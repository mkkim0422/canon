# 전체 점검 (K) — 2026-10-08, 커밋 0c0eb46 기준

코드 수정 없이 점검만 했다. 스크린샷 18장은 `docs/screens/audit/`에 있다(요구 16장 + 360px 폭 2장). 라이트 테마, 헤드리스 Chrome을 DevTools 프로토콜로 제어해 실시간 렌더 후 캡처. 상태 주입은 localStorage(cck.camera/lens/setupDone)와 sessionStorage(cck.ref/cck.diag).
K 지시 원문은 이번 세션에 없어 "코드 수정 없이 점검 · 스크린샷 16장 · docs/audit.md 작성"이라는 요약과 인수인계서.txt를 근거로 범위를 잡았다.

## 1. 자동 검사
| 항목 | 결과 |
|---|---|
| `node check.js` | 통과. "모든 값이 facts.md 범위 안에 있음." 계산표 재생성 |
| test.html (mock) | 9장 전부 표 출력. gemini 모드는 API 키가 없어 실측 못 함(잘못된 키로 9회 호출 → 전부 'API 키를 확인해 주세요' 매핑 확인) |
| test-diag.html | 36장 + 가짜 EXIF 3행 출력. S_LOW 12에서 원본 오판 0/9, 블러 오판 0/9. pixels 평균 5ms · 최대 11ms |
| Node 스텁 하네스 (gemini 요청 형태·오류 매핑 22개, match 추가 규칙 10개) | 통과(이전 세션 기록) |

## 2. 화면 점검표 (docs/screens/audit/)
| # | 파일 | 상태 | 비고 |
|---|---|---|---|
| 01 | 01-camera.png | OK | 바디 3종. verified 전 표시 없음(3종 모두 verified) |
| 02 | 02-lenses.png | OK | 6D2: EF 2종만 보임 → **G1·G2 미반영**(아래 A1) |
| 03 | 03-home-scene.png | OK | setupDone 없을 때 C1·C2 등록 배너 정상 |
| 04 | 04-home-style.png | OK | 스타일 9장 썸네일 정상 |
| 05 | 05-home-photos.png | OK | '사진으로' 탭: 카드 2개 + 예시 줄 |
| 06 | 06-subjects.png | OK | C2 1/500 · C1 1/125 |
| 07 | 07-r-shade-still-50.png | OK | 자세히 펼침 포함. f/2.2 · EC 0 · C1 · 1/800 · ISO 100 |
| 08 | 08-r-night-kid-24105.png | OK | M 모드: f/4 · 1/250 · ISO 6400, 노출보정 숨김, ISO 클릭 순서 6400→12800 |
| 09 | 09-style-rimlight.png | OK | EC +1, 스팟 측광 dialExtra 4단계 |
| 10 | 10-settings-6d2.png | OK | 사진 분석 섹션, 공통 7 + C1·C2 9단계 |
| 11 | 11-settings-r6m2.png | OK | **ISO 자동 상한 12800으로 표시(L9 충족)**. 렌즈 6종(RF 4 + EF 어댑터 2). 공통 10항목(어댑터·피사체 검출·셔터 모드 포함) |
| 12 | 12-r6m2-cafe-kid-rf85.png | 주의 | 렌즈 칩 6개가 **두 줄로 접힘**(G의 가로 스크롤 칩 미반영, A1). 숫자는 정상(f/2.2 · C2 · 1/500 · ISO 4000, 흔들리면 → 25600) |
| 13 | 13-ref-pick.png | OK | '사진과 같은 곳 · 역광' 카드 |
| 14 | 14-ref-result.png | OK | 현재 indoorEvening: 불가 2(테두리 빛, 쨍한 정지) + 링크 |
| 15 | 15-diag.png | OK | JPEG만 받음 안내 |
| 16 | 16-diag-result.png | 주의 | 6D2 EXIF(1/60 f/1.8 ISO3200 −0.67): sceneGuess null → '상황을 직접 골라주세요'. 흔한 실내 사진인데 추천이 비는 문제(A3, L3) |
| 17 | 17-home-360.png | 주의 | 360px: 3칸 탭에서 '원하는 사진으로 찾기'가 두 줄(의도된 줄바꿈이지만 글자 작음) |
| 18 | 18-r-sunny-kid-360.png | 주의 | 24-105 f/4에서 현장 조정 '하얀 옷·모래·눈이 많으면 → f/4로 (최고 셔터 1/4000 초과 방지)' — 이미 f/4라 무의미. 50mm 전용 문구가 렌즈 무관하게 노출(A2, G5 문구 일반화) |

## 3. 발견 사항 (심각도 순)

