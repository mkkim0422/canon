// 온디바이스 픽셀 분석. 1024px 축소본(캔버스 ImageData)에서 계산. 외부 라이브러리 없음. AI 미사용.
// 전부 동기 함수. 1024px(약 70만 픽셀)에서 전체 합계 200ms 안에 끝나야 한다(test-diag.html이 시간을 잰다).
// 규칙·임계값은 docs/diagnose.md. 여기는 숫자만 계산하고 판정하지 않는다.

// 그레이스케일(0~255) Float32Array. Rec.601 가중치.
function toGray(imageData) {
  const { data, width, height } = imageData;
  const g = new Float32Array(width * height);
  for (let i = 0, p = 0; i < g.length; i++, p += 4) g[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
  return g;
}

// 선명도: 3×3 라플라시안(중심 -4, 상하좌우 +1)의 분산. 값이 클수록 선명. 가장자리 1픽셀은 제외.
function sharpness(imageData) {
  const { width: w, height: h } = imageData;
  const g = toGray(imageData);
  let sum = 0, sum2 = 0, n = 0;
  for (let y = 1; y < h - 1; y++) {
    const row = y * w;
    for (let x = 1; x < w - 1; x++) {
      const i = row + x;
      const v = g[i - w] + g[i + w] + g[i - 1] + g[i + 1] - 4 * g[i];
      sum += v; sum2 += v * v; n++;
    }
  }
  if (!n) return 0;
  const mean = sum / n;
  return sum2 / n - mean * mean;
}

// 클리핑: 밝기(0~255) 250 이상 비율(highlights), 5 이하 비율(shadows). 0~1.
function clipping(imageData) {
  const { data } = imageData;
  const n = data.length / 4;
  let hi = 0, lo = 0;
  for (let p = 0; p < data.length; p += 4) {
    const l = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
    if (l >= 250) hi++;
    else if (l <= 5) lo++;
  }
  return { highlights: n ? hi / n : 0, shadows: n ? lo / n : 0 };
}

// 얼굴 영역. faces: detectFaces()가 돌려준 사각형 배열(없거나 비면 중앙 40%×40% 추정).
// window.FaceDetector는 비동기(detect()가 Promise)라 동기 함수에서 직접 부를 수 없다 → 호출자가 detectFaces()를 먼저 await 해서 넘긴다.
function faceRegion(imageData, faces) {
  const { width: w, height: h } = imageData;
  const list = Array.isArray(faces) ? faces.filter((f) => f && f.width > 0 && f.height > 0) : [];
  if (list.length) {
    const f = list.reduce((a, b) => (a.width * a.height >= b.width * b.height ? a : b));
    const x = Math.max(0, Math.floor(f.x)), y = Math.max(0, Math.floor(f.y));
    return { rect: { x, y, width: Math.min(w - x, Math.ceil(f.width)), height: Math.min(h - y, Math.ceil(f.height)) }, isEstimate: false };
  }
  return { rect: { x: Math.round(w * 0.3), y: Math.round(h * 0.3), width: Math.round(w * 0.4), height: Math.round(h * 0.4) }, isEstimate: true };
}

// FaceDetector가 있으면 얼굴 사각형 배열(축소본 좌표), 없거나 실패하면 []. source: canvas 또는 ImageBitmap.
function detectFaces(source) {
  if (typeof window === 'undefined' || !window.FaceDetector) return Promise.resolve([]);
  try {
    return new window.FaceDetector({ maxDetectedFaces: 5, fastMode: true }).detect(source)
      .then((faces) => faces.map((f) => f.boundingBox).filter(Boolean))
      .catch(() => []);
  } catch (e) { return Promise.resolve([]); }
}

// 영역 평균 밝기 0~1.
function regionLuma(imageData, rect) {
  const { data, width: w, height: h } = imageData;
  const x0 = Math.max(0, rect.x), y0 = Math.max(0, rect.y);
  const x1 = Math.min(w, rect.x + rect.width), y1 = Math.min(h, rect.y + rect.height);
  let sum = 0, n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const p = (y * w + x) * 4;
      sum += 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
      n++;
    }
  }
  return n ? sum / n / 255 : 0;
}

// diagnose()가 받는 pixels 객체 한 번에. faces는 detectFaces() 결과(선택).
function analyzePixels(imageData, faces) {
  const face = faceRegion(imageData, faces);
  return {
    sharpness: sharpness(imageData),
    clipping: clipping(imageData),
    faceLuma: regionLuma(imageData, face.rect),
    faceRect: face.rect,
    faceEstimate: face.isEstimate,
    width: imageData.width, height: imageData.height,
  };
}
