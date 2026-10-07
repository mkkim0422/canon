// img/ 샘플 9장의 Features(모의 AI 분석 결과). analyze.js의 mock 모드가 쓴다.
// 각 항목은 STYLES 정의와 모순되지 않게 작성(모순 시 STYLES 우선). 숫자 필드 없음 — 분류값만.
// 스키마: docs/match.md 참조.

const MOCK_FEATURES = {
  // 배경이 사르르 녹는 아이 얼굴 — outdoorShade · still · 50mm f/2.2
  softKid: {
    light: 'shade', lightConfidence: 0.8, artificialLight: false, rimLight: false,
    dof: 'shallow', motion: 'still', focalFeel: 'normal', subject: 'kid', framing: 'face',
    color: { saturation: 'mid', warmth: 'warm', contrast: 'mid' },
    notes: ['나무 그늘의 부드러운 빛', '배경 나뭇잎이 둥근 보케로 녹음'],
  },
  // 역광에 머리카락이 빛나는 사진 — backlit · still · 50mm f/2.2 · 스팟 측광
  rimLight: {
    light: 'backlit', lightConfidence: 0.85, artificialLight: false, rimLight: true,
    dof: 'shallow', motion: 'still', focalFeel: 'normal', subject: 'kid', framing: 'face',
    color: { saturation: 'mid', warmth: 'warm', contrast: 'mid' },
    notes: ['해를 등진 역광, 머리카락 테두리가 빛남', '얼굴은 밝게 살아 있음(노출보정 +)'],
  },
  // 실루엣 — backlit(일몰 하늘) · still · 24-105 f/8 · M
  silhouette: {
    light: 'backlit', lightConfidence: 0.9, artificialLight: false, rimLight: false,
    dof: 'deep', motion: 'still', focalFeel: 'normal', subject: 'group', framing: 'full',
    color: { saturation: 'high', warmth: 'warm', contrast: 'high' },
    notes: ['일몰 하늘 앞 검은 윤곽', '하늘 밝기에 노출을 맞춘 사진(「실루엣」 스타일)'],
  },
  // 창가 빛이 얼굴 반쪽만 든 사진 — indoorWindow · still · 50mm f/2.2
  windowHalf: {
    light: 'window', lightConfidence: 0.85, artificialLight: false, rimLight: false,
    dof: 'medium', motion: 'still', focalFeel: 'normal', subject: 'kid', framing: 'halfbody',
    color: { saturation: 'low', warmth: 'neutral', contrast: 'high' },
    notes: ['창 옆 90도, 한쪽 얼굴만 밝음', '실내등 없이 창빛만'],
  },
  // 뛰는 순간 정지 — outdoorSunny · kid · 24-105 f/4 · 최소 셔터 1/1000
  freeze: {
    light: 'sunny', lightConfidence: 0.9, artificialLight: false, rimLight: false,
    dof: 'medium', motion: 'frozen', focalFeel: 'tele', subject: 'kid', framing: 'full',
    color: { saturation: 'high', warmth: 'neutral', contrast: 'mid' },
    notes: ['점프 꼭대기에서 머리카락까지 멈춤', '맑은 날 잔디밭, 망원으로 배경 압축'],
  },
  // 야경 보케 앞 인물 — nightPortrait · still · 50mm f/1.8 · M ISO 3200
  nightBokeh: {
    light: 'night', lightConfidence: 0.9, artificialLight: false, rimLight: false,
    dof: 'shallow', motion: 'still', focalFeel: 'normal', subject: 'kid', framing: 'face',
    color: { saturation: 'high', warmth: 'warm', contrast: 'mid' },
    notes: ['간판 불빛이 큰 원형 보케', '얼굴에는 가까운 간판 빛'],
  },
  // 비 오는 날 차분한 톤 — cloudyRain · still · 50mm f/2.2 · 채도 -2
  rainTone: {
    light: 'overcast', lightConfidence: 0.8, artificialLight: false, rimLight: false,
    dof: 'medium', motion: 'still', focalFeel: 'normal', subject: 'kid', framing: 'halfbody',
    color: { saturation: 'low', warmth: 'cool', contrast: 'low' },
    notes: ['흐린 비 오는 날, 투명 우산', '채도를 낮춘 회색 톤'],
  },
  // 카페 분위기 — cafe · still · 50mm f/2.2 · AWB 분위기 우선
  cafeMood: {
    light: 'dim', lightConfidence: 0.75, artificialLight: false, rimLight: false,
    dof: 'shallow', motion: 'still', focalFeel: 'normal', subject: 'group', framing: 'halfbody',
    color: { saturation: 'mid', warmth: 'warm', contrast: 'mid' },
    notes: ['전구색 실내 조명(스튜디오 조명 아님)', '엄마와 아이 둘'],
  },
  // 셀프 가족사진 — outdoorShade · still · 24-105 f/5.6 · 삼각대
  familySelf: {
    light: 'shade', lightConfidence: 0.8, artificialLight: false, rimLight: false,
    dof: 'deep', motion: 'still', focalFeel: 'wide', subject: 'group', framing: 'full',
    color: { saturation: 'mid', warmth: 'neutral', contrast: 'mid' },
    notes: ['공원 그늘 벤치, 세 명 전원 선명', '넓은 화각(24~35mm 느낌)'],
  },
};