### A1. G 작업(렌즈 8종 + portraitAp/apRule 구조)이 저장소에 없음 — **G1·G2 미완료**
- 인수인계서 5절은 "G: 렌즈 8종 + portraitAp/apRule 구조 + 다중 렌즈 체크 + 결과 화면 가로 스크롤 칩 + 스타일 recommend 조건" 완료로 적혀 있으나, GitHub `main`에는 없다. 아마 OneDrive 작업 폴더에서 커밋되지 않은 채 H 이후 작업이 다른 경로에서 이어진 것으로 보인다.
- 현재 상태: `LENSES`는 EF 2종(ef24105, ef50) + RF 4종. ef85_18 · ef50_14 · ef35_2is · ef2470_28 · ef70200_28 · ef70200_4 없음. `lens.portraitAp` 없음. `SCENES[*].aperture`가 렌즈 id별 객체(`{ ef24105: 4, ef50: 2.2, rf50: 2.2, … }`)로 렌즈 id를 직접 쓴다. `scene.apRule` 없음. `STYLES[*].recommend` 없음(권장 렌즈는 `style.lens` 하나). 렌즈 체크는 라디오 단일 선택. 결과 화면 렌즈 칩은 flex-wrap(가로 스크롤 아님). facts.md 렌즈 표도 6종만.
- 연쇄: `docs/match.md` (b)와 `js/match.js`의 `apRule: 'portrait'`가 "상황 기본 조리개 = SCENES[scene].aperture[lens]"를 가리킨다(exposure.js에서 그렇게 구현). 새 구조에서는 lens.portraitAp를 가리키도록 match.md·match.js·exposure.js를 함께 바꿔야 한다.
- 인수인계서의 portraitAp 규칙: f/1.4→2, f/1.8·2→2.2, f/2.8→2.8, f/4→4.

### A2. 상황 adjust 문구가 특정 렌즈를 전제 (G5 문구 일반화 대상)
- outdoorSunny '하얀 옷·모래·눈이 많으면 → f/4로 (최고 셔터 1/4000 초과 방지)': 50mm f/3.2 자동 조임 전제. 24-105(f/4)·1/8000 바디(5D4·R6 II)에서는 무의미하거나 틀림. 렌즈 8종이 들어오면 더 늘어난다. `{aperture}`·`{maxShutter}` 치환 또는 조건부 규칙으로 일반화 필요. 그 밖의 adjust 문구도 "50mm", "24-105" 직접 언급 여부를 L1에서 전수 점검할 것.

### A3. diagnose.md 규칙의 현실성 (L2~L6 대상)
- (a) EV 허용 차 2: 1/60 f/1.8 ISO3200(EV 2.6)이 null. 가정 실내(home EV 6)보다 어두운 흔한 사진이 추천을 못 받는다. → L3(가장 가까운 상황 + sceneConfidence 'low', EV 차 ≥ 4면 null).
- (a) shade/overcast 동률에서 backlit 판정이 EC > 0: +0.3 보정(흐림·창가 기본값)도 역광으로 읽힌다. → L2(EC ≥ +0.7).
- (b) 고ISO 사진은 노이즈 때문에 라플라시안 분산이 오히려 커져 blur 판정을 신뢰할 수 없다(노이즈 = 고주파). 현재는 ISO와 무관하게 S_LOW로 판정. → L4.
- (c) 얼굴 밝기 절대값 0.30/0.40만 본다. 야경·카페 샘플 원본이 전부 '얼굴 조금 어두움' warn(test-diag 결과). 전체 평균 대비가 없다. → L5(pixels.js imageLuma 추가).
- (f) P 모드를 bad '오토로 찍힘'. P는 노출보정·ISO 자동이 사는 반자동이라 bad는 과하다. → L6(P·other는 warn, SCN 계열만 bad).
- 추가 관찰: 헤드리스·데스크톱 Chrome엔 FaceDetector가 없어 얼굴은 항상 '중앙 기준 추정'. 안드로이드 Chrome은 Play 서비스가 있을 때만 FaceDetector가 있다(기기별 확인 필요).

### A4. 핸드헬드 여유 계산이 exposure.js와 diagnose.js에서 다름 (L7 대상)
- exposure.js `compute`: IS 렌즈면 일괄 ×4(`CAMERA_COMMON.isGainFactor`), isStops 무시.
- diagnose.js: `2^(isStops−2)`, isStops 없으면 4스톱 가정(→ ×4). RF 85/24-105/35(isStops 5)는 ×8.
- facts.md 공통 2: "IS 있으면 ×4(2스톱) 여유, 상한 1/15초". 인수인계서 3절: "IS면 2^(isStops−2)배 여유".
- 세 곳이 서로 다르다. L7은 facts.md 문구를 통일하라는 것이지만, exposure.js도 같은 규칙을 쓰게 맞출지 결정 필요(현재 check.js 계산표는 ×4 기준).

### A5. L8 — R6 II awbPriority 경로 확인 결과: 수정 불필요
- 가이드 UG-04_Shooting-1_0200을 열어 확인: "With [AWB] selected, press the [AF point selection] button." data.js·facts.md의 'AF 포인트 선택 버튼'이 맞다. INFO 버튼은 6D2·5D4 쪽이고 그대로 맞다.

### A6. L9 — SETUP ISO 자동 상한: 이미 camera.isoUsable을 읽음
- SETUP_COMMON `isoAutoRange` title/value가 `{isoUsable}` 치환. 11번 스크린샷에서 R6 II '④ ISO 자동 상한 12800 / Auto range → Maximum 12800' 확인. 수정 불필요.

