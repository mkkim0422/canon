# 카메라 치트키 (구 6D2 세팅 가이드)

캐논 카메라로 인물·아이를 찍는 초보용 단일 페이지 웹앱 + 안드로이드 앱. 바디(CAMERAS)를 고르고 상황 8개 × 피사체 2종을 고르면 Av 모드 설정값(조리개·노출보정·ISO 자동 상한·최소 셔터속도)과 다이얼 순서·현장 조정 규칙을 보여준다. 한국어 UI, 모바일 한 손 사용 전제. 현재 검증된 바디는 EOS 6D Mark II 하나.

## 바디 다중 지원 원칙
- **바디 추가는 한 세션에 하나.** `CAMERAS`에 객체 1개 + facts.md에 "## 바디:" 절 1개 + `json facts`.cameras 항목 1개. 매뉴얼 원문 URL(`manualUrl`) 필수.
- **`verified: true`는 menu 11개 항목(imageQuality, isoAutoRange, minShutter, pictureStyle, wb, awbPriority, alo, highIsoNr, antiFlicker, customMode, lensAdapter) 전부 page가 있을 때만.** EF 마운트의 lensAdapter만 `na: true` 허용. verified: false 바디는 check.js가 경고만 하고, UI에 "검증 전" 표시.
- **`family`는 내부 분류(ff2dial | crop2dial | crop1dial | rf)로 다이얼 문구 템플릿(js/dials.js)을 고르는 데만 쓴다. UI에 절대 노출하지 않는다.** 실제 검증된 템플릿은 ff2dial뿐. crop1dial·rf는 틀만 있고 "RF 바디 문구 미확정" 같은 자리표시가 들어 있다.
- 마운트: EF 바디 + RF 렌즈는 조합 불가(목록에서 숨김). RF 바디 + EF 렌즈는 `r.adapter = true`로 "어댑터 필요" 표시. 크롭 바디는 환산 초점거리(portraitFocal × crop)로 핸드헬드 한계를 계산하고 "환산 80mm"를 표시.
- 바디별 값은 compute()가 camera에서 읽는다: shutterFastest(자동 조임 기준), isoUsable(ISO 자동 상한), isoHard(비상 상한), isoMin/isoMax, crop, afModes/afArea 명칭, burstFps, cModes.
- **야외 맑음의 밝은 단렌즈 조리개는 데이터에 f/2.2로 두고 compute()가 바디 최고 셔터에 맞춰 자동으로 조인다**(`r.autoStopped`, apNotes에 사유). 1/4000 바디(6D2) f/3.2, 1/8000 바디(5D4) f/2.2 유지. check.js가 이 차이를 검사한다. 데이터에 바디별 조리개를 따로 적지 않는다.
- 검증된 바디: EOS 6D Mark II(2026-10-07), EOS 5D Mark IV(2026-10-07, ff2dial 템플릿을 두 바디로 검증), EOS R6 Mark II(2026-10-07, rf 템플릿 검증). 다음 바디부터는 family가 다르면 dials.js 템플릿을 그 바디 매뉴얼로 채운다.
- **미러리스(온라인 가이드) 바디는 `page`에 PDF 쪽수 대신 가이드 페이지 URL 문자열을 넣는다.** app.js가 문자열이면 "온라인 가이드" 링크로, 숫자면 "p.N"으로 표시. facts.md json의 menuPages에도 그 URL을 넣는다.
- 미러리스 전용 메뉴 키(`subjectDetect`, `shutterMode`, `afOperation`, `afArea`, `driveMode`)는 선택 항목. SETUP_COMMON의 `onlyIf: '<키>'` 항목은 그 키가 있는 바디에서만 보이고, SETUP_CMODE_STEPS의 `rf: {...}`는 rf family에서 기본 문구를 덮어쓴다. 아이용 세트는 Servo AF + Whole area AF + Subject to detect People + Eye detection + 고속 연사(기계식).
- 렌즈 목록 순서: 바디와 같은 마운트가 먼저, 어댑터 렌즈(RF 바디의 EF)는 뒤에 "어댑터" 표시.
- 설정 페이지 항목은 공통(SETUP_COMMON, SETUP_CMODE_STEPS)이고 경로·페이지는 camera.menu / camera.pages에서 읽는다. hasCModes가 false면 C 모드 단계 대신 안내 카드.
- localStorage 키 접두어는 `cck.` (예전 `6d2.` 키는 app.js가 1회 마이그레이션하며 6D2 바디로 간주).

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
- `js/data.js` — 데이터만. CAMERA_COMMON, CAMERAS(바디), 표준값 표, WB, LENSES(EF 2 + RF 4), LIGHTS, SUBJECTS(2종), SCENES(8개), STYLES(9개), SETUP_COMMON / SETUP_CMODE_STEPS(한 번만 하는 설정 템플릿).
- `js/exposure.js` — `compute(camera, scene, subject, lens, override)` 하나 + 마운트 호환(`lensCompatible`, `compatibleLenses`) + 바디별 표준값 표(`tablesFor`). 로직 변경은 여기만. 문구는 만들지 않는다.
- `js/dials.js` — `dialSteps(r)`. family별 다이얼 조작 문구 템플릿(Av/M). 문구 수정은 여기만.
- `js/app.js` — 해시 라우팅과 렌더. 로직 없음.
- `css/style.css` — 테마 변수, 다크모드 자동.
- `check.js` — Node 검증 스크립트.
- `img/` — 스타일 사진 `img/{styleId}.jpg` 9장 (AI 생성 샘플, 긴 변 1200px·300KB 이하, JPEG 80). 교체 시 같은 파일명으로 덮어쓰기. 원본은 `sample/c1~c9.png`(앱에 포함하지 않음). 변환 스크립트는 `C:\dev\canon6d2-app\make-style-images.js`(sharp). STYLES.image가 가리키는 파일이 없으면 check.js가 실패하고, 화면에서는 onerror로 빈 슬롯으로 돌아간다. familySelf는 교체 예정.

