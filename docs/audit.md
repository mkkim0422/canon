# 전체 점검 (K) — 2026-10-08, 커밋 0c0eb46 기준 (1~4절). L 반영 현황은 5절, L11 재점검은 6절

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

## 5. L 반영 현황 (2026-10-08, 커밋은 git log 참조)
| L | 상태 | 비고 |
|---|---|---|
| L1 | 완료 | 렌즈 EF 8 + RF 4, lens.portraitAp/scene.apRule, 다중 렌즈 체크(cck.lenses), 결과 칩 가로 스크롤, STYLES.recommend, 문구 일반화({apStop}), check.js 475 조합 통과 |
| L2 | 완료 | backlit 판정 EC ≥ +0.7 (test-diag '흐림 +0.3' → outdoorShade) |
| L3 | 완료 | EV 차 2~4 → 가장 가까운 상황 + sceneConfidence 'low'("(대략)"), ≥4 null. app.js 진단 결과 칩에 표시 |
| L4 | 완료 | ISO ≥ isoUsable이면 선명도 판정 보류(warn 2종) |
| L5 | 완료 | 얼굴 bad = <0.30 그리고 < imageLuma − 0.10. pixels.imageLuma 추가. nightBokeh 어둡게 변형이 bad → warn |
| L6 | 완료 | P → warn 'P·오토 모드로 찍힘', SCN 계열만 bad |
| L7 | 완료 | 핸드헬드 2^(isStops−2) exposure·diagnose·facts 통일 |
| L8·L9 | 불필요 | 위 A5·A6 |
| L10 | 완료(행 추가) / 재검증 대기 | test-diag.html 세 번째 표: `img/real/1~9.jpg` 중 있는 것만 실제 EXIF 경로로 진단, S_LOW 미만 장수 요약. 실사진이 아직 없어 S_LOW 12 유지. `img/real/`은 .gitignore. 절차는 diagnose.md 'S_LOW 실사진 재검증' |
| L11 | 완료 | 아래 6절 |

## 6. L11 재점검 (2026-10-08, L1~L10 반영 후)
자동 검사: `node check.js` 통과(5바디 × 렌즈 12종 호환 조합) · test.html mock 9장 · test-diag.html 36장 + 가짜 EXIF 7/7 일치 + 실사진 0장(없음). pixels 평균 5ms · 최대 14ms.

| 3절 항목 | 상태 | 비고 |
|---|---|---|
| A1 G 미반영 | 해소 | LENSES EF 8 + RF 4, lens.portraitAp / scene.apRule, 다중 렌즈 체크, 렌즈 칩 가로 스크롤(.lens-row.scroll), STYLES.recommend. match.md·match.js의 apRule 'portrait'는 lens.portraitAp를 가리킴 |
| A2 렌즈 종속 문구 | 해소 | outdoorSunny '하얀 옷…' → '조리개 한 스톱 조이기 ({apStop}). 최고 셔터 {maxShutter} 초과 방지'로 일반화 |
| A3 diagnose 규칙 | 해소 | L2~L6 반영. 1/60 f/1.8 ISO3200 → indoorEvening (대략) |
| A4 핸드헬드 불일치 | 해소 | exposure·diagnose·facts 모두 2^(isStops−2), isStops 없으면 4스톱, 상한 1/15 |
| A5·A6 (L8·L9) | 수정 불필요 | 변경 없음 |
| A7 문서 불일치 | 부분 | CLAUDE.md가 기준. 인수인계서.txt는 구버전 그대로(개인 정보 포함, 저장소 공개 시 제외 검토 유지) |
| A8 배포물 | 미해소 | 아티팩트 재배포·안드로이드 www 동기화 미확인(네이티브 폴더 이 PC에 없음). 바디가 5종(6D2·5D4·R6 II·R50·R8)으로 늘었으니 재배포 시 전체 js 동반 |
| A9 실측 공백 | 미해소 | gemini 실측(키 없음) · 실사진 S_LOW(img/real 없음) · 폰 처리 시간 |
| A10 작은 것들 | 부분 | theme-color #f2f4f6로 수정됨. 홈 탭 라벨 '상황으로 / 원하는 사진 / 사진으로'로 축약(360px 두 줄 해소). EXIF 보정 표시 반올림은 정보성 유지 |

남은 것: A8(배포), A9(실측 3건). 다음 바디 추가 순서는 CLAUDE.md대로 90D → 850D → 6D → 80D → 200D II.
추가: 역광 상황 현장 조정 1번을 "해가 화면 안에 들어오면 → 머리·나무 뒤로 숨기기"로(사용자 실전 플레어 피드백). theme-color #f2f4f6. 홈 탭 라벨 축약.

