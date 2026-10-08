# '내 사진 진단' 규칙 (js/diagnose.js의 명세)

diagnose.js는 이 문서의 구현이다. 규칙·임계값을 바꿀 때는 **이 문서를 먼저** 고치고, 임계값은 test-diag.html의 수치 근거 없이 바꾸지 않는다.
AI API를 쓰지 않는다. EXIF(js/exif.js) + 온디바이스 픽셀 분석(js/pixels.js)만으로 판정하고, 숫자 세팅(next)은 compute()에서만 나온다. 오프라인에서 동작.

## 입력
`diagnose(exif, pixels, cameraId, lensId)`
- exif: `readExif(원본 File)` 결과 또는 null. 쓰는 필드: model, lens, fNumber, exposureTime(초), iso, ec(소수 2자리, 부호 유지), focal(mm), program('M'|'P'|'Av'|'Tv'|'Creative'|'Action'|'Portrait'|'Landscape'|'other'|null), flash(boolean).
- pixels: `analyzePixels(imageData, faces)` 결과. 1024px 축소본 기준 { sharpness, clipping: { highlights, shadows }, faceLuma, faceRect, faceEstimate }.
- cameraId / lensId: 앱의 현재 선택.

## 출력
| 키 | 내용 |
|---|---|
| lights | `{ blur, face, highlights, noise, mode }` 각각 'ok' \| 'warn' \| 'bad' |
| findings | `[{ sev, key, title, detail, fix }]` 문제만. sev는 'bad' \| 'warn' \| 'info'. 정렬은 (g) |
| sceneGuess | 상황 id 또는 null — (a) |
| sceneConfidence | 'high' \| 'low'(화면에 "(대략)") \| null — (a) |
| subjectGuess | 'kid' \| 'still' — 셔터 ≤ 1/500이면 kid, 아니면 still |
| next | `compute(진단 바디, sceneGuess, subjectGuess, 진단 렌즈)` 또는 null(sceneGuess 없음·EXIF 없음) |
| exifSummary | `f/1.8 · 1/60 · ISO 3200 · 50mm · 보정 0 · Av` 또는 null |
| ev100, gear, cameraId, lensId | 보조 정보(역산 EV, 장비 매칭 결과, 실제 계산에 쓴 바디·렌즈 id) |

## pixels.js (숫자만, 판정 없음)
| 함수 | 계산 |
|---|---|
| sharpness(imageData) | 그레이스케일(Rec.601) → 3×3 라플라시안(중심 −4, 상하좌우 +1) → 분산. 가장자리 1px 제외 |
| clipping(imageData) | 밝기 ≥ 250 픽셀 비율 highlights, ≤ 5 비율 shadows (0~1) |
| faceRegion(imageData, faces) | faces(detectFaces 결과)가 있으면 가장 큰 사각형, 없으면 중앙 40%×40% → `{ rect, isEstimate }` |
| detectFaces(source) | `window.FaceDetector`가 있으면 얼굴 사각형 배열(비동기 Promise), 없으면 `[]`. FaceDetector의 detect()가 비동기라 동기 함수인 faceRegion이 직접 못 부르므로 호출자가 먼저 await 해서 넘긴다 |
| regionLuma(imageData, rect) | 영역 평균 밝기 0~1 |
| imageLuma | 전체 평균 밝기 0~1 (clipping 계산 중 함께 누적). (c)의 상대 기준 |
| analyzePixels(imageData, faces) | 위를 한 번에 묶은 pixels 객체 |
성능(2026-10-07, test-diag.html 36장, 1024px 축소본, 헤드리스 Chrome): 평균 4ms, 최대 11ms. 목표 200ms 안.

## 규칙

### (a) EV 역산 → 상황 추정 (sceneGuess)
- EV100 = log2(N² / t) − log2(ISO / 100) + EC. (fNumber·exposureTime·iso 중 하나라도 없으면 null)
- 후보 LIGHTS와 |EV 차|가 최소인 것. 같은 EV가 여럿이면 아래 표 순서로 먼저 맞는 것(home 6 = dim 6 = nightFace 6 → home).
- 차이에 따라 **sceneConfidence**: 차 < 2 → 'high' / 2 ≤ 차 < 4 → 'low'(가장 가까운 상황을 그대로 추천하되 화면에 "(대략)" 표시) / 차 ≥ 4 → sceneGuess null, sceneConfidence null. (L3: 1/60 f/1.8 ISO3200 같은 흔한 어두운 실내 사진이 추천을 못 받던 문제)

| light | ev | sceneGuess |
|---|---|---|
| sunny | 15 | outdoorSunny |
| shade | 12 | outdoorShade. **EC ≥ +0.7이면 backlit** (shade와 overcast는 EV가 같아 역광 얼굴은 보정값으로 구분. +0.3은 흐림·창가 기본값이라 역광으로 보지 않는다 — L2) |
| overcast | 12 | outdoorShade (위와 같음) |
| window | 9 | indoorWindow |
| home | 6 | indoorEvening |
| dim | 6 | cafe |
| nightFace | 6 | nightPortrait |
preSunset(13)은 후보에서 뺀다(실루엣 스타일 전용).