## 깨지 말아야 할 원칙
1. **Av 기본.** 추천은 Av + ISO 자동(상한 지정) + 노출보정 + 최소 셔터속도. M은 야경 배경 인물과 실루엣처럼 Av가 틀리는 상황에만. 플래시는 다루지 않는다.
2. **시작값 + 현장 조정 규칙.** 모든 상황은 `why` 한 줄과 `adjust` 2~4개를 가진다. adjust는 `[조건, 조치]` 쌍(조건 없으면 `''`), 조치 끝에 마침표 없음, 노출보정은 항상 "노출보정 ±x" 형태, ISO 상한 변경은 메뉴 경로("MENU → ISO speed settings → Auto range → 12800") 포함. 조치 안의 `{isoSteps}`/`{shutterSteps}`는 app.js가 현재 값부터 다음 3단계로 치환. flagRules도 같은 쌍을 돌려준다. check.js가 이 문구 규칙을 검사한다. `tips`는 팁 카드에 표시. 고정값 한 세트로 끝내지 않는다.
3. **렌즈 2종만.** EF 24-105mm f/4L IS II, EF 50mm f/1.8 STM. 같은 상황도 렌즈별 조리개가 다르다. 50mm 인물 기본은 f/2.2~2.8 (f/1.8은 스타일 카드에서만).
4. **상황 8개 고정.** 야외 맑음 / 야외 그늘 / 역광 / 흐림·비 / 실내 창가 낮 / 실내 저녁 조명 / 카페·식당 / 야경 배경 인물. 각 상황 × 피사체(움직이는 아이 / 가만히 있는 사람). 피사체가 최소 셔터속도·AF 모드·측거점을 정한다. WB는 전 상황 AWB 분위기 우선(`awbAmb`)이고 그늘·흐림·텅스텐 프리셋은 조정 규칙("Q 버튼 → WB → 그늘")으로만 안내한다. 조합별 예외는 `perCombo['렌즈.피사체']`의 minShutter / adjustFirst / adjustLast.
5. **2탭 원칙 + C1/C2 전제.** 첫 실행은 카메라 선택(바디 이름만) → 렌즈 체크 → 홈. 그 뒤로는 첫 화면(탭: 상황으로 찾기 / 원하는 사진으로 찾기) → 상황 → 피사체 → 결과. 설정 맨 위 "내 카메라" 카드에서 바디 변경(바꾸면 setupDone 초기화). 홈 헤더 칩은 "6D2 · 50 f/1.8" 형식. 앱 이름은 "카메라 치트키"(임시). 렌즈는 결과 화면 상단 토글(LENSES 길이만큼 칸, 탭과 같은 규칙)로 전환하고 설정에서도 변경 가능하며 localStorage에 전역 저장한다. 토글은 페이지 이동 없이 제자리 재계산하고 바뀐 숫자(조리개·예상 셔터·예상 ISO)를 0.3초 강조한다. 스타일 결과도 현재 렌즈로 계산하고 STYLES.lens는 핵심 숫자 카드 첫 줄에 파란색(#3182f6, 안내) "권장 렌즈"로만 표시. 온보딩·설명 페이지 없음. 피사체 세트는 카메라의 C1(가만히 있는 사람: Av, ISO 자동 상한 6400, 최소 셔터 1/125, One-Shot, 1점 AF, 1매) / C2(움직이는 아이: 최소 셔터 1/500, AI Servo, 존 AF, 고속 연사)에 등록해 두는 것을 전제로 하므로, 결과의 다이얼 순서는 "모드 다이얼 C1/C2 → 메인 다이얼 조리개 → 퀵 컨트롤 다이얼 노출보정" 3단계다. ISO 상한은 전 상황 6400으로 고정하고 예외는 adjust 문구로만. M 모드 결과는 노출보정을 숨기고 셔터·조리개·ISO 고정값만 보여준다.
6. **결과 화면 순서 고정.** 제목(상황명 또는 스타일명) + 피사체 부제 → 렌즈 버튼 → ① 핵심 숫자 ② 다이얼 순서(+자세히: AF·드라이브·최소 셔터) ③ 현장 조정 ④ 팁(tips 있을 때만) ⑤ 왜 ⑥ 큰 버튼. 스타일은 숫자 카드 위에 사진 슬롯/조건/실패 원인. 스타일의 `dialExtra`는 다이얼 순서 뒤에 붙는다. 첫 실행(localStorage `6d2.setupDone` 없음)엔 홈 배너와 다이얼 1단계의 "(⚙ 등록 필요)"가 보이고, 설정 맨 아래 "등록 완료"로 끈다.
7. **스타일은 scene을 참조.** STYLES는 scene·subject·lens id + override만 가진다. 숫자를 중복 정의하지 않는다. `image: null`은 나중에 사용자 사진을 넣는 자리.
8. **근거 없는 값 금지.** 새 숫자(EV, 사양, 메뉴 경로)는 facts.md에 출처를 먼저 적고, 표에 없는 EV는 `est: true`, 못 찾은 메뉴 위치는 `page` 생략(UI에 "미확인"). check.js가 facts.md의 ```json facts 블록과 대조하므로 그 블록도 함께 고친다.
9. **디자인 규칙 (토스 스타일).** 외부 라이브러리·웹폰트·아이콘 폰트·빌드 도구 금지(오프라인). 
   1) 배경 #f2f4f6, 카드 #fff, 카드 모서리 20px, 테두리·그림자 없음. 구분은 여백으로만.
   2) 제목 #191f28, 본문 #333d4b, 보조 #8b95a1. 포인트 #3182f6 하나(주요 버튼·선택·링크), 경고 #f04452. 다크모드 배경 #17171c, 카드 #202027.
   3) font-family: Pretendard, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif. 숫자는 tabular-nums.
   4) 화면 제목 24/700, 카드 제목 17/600, 본문 15/400, 보조 13/400, 핵심 숫자 32/700, 자간 -0.3px.
   5) 화면 좌우 20px, 카드 안 20px, 카드 사이 12px, 섹션 사이 24px.
   6) 첫 화면: 제목 + 렌즈 pill(14px) + 톱니 → 최근 카드(파란 "최근" 라벨, 있을 때만) → pill 세그먼트 탭(배경 #e5e8eb, 선택 시 흰 배경·굵은 글자) → 상황 카드 2열 88px 왼쪽 정렬(제목 17 + SCENES.sub 13 회색).
   7) 결과 화면: 13px 회색 라벨 "렌즈" + 채워진 pill 버튼(LENSES 개수만큼, 36px, 좌우 16px, 모서리 18px, 14/600, 선택 #3182f6+흰 글자, 미선택 #e5e8eb+#333d4b. 탭과 모양이 달라야 함) → 핵심 숫자 카드(조리개/노출보정/모드 32px 3칸, M은 조리개/셔터/ISO) → 다이얼 순서 카드(파란 번호 동그라미 24px + 한 줄, 3단계) + "자세히" 파란 텍스트 버튼(AF·드라이브·최소 셔터) → 현장 조정 카드(왼쪽 조건 회색 / 오른쪽 조치 진하게, 16px 간격, 구분선 없음. app.js의 splitRule이 "~면 " 앞뒤로 나눔) → "왜" 회색 13px → 큰 버튼 "다른 상황 고르기"(56px, 파란 배경, 흰 17/600, 모서리 16px, 일반 흐름).
   8) 스타일 카드: 세로 리스트, 왼쪽 이미지 슬롯 72×72 모서리 12px(비면 #f2f4f6), 오른쪽 제목 17 + 설명 13.
   9) 이모지·외부 아이콘 금지. 꼭 필요하면 인라인 SVG 선 아이콘 20px(stroke 1.5). 현재는 뒤로·설정만.
   10) 터치 피드백은 배경이 살짝 어두워지는 transition .15s만. 렌즈 토글의 0.3초 숫자 강조 외 애니메이션 없음.
   하이라이트 톤 우선은 권하지 않는다(최저 ISO 200이 되어 야외 맑음이 1/4000을 넘김).

## 계산 요약 (exposure.js를 읽지 않아도 되게)
- 조리개 = SCENES[scene].aperture[lens] (override 가능), 렌즈 f/최소~최대로 클램프.
- 최소 셔터 = min(피사체 minShutter, 핸드헬드 1/초점거리(IS면 ×4, 상한 1/15)). 상황의 `perCombo['렌즈.피사체']`가 있으면 그 minShutter와 adjustFirst가 우선(현재 야경×24-105×아이 = 1/250).
- check.js는 기본 조합(8×2×2)에 tooDark/tooBright 플래그가 하나라도 있으면 실패한다.
- 계산 EV = LIGHTS[light].ev − 노출보정. 예상 ISO = 100·N²/(t·2^EV). ISO ≤ 100이면 ISO 100 고정 후 셔터 재계산(1/4000 초과 시 tooBright). Av에서 ISO > 상한이면 isoCapped: 카메라가 셔터를 늦춘다고 표시. M에서 > 12800이면 tooDark.
- 1/3스톱 표준값으로 반올림.

## 토큰 절약
- 상황·스타일·설정 항목을 고치는 요청은 data.js의 해당 배열 하나만 읽는다.
- 메뉴 경로 질문은 facts.md 2절만 읽는다. 매뉴얼을 다시 받지 않는다.
- 작업 끝에 `node check.js` 결과 요약 한 줄만 보고한다.
