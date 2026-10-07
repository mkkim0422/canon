# '이 사진처럼 찍기' 매핑 규칙 (js/match.js의 명세)

match.js는 이 문서를 구현한 것이어야 한다. 규칙을 바꾸거나 더할 때는 **이 문서를 먼저** 고친다.

## 원칙
- AI 응답(Features)은 **분류값만** 쓴다. 조리개·셔터·ISO 같은 숫자는 전부 `compute(cameraId, sceneId, subjectId, lensId, override)`에서만 나온다.
- 노출보정은 **현재 상황**(SCENES[scene].ec)에서만 온다. 레퍼런스가 역광이라고 +1을 주지 않는다. 역광 효과를 원하면 `linkSceneId: 'backlit'`으로 상황을 바꾸게 안내한다.
- Features의 어떤 값도 숫자로 직접 쓰지 않는다. (dof 'deep' → "조리개 5.6"은 override로 compute()에 넘겨서 계산 결과를 받는 것이지 Features가 숫자를 준 것이 아니다.)
- 분석 실패·불확실(`lightConfidence < 0.5`, light 'unknown')이면 상황 추천(sameSceneId)은 null. 나머지 규칙은 계속 적용. (단, rimLight·backlit은 confidence와 무관하게 'backlit'.)
- compute()의 `override.apRule`: 'portrait' = 상황 기본 조리개(SCENES[scene].aperture[lens]), 'wideOpen' = 렌즈 최대 개방(lens.apMin). `override.aperture`가 있으면 그것이 우선. (exposure.js에 이 규칙을 읽는 최소 수정이 들어 있다.)

## Features 스키마 (analyze.js의 validateFeatures가 보장)
| 필드 | 허용값 | 밖이면 |
|---|---|---|
| light | sunny · shade · backlit · overcast · window · home · dim · night · studio · unknown | unknown |
| lightConfidence | 0~1 | 0 |
| artificialLight | true/false | false |
| rimLight | true/false | false |
| dof | shallow · medium · deep | medium |
| motion | frozen · still · blur | still |
| focalFeel | wide · normal · tele | normal |
| subject | kid · adult · group · none | none |
| framing | face · halfbody · full | halfbody |
| color.saturation / warmth / contrast | low·mid·high / cool·neutral·warm / low·mid·high | mid / neutral / mid |
| notes | 문자열 최대 3개 | 잘라냄 |

## 입력
`matchFeatures(features, currentSceneId, currentSubjectId, cameraId, lensId, ownedLensIds)`
- currentSceneId: 사용자가 지금 있는 상황(8개 중 하나). 숫자 계산의 기준.
- currentSubjectId: 사용자가 고른 피사체. null이면 (d)의 기본값.
- ownedLensIds: 내 렌즈 목록. lensWarning.okLenses 계산용. 바디와 호환되는 것만 본다.

## 출력
| 키 | 내용 |
|---|---|
| settings | compute() 결과 그대로 (aperture, shutter, iso, ec, cmode, af … ) |
| summary | `역광 · 배경 강하게 흐림 · 따뜻한 채도 · 망원 느낌` 형식 한 줄. 빛 → 심도 → 색 → 화각 순, 해당 없는 조각은 생략 |
| sameSceneId | 우선순위: ① rimLight true 또는 light 'backlit' → 'backlit' (confidence 무관) ② light 'studio'·'unknown' → null ③ lightConfidence < 0.5 → null ④ 그 외 (a) 표 |
| possible | `[{ what, how }]` 지금 상황·렌즈로 되는 것 |
| impossible | `[{ what, why, alt, linkSceneId }]` 지금은 안 되는 것과 대안 |
| lensWarning | `{ need, okLenses }` 또는 null |
| colorTips | `{ ps, edit }` ps는 픽처스타일 조정, edit는 후보정. edit 앞에는 항상 "색감의 절반은 보정이에요" |
| moveTip | 문자열 또는 null |

## 규칙

### (a) light → 상황 id (sameSceneId)
| light | sameSceneId |
|---|---|
| sunny | outdoorSunny |
| shade | outdoorShade |
| backlit | backlit |
| overcast | cloudyRain |
| window | indoorWindow |
| home | indoorEvening |
| dim | cafe |
| night | nightPortrait |
| studio | null + impossible 고정 문구 ((g)와 같은 항목) |
| unknown | null |
우선순위: ① rimLight true 또는 light 'backlit' → 'backlit' (confidence 무관) ② studio·unknown → null ③ confidence < 0.5 → null ④ 그 외 이 표.

### (b) dof → 조리개 override · 렌즈 요구
| dof | override | lensRequirement | possible |
|---|---|---|---|
| shallow | `{ apRule: 'portrait' }` (= 상황 기본 조리개) | `{ maxAp: 2.2 }` | 렌즈 조건 충족 시 `배경 강하게 흐림` / how: "f/{aperture}, 피사체와 배경 3m 이상 떼기" |
| medium | `{ apRule: 'portrait' }` | 없음 | `적당한 배경 분리` / how: "f/{aperture}, 눈에 초점" |
| deep | `{ aperture: 5.6 }` | 없음 | `앞뒤 모두 선명` / how: "f/{aperture}, 가운데 사람 얼굴에 초점" |