예: 1/2000 f/3.2 ISO 100 → 14.3 → sunny(차 0.7) → outdoorSunny(high). 1/125 f/5.6 ISO 800 → 8.9 → window → indoorWindow(high). 1/60 f/1.8 ISO 3200 → 2.6 → 가장 가까운 home(6)과 3.4 차 → indoorEvening(low, "(대략)"). 1/250 f/4 ISO 200 EC +0.3 → 11.3 → shade(차 0.7), EC < +0.7 → outdoorShade(backlit 아님). 30초 f/2.8 ISO 100 → −1.9 → home과 7.9 차 → null.

### (b) 흔들림 (blur)
- 핸드헬드 한계 limit = min(CAMERA_COMMON.handheldCap 1/15, slack / (focal × crop)). focal은 EXIF FocalLength, 없으면 렌즈 portraitFocal.
- slack: IS 렌즈면 2^(isStops − 2), 아니면 1. isStops가 없는 IS 렌즈(EF 24-105 IS)는 4스톱으로 본다(= CAMERA_COMMON.isStopsDefault, exposure.js와 같은 규칙).
- sharpness 낮음 = sharpness < **S_LOW**. t 느림 = exposureTime > limit. 최대 개방 근처 = fNumber ≤ lens.apMin + 0.3.
- **고감도 보류(L4)**: ISO ≥ camera.isoUsable이면 sharpness를 판정에 쓰지 않는다(노이즈는 고주파라 라플라시안 분산을 올려 흐린 사진도 선명하게 읽힘. S_LOW는 노이즈 없는 AI 샘플 기준). 이때 느림이면 warn '셔터가 한계보다 느림 (선명도는 노이즈로 판정 보류)', 아니면 warn '선명도 판정 보류 (고감도 노이즈)'.

| 조건 | lights.blur | title | fix |
|---|---|---|---|
| ISO ≥ isoUsable 그리고 느림 | warn | 셔터가 한계보다 느림 (선명도는 노이즈로 판정 보류) | 최소 셔터 limit 이상, 흔들림은 확대해서 눈으로 확인 |
| ISO ≥ isoUsable (그 외) | warn | 선명도 판정 보류 (고감도 노이즈) | 확대해서 눈으로 확인. 다음엔 밝은 자리·밝은 렌즈로 ISO 낮추기 |
| 낮음 그리고 느림 | bad | 손떨림 | C1/C2 최소 셔터가 지켜졌는지, 또는 ISO 상한 올리기 |
| 낮음 그리고 빠름 그리고 최대 개방 근처 | bad | 초점 빗나감 (심도 얕음) | f/2.2로 조이고 눈에 1점 AF |
| 낮음 그리고 빠름 그리고 f 충분 | warn | 초점 또는 피사체 움직임 | AI Servo + 연사 (바디의 kid AF 명칭) |
| 정상인데 느림 | warn | 운 좋게 멈춤. 다음엔 위험 | 최소 셔터 limit 이상, 모자라면 ISO 상한 올리기 |
| EXIF 없음 그리고 낮음 | warn | 선명하지 않음 | 최소 셔터와 1점 AF 확인 |
| 그 외 | ok | | |

**S_LOW = 12.** 산출(2026-10-07, test-diag.html, 1024px 축소본):
| 그룹 | 최소 | 중앙값 | 최대 |
|---|---|---|---|
| 원본 9장 | 51.3 (rimLight) | 144.3 | 640.9 (familySelf) |
| 블러 3px 9장 | 0.9 | 1.4 | 2.5 |
| 어둡게 −40% 9장 | 19.0 (rimLight) | | 231.4 |
| 밝게 +40% 9장 | 34.6 (rimLight) | | 1109.7 |
- 두 그룹 사이 중간값: 산술 (51.3 + 2.5) / 2 = 26.9, 기하평균 √(51.3 × 2.5) = 11.3. 라플라시안 분산은 밝기의 제곱에 비례해(−40%면 ×0.36) 노출이 어두운 선명한 사진이 산술 중간값 26.9 아래로 떨어진다(rimLight 어둡게 19.0). 로그 스케일 중간값 11.3을 올림한 **12**를 채택. 12에서 원본 오판 0/9, 블러 오판 0/9, 어둡게·밝게 변형 오판 0/18.
- 여유: 블러 최대 2.5는 임계의 1/4.8, 선명 최소(어둡게 rimLight) 19.0은 1.6배. 실제 카메라 JPEG으로 재검증 전까지 바꾸지 않는다.

### (c) 얼굴 (face)
- bad = faceLuma < 0.30 **그리고** faceLuma < imageLuma − 0.10 (얼굴이 사진 전체 평균보다도 뚜렷이 어두울 때만. L5. imageLuma는 pixels.js 전체 평균 밝기 0~1) → '얼굴 어두움' fix '노출보정 +0.7 (역광이면 +1)'. EC ≥ +0.7인 사진이면 fix '노출보정 +1'.
- 그 외 faceLuma < 0.40 → warn '얼굴 조금 어두움' fix '노출보정 +0.3'. (전체가 함께 어두운 야경·카페 사진은 여기까지만)
- faceEstimate(FaceDetector 없음)면 title 뒤에 ' (중앙 기준 추정)'.

