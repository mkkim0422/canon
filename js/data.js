// 데이터 전용. 모든 숫자의 근거는 docs/facts.md. 근거 없는 값은 넣지 않는다.
// 검증: node check.js
// adjust 규칙은 [조건, 조치] 쌍. 조건 없으면 ''. 조치 끝에 마침표 없음. 노출보정은 항상 "노출보정 ±x".
// 조치 안의 {isoSteps} {shutterSteps}는 app.js가 현재 값 기준 다음 3단계로 치환.

// 바디 공통 상수 (바디별 값은 CAMERAS에)
const CAMERA_COMMON = {
  handheldCap: 1 / 15,       // IS가 있어도 초보 기준 이보다 느리게 들지 않음
  isStopsDefault: 4,         // IS 있는데 isStops 미확인인 렌즈(EF 24-105)에 적용. 핸드헬드 여유 = 2^(isStops−2)배, 상한 1/15
};

// 바디 목록. family는 내부 분류(다이얼 문구 템플릿 선택)이며 UI에 노출하지 않는다.
// verified: true 는 menu 11개 항목 전부 page가 있을 때만 (EF 마운트의 lensAdapter는 na: true 허용).
const CAMERAS = [
  {
    id: 'eos6d2', name: 'EOS 6D Mark II', short: '6D2', family: 'ff2dial', mount: 'EF', crop: 1,
    isoMin: 100, isoMax: 40000, isoUsable: 6400, isoHard: 12800, isoAutoMaxMin: 200,
    shutterFastest: 1 / 4000, shutterLongest: 30,
    hasCModes: true, cModes: ['C1', 'C2'], ecDial: 'quick',
    afModes: { still: 'One-Shot', kid: 'AI Servo' }, afAreaStill: '1점 AF', afAreaKid: '존 AF', burstFps: 6.5,
    menu: {
      imageQuality: { path: 'MENU → 촬영 1탭 → Image quality', page: 162 },
      isoAutoRange: { path: 'MENU → 촬영 2탭 → ISO speed settings → Auto range', page: 174 },
      minShutter:   { path: 'MENU → 촬영 2탭 → ISO speed settings → Min. shutter spd.', page: 175 },
      pictureStyle: { path: 'MENU → 촬영 3탭 → Picture Style → 인물 → INFO 버튼', page: 180 },
      wb:           { path: 'MENU → 촬영 2탭 → White balance', page: 185 },
      awbPriority:  { path: 'MENU → 촬영 2탭 → White balance → AWB 선택 후 INFO 버튼 → Ambience priority', page: 187 },
      alo:          { path: 'MENU → 촬영 2탭 → Auto Lighting Optimizer', page: 194 },
      highIsoNr:    { path: 'MENU → 촬영 3탭 → High ISO speed NR', page: 195 },
      antiFlicker:  { path: 'MENU → 촬영 4탭 → Anti-flicker shoot.', page: 206 },
      customMode:   { path: 'MENU → 설정(공구) 5탭 → Custom shooting mode (C1, C2) → Register settings', page: 510 },
      lensAdapter:  { path: '해당 없음 (EF 마운트, 어댑터 불필요)', page: null, na: true },
    },
    // 버튼 조작 페이지 (C 모드 등록 단계·다이얼 문구 근거)
    pages: { afMode: 130, afArea: 136, drive: 156, avMode: 238, mMode: 241, ec: 245, iso: 170 },
    manualUrl: 'https://www.adorama.com/col/productManuals/ICA6DM2.pdf',
    verified: true,
  },
  {
    id: 'eos5d4', name: 'EOS 5D Mark IV', short: '5D4', family: 'ff2dial', mount: 'EF', crop: 1,
    isoMin: 100, isoMax: 32000, isoUsable: 6400, isoHard: 12800, isoAutoMaxMin: 200,
    shutterFastest: 1 / 8000, shutterLongest: 30,
    hasCModes: true, cModes: ['C1', 'C2', 'C3'], ecDial: 'quick',   // C3는 앱에서 쓰지 않음(데이터만)
    afModes: { still: 'One-Shot', kid: 'AI Servo' }, afAreaStill: '1점 AF', afAreaKid: '존 AF', burstFps: 7.0,
    menu: {
      imageQuality: { path: 'MENU → 촬영 1탭 → Image quality', page: 169 },
      isoAutoRange: { path: 'MENU → 촬영 2탭 → ISO speed settings → Auto range', page: 181 },
      minShutter:   { path: 'MENU → 촬영 2탭 → ISO speed settings → Min. shutter spd.', page: 182 },
      pictureStyle: { path: 'Picture Style 버튼(뒷면) 또는 MENU → 촬영 3탭 → Picture Style → 인물 → INFO 버튼', page: 183 },
      wb:           { path: 'MENU → 촬영 2탭 → White balance', page: 192 },
      awbPriority:  { path: 'MENU → 촬영 2탭 → White balance → AWB 선택 후 INFO 버튼 → Ambience priority', page: 194 },
      alo:          { path: 'MENU → 촬영 2탭 → Auto Lighting Optimizer', page: 201 },
      highIsoNr:    { path: 'MENU → 촬영 3탭 → High ISO speed NR', page: 202 },
      antiFlicker:  { path: 'MENU → 촬영 4탭 → Anti-flicker shoot.', page: 215 },
      customMode:   { path: 'MENU → 설정(공구) 5탭 → Custom shooting mode (C1-C3) → Register settings', page: 520 },
      lensAdapter:  { path: '해당 없음 (EF 마운트, 어댑터 불필요)', page: null, na: true },
    },
    pages: { afMode: 100, afArea: 106, drive: 160, avMode: 248, mMode: 251, ec: 255, iso: 177 },
    manualUrl: 'https://gdlp01.c-wss.com/gds/8/0300025058/01/EOS_5D_Mark_IV_Instruction_Manual_EN.pdf',
    verified: true,
  },
  {
    // RF 미러리스 첫 기종. page는 PDF 쪽수 대신 온라인 가이드(펌웨어 1.7.0 기준) 페이지 URL.
    id: 'eosr6m2', name: 'EOS R6 Mark II', short: 'R6 II', family: 'rf', mount: 'RF', crop: 1,
    isoMin: 100, isoMax: 102400, isoUsable: 12800, isoHard: 25600, isoAutoMaxMin: 200,
    shutterFastest: 1 / 8000, shutterLongest: 30,   // 기계식·전자 선막 기준. 전자셔터 1/16000은 앱에서 쓰지 않음
    hasCModes: true, cModes: ['C1', 'C2', 'C3'], ecDial: 'quick',   // 노출보정 기본 = 퀵 컨트롤 다이얼 1
    afModes: { still: 'One-Shot AF', kid: 'Servo AF' }, afAreaStill: '1-point AF', afAreaKid: 'Whole area AF', burstFps: 12,
    menu: {
      imageQuality: { path: 'MENU → 촬영 1탭 → Image quality', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0030.html' },
      isoAutoRange: { path: 'MENU → 촬영 2탭 → ISO speed settings → Auto range', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0100.html' },
      minShutter:   { path: 'MENU → 촬영 2탭 → ISO speed settings → Min. shutter spd.', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0100.html' },
      pictureStyle: { path: 'MENU → 촬영 4탭 → Picture Style → Portrait → INFO(세부 조정)', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0230.html' },
      wb:           { path: 'MENU → 촬영 4탭 → White balance', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0200.html' },
      awbPriority:  { path: 'MENU → 촬영 4탭 → White balance → AWB 선택 후 AF 포인트 선택 버튼 → Ambience priority', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0200.html' },
      alo:          { path: 'MENU → 촬영 2탭 → Auto Lighting Optimizer', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0130.html' },
      highIsoNr:    { path: 'MENU → 촬영 5탭 → High ISO speed NR', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0300.html' },
      antiFlicker:  { path: 'MENU → 촬영 3탭 → Anti-flicker shoot.', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0150.html' },
      customMode:   { path: 'MENU → 설정(공구) 6탭 → Custom shooting mode (C1-C3) → Register settings', page: 'https://cam.start.canon/en/C012/manual/html/UG-08_Set-up_0330.html' },
      lensAdapter:  { path: 'EF/EF-S 렌즈는 마운트 어댑터 EF-EOS R에 끼워 장착 (EF-M 렌즈 불가)', page: 'https://cam.start.canon/en/C012/manual/html/UG-01_Preparations_0080.html' },
      // 미러리스 전용 항목 (DSLR 바디엔 없음 → 설정 화면에서 자동 숨김)
      subjectDetect: { path: 'MENU → AF 1탭 → Subject to detect → People / Eye detection → Enable(Auto)', page: 'https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0060.html' },
      shutterMode:   { path: 'MENU → 촬영 7탭 → Shutter mode → Mechanical', page: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0370.html' },
      afOperation:   { path: 'MENU → AF 1탭 → AF operation', page: 'https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0040.html' },
      afArea:        { path: 'MENU → AF 1탭 → AF area', page: 'https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0060.html' },
      driveMode:     { path: 'M-Fn 버튼 → 드라이브 항목 → 메인 다이얼 (또는 MENU → 촬영 7탭 → Drive mode)', page: 'https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0120.html' },
    },
    pages: { afMode: 'https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0040.html', afArea: 'https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0060.html', drive: 'https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0120.html',
      avMode: 'https://cam.start.canon/en/C012/manual/html/UG-03_CustomShooting_0050.html', mMode: 'https://cam.start.canon/en/C012/manual/html/UG-03_CustomShooting_0060.html', ec: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0080.html', iso: 'https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0100.html' },
    manualUrl: 'https://cam.start.canon/en/C012/manual/',
    specUrl: 'http://ph.canon/en/consumer/eos-r6-mark-ii/body/specification',
    verified: true,
  },
  {
    // 크롭 미러리스·1다이얼. 스틸 C 모드 없음(Custom shooting mode는 동영상 모드에서만 표시), ISO 자동 최소 셔터 메뉴 없음(Max for Auto만).
    // 가이드 https://cam.start.canon/en/C011/manual/ (영문 온라인). 사양: UG-11_Reference_0090
    id: 'eosr50', name: 'EOS R50', short: 'R50', family: 'rf1dial', mount: 'RF', crop: 1.6,
    isoMin: 100, isoMax: 32000, isoUsable: 6400, isoHard: 12800, isoAutoMaxMin: 400,   // H 51200(C.Fn ISO expansion)은 앱에서 쓰지 않음. Max for Auto 400–32000
    shutterFastest: 1 / 4000, shutterLongest: 30,   // 전자 선막 기준(기계식 셔터 없음). 전자셔터 1/8000은 앱에서 쓰지 않음
    hasCModes: false, cModes: [], ecDial: 'button',   // 노출보정 = ▲(노출보정) 버튼 누른 뒤 다이얼 (UG-05_Shooting-1_0070)
    hasMinShutter: false, isoAutoMaxLabel: 'Max for Auto',   // Min. shutter spd. 메뉴 없음 → 움직이는 아이는 M + ISO AUTO (exposure.js r.mAuto, dials.js rf1dial)
    afModes: { still: 'One-Shot AF', kid: 'Servo AF' }, afAreaStill: '1-point AF', afAreaKid: 'Whole area AF', burstFps: 12,   // High-speed continuous + 전자 선막 약 12컷/초
    menu: {
      imageQuality: { path: 'MENU → 촬영 1탭 → Image quality', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0030.html' },
      isoAutoRange: { path: 'MENU → 촬영 2탭 → ISO speed settings → Max for Auto', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0090.html',
        value: 'Max for Auto → {isoUsable}', pathKo: 'ISO 감도 설정 → 자동 최대' },
      minShutter:   { path: '이 기종엔 최소 셔터 속도 설정이 없음 (ISO speed settings에는 Max for Auto만 있음)', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0090.html', na: true },
      pictureStyle: { path: 'MENU → 촬영 4탭 → Picture Style → Portrait → INFO(세부 조정)', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0190.html' },
      wb:           { path: 'MENU → 촬영 4탭 → White balance', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0160.html' },
      awbPriority:  { path: 'MENU → 촬영 4탭 → White balance → AWB 선택 후 AF 포인트 선택 버튼 → Ambience priority', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0160.html' },
      alo:          { path: 'MENU → 촬영 2탭 → Auto Lighting Optimizer', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0120.html' },
      highIsoNr:    { path: 'MENU → 촬영 5탭 → High ISO speed NR', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0260.html' },
      antiFlicker:  { path: 'MENU → 촬영 2탭 → Anti-flicker shoot.', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0140.html' },
      customMode:   { path: '스틸용 C 모드 없음 (설정 5탭 Custom shooting mode (C mode)는 동영상 모드에서만 표시)', page: 'https://cam.start.canon/en/C011/manual/html/UG-09_Set-up_0250.html' },
      lensAdapter:  { path: 'EF/EF-S 렌즈는 마운트 어댑터 EF-EOS R에 끼워 장착 (EF-M 렌즈 불가)', page: 'https://cam.start.canon/en/C011/manual/html/UG-01_Preparations_0070.html' },
      // 미러리스 전용 항목. title/value/why는 SETUP_COMMON 기본 문구를 이 바디에서만 덮어쓴다 (app.js renderSettings)
      subjectDetect: { path: 'MENU → AF 1탭 → Subject to detect → People / Eye detection → Enable', page: 'https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0060.html',
        value: 'Subject to detect → People, Eye detection → Enable' },
      shutterMode:   { path: 'MENU → 촬영 6탭 → Shutter mode → Elec. 1st-curtain', page: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0300.html',
        title: '셔터 모드 전자 선막', value: 'Elec. 1st-curtain',
        why: '이 기종은 기계식 셔터가 없음. 전자 선막이 기본값이고 앱의 셔터 상한 1/4000은 이 기준. Electronic은 1/8000까지 되지만 실내 LED 플리커·롤링 셔터 왜곡이 생길 수 있음.' },
      afOperation:   { path: 'MENU → AF 1탭 → AF operation', page: 'https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0040.html' },
      afArea:        { path: 'MENU → AF 1탭 → AF area', page: 'https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0060.html' },
      driveMode:     { path: '▶(오른쪽 키) 버튼 → 다이얼로 드라이브 선택 (또는 MENU → 촬영 6탭 → Drive mode)', page: 'https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0120.html' },
    },
    pages: { afMode: 'https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0040.html', afArea: 'https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0060.html', drive: 'https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0120.html',
      avMode: 'https://cam.start.canon/en/C011/manual/html/UG-03_CustomShooting_0040.html', mMode: 'https://cam.start.canon/en/C011/manual/html/UG-03_CustomShooting_0050.html', ec: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0070.html', iso: 'https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0090.html' },
    manualUrl: 'https://cam.start.canon/en/C011/manual/',
    specUrl: 'https://cam.start.canon/en/C011/manual/html/UG-11_Reference_0090.html',
    verified: true,
  },
];

// 1/3스톱 표준값
const APERTURES = [1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16, 18, 20, 22, 25, 29, 32];
const SHUTTERS = [30, 25, 20, 15, 13, 10, 8, 6, 5, 4, 3.2, 2.5, 2, 1.6, 1.3, 1, 0.8, 0.6, 0.5, 0.4, 0.3,
  1/4, 1/5, 1/6, 1/8, 1/10, 1/13, 1/15, 1/20, 1/25, 1/30, 1/40, 1/50, 1/60, 1/80, 1/100, 1/125, 1/160, 1/200,
  1/250, 1/320, 1/400, 1/500, 1/640, 1/800, 1/1000, 1/1250, 1/1600, 1/2000, 1/2500, 1/3200, 1/4000, 1/5000, 1/6400, 1/8000];
const ISOS = [100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12800, 16000, 20000, 25600, 32000, 40000, 51200, 64000, 80000, 102400];

// WB 프리셋 (facts.md). 전 상황 기본은 awbAmb. 프리셋 전환은 조정 규칙으로만.
const WB = {
  awb:      { label: 'AWB (화이트 우선)', k: '자동' },
  awbAmb:   { label: 'AWB (분위기 우선)', k: '자동' },
  daylight: { label: '태양광', k: '약 5200K' },
  shade:    { label: '그늘', k: '약 7000K' },
  cloudy:   { label: '흐림', k: '약 6000K' },
  tungsten: { label: '텅스텐', k: '약 3200K' },
  fluor:    { label: '백색형광등', k: '약 4000K' },
};

// 렌즈 (facts.md 렌즈 절). mount: EF | RF. 상황별 조리개는 렌즈마다 적지 않고 portraitAp 하나로 쓴다(SCENES.apRule 'portrait').
// portraitAp 규칙(사용자 지정): 최대 개방 f/1.4→2, f/1.8·2→2.2, f/2.8→2.8, f/4→4. 'wideOpen'은 apMin.
// portraitFocal: 인물 때 권장 초점거리(핸드헬드 한계 계산, crop 곱함). isStops: IS 스톱 수(미확인이면 생략 → CAMERA_COMMON.isStopsDefault).
// chip: 헤더 칩 표기, tab: 결과 화면 렌즈 버튼 표기. fieldTip: 결과 화면 자세히 첫 줄(줌 렌즈).
const LENSES = [
  // EF (6D2·5D4 네이티브, RF 바디는 어댑터)
  { id: 'ef24105', mount: 'EF', label: 'EF 24-105mm f/4L IS USM', short: '24-105', tab: '24-105 f/4', chip: '24-105 f/4', wide: 24, tele: 105, apMin: 4, apMax: 22, portraitAp: 4, is: true, minFocus: 0.45, portraitFocal: 85,
    note: '인물은 70~105mm로 당겨서. 배경 흐림은 밝은 단렌즈보다 약하지만 IS가 있어 어두운 곳에서 손떨림엔 강함. I형/II형 미확인.',
    fieldTip: '줌은 70~105mm로 당겨서 (배경 흐림↑, 얼굴 왜곡↓)' },
  { id: 'ef50', mount: 'EF', label: 'EF 50mm f/1.8 STM', short: '50mm', tab: '50mm f/1.8', chip: '50 f/1.8', wide: 50, tele: 50, apMin: 1.8, apMax: 22, portraitAp: 2.2, is: false, minFocus: 0.35, portraitFocal: 50,
    note: '기본 f/2.2~2.8. f/1.8은 심도가 너무 얕아 눈 초점이 빗나가기 쉬움. 35cm 안쪽은 초점이 안 맞음.' },
  { id: 'ef85_18', mount: 'EF', label: 'EF 85mm f/1.8 USM', short: '85mm', tab: '85mm f/1.8', chip: '85 f/1.8', wide: 85, tele: 85, apMin: 1.8, apMax: 22, portraitAp: 2.2, is: false, minFocus: 0.85, portraitFocal: 85,
    note: '인물 전용 화각. 기본 f/2.2~2.8. 85cm 안쪽은 초점이 안 맞아 실내에선 뒤로 물러서야 함.' },
  { id: 'ef50_14', mount: 'EF', label: 'EF 50mm f/1.4 USM', short: '50mm f/1.4', tab: '50mm f/1.4', chip: '50 f/1.4', wide: 50, tele: 50, apMin: 1.4, apMax: 22, portraitAp: 2, is: false, minFocus: 0.45, portraitFocal: 50,
    note: '기본 f/2. f/1.4는 심도가 아주 얕아 눈 초점이 자주 빗나감. 45cm 안쪽은 초점이 안 맞음.' },
  { id: 'ef35_2is', mount: 'EF', label: 'EF 35mm f/2 IS USM', short: '35mm', tab: '35mm f/2', chip: '35 f/2', wide: 35, tele: 35, apMin: 2, apMax: 22, portraitAp: 2.2, is: true, isStops: 4, minFocus: 0.24, portraitFocal: 35,
    note: '넓은 화각. 인물은 상반신 이상으로. IS 4스톱. 24cm까지 접근 가능.' },
  { id: 'ef2470_28', mount: 'EF', label: 'EF 24-70mm f/2.8L II USM', short: '24-70', tab: '24-70 f/2.8', chip: '24-70 f/2.8', wide: 24, tele: 70, apMin: 2.8, apMax: 22, portraitAp: 2.8, is: false, minFocus: 0.38, portraitFocal: 70,
    note: '인물은 50~70mm로 당겨서. f/2.8 고정. IS 없음.', fieldTip: '줌은 50~70mm로 당겨서 (배경 흐림↑, 얼굴 왜곡↓)' },
  { id: 'ef70200_28', mount: 'EF', label: 'EF 70-200mm f/2.8L IS III USM', short: '70-200 f/2.8', tab: '70-200 f/2.8', chip: '70-200 f/2.8', wide: 70, tele: 200, apMin: 2.8, apMax: 32, portraitAp: 2.8, is: true, isStops: 3.5, minFocus: 1.2, portraitFocal: 135,
    note: '망원 인물. 85~135mm에서 배경 압축. 1.2m 안쪽은 초점이 안 맞음. IS 3.5스톱.', fieldTip: '85~135mm로 당겨서 배경을 압축 (피사체와 3m 이상)' },
  { id: 'ef70200_4', mount: 'EF', label: 'EF 70-200mm f/4L IS II USM', short: '70-200 f/4', tab: '70-200 f/4', chip: '70-200 f/4', wide: 70, tele: 200, apMin: 4, apMax: 32, portraitAp: 4, is: true, isStops: 5, minFocus: 1.0, portraitFocal: 135,
    note: '망원 인물. 85~135mm에서 배경 압축. 1m 안쪽은 초점이 안 맞음. IS 5스톱.', fieldTip: '85~135mm로 당겨서 배경을 압축 (피사체와 3m 이상)' },
  // RF (R 시리즈 네이티브)
  { id: 'rf50', mount: 'RF', label: 'RF 50mm F1.8 STM', short: 'RF50', tab: 'RF 50 f/1.8', chip: 'RF50 f/1.8', wide: 50, tele: 50, apMin: 1.8, apMax: 22, portraitAp: 2.2, is: false, isStops: 0, minFocus: 0.30, portraitFocal: 50,
    note: '기본 f/2.2~2.8. 30cm 안쪽은 초점이 안 맞음. IS 없음 (바디 손떨림보정이 있으면 그걸로).' },
  { id: 'rf85', mount: 'RF', label: 'RF 85mm F2 Macro IS STM', short: 'RF85', tab: 'RF 85 f/2', chip: 'RF85 f/2', wide: 85, tele: 85, apMin: 2, apMax: 29, portraitAp: 2.2, is: true, isStops: 5, minFocus: 0.35, portraitFocal: 85,
    note: '인물 전용 화각. 기본 f/2.2~2.8. 35cm까지 접근 가능.' },
  { id: 'rf24105', mount: 'RF', label: 'RF 24-105mm F4 L IS USM', short: 'RF24-105', tab: 'RF 24-105 f/4', chip: 'RF24-105 f/4', wide: 24, tele: 105, apMin: 4, apMax: 22, portraitAp: 4, is: true, isStops: 5, minFocus: 0.45, portraitFocal: 85,
    note: '인물은 70~105mm로 당겨서. IS 5스톱.', fieldTip: '줌은 70~105mm로 당겨서 (배경 흐림↑, 얼굴 왜곡↓)' },
  { id: 'rf35', mount: 'RF', label: 'RF 35mm F1.8 Macro IS STM', short: 'RF35', tab: 'RF 35 f/1.8', chip: 'RF35 f/1.8', wide: 35, tele: 35, apMin: 1.8, apMax: 22, portraitAp: 2.2, is: true, isStops: 5, minFocus: 0.17, portraitFocal: 35,
    note: '넓은 화각. 인물은 상반신 이상으로. 17cm까지 접근 가능. 기본 f/2.2~2.8.' },
];

// 빛 조건 EV100 (facts.md). est=true는 추정값.
const LIGHTS = [
  { id: 'sunny',     label: '맑음 직사광',              ev: 15 },
  { id: 'shade',     label: '맑은 날 그늘 (역광 얼굴 포함)', ev: 12 },
  { id: 'overcast',  label: '짙은 흐림·비 오는 낮',       ev: 12 },
  { id: 'preSunset', label: '일몰 직전 하늘',            ev: 13 },
  { id: 'home',      label: '가정 실내 조명',             ev: 6 },
  { id: 'window',    label: '실내 창가 자연광',           ev: 9, est: true },
  { id: 'dim',       label: '어두운 카페·식당',           ev: 6, est: true },
  { id: 'nightFace', label: '야간 가로등·간판 근처 얼굴',  ev: 6, est: true },
];

// 피사체 2종 = C 모드 세트(바디에 C 모드가 있을 때 cModes[0]=still, [1]=kid). minShutter = ISO 자동 최소 셔터속도.
// AF 모드·영역 명칭은 바디(afModes, afAreaStill/Kid)에서 읽고, 여기엔 피사체 쪽 안내만.
const SUBJECTS = [
  { id: 'kid', label: '움직이는 아이', minShutter: 1 / 500,
    afAreaHint: '아이 몸통이 영역 안에 들어오게',
    afTip: '반셔터를 누른 채 아이를 따라가다가 연사. 멈추는 순간(점프 꼭대기, 방향 전환)이 가장 잘 나옴.' },
  { id: 'still', label: '가만히 있는 사람', minShutter: 1 / 125,
    afAreaHint: '가까운 쪽 눈에 점을 대고',
    afTip: '눈에 초점을 맞춘 뒤 반셔터를 유지한 채 구도를 바꾸기. 라이브뷰 얼굴 추적도 정확함.' },
];

// 상황 8개. 조리개는 apRule('portrait' = 렌즈의 portraitAp, 'wideOpen' = 최대 개방)로 정하고 렌즈별 숫자를 적지 않는다. mode Av가 기본, M은 야경만. ISO 자동 상한은 바디의 isoUsable. wb는 전부 awbAmb.
// sub: 카드 부제. adjust: [조건, 조치]. why: 한 줄 이유. tips: 팁 카드. perCombo: 조합별 예외 {minShutter, adjustFirst, adjustLast}. 키는 '렌즈id.피사체' | 'slow.피사체'(최대 개방 f/4 이상) | 'fast.피사체' | '*.피사체'.
const SCENES = [
  { id: 'outdoorSunny', label: '야외 맑음', sub: '그림자가 선명할 때', light: 'sunny', mode: 'Av',
    apRule: 'portrait', ec: 0, wb: 'awbAmb', metering: '평가 측광', ps: '인물',
    // 밝은 단렌즈는 바디 최고 셔터에 맞춰 compute()가 자동으로 조임: 1/4000 바디 f/3.2(1/3200), 1/8000 바디 f/2.2(1/6400) 유지.
    why: '빛이 넘치는 조건. 셔터가 1/2000 이상으로 잡혀 아이도 멈춤. 밝은 단렌즈는 바디 최고 셔터를 넘지 않는 선까지 자동으로 조여짐(1/4000 바디 f/3.2, 1/8000 바디 f/2.2).',
    adjust: [
      ['얼굴에 그림자가 져 어두우면', '노출보정 +0.7'],
      ['하늘이 하얗게 날아가면', '노출보정 -0.3'],
      ['하얀 옷·모래·눈이 많으면', '조리개 한 스톱 조이기 ({apStop}). 최고 셔터 {maxShutter} 초과 방지'],
      ['배경을 더 흐리고 싶으면', '그늘로 옮겨 「야외 그늘」로'],
    ],
    tips: ['정오 직사광은 눈 밑에 그림자가 짐. 해를 등지게 세우면 「역광」 상황이 됨.'] },

  { id: 'outdoorShade', label: '야외 그늘', sub: '인물에 가장 좋은 자리', light: 'shade', mode: 'Av',
    apRule: 'portrait', ec: 0, wb: 'awbAmb', metering: '평가 측광', ps: '인물',
    why: '그늘은 빛이 부드럽고 균일해 인물에 가장 좋은 자리. 밝은 단렌즈는 f/2.2 근처로 배경을 녹이고, f/4 줌은 최대 개방.',
    adjust: [
      ['얼굴이 어두우면', '노출보정 +0.3~+0.7'],
      ['피부가 푸르스름하면', 'Q 버튼 → WB → 그늘'],
      ['배경을 더 녹이고 싶으면', '피사체를 배경에서 3m 이상 떼기'],
    ],
    tips: ['그늘 가장자리(밝은 쪽을 바라보는 자리)에 세우면 눈에 빛이 들어감.'] },

  { id: 'backlit', label: '역광', sub: '해를 등지고', light: 'shade', mode: 'Av',
    apRule: 'portrait', ec: 1, wb: 'awbAmb', metering: '평가 측광', ps: '인물',
    why: '얼굴은 자기 그림자 속(그늘 밝기)인데 뒤는 밝아서 카메라가 얼굴을 어둡게 찍음. 노출보정 +1로 얼굴을 살림. 배경이 하얗게 날아가는 건 정상.',
    adjust: [
      ['해가 화면 안에 들어오면', '아이 머리나 나무 뒤로 해를 숨기기. 빛번짐(플레어)과 뿌연 사진의 가장 큰 원인'],
      ['전체가 뿌옇게 번지면(플레어)', '손이나 후드로 렌즈 위를 가리고, 해를 화면 밖으로'],
      ['얼굴이 여전히 어두우면', '노출보정 +1.3, 또는 측광 모드 버튼 → 스팟 측광으로 얼굴을 재기'],
      ['하늘 색을 살리고 싶으면', '「실루엣」 스타일로 (원하는 사진 탭, M 모드)'],
    ],
    tips: ['해가 낮은 오후 4시 이후가 쉬움. 정오 역광은 머리 위에서 내려와 효과가 약함.', '밝은 단렌즈(특히 50mm f/1.8)는 해가 화면 근처에만 있어도 플레어가 심함. 해를 등지되 화면엔 넣지 않기.'] },

  { id: 'cloudyRain', label: '흐림·비', sub: '구름이 디퓨저', light: 'overcast', mode: 'Av',
    apRule: 'portrait', ec: 0.3, wb: 'awbAmb', metering: '평가 측광', ps: '인물',
    perCombo: { '*.still': { adjustLast: ['빗방울을 멈추고 싶으면', '아이용 세트로 (최소 셔터 1/500)'] } },
    why: '구름이 거대한 디퓨저 역할을 해 그림자가 없음. 색이 차갑고 어둡게 나오니 노출보정 +0.3으로 보정.',
    adjust: [
      ['회색으로 칙칙하면', '노출보정 +0.7'],
      ['색이 차갑게 나오면', 'Q 버튼 → WB → 흐림'],
      ['차분한 톤을 원하면', '노출보정 0, 픽처스타일 채도 -2'],
    ],
    tips: ['방진방적 바디라도 렌즈와 마운트 틈은 비를 피할 것.', '우산·창문·젖은 바닥처럼 비의 흔적을 화면에 넣기.'] },

  { id: 'indoorWindow', label: '실내 창가 낮', sub: '창 옆 90도', light: 'window', mode: 'Av',
    apRule: 'portrait', ec: 0.3, wb: 'awbAmb', metering: '평가 측광', ps: '인물',
    why: '창빛은 한쪽에서 오는 부드러운 빛. 밝은 창이 화면에 들어오면 카메라가 얼굴을 어둡게 하므로 노출보정 +0.3.',
    adjust: [
      ['얼굴이 어두우면', '노출보정 +0.7 (창이 하얗게 날아가도 됨)'],
      ['아이가 흔들리면', '창에 더 가까이 (빛은 거리의 제곱으로 줄어듦)'],
      ['얼굴이 주황·초록빛이면', '실내등 끄기'],
    ],
    tips: ['창 옆 90도에 세우면 얼굴 반쪽에 빛이 들어 입체적. 창을 정면으로 보면 평면적.', '창빛(5200K)과 전구(3200K)가 섞이면 피부색이 틀어짐.'] },

  { id: 'indoorEvening', label: '실내 저녁 조명', sub: 'ISO가 올라가는 게 정상', light: 'home', mode: 'Av',
    apRule: 'portrait', ec: 0, wb: 'awbAmb', metering: '평가 측광', ps: '인물',
    why: '가정 조명은 낮 야외의 1/500 밝기. ISO가 수천까지 오르는 게 정상. 단렌즈 f/2.2는 f/4보다 빛을 3배 받아 ISO가 1.5스톱 낮음.',
    adjust: [
      ['흔들리면', 'MENU → ISO speed settings → Auto range → {isoHard}, 또는 방 조명 전부 켜기'],
      ['얼굴이 너무 주황이면', 'Q 버튼 → WB → 텅스텐, 또는 AWB 화이트 우선'],
      ['얼굴이 어두우면', '노출보정 +0.3'],
    ],
    tips: ['스탠드 하나를 얼굴 옆 45도에 두면 조명 사진처럼 됨.', '안티플리커를 켜두면 LED 조명 줄무늬를 피함.'] },

  { id: 'cafe', label: '카페·식당', sub: '단렌즈가 유리', light: 'dim', mode: 'Av',
    apRule: 'portrait', ec: 0, wb: 'awbAmb', metering: '평가 측광', ps: '인물',
    why: '어두운 상황. f/4 줌은 ISO가 상한 근처까지 오르니 밝은 단렌즈가 유리. 조명 색은 AWB 분위기 우선으로 남김.',
    adjust: [
      ['흔들리면', 'MENU → ISO speed settings → Auto range → {isoHard}. 그래도 어두우면 창가 자리로'],
      ['분위기를 어둡게 살리고 싶으면', '노출보정 -0.3'],
      ['아이가 흔들리면', '먹는 순간처럼 멈춘 때를 노리기'],
    ],
    tips: ['조명 바로 아래보다 조명이 옆이나 뒤에 있는 자리가 얼굴에 좋음.'] },

  { id: 'nightPortrait', label: '야경 배경 인물', sub: 'M 모드', light: 'nightFace', mode: 'M',
    apRule: 'portrait', ec: 0, wb: 'awbAmb', metering: '평가 측광 (M에서는 참고용)', ps: '인물',
    perCombo: { 'slow.kid': { minShutter: 1 / 250, adjustFirst: ['', '밤에 아이는 멈춘 순간만. 가능하면 밝은 단렌즈로 교체'] } },
    why: 'Av로 두면 카메라가 어두운 배경까지 밝히려고 셔터를 늦춰 흔들림. M으로 셔터를 고정하고 ISO로 얼굴 밝기를 맞춤. 배경 불빛은 보케가 됨.',
    adjust: [
      ['얼굴이 어두우면', 'ISO 버튼 → 메인 다이얼 한 클릭씩 올리기 ({isoSteps}). 상한 {isoHard}'],
      ['배경 불빛이 하얗게 번지면', '셔터 한 클릭 빠르게 ({shutterSteps})'],
      ['얼굴에 빛이 안 닿으면', '설정으로 못 고침. 간판·쇼윈도 앞으로 자리 이동'],
    ],
    tips: ['뒤쪽 조명과 5m 이상 떨어지면 보케가 커짐.', '뷰파인더 인디케이터가 -쪽으로 치우쳐도 정상. 배경이 어두워서 그렇게 보임.'] },
];

// 원하는 사진 9개. 숫자는 scene을 참조하고 override로 일부만 바꾼다. image: 'img/{id}.jpg'. lens: 샘플을 찍은 렌즈(참고).
// recommend: 이 느낌이 나는 렌즈 조건 { maxAp: 최대 개방 ≤ , minFocal: 환산 최대 초점거리 ≥ , maxWide: 환산 최단 초점거리 ≤ }. 현재 렌즈가 못 맞추면 결과 화면에 '권장' 안내.
// override.dialExtra: 다이얼 순서 뒤에 붙는 추가 단계.
const STYLES = [
  { id: 'softKid', title: '배경이 사르르 녹는 아이 얼굴', desc: '아이 얼굴만 또렷하고 뒤는 색 번짐으로.',
    scene: 'outdoorShade', subject: 'still', lens: 'ef50', recommend: { maxAp: 2.2 }, override: { aperture: 2.2 },
    conditions: '피사체와 배경 거리 3m 이상. 아이와는 1.5m 정도. 배경에 작은 불빛이나 나뭇잎이 있으면 더 예쁨.',
    failure: '배경이 바로 뒤에 붙어 있음. 또는 최단 촬영거리 안으로 다가가 초점이 안 맞음.', image: 'img/softKid.jpg' },
  { id: 'rimLight', title: '역광에 머리카락이 빛나는 사진', desc: '머리카락 테두리가 빛나고 얼굴도 밝음.',
    scene: 'backlit', subject: 'still', lens: 'ef50', recommend: { maxAp: 2.2 }, override: { ec: 1, metering: '스팟 측광. 중앙점을 얼굴에 대고 반셔터',
      dialExtra: ['측광 모드 버튼 → 스팟 측광. 중앙점을 얼굴에 대고 반셔터'] },
    conditions: '해를 등지게 세우기. 해가 낮은 오후 4시 이후. 배경이 어두운 나무·건물이면 테두리 빛이 더 보임.',
    failure: '노출보정 없이 찍어 얼굴이 검게 나옴. 해가 렌즈에 직접 들어와 뿌옇게 번짐.', image: 'img/rimLight.jpg' },
  { id: 'silhouette', title: '실루엣', desc: '붉은 하늘에 검은 윤곽만.',
    scene: 'backlit', subject: 'still', lens: 'ef24105', recommend: {}, override: { mode: 'M', light: 'preSunset', ec: -2, aperture: 8, wb: 'daylight',
      dialExtra: ['Q 버튼 → WB → 태양광 (AWB는 노을 색을 지움)'],
      why: 'Av는 어두운 사람을 밝히려다 하늘을 하얗게 날림. 하늘 밝기(EV 13)보다 2스톱 어둡게 M으로 고정하면 하늘은 진하고 사람은 검게 됨.',
      adjust: [
        ['하늘이 아직 밝고 사람 옷이 보이면', '셔터 1/1000으로'],
        ['하늘이 너무 어두우면', '셔터 1/250으로'],
        ['노을 색이 밋밋하면', 'Q 버튼 → WB → 그늘 (더 붉게)'],
      ] },
    conditions: '해가 지평선 가까이. 사람 윤곽이 하늘 위에 오게 (몸이 땅이나 건물과 겹치면 안 됨). 팔다리를 벌려 형태 만들기.',
    failure: 'Av 그대로 찍어 카메라가 사람을 밝히려다 하늘이 하얗게 날아감. AWB가 노을 색을 지움.', image: 'img/silhouette.jpg' },
  { id: 'windowHalf', title: '창가 빛이 얼굴 반쪽만 든 사진', desc: '한쪽 얼굴은 밝고 반대쪽은 부드럽게 어둡게.',
    scene: 'indoorWindow', subject: 'still', lens: 'ef50', recommend: { maxAp: 2.8 }, override: {},
    conditions: '창 옆 90도에 세우기. 실내등 끄기. 창에서 1m 이내.',
    failure: '창을 정면으로 보고 서서 평면적. 실내등이 켜져 반대쪽 얼굴이 주황색.', image: 'img/windowHalf.jpg' },
  { id: 'freeze', title: '뛰는 순간 정지', desc: '머리카락 한 올까지 멈춘 아이.',
    scene: 'outdoorSunny', subject: 'kid', lens: 'ef24105', recommend: { minFocal: 85 }, override: { minShutter: 1 / 1000 },
    conditions: '밝은 야외. 아이가 카메라 쪽으로 오게. 반셔터를 유지하며 따라가다 연사.',
    failure: '원샷 AF로 찍어 초점이 뒤 배경에 맞음. 최소 셔터속도를 안 올려 손발이 흐림.', image: 'img/freeze.jpg' },
  { id: 'nightBokeh', title: '야경 보케 앞 인물', desc: '얼굴은 또렷, 뒤 불빛은 동그란 원.',
    scene: 'nightPortrait', subject: 'still', lens: 'ef50', recommend: { maxAp: 2 }, override: { apRule: 'wideOpen', iso: 3200 },
    conditions: '뒤쪽 조명과 5m 이상 거리. 얼굴에는 간판·쇼윈도 빛이 닿는 자리.',
    failure: '얼굴에 빛이 없어 배경만 밝음. Av로 찍어 셔터가 느려져 흔들림.', image: 'img/nightBokeh.jpg' },
  { id: 'rainTone', title: '비 오는 날 차분한 톤', desc: '색이 가라앉고 부드러운 회색 톤.',
    scene: 'cloudyRain', subject: 'still', lens: 'ef50', recommend: { maxAp: 2.8 }, override: { ec: 0.3, ps: '인물, 채도 -2' },
    conditions: '우산·창문·젖은 바닥 같은 비의 흔적을 화면에. 색이 적은 옷.',
    failure: '카메라가 밝게 만들어 비 느낌이 사라짐. 채도를 그대로 두어 알록달록.', image: 'img/rainTone.jpg' },
  { id: 'cafeMood', title: '카페 분위기', desc: '전구색이 남은 따뜻한 실내.',
    scene: 'cafe', subject: 'still', lens: 'ef50', recommend: { maxAp: 2.2 }, override: { wb: 'awbAmb' },
    conditions: '조명 바로 아래보다 조명이 옆·뒤에 있는 자리. 테이블 위 소품을 앞에 두기.',
    failure: 'AWB 화이트 우선으로 전구색이 사라져 차가운 사진. ISO 상한이 낮아 흔들림.', image: 'img/cafeMood.jpg' },
  { id: 'familySelf', title: '셀프 가족사진', desc: '전원 선명, 카메라는 삼각대 위.',
    scene: 'outdoorShade', subject: 'still', lens: 'ef24105', recommend: { maxWide: 35 }, override: { aperture: 5.6, tripod: true, drive: '셀프타이머 10초 + 연속 (2~10장)',
      afArea: '1점 AF를 가운데 사람 얼굴에 맞춘 뒤 렌즈 스위치 MF로 고정',
      dialExtra: ['1점 AF로 가운데 사람 얼굴에 반셔터 → 초점 맞으면 렌즈 옆 스위치를 MF로', '드라이브 버튼 → 셀프타이머 10초 + 연속'] },
    conditions: '삼각대 (또는 올려놓을 곳). 모두 같은 줄에 서기. 카메라와 2~3m.',
    failure: '자동 AF가 앞사람에게 맞아 뒷사람 흐림. f/2.2로 찍어 한 명만 선명.', image: 'img/familySelf.jpg' },
];

// 한 번만 해두는 카메라 설정. 항목은 바디 공통, 경로·페이지는 camera.menu[key]에서 읽는다. pathKo: 한글 메뉴명 추정(미확인).
const SETUP_COMMON = [
  { key: 'imageQuality', title: 'RAW + JPEG 기록', value: 'RAW + JPEG L', pathKo: '화질',
    why: 'WB와 밝기를 나중에 고칠 수 있음. 폰이 자동으로 하는 보정을 사람이 대신하는 재료.', note: 'RAW는 메인 다이얼, JPEG는 좌우 키.' },
  { key: 'pictureStyle', title: '픽처스타일 인물 + 세부 조정', value: '인물(Portrait) 선택 → INFO → 샤프니스 강도 +1, 채도 +1 (기본값에서 한 칸씩)', pathKo: '픽처 스타일',
    why: '폰처럼 살짝 또렷하고 선명한 JPEG. 조정 범위는 샤프니스 강도 0~7, 콘트라스트·채도·색조 ±4.', note: '인물 스타일의 기본 숫자값은 미확인. "+1"은 기본값에서 한 칸 오른쪽.' },
  { key: 'awbPriority', title: '화이트밸런스 자동 (분위기 우선)', value: 'AWB → Ambience priority', pathKo: '화이트 밸런스',
    why: '전구색 분위기를 남김. 그늘·흐림·태양광 전환은 상황별 조정 규칙에서 Q 버튼으로.' },
  { key: 'isoAutoRange', title: 'ISO 자동 상한 {isoUsable}', value: 'Auto range → Maximum {isoUsable}', pathKo: 'ISO 감도 설정 → 자동 범위',
    why: '노이즈가 감당 안 되는 ISO로 올라가는 걸 막음. 어두운 실내에서만 {isoHard}로 잠깐 올림.' },
  { key: 'highIsoNr', title: '고감도 노이즈 감소', value: 'Standard', pathKo: '고감도 ISO 노이즈 감소',
    why: 'JPEG의 고감도 노이즈를 줄임. RAW에는 적용되지 않음.', note: 'Multi Shot NR은 RAW+JPEG에서 선택 불가.' },
  { key: 'alo', title: '오토 라이팅 옵티마이저', value: 'Standard', pathKo: '오토 라이팅 옵티마이저',
    why: '역광 얼굴과 어두운 부분을 자동으로 밝힘. 폰 자동 보정과 가장 비슷한 기능.', note: '기본 설정에선 M·B 모드에서 꺼짐.' },
  { key: 'antiFlicker', title: '안티플리커', value: 'Enable', pathKo: '플리커 방지 촬영',
    why: '실내 형광등·LED에서 사진마다 밝기와 색이 달라지는 걸 막음.' },
  { key: 'lensAdapter', title: '마운트 어댑터', value: 'EF 렌즈를 쓸 때 EF-EOS R 어댑터 장착', pathKo: '해당 없음', onlyMount: 'RF',
    why: 'RF 바디에 EF 렌즈를 쓰려면 어댑터가 필요함. 노출·AF 동작은 동일.' },
  // onlyIf: camera.menu에 그 키가 있는 바디에서만 표시 (미러리스 전용)
  { key: 'subjectDetect', title: '피사체 검출 사람 + 눈 검출', value: 'Subject to detect → People, Eye detection → Enable (Auto)', pathKo: '검출할 피사체 / 눈 검출', onlyIf: 'subjectDetect',
    why: '화면 어디에 있든 사람 눈을 자동으로 잡음. 측거점을 고를 필요가 없어짐. 아이용 세트(Whole area AF + Servo AF)의 전제.' },
  { key: 'shutterMode', title: '셔터 모드 기계식', value: 'Mechanical', pathKo: '셔터 방식', onlyIf: 'shutterMode',
    why: '전자셔터는 실내 LED·형광등에서 줄무늬(플리커)와 빠른 움직임의 일그러짐(롤링 셔터)이 생길 수 있음. 앱의 셔터·연사 값은 기계식 기준.' },
];

// C 모드 등록 단계 (hasCModes인 바디만). {c1} {c2} {afStill} {afKid} {afAreaStill} {afAreaKid} {burst}는 바디 값으로 치환.
// pageKey는 camera.pages, menuKey는 camera.menu에서 페이지를 찾는다.
const SETUP_CMODE_STEPS = [
  { title: '모드 다이얼 Av', value: '모드 다이얼을 Av에', path: '모드 다이얼', pageKey: 'avMode' },
  { title: 'AF 동작 {afStill}', value: 'AF 버튼 → 메인 다이얼로 {afStill}', path: 'AF 버튼', pageKey: 'afMode',
    rf: { value: 'MENU → AF 1탭 → AF operation → {afStill}', path: '', pageKey: null, menuKey: 'afOperation' } },
  { title: 'AF 영역 {afAreaStill}', value: 'AF 영역 선택 버튼 → {afAreaStill}', path: 'AF 영역 선택 버튼', pageKey: 'afArea',
    rf: { value: 'MENU → AF 1탭 → AF area → {afAreaStill} (눈 검출이 켜져 있으면 점 근처 얼굴의 눈을 잡음)', path: '', pageKey: null, menuKey: 'afArea' } },
  // 드라이브 다이얼은 바디마다 다름(6D2 메인 다이얼 p.156, 5D4 퀵 컨트롤 다이얼 p.160) → 공통 문구 '다이얼로'
  { title: '드라이브 1매', value: 'DRIVE 버튼 → 다이얼로 1매', path: 'DRIVE 버튼', pageKey: 'drive',
    rf: { value: 'M-Fn 버튼 → 드라이브 항목 → 메인 다이얼로 Single shooting', path: '', pageKey: null, menuKey: 'driveMode' } },
  { title: '최소 셔터 1/125', value: 'Min. shutter spd. → Manual → 1/125', menuKey: 'minShutter', pathKo: 'ISO 감도 설정 → 최저 셔터 속도',
    note: 'ISO 상한에 걸리면 카메라가 이보다 느린 셔터를 쓰기도 함 (매뉴얼 명시). 그때는 ISO 상한을 올려야 함.' },
  { title: '{c1}에 등록', value: 'Register settings → {c1} → OK', menuKey: 'customMode', pathKo: '커스텀 촬영 모드 → 설정 등록' },
  { title: '아이용으로 바꾸기', value: 'AF 버튼 → {afKid} / AF 영역 선택 버튼 → {afAreaKid} / DRIVE 버튼 → 고속 연사 ({burst}컷/초) / Min. shutter spd. → 1/500', path: '②~⑤와 같은 버튼·메뉴', pageKeys: ['afMode', 'afArea', 'drive'], menuKeys: ['minShutter'],
    rf: { value: 'AF operation → {afKid} / AF area → {afAreaKid} / Drive → High-speed continuous + (Mechanical 약 {burst}컷/초) / Min. shutter spd. → 1/500', pageKeys: [], menuKeys: ['afOperation', 'afArea', 'driveMode', 'minShutter'] } },
  { title: '{c2}에 등록', value: 'Register settings → {c2} → OK', menuKey: 'customMode', pathKo: '커스텀 촬영 모드 → 설정 등록' },
  { title: 'Auto update set.는 Disable 유지', value: 'Disable (기본값)', menuKey: 'customMode', pathSuffix: ' → Auto update set.', pathKo: '커스텀 촬영 모드 → 자동 업데이트 설정',
    why: '현장에서 바꾼 값이 저장되지 않아 매번 깨끗하게 시작.' },
];