### A7. 문서 간 불일치
- 결과 화면 순서: CLAUDE.md 원칙 6은 "① 핵심 숫자 ② 다이얼 순서 ③ 현장 조정 ④ 팁 ⑤ 왜", 인수인계서 3절은 "①다이얼 순서 ②숫자 ③AF ④현장 조정 ⑤왜 ⑥팁". 현재 UI는 CLAUDE.md대로. 인수인계서가 구버전.
- 인수인계서의 프로젝트 폴더(OneDrive)와 현재 작업 폴더(`C:\민규앱\canon`, GitHub 클론)가 다르다. 안드로이드 네이티브 폴더 `C:\dev\canon6d2-app`도 이 PC에 없다(APK 절차 미확인).
- docs/match.md 원칙에 "SCENES[scene].aperture[lens]" 표기 — A1과 함께 갱신 대상.

### A8. 배포물
- claude.ai 아티팩트는 I-a 이후 재배포하지 않았다. 재배포 시 js 6개(exif·mock-features·analyze·match·pixels·diagnose)를 함께 publish해야 하고, img/가 없으면 홈 예시 썸네일이 빈 슬롯이 되고 누르면 '예시 사진을 불러오지 못했어요'로 떨어진다(의도된 폴백).
- 안드로이드 www 동기화 스크립트가 새 js 파일을 복사하는지 확인 못 함(폴더 부재).

### A9. 실측 공백
- gemini 모드 실제 응답과 mock 불일치표: API 키 없음. test.html은 `?gemini=1&key=` 자동 실행 준비됨.
- S_LOW·얼굴·하이라이트 임계값: AI 생성 샘플 9장으로만 산출. 실제 6D2 JPEG(`img/real/*.jpg`) 없음. → L10.
- 폰 처리 시간: 데스크톱 Chrome 17.9MB JPEG 약 200ms만 측정. 폰 미측정.

### A10. 작은 것들
- 360px 폭에서 3칸 세그먼트 탭 글자가 두 줄로 접힘(17번). 라벨을 줄이거나 2줄 허용 유지 중 결정.
- EXIF 노출보정은 소수 2자리로 읽고(−0.67) 화면은 fmtEC로 1자리(−0.7) 표시. 정보성.
- index.html `theme-color`가 `#f6f6f4`인데 배경은 `#f2f4f6`. 안드로이드 상태바 색이 살짝 다름.
- R6 II 공통 설정 ⑧ 마운트 어댑터 항목 pathKo '해당 없음'이 EF 렌즈 사용 시에도 그대로 보임(값 문구는 맞음). 정보성.
- `인수인계서.txt`가 저장소에 커밋돼 있고 개인 일정·여행 정보가 들어 있다. 공개 저장소면 제외 검토.

## 4. L 항목별 현재 상태
| L | 내용 | 현재 | 필요 작업 |
|---|---|---|---|
| L1 | G1·G2 재수행 (렌즈 6종, portraitAp/apRule, 다중 렌즈 체크, 가로 스크롤 칩, recommend, G5 문구) | 전부 미반영 (A1·A2) | 큼. data.js·exposure.js·check.js·facts.md·app.js·css·match.md·match.js·dials 문구 |
| L2 | backlit 판정 EC ≥ +0.7 | EC > 0 | diagnose.md (a) + diagnose.js guessScene 1줄 + 예시 |
| L3 | EV 차 ≥ 2는 low confidence, ≥ 4만 null, 화면 '(대략)' | ≥ 2면 null | diagnose.md/diagnose.js(sceneConfidence) + app.js 칩 |
| L4 | ISO ≥ isoUsable이면 sharpness 판정 보류 | 없음 (A3) | diagnose.md (b) + diagnose.js |
| L5 | 얼굴 bad = <0.30 그리고 < imageLuma − 0.10 | 절대값만 | pixels.js imageLuma + analyzePixels + diagnose |
| L6 | P·other → warn 'P·오토 모드로 찍힘', SCN만 bad | P bad / other warn | diagnose.md (f) + diagnose.js + test-diag 가짜 EXIF 기대값 |
| L7 | facts.md 핸드헬드 문구 통일 | ×4 고정 문구, 코드 2곳 불일치 (A4) | facts.md 공통 2 + (결정) exposure.js를 2^(isStops−2)로 맞출지 |
| L8 | R6 II awbPriority 버튼 재확인 | 가이드와 일치 (A5) | 없음 |
| L9 | SETUP ISO 상한이 isoUsable | 이미 충족 (A6) | 없음 |
| L10 | img/real/*.jpg 실사진 행 + S_LOW 재검증 | 폴더 없음 | test-diag.html에 선택적 행 추가(파일 목록은 수동 지정 필요: 정적 서버라 디렉터리 나열 불가) |
| L11 | check.js·test.html·test-diag.html 통과 후 audit 갱신 | — | L 완료 후 |