### (c) focalFeel → 렌즈 요구 · 이동 팁
| focalFeel | lensRequirement | moveTip | possible |
|---|---|---|---|
| tele | `{ minFocal: 85 }` (환산 초점거리 = 렌즈 최대 초점거리 × crop) | 미달 시 "아이에게 더 가까이, 배경은 더 멀리" | 충족 시 `망원 압축감` / how: "85mm 이상으로 당겨서, 배경은 멀리" |
| wide | 없음 | "24~35mm 쪽으로 (요구 아님, 분위기)" | 없음 |
| normal | 없음 | null | 없음 |

### (d) subject · motion → 피사체 기본값
- (subject 'kid' 그리고 motion 'frozen') → 'kid'. 그 외 → 'still'.
- 사용자가 2단계에서 피사체를 바꾸면 그 값이 우선(currentSubjectId).
- motion 'blur'는 possible에 넣지 않고 notes에만: "흔들림 효과는 이 앱이 다루지 않음".

### (e) 역광 · 머리카락 테두리 빛
- rimLight true 또는 light 'backlit' → sameSceneId 'backlit' (confidence 무관).
- 현재 상황이 backlit → possible `머리카락 테두리 빛 (해를 등지고)` / how: "해를 등지게 세우고 노출보정 {현재 상황 ec}".
- 현재 상황이 indoorWindow → possible `{ what: '창을 등진 테두리 빛', how: '창을 등지고 서서 노출보정 +0.7' }`.
- backlit·indoorWindow 외 상황 → impossible `{ what: '머리카락 테두리 빛', why: '햇빛을 등진 역광이라 지금 빛으론 안 됨', alt: '오후 4시 이후 창가·야외. 실내면 스탠드를 뒤쪽 45도에', linkSceneId: 'backlit' }`.

### (f) 빛 불일치 (사진 light vs 현재 상황의 light)
현재 상황의 light: outdoorSunny→sunny, outdoorShade→shade, backlit→backlit, cloudyRain→overcast, indoorWindow→window, indoorEvening→home, cafe→dim, nightPortrait→night.
같은 계열(sunny↔backlit, shade↔overcast, window↔home, dim↔night)이면 impossible 없음.

| 사진 light | 현재 light | impossible.what | why | alt | linkSceneId |
|---|---|---|---|---|---|
| sunny / backlit | window / home / dim / night | 1/1000 이상의 쨍한 정지 | 밝기 부족 | 밝은 곳으로 | outdoorSunny |
| night | sunny / backlit / shade / overcast / window (밝은 곳) | 배경 불빛 보케 | 불빛이 없음 | 해 진 뒤 간판·가로등 앞 | nightPortrait |
| overcast / shade | sunny | 부드러운 그림자 | 직사광 | 그늘로 | outdoorShade |
| window | sunny | 한쪽에서 오는 부드러운 창빛 | 직사광은 그림자가 강함 | 그늘 가장자리 또는 창가 실내 | indoorWindow |

### (g) 인공 조명
artificialLight true 또는 light 'studio' → impossible **맨 위 고정** `{ what: '조명 장비 느낌', why: '플래시·스튜디오 조명을 쓴 사진', alt: '설정만으론 재현 불가. 배경 흐림·색감만 가져오기', linkSceneId: null }`. 나머지 규칙은 계속 적용.

### (h) 색감 → colorTips
| 값 | ps | edit |
|---|---|---|
| saturation high | 채도 +2 | 채도 +15 |
| saturation low | 채도 -2 | 채도 -15 |
| saturation mid | 없음 | 없음 |
| warmth warm | WB 분위기 우선 유지 | 따뜻함 +10 |
| warmth cool | AWB 화이트 우선으로 (설정 페이지 WB 항목 참고) | 따뜻함 -10 |
| contrast high | 콘트라스트 +1 | 대비 +10 |
colorTips.edit는 항상 "색감의 절반은 보정이에요. 라이트룸: …" 형식. ps 항목이 하나라도 있으면 possible에 `색감 (픽처스타일)` / how: ps 문자열.

### (i) lensRequirement 판정
- maxAp: 현재 렌즈 apMin ≤ maxAp. minFocal: 렌즈 최대 초점거리 × camera.crop ≥ minFocal.
- 현재 렌즈가 하나라도 미달이면 `lensWarning = { need, okLenses }`. need 예: "f/2.2 이하 밝은 렌즈", "85mm 이상 (환산)". okLenses는 ownedLensIds 중 바디 호환이면서 조건을 모두 만족하는 것. 없으면 need 끝에 "(내 렌즈 중엔 없음)".
- lensWarning이 있는 항목의 possible은 넣지 않는다.

### (j) possible 최소 보장
(b)(c)(e)(h)에서 조건 충족된 것만 possible. 하나도 없으면 `{ what: '초점·노출 기본 세팅', how: '{af} · 노출보정 {ec}' }`를 넣는다.

## summary 조각
- 빛: sunny 맑은 직사광 / shade 그늘빛 / backlit 역광 / overcast 흐린 빛 / window 창가 빛 / home 실내 조명 / dim 어두운 실내 / night 야간 불빛 / studio 조명 장비 / unknown (생략)
- 심도: shallow 배경 강하게 흐림 / medium 배경 적당히 분리 / deep 앞뒤 선명
- 색: warm+high 따뜻한 채도 / warm 따뜻한 톤 / cool 차가운 톤 / high 채도 높음 / low 채도 낮음 / 그 외 생략
- 화각: tele 망원 느낌 / wide 광각 느낌 / normal 생략
