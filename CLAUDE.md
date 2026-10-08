# 카메라 치트키 (구 6D2 세팅 가이드)

캐논 카메라로 인물·아이를 찍는 초보용 단일 페이지 웹앱 + 안드로이드 앱. 바디(CAMERAS)를 고르고 상황 8개 × 피사체 2종을 고르면 Av 모드 설정값(조리개·노출보정·ISO 자동 상한·최소 셔터속도)과 다이얼 순서·현장 조정 규칙을 보여준다. 한국어 UI, 모바일 한 손 사용 전제. 검증된 바디 10종(6D2·5D4·R6 II·R50·R8·90D·80D·6D·200D II·850D), 렌즈 EF 8 + RF 4.

## 바디 다중 지원 원칙
- **바디 추가는 한 세션에 하나.** `CAMERAS`에 객체 1개 + facts.md에 "## 바디:" 절 1개 + `json facts`.cameras 항목 1개. 매뉴얼 원문 URL(`manualUrl`) 필수.
- **`verified: true`는 menu 11개 항목(imageQuality, isoAutoRange, minShutter, pictureStyle, wb, awbPriority, alo, highIsoNr, antiFlicker, customMode, lensAdapter) 전부 page가 있을 때만.** EF 마운트의 lensAdapter만 `na: true` 허용. verified: false 바디는 check.js가 경고만 하고, UI에 "검증 전" 표시.
- **`family`는 내부 분류(ff2dial | crop2dial | crop1dial | rf | rf1dial | rf2dial)로 다이얼 문구 템플릿(js/dials.js)을 고르는 데만 쓴다. UI에 절대 노출하지 않는다.** 검증된 템플릿은 ff2dial(6D2·5D4), rf(R6 II: 퀵 컨트롤 다이얼 1·2), rf1dial(R50: 다이얼 1개), rf2dial(R8: 메인 + 퀵 컨트롤 다이얼 1개, ISO 버튼 없음). crop2dial·crop1dial은 틀만. 기계식 셔터가 없는 바디는 `shutterBase: 'Elec. 1st-curtain'`(C 모드 단계 `{shutterBase}` 치환, 기본 Mechanical). 설정 화면의 SETUP_CMODE_STEPS `rf:` 문구는 RF 마운트 바디 전부에 적용된다.
- **최소 셔터 메뉴가 없는 바디는 `hasMinShutter: false`** (R50: ISO 자동은 Max for Auto만). 그러면 compute()가 움직이는 아이를 `r.mAuto`(M + ISO AUTO, 모드 표기 M)로 바꾸고 계산은 Av와 같다. `menu.minShutter`는 `na: true` + ISO 페이지 URL. `isoAutoMaxLabel`('Max for Auto')은 Auto range 문구를 바꾼다. `camera.menu[key]`의 `title/value/why/pathKo`는 SETUP_COMMON 공통 문구를 그 바디에서만 덮어쓴다(R50 셔터 모드 = Elec. 1st-curtain, 기계식 없음).
- 마운트: EF 바디 + RF 렌즈는 조합 불가(목록에서 숨김). RF 바디 + EF 렌즈는 `r.adapter = true`로 "어댑터 필요" 표시. 크롭 바디는 환산 초점거리(portraitFocal × crop)로 핸드헬드 한계를 계산하고 "환산 80mm"를 표시.
- 바디별 값은 compute()가 camera에서 읽는다: shutterFastest(자동 조임 기준), isoUsable(ISO 자동 상한), isoHard(비상 상한), isoMin/isoMax, crop, afModes/afArea 명칭, burstFps, cModes, isoDial(야경 현장 조정의 ISO 조작 문구 {isoDial}, 기본 'ISO 버튼 → 메인 다이얼'), isoAutoMaxLabel(ISO 자동 상한 메뉴명이 Auto range가 아닌 바디: R50·850D·250D 'Max for Auto', 6D 'Auto ISO range' — 현장 조정 문구의 'Auto range'를 app.js가 치환), exifModels(카메라가 EXIF Model에 쓰는 다른 이름, 진단 장비 매칭), minShutterCap(최소 셔터 메뉴 상한. 6D 1/250 → 그보다 빠른 피사체 셔터는 상한으로 묶고 flagRules '아이가 흔들리면 → M + ISO AUTO'로 안내, C2 등록 단계는 SETUP_CMODE_STEPS[].<cameraId> 덮어쓰기), burstLabel(고속 연사 모드가 없는 바디의 드라이브 명칭 '연속'). menu 항목의 `value/title/why`는 그 바디에서만 SETUP_COMMON 문구를 덮어쓰고, 기능이 없는 항목은 `na: true` + 근거 page(사양·기능 목록)로 verified를 유지한다.
- **야외 맑음의 밝은 단렌즈 조리개는 데이터에 f/2.2로 두고 compute()가 바디 최고 셔터에 맞춰 자동으로 조인다**(`r.autoStopped`, apNotes에 사유). 1/4000 바디(6D2) f/3.2, 1/8000 바디(5D4) f/2.2 유지. check.js가 이 차이를 검사한다. 데이터에 바디별 조리개를 따로 적지 않는다.
- 검증된 바디: EOS 6D Mark II(2026-10-07), EOS 5D Mark IV(2026-10-07, ff2dial 템플릿을 두 바디로 검증), EOS R6 Mark II(2026-10-07, rf 템플릿 검증), EOS R50(2026-10-08, rf1dial 템플릿 검증, 온라인 가이드 C011), EOS R8(2026-10-08, rf2dial 템플릿 검증, 온라인 가이드 C013), EOS 90D(2026-10-08, crop2dial 템플릿 검증 = ff2dial 문구 그대로, PDF 매뉴얼 쪽수). EOS 80D(2026-10-08, crop2dial·C 모드, PDF 미러), EOS 6D(2026-10-08, ff2dial, PDF. AWB 우선·안티플리커 없음 → menu na + value/why 덮어쓰기, Min. shutter spd. 상한 1/250 → minShutterCap), EOS 200D II/250D(2026-10-08, crop1dial 템플릿 검증, PDF. 메뉴 탭 번호 미확인 → '촬영 탭'), EOS 850D(2026-10-08, crop2dial의 C 모드 없는 변형, 온라인 가이드 C002). 계획했던 10종이 모두 들어갔다. 새 바디는 같은 절차(매뉴얼 PDF/온라인 가이드 → facts.md 절 + json → data.js → check.js → 설정·결과 스크린샷). 다음 바디부터는 family가 다르면 dials.js 템플릿을 그 바디 매뉴얼로 채운다.
- **미러리스(온라인 가이드) 바디는 `page`에 PDF 쪽수 대신 가이드 페이지 URL 문자열을 넣는다.** app.js가 문자열이면 "온라인 가이드" 링크로, 숫자면 "p.N"으로 표시. facts.md json의 menuPages에도 그 URL을 넣는다.
- 미러리스 전용 메뉴 키(`subjectDetect`, `shutterMode`, `afOperation`, `afArea`, `driveMode`)는 선택 항목. SETUP_COMMON의 `onlyIf: '<키>'` 항목은 그 키가 있는 바디에서만 보이고, SETUP_CMODE_STEPS의 `rf: {...}`는 rf family에서 기본 문구를 덮어쓴다. 아이용 세트는 Servo AF + Whole area AF + Subject to detect People + Eye detection + 고속 연사(기계식).
- 렌즈 목록 순서: 바디와 같은 마운트가 먼저, 어댑터 렌즈(RF 바디의 EF)는 뒤에 "어댑터" 표시.
- 설정 페이지 항목은 공통(SETUP_COMMON, SETUP_CMODE_STEPS)이고 경로·페이지는 camera.menu / camera.pages에서 읽는다. hasCModes가 false면 C 모드 단계 대신 안내 카드.
- localStorage 키 접두어는 `cck.` (예전 `6d2.` 키는 app.js가 1회 마이그레이션하며 6D2 바디로 간주).