### (d) 하늘·배경 (highlights)
- clipping.highlights > 8% → bad '하얗게 날아간 부분 많음' fix '노출보정 −0.3, 해를 등지면 역광 상황으로'.
- 3% < highlights ≤ 8% → warn '하얗게 날아간 부분 있음' fix '노출보정 −0.3'.
- 역광 사진(EC ≥ +0.7)은 배경 날아감이 정상이므로 **warn까지만**(title '배경 날아감 (역광이라 정상 범위)').

### (e) 노이즈 (noise)
- ISO > camera.isoHard → bad. ISO > camera.isoUsable → warn. fix '밝은 자리로, 밝은 렌즈로, 또는 방 조명 전부 켜기'. 바디는 진단 바디(아래 장비 규칙).

### (f) 모드 (mode)
- program이 Creative · Action · Portrait · Landscape(SCN 계열, 노출보정·ISO 자동을 사람이 못 건드림) → bad '오토(SCN)로 찍힘' fix 'C1/C2로'(C 모드 없는 바디는 'Av 모드로').
- program 'P' → warn 'P·오토 모드로 찍힘' (P는 노출보정·ISO 자동이 살아 있는 반자동이라 bad는 과함 — L6). program 'other'(EXIF ExposureProgram 0 = 정의 안 됨. 캐논 전자동이 여기 기록됨) → warn '촬영 모드 확인 불가 (오토일 가능성)'.
- Av · Tv · M → ok. program 없음 → ok(판단 보류).
- flash true → info '플래시 사용됨 — 이 앱 범위 밖'. lights에는 영향 없음.

### 장비 (gear)
- EXIF Model("Canon EOS 6D Mark II")을 CAMERAS.name 포함 비교, LensModel("EF50mm f/1.8 STM")을 LENSES.label과 공백 제거 비교.
- 바디나 렌즈가 현재 선택과 다르면 findings **맨 위**에 info '이 사진은 {Model}+{Lens}로 찍음 / 진단은 그 장비 기준'. 목록에 있고 호환되면 그 id로 (b)(e)·next를 계산, 없으면 현재 선택으로.

### EXIF 없음
- lights.blur/face/highlights만 픽셀로 판정(noise·mode는 ok). findings에 info '촬영 정보가 없는 사진 (편집·캡처본)'. sceneGuess·next는 null, exifSummary null.

### (g) findings 정렬
장비 info(맨 위 고정) → bad → warn → info. 같은 심각도면 mode → blur → face → highlights → noise → flash → noexif 순.

### (h) 전부 ok
bad·warn이 하나도 없으면 info '설정은 문제없음 / 구도·순간은 사람 몫' 1개를 추가(장비·플래시·EXIF 없음 info와 함께 있을 수 있음).

## test-diag.html
img/ 샘플 9장 + 캔버스 변형(블러 3px · brightness 0.6 · brightness 1.4) 27장 = 36장을 EXIF 없는 경로로 돌려 sharpness / 얼굴 밝기 / 전체 밝기 / 하이라이트 / 섀도 / pixels 시간 / lights 5칸 / findings 표. 아래에 가짜 EXIF 7개(맑음 Av · 어두운 실내 Av(low) · P 모드 · 흐림 +0.3 Av · 역광 +1 Av · 고ISO 12800 Av · SCN Portrait)로 EXIF 경로(sceneGuess·confidence·next·findings) 표. 각 행에 기대값(sceneGuess·confidence·mode·blur)과 ✓/✗. 로컬 서버 또는 file://(--allow-file-access-from-files)로 열 것(img/ fetch).
세 번째 표 '실사진': `img/real/1.jpg` ~ `9.jpg` 중 존재하는 파일만 자동으로 돌린다(정적 서버라 디렉터리 나열이 안 되어 이름을 고정). 원본 File → readExif(실제) → 1024px 축소본 → pixels → diagnose(실제 EXIF). sharpness가 S_LOW 미만이면 빨간 숫자. 요약 줄에 'S_LOW 미만 n장'이 나오므로 실제로 흔들린 장수와 맞는지 눈으로 확인한다.

### S_LOW 실사진 재검증
- 2026-10-08 현재 `img/real/`에 실사진 없음. 재검증 전까지 S_LOW = 12(AI 샘플 근거) 유지.
- 재검증 절차: 6D2 원본 JPEG(선명한 것 5장 이상 + 흔들린 것 2장 이상)을 img/real/1~9.jpg로 넣고 test-diag.html을 연다. 선명한 사진의 sharpness 최소값과 흔들린 사진의 최대값 사이에 S_LOW가 있으면 유지, 아니면 그 두 값의 기하평균으로 바꾸고 이 절에 수치를 적는다. `img/real/`은 .gitignore 대상(개인 사진, 저장소에 올리지 않음).