## 7. 검토 라운드 (2026-10-08, 에이전트 3종: 데이터 교차검증 / 악마의 변호인 / UX)

### 반영한 것
- 데이터: 250D C 모드 근거 쪽수 p.30→31(+menuPages), EF 85 출처 URL 교체(404), facts 검증 날짜, 공통 4에 피사체 최소 셔터·상황 노출보정·APS-C ISO 상한 원칙 추가. APS-C 바디(90D·R50 포함) isoUsable/isoHard를 3200/6400으로 통일. 6D isoAutoMaxLabel 'Auto ISO range', 6D 픽처스타일 단일 슬라이더 문구. CLAUDE.md의 낡은 문장 7곳(조리개 구조, isoHard, ISO 상한, cck 키, 검증 바디, 렌즈 수, 결과 순서).
- 촬영 논리: 역광 스팟 측광은 * AE 잠금과 함께(반셔터는 평가 측광에서만 노출 고정), '측광 모드 버튼' 삭제. 흰 옷·모래·눈은 +0.7(노출 부족이 먼저). 역광 미러리스 얼굴 과다 +0.3 규칙. 실내 LED 푸른빛 → 백색형광등 규칙. 존 AF는 얼굴·머리에(가장 가까운 것에 맞음). 가만히 있는 사람 구도 변경은 f/2.8 이상에서. 실내 저녁·카페 아이 1/320(perCombo). 6D 아이는 Tv 1/500 + ISO AUTO(M+ISO AUTO는 노출보정 불가). mAuto의 isoCapped 문구(셔터는 그대로, 어둡게 나옴). 1.5스톱→약 1.7스톱. 안티플리커 트레이드오프·60Hz(1/60·1/125). 야경 ISO 조작 {isoDial} 바디별. familySelf: RF 렌즈 MF 경로·연속 셀프타이머 없는 바디·Camera Connect. 플레어는 지문부터.
- 매칭: 흐림 지수(환산 초점거리÷최대 개방 ≥ 20)로 줌 망원도 '배경 흐림' 충족, deep + ISO 상한이면 impossible, 조명 장비 테두리 빛은 역광으로 안 보냄. 진단: 얼굴이 ok면 하이라이트 bad 금지, kid 추정은 ISO ≥ 400일 때만, 사람 사진 셔터 하한 1/125 규칙, EXIF 모델명(R6m2·250D·Rebel) 매칭.
- UX: 홈 '나가기 전 체크'·시간대 추천·'방금 찍은 게 이상해요'(#fix)·'진단한 사진으로 돌아가기', 결과 '핵심만 보기', C 모드 미등록 다이얼, 숫자 카드 '참고' 문구, 「상황」 링크, 중복 조치 제거, 설정 Gemini 섹션을 맨 아래 '고급'으로, 예시 전용일 때 업로드 숨김, HEIC 안내, 2단계 피사체→상황 순서, 스타일 권장 렌즈 자동 전환, 렌즈 칩 스냅 제거, 카메라 '목록에 없어요', 진단 신호등 글자, 360px 조건|조치 세로, 상황 부제 쉬운 말, 다크 theme-color, 터치 영역.

### 보류 (결정 필요 또는 근거 부족)
- 야경 배경 인물을 M 고정 ISO → M + ISO AUTO + 노출보정으로(6D 제외). 원칙 1(M은 야경만) 변경이라 사용자 결정.
- LIGHTS home 6→7, dim 6→5(한국 LED 아파트·어두운 카페): 출처가 위키 표라 숫자만 바꿀 근거 없음. 폰 노출계 앱으로 실측 후.
- RAW+JPEG 기본값(버퍼·카드 용량) → JPEG L + RAW는 선택: 사용자 원칙.
- 설정 메뉴 한국어/영어 토글: 한글 메뉴명이 전부 '추정'이라 주 표기로 올리기 전 카메라 확인 필요.
- 등록 15분 플로우 체크박스·진행률, 홈 헤더 칩에서 렌즈 바꾸기, 안드로이드 런처 이름 '6D2 세팅'(다른 PC의 네이티브 프로젝트).
- 250D AF operation이 ▶ 키인지(가이드는 메뉴 p.104), R8 M-Fn ISO 경로, 850D LOCK 스위치 유무: 실기 확인.
- 90D Auto range 하한 200(추정), ef24105 IS 스톱 기본 4(II형 가정. I형이면 3).
- 시도 조절·하이라이트 경고·카드 속도 같은 1회 설정 항목 추가(SETUP_COMMON 구조상 menu 키가 필요해 별도 작업).