## 저장소
- GitHub: https://github.com/mkkim0422/canon (main). 작업이 끝나면 커밋·푸시하고, 폰이 연결돼 있으면 안드로이드 디버그 APK도 새로 설치한다. `sample/`(원본 PNG)은 .gitignore로 제외.

## 실행·검증
- 빌드·의존성 없음. `index.html`을 브라우저로 열면 끝.
- 폰용 공개 링크: https://claude.ai/artifact/FzqHsNUGc92WBc4W7PsnYS (claude.ai 아티팩트). 진입 파일은 `artifact.html`(doctype/head 없음). 재배포는 Artifact 도구로 `artifact.html` + `css/style.css` + `js/*.js`를 위 URL에 publish. 아티팩트 호스팅은 서비스워커와 `/` 포함 해시를 막으므로 라우트 구분자는 점(`#r.cafe.kid`).
- 데이터를 바꿨으면 반드시 `node check.js`. data.js 전체를 docs/facts.md와 대조하고 계산표를 facts.md 6절에 다시 쓴다. 실패(종료 코드 1)면 커밋하지 않는다.

## 안드로이드 앱 (Capacitor, 스토어 출시용)
- 네이티브 프로젝트는 `C:\dev\canon6d2-app` (한글·공백 경로에서 Gradle이 깨져 OneDrive 밖에 둠). 웹 소스는 이 폴더가 원본이고 거기로 복사만 한다.
- 갱신 절차: `cd C:\dev\canon6d2-app` → `node sync-www.js`(www/ 복사) → `node node_modules\@capacitor\cli\bin\capacitor sync android` → `android\gradlew.bat assembleDebug bundleRelease` (JAVA_HOME=`C:\Program Files\Android\Android Studio\jbr`). PowerShell에서 실행. Git Bash에서는 node가 127로 죽는 경우가 있음.
- 패키지명 `app.sixd2.setting`, 앱 이름 "6D2 세팅". 패키지명은 스토어 등록 후 바꿀 수 없다.
- 서명 키 `C:\dev\canon6d2-app\keystore\upload.jks`, 비밀번호는 `android\keystore.properties`. 둘 다 git 제외. 잃어버리면 Play 콘솔에서 업로드 키 재설정 요청 필요.
- 버전 올릴 때 `android\app\build.gradle`의 versionCode(+1)와 versionName을 수정.
- 결과물: 디버그 APK `android\app\build\outputs\apk\debug\app-debug.apk`, 출시용 AAB `android\app\build\outputs\bundle\release\app-release.aab`.
- 아이콘·스플래시 원본은 `assets/`(headless Chrome으로 `assets-src/*.html`에서 생성), 변환은 `node_modules\.bin\capacitor-assets.cmd generate --android`.
- `fs.cpSync`는 OneDrive 폴더에서 Node가 비정상 종료하므로 sync-www.js는 수동 복사를 쓴다.
- 뒤로가기: Capacitor 8 코어는 뒤로가기를 처리하지 않는다. `@capacitor/app` 플러그인이 설치돼 있고 app.js 끝의 `bindAndroidBack`이 "홈이 아니면 history.back(), 홈이면 exitApp()"을 처리한다. 플러그인을 지우면 뒤로가기가 곧바로 앱을 종료시킨다.

## 파일
- `docs/facts.md` — 사양·메뉴 경로(매뉴얼 페이지)·렌즈·EV 표·공식·계산표·check.js용 JSON. **모든 숫자의 유일한 근거.**
- `js/data.js` — 데이터만. CAMERA_COMMON, CAMERAS(바디), 표준값 표, WB, LENSES(EF 8 + RF 4, portraitAp), LIGHTS, SUBJECTS(2종), SCENES(8개), STYLES(9개), SETUP_COMMON / SETUP_CMODE_STEPS(한 번만 하는 설정 템플릿).
- `js/exposure.js` — `compute(camera, scene, subject, lens, override)` 하나 + 마운트 호환(`lensCompatible`, `compatibleLenses`) + 바디별 표준값 표(`tablesFor`). 로직 변경은 여기만. 문구는 만들지 않는다. override에 `apRule: 'portrait' | 'wideOpen'`(상황 기본 조리개 / 렌즈 최대 개방)을 받으며 `aperture`가 있으면 그것이 우선 — match.js가 쓴다.
- `js/dials.js` — `dialSteps(r)`. family별 다이얼 조작 문구 템플릿(Av/M). 문구 수정은 여기만.
- `js/exif.js` — JPEG EXIF 최소 파서 `readExif(file)`. 원본 File에서만 읽는다(축소본엔 EXIF 없음). PNG·WebP·태그 없음 → null. 필드: make, model, lens, fNumber, exposureTime(초), iso, ec(SRATIONAL → 소수 2자리, 부호 유지), focal, program, flash(bit0 boolean), meteringMode, exposureMode. 캐논 MakerNote는 읽지 않는다.
- `js/pixels.js` — 온디바이스 픽셀 분석(동기): `sharpness`(라플라시안 분산) · `clipping` · `faceRegion` · `regionLuma` · `analyzePixels`. `detectFaces`만 비동기(FaceDetector). 숫자만 계산하고 판정하지 않는다.
- `js/diagnose.js` — `diagnose(exif, pixels, cameraId, lensId)`. docs/diagnose.md의 구현. 임계값은 `DIAG` 상수 하나.
- `docs/diagnose.md` — '내 사진 진단' 규칙표와 S_LOW 산출 근거. **규칙·임계값 수정은 이 문서 먼저.**
- `test-diag.html` — 샘플 9장 + 변형 27장(블러·어둡게·밝게) + 가짜 EXIF 7개(기대값 ✓/✗) + 실사진 `img/real/1~9.jpg`(있는 것만, S_LOW 재검증용. 개인 사진이라 git 제외) 진단 표. 로컬 서버로 열 것.
- `js/analyze.js` — `analyzeImage(file, mode, opts)`. mock은 파일명(basename, 대소문자 무시)으로 MOCK_FEATURES를 돌려주고 0.8초 지연. gemini는 **generateContent REST 직접 호출**: 모델은 상수 `GEMINI_MODEL` 하나(설정에 노출 금지), 프롬프트는 상수 `GEMINI_PROMPT`(영문, Features 스키마와 enum 정의, "숫자·카메라 설정 금지"), `generationConfig.responseSchema`에 Features 스키마, 1024px·JPEG 0.85 축소본만 전송(원본 금지), 20초 AbortController, 키는 localStorage `cck.geminiKey`(opts.key로 대체 가능). 오류 문구 고정: 400/401/403 'API 키를 확인해 주세요' · 429 '요청이 많아요. 잠시 후 다시' · 차단(finishReason SAFETY 등, promptFeedback.blockReason) '이 사진은 분석할 수 없어요. 다른 사진으로' · 파싱 실패 '응답 형식 오류' · 그 외 '분석 서버 오류'. 응답은 반드시 `validateFeatures()`를 거친다(허용값 밖 치환, 숫자 필드 제거). **이미지·응답을 localStorage·콘솔에 남기지 않는다**(`GEMINI_DEBUG`는 커밋 시 false).
- `docs/release-notes.md` — 출시 전 필수 항목. **스토어 출시 전 API 키를 중계 서버(Cloudflare Worker 등)로 옮길 것.** 사용량 제한·구독 검증도 중계에서.
- `js/mock-features.js` — img/ 샘플 9장의 Features. STYLES와 모순되면 STYLES 우선.
- `js/match.js` — `matchFeatures(features, currentSceneId, currentSubjectId, cameraId, lensId, ownedLensIds)`. docs/match.md의 구현.
- `docs/match.md` — '이 사진처럼 찍기' 매핑 규칙 명세. **규칙 추가·수정은 이 문서 먼저.**
- `test.html` — 샘플 9장 × 현재 상황 3가지 매핑 표. 상단 pill로 mock / gemini(confirm 후 실제 호출 9회, mock 행과 gemini 행을 나란히, 다른 칸 노란 배경, 맨 아래 '불일치 n/9'). img/를 fetch하므로 로컬 서버로 열 것(`python -m http.server 8000`; file://에서는 fetch가 막힘). (화면 연결은 다음 세션, app.js 미변경)
- `js/app.js` — 해시 라우팅과 렌더. 로직 없음. 결과 화면 조각 함수 `renderKeyCard(r, {recLens})` / `renderDialCard(r)` / `renderRulesCard(r)` / `renderTipsCard(r)` + 렌즈 줄 `lensRow(cam, lens)` / `bindLensRow(view, r, rerender)` / `flashChanged(view, r, prev)`를 기존 결과(#r·#style)와 '이 사진처럼'(#ref.result)이 공유한다. 카드 마크업을 고칠 때는 이 함수만 고친다.
- `index.html` / `artifact.html` — 스크립트 로드 순서: data → exposure → dials → exif → mock-features → analyze → match → pixels → diagnose → app. 새 js 파일은 두 파일 모두에 추가.
- `css/style.css` — 테마 변수, 다크모드 자동.
- `check.js` — Node 검증 스크립트.
- `img/` — 스타일 사진 `img/{styleId}.jpg` 9장 (AI 생성 샘플, 긴 변 1200px·300KB 이하, JPEG 80). 교체 시 같은 파일명으로 덮어쓰기. 원본은 `sample/c1~c9.png`(앱에 포함하지 않음). 변환 스크립트는 `C:\dev\canon6d2-app\make-style-images.js`(sharp). STYLES.image가 가리키는 파일이 없으면 check.js가 실패하고, 화면에서는 onerror로 빈 슬롯으로 돌아간다. familySelf는 교체 예정.

## 깨지 말아야 할 원칙
1. **Av 기본.** 추천은 Av + ISO 자동(상한 지정) + 노출보정 + 최소 셔터속도. M은 야경 배경 인물과 실루엣처럼 Av가 틀리는 상황에만. 플래시는 다루지 않는다.
2. **시작값 + 현장 조정 규칙.** 모든 상황은 `why` 한 줄과 `adjust` 2~4개를 가진다. adjust는 `[조건, 조치]` 쌍(조건 없으면 `''`), 조치 끝에 마침표 없음, 노출보정은 항상 "노출보정 ±x" 형태, ISO 상한 변경은 메뉴 경로("MENU → ISO speed settings → Auto range → 12800") 포함. 조치 안의 `{isoSteps}`/`{shutterSteps}`는 app.js가 현재 값부터 다음 3단계로 치환. flagRules도 같은 쌍을 돌려준다. check.js가 이 문구 규칙을 검사한다. `tips`는 팁 카드에 표시. 고정값 한 세트로 끝내지 않는다.
3. **렌즈는 LENSES 목록(EF 8종 + RF 4종)에서 사용자가 "내 렌즈"로 체크한 것만 쓴다.** 상황은 렌즈별 조리개 숫자를 갖지 않고 `apRule`('portrait' | 'wideOpen')만 가진다. 'portrait'는 `lens.portraitAp`(최대 개방 f/1.4→2, f/1.8·2→2.2, f/2.8→2.8, f/4→4, check.js가 규칙 검사). 렌즈 추가는 facts.md 렌즈 표에 출처와 함께 넣고 json lenses에도 넣는다. 조합 예외(perCombo)는 렌즈 id 대신 'slow'(최대 개방 f/4 이상)/'fast'/'*' 키를 우선 쓴다. adjust·why 문구에 특정 렌즈 이름을 쓰지 않는다(“밝은 단렌즈”, “f/4 줌”, `{apStop}` 같은 치환으로).
4. **상황 8개 고정.** 야외 맑음 / 야외 그늘 / 역광 / 흐림·비 / 실내 창가 낮 / 실내 저녁 조명 / 카페·식당 / 야경 배경 인물. 각 상황 × 피사체(움직이는 아이 / 가만히 있는 사람). 피사체가 최소 셔터속도·AF 모드·측거점을 정한다. WB는 전 상황 AWB 분위기 우선(`awbAmb`)이고 그늘·흐림·텅스텐 프리셋은 조정 규칙("Q 버튼 → WB → 그늘")으로만 안내한다. 조합별 예외는 `perCombo['렌즈.피사체']`의 minShutter / adjustFirst / adjustLast.
5. **2탭 원칙 + C1/C2 전제.** 첫 실행은 카메라 선택(바디 이름만) → 렌즈 체크 → 홈. 그 뒤로는 첫 화면(탭: 상황으로 찾기 / 원하는 사진으로 찾기) → 상황 → 피사체 → 결과. 설정 맨 위 "내 카메라" 카드에서 바디 변경(바꾸면 setupDone 초기화). 홈 헤더 칩은 "6D2 · 50 f/1.8" 형식. 앱 이름은 "카메라 치트키"(임시). 첫 실행 렌즈 체크와 설정 "내 렌즈"는 다중 체크(localStorage `cck.lenses`, 최소 1개). 결과 화면 렌즈 버튼(채워진 pill, 가로 스크롤 한 줄)은 체크한 렌즈만 보여주고 현재 렌즈(`cck.lens`)를 전역 저장한다. 버튼은 페이지 이동 없이 제자리 재계산하고 바뀐 숫자(조리개·예상 셔터·예상 ISO)를 0.3초 강조한다. 스타일 결과도 현재 렌즈로 계산하고, `STYLES.recommend`(maxAp/minFocal/maxWide) 조건을 현재 렌즈가 못 맞출 때만 핵심 숫자 카드 첫 줄에 파란색 "권장 …(내 렌즈 중 …)"을 표시한다. 홈 탭 라벨은 "상황으로 / 원하는 사진 / 사진으로"(360px에서 한 줄). 온보딩·설명 페이지 없음. 피사체 세트는 카메라의 C1(가만히 있는 사람: Av, ISO 자동 상한 6400, 최소 셔터 1/125, One-Shot, 1점 AF, 1매) / C2(움직이는 아이: 최소 셔터 1/500, AI Servo, 존 AF, 고속 연사)에 등록해 두는 것을 전제로 하므로, 결과의 다이얼 순서는 "모드 다이얼 C1/C2 → 메인 다이얼 조리개 → 퀵 컨트롤 다이얼 노출보정" 3단계다. ISO 자동 상한은 바디의 isoUsable(각 바디 리뷰 근거, facts.md)이고 예외는 adjust 문구로만. M 모드 결과는 노출보정을 숨기고 셔터·조리개·ISO 고정값만 보여준다.
6. **결과 화면 순서 고정.** 제목(상황명 또는 스타일명) + 피사체 부제 → 렌즈 버튼 → ① 핵심 숫자 ② 다이얼 순서(+자세히: AF·드라이브·최소 셔터) ③ 현장 조정 ④ 팁(tips 있을 때만) ⑤ 왜 ⑥ 큰 버튼. 스타일은 숫자 카드 위에 사진 슬롯/조건/실패 원인. 스타일의 `dialExtra`는 다이얼 순서 뒤에 붙는다. 첫 실행(localStorage `cck.setupDone` 없음)엔 홈 배너와 다이얼 1단계의 "(⚙ 등록 필요)"가 보이고, 설정 맨 아래 "등록 완료"로 끈다.
7. **스타일은 scene을 참조.** STYLES는 scene·subject·lens id + override만 가진다. 숫자를 중복 정의하지 않는다. `image: null`은 나중에 사용자 사진을 넣는 자리.
8. **근거 없는 값 금지.** 새 숫자(EV, 사양, 메뉴 경로)는 facts.md에 출처를 먼저 적고, 표에 없는 EV는 `est: true`, 못 찾은 메뉴 위치는 `page` 생략(UI에 "미확인"). check.js가 facts.md의 ```json facts 블록과 대조하므로 그 블록도 함께 고친다.
9. **디자인 규칙 (토스 스타일).** 외부 라이브러리·웹폰트·아이콘 폰트·빌드 도구 금지(오프라인). 
   1) 배경 #f2f4f6, 카드 #fff, 카드 모서리 20px, 테두리·그림자 없음. 구분은 여백으로만.
   2) 제목 #191f28, 본문 #333d4b, 보조 #8b95a1. 포인트 #3182f6 하나(주요 버튼·선택·링크), 경고 #f04452. 다크모드 배경 #17171c, 카드 #202027.
   3) font-family: Pretendard, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif. 숫자는 tabular-nums.
   4) 화면 제목 24/700, 카드 제목 17/600, 본문 15/400, 보조 13/400, 핵심 숫자 32/700, 자간 -0.3px.
   5) 화면 좌우 20px, 카드 안 20px, 카드 사이 12px, 섹션 사이 24px.
   6) 첫 화면: 제목 + 렌즈 pill(14px) + 톱니 → 최근 카드(파란 "최근" 라벨, 있을 때만) → pill 세그먼트 탭(배경 #e5e8eb, 선택 시 흰 배경·굵은 글자) → 상황 카드 2열 88px 왼쪽 정렬(제목 17 + SCENES.sub 13 회색).
   7) 결과 화면: 13px 회색 라벨 "렌즈" + 채워진 pill 버튼(LENSES 개수만큼, 36px, 좌우 16px, 모서리 18px, 14/600, 선택 #3182f6+흰 글자, 미선택 #e5e8eb+#333d4b. 탭과 모양이 달라야 함) → 핵심 숫자 카드(조리개/노출보정/모드 32px 3칸, M은 조리개/셔터/ISO) → 다이얼 순서 카드(파란 번호 동그라미 24px + 한 줄, 3단계) + "자세히" 파란 텍스트 버튼(AF·드라이브·최소 셔터) → 현장 조정 카드(왼쪽 조건 회색 / 오른쪽 조치 진하게, 16px 간격, 구분선 없음. app.js의 splitRule이 "~면 " 앞뒤로 나눔) → 팁 카드(tips 있을 때만) → "왜" 회색 13px → 큰 버튼 "다른 상황 고르기"(56px, 파란 배경, 흰 17/600, 모서리 16px, 일반 흐름).
   8) 스타일 카드: 세로 리스트, 왼쪽 이미지 슬롯 72×72 모서리 12px(비면 #f2f4f6), 오른쪽 제목 17 + 설명 13.
   9) 이모지·외부 아이콘 금지. 꼭 필요하면 인라인 SVG 선 아이콘 20px(stroke 1.5). 현재는 뒤로·설정만.
   10) 터치 피드백은 배경이 살짝 어두워지는 transition .15s만. 렌즈 토글의 0.3초 숫자 강조 외 애니메이션 없음.
   하이라이트 톤 우선은 권하지 않는다(최저 ISO 200이 되어 야외 맑음이 1/4000을 넘김).
10. **'이 사진처럼 찍기' 화면.** 라우트 3개: `#ref`(1단계 = 홈 3번째 탭 '이 사진처럼': 설명 카드 → 사진 올리기 → 예시 썸네일 9장) / `#ref.pick`(2단계: 축소본 + summary + 상황 8개 + 피사체 pill, sameSceneId가 있으면 맨 위 파란 테두리 '사진과 같은 곳' 카드) / `#ref.result`(3단계). 분석 결과(features·exif·축소본 dataURL·summary·sameSceneId·선택한 scene/subject)는 메모리 변수 `REF` + sessionStorage `cck.ref`에만 저장. 원본 파일·사진은 localStorage·서버 어디에도 저장하지 않고 objectURL은 사용 후 revoke. 새로고침으로 세션이 비면 #ref로 보낸다. 최근 사용(recent)에는 넣지 않는다. **'이 세팅으로 찍기' 버튼은 두지 않는다** — 기존 결과 화면(#r)으로 넘기면 match의 override(조리개 5.6 등)가 사라진다. 3단계 버튼은 '다른 사진'(#ref) / '상황 바꾸기'(#ref.pick) 둘뿐. 설정의 '사진 분석' 섹션: 분석 모드 `cck.refMode`(mock 기본 / gemini), Gemini 키 `cck.geminiKey`(폰에만 저장) + '연결 테스트' 버튼(img/softKid.jpg 한 장 호출, 성공/실패·소요 시간만 표시, 키 없으면 비활성). 오프라인 + gemini면 올리기 버튼 비활성. 앱은 바디 호환 렌즈 전부를 ownedLensIds로 넘긴다.
11. **'내 사진 진단' 원칙.** diagnose는 AI 미사용·오프라인(EXIF + 픽셀만). 규칙은 docs/diagnose.md 먼저 고치고 diagnose.js가 따라간다. S_LOW 등 임계값은 test-diag.html 수치 근거 없이 바꾸지 않는다. 숫자 세팅(next)은 compute()만. 화면: 홈 3번째 탭 '사진으로'는 큰 카드 2개('이 사진처럼 찍기' #ref + 예시 썸네일 줄, '내 사진 진단' #diag). 라우트 `#diag`(JPEG만 받음. HEIC·PNG는 안내 후 중단) → `#diag.result`. 처리: readExif(원본) → createImageBitmap resize(없으면 Image+canvas) → pixels → diagnose. 결과는 메모리 `DIAGS` + sessionStorage `cck.diag`에 lights·findings·exifSummary·sceneGuess·subjectGuess·축소본 dataURL·진단 바디/렌즈 id만(원본 없음). 새로고침으로 비면 #diag로. recent에 넣지 않는다. **장비 불일치(EXIF 바디·렌즈 ≠ 현재 선택) info가 있으면 회색 카드로 분리하고 렌즈 칩 줄을 숨긴다**(계산 기준이 사진의 장비). next는 renderKeyCard + renderDialCard 재사용, null이면 '상황을 직접 골라주세요' → 홈 상황 탭.
12. **'이 사진처럼 찍기' 원칙.** AI 응답은 Features 분류값만 사용(light/dof/motion/focalFeel/subject/framing/color). 숫자(조리개·셔터·ISO)는 compute()만. 노출보정은 현재 상황(scene.ec)에서만 — 레퍼런스가 역광이라고 +1을 주지 않는다. 매핑 규칙은 docs/match.md 먼저 고치고 match.js가 따라간다. mock 파일명 비교는 경로 제외 basename·대소문자 무시. EXIF는 원본 File에서만 읽는다.

13. **검토 라운드(2026-10-08) 반영 규약.** 홈 상황 탭 맨 위 '나가기 전 체크' 카드(하루 1회 닫기, `cck.checklistHide`에 날짜. IS 줄은 내 렌즈에 IS가 있을 때만)와 시간대 추천 pill(위치 권한 없이 시각만). 홈 '사진으로' 탭 첫 카드 '방금 찍은 게 이상해요' = 라우트 `#fix[.scene[.problem]]` (업로드 없이 recent 상황의 현장 조정만 키워드로 골라 큰 글씨, FIX_PROBLEMS). 결과 카드 '핵심만 보기'(`cck.focus`, main.focus가 숫자·다이얼 카드만 남김). C 모드 미등록이면 다이얼 1단계가 'Av (C1 등록 전 임시)' + AF·드라이브·최소 셔터 단계로 펼쳐짐(⚙ 기호 금지). 숫자 카드의 셔터·ISO는 '카메라가 알아서 정할 값(참고)'로, M+ISO AUTO면 '셔터 고정 · ISO는 카메라가'. 현장 조정의 「상황명」「스타일명」은 linkNames()가 링크로, 같은 조치는 하나만. 설정의 Gemini 섹션은 맨 아래 '고급' details, 라벨은 '예시만 사용 / AI 분석(키 필요)'(mock·gemini 단어 금지). '이 사진처럼'은 AI 분석이 꺼져 있으면 업로드 버튼을 숨기고 예시 9장만(모르는 파일명이 softKid로 조용히 떨어지는 문제). 카메라 선택 '목록에 없어요'는 안내 문구만(유사 기종 대응표는 근거가 없어 두지 않는다). 진단 신호등은 색 + 글자(좋음/주의/문제). 상황 adjust 치환 토큰: {isoSteps} {shutterSteps} {apStop} {maxShutter} {isoHard} {isoDial} {minShutterSet}(최소 셔터 메뉴 없으면 'M 모드 셔터를', 상한 있으면 'Tv 모드로 셔터를'). 설정 페이지는 항목마다 '했음' 체크(`cck.setupSteps[cameraId]`)와 진행률 막대, 전부 체크하면 자동 등록 완료. '3. 그 밖에 한 번만' 카드(시도 조절·재생 하이라이트 경고·카드 속도·렌즈 스위치)는 메뉴 쪽수 없는 1회 준비 항목. 홈 헤더 칩(바디 · 렌즈 ▾)을 누르면 홈 안에서 렌즈를 바로 바꿈(설정은 톱니). 최근 카드는 스타일도 기억(`cck.recent = {style}`). 최소 셔터 상한 바디(6D)는 현장 조정에 flagRules의 Tv 안내 하나만(perCombo의 {minShutterSet} 규칙은 숨김). 미반영·보류 항목은 docs/audit.md 7절.

## 계산 요약 (exposure.js를 읽지 않아도 되게)
- 조리개 = lens.portraitAp (scene.apRule 'wideOpen'이면 lens.apMin, override.aperture 우선), 렌즈 f/최소~최대로 클램프. 상황 데이터에 렌즈 id를 직접 쓰지 않는다.
- 조리개 = override.aperture → apRule(override → scene, 기본 'portrait' = lens.portraitAp, 'wideOpen' = lens.apMin) → 렌즈 범위 클램프.
- 최소 셔터 = min(피사체 minShutter, 핸드헬드 1/(초점거리×crop) × 2^(isStops−2)(IS 없음 ×1, isStops 미확인 ×4), 상한 1/15). diagnose.js와 같은 규칙. 상황의 `perCombo['렌즈.피사체']`가 있으면 그 minShutter와 adjustFirst가 우선(현재 야경×24-105×아이 = 1/250).
- check.js는 기본 조합(8×2×2)에 tooDark/tooBright 플래그가 하나라도 있으면 실패한다.
- 계산 EV = LIGHTS[light].ev − 노출보정. 예상 ISO = 100·N²/(t·2^EV). ISO ≤ 100이면 ISO 100 고정 후 셔터 재계산(1/4000 초과 시 tooBright). Av에서 ISO > 상한이면 isoCapped: 카메라가 셔터를 늦춘다고 표시. M에서 > camera.isoHard면 tooDark.
- 1/3스톱 표준값으로 반올림.

## 토큰 절약
- 상황·스타일·설정 항목을 고치는 요청은 data.js의 해당 배열 하나만 읽는다.
- 메뉴 경로 질문은 facts.md 2절만 읽는다. 매뉴얼을 다시 받지 않는다.
- 작업 끝에 `node check.js` 결과 요약 한 줄만 보고한다.
