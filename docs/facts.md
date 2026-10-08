# 검증된 사실 (공통 기준값 · 렌즈 · 바디별 사양과 메뉴 경로)

앱의 모든 숫자는 이 문서에 근거한다. 여기 없는 값을 코드에 넣지 말 것.
`[추정]` 표시는 공식 표에 없어 경험적 범위에서 고른 값이며, UI에도 "추정"으로 노출한다.
`미확인`은 근거를 찾지 못한 항목. UI에 "미확인"으로 표시한다.
바디를 추가할 때는 "## 바디:" 절 하나와 맨 아래 `json facts`의 `cameras` 항목을 함께 추가한다. 매뉴얼 원문 URL 필수.

검증 날짜: 2026-10-07.

## 공통 1. 조명 조건별 EV100 (Wikipedia "Exposure value" 표)
출처: https://en.wikipedia.org/wiki/Exposure_value

| 조건 | EV100 |
|---|---|
| 눈·모래, 맑음 | 16 |
| 맑음 직사광 (그림자 선명, Sunny 16) | 15 |
| 옅은 구름 | 14 |
| 흐림 밝음 | 13 |
| 짙은 흐림 | 12 |
| 맑은 날 그늘 | 12 |
| 일몰 직전 | 12–14 |
| 일몰 직후 | 9–11 |
| 밝은 야간 거리 | 8 |
| 야간 거리·쇼윈도 | 7–8 |
| 조명 건물·분수 | 3–5 |
| 사무실 | 7–8 |
| 가정 실내 | 5–7 |

앱에서 쓰는 값:
- sunny 15 (표) / shade 12 (표) / overcast 12 (표, 짙은 흐림 = 비 오는 낮) / preSunset 13 (표 12–14 중간) / home 6 (표 5–7 중간)
- `[추정]` window 9 (실내 창가 자연광. 일몰 직후 9–11과 가정 실내 5–7 사이) / dim 6 (어두운 카페·식당. 가정 실내 5–7 범위 안) / nightFace 6 (가로등·간판 근처 얼굴. 야간 거리 7–8보다 한 스톱 어둡고 가정 실내 5–7 안)
- 역광(backlit)의 얼굴 밝기는 shade 12로 계산한다. 얼굴이 자기 그림자 속에 있어 그늘과 같은 밝기이기 때문.

## 공통 2. 공식
- EV100 = log2(N² / t)
- ISO S에서 셔터: t = N² × 100 / (S × 2^EV)
- 노출보정 c 반영: 계산용 EV = EV − c
- 핸드헬드 한계: 1/(초점거리 × 크롭 배율). IS 있으면 2^(isStops−2)배 여유(isStops 미확인 렌즈는 4스톱으로 보아 ×4), 상한 1/15초. exposure.js·diagnose.js 공통 규칙.
- 인물 기본 조리개(portraitAp): 렌즈 최대 개방 f/1.4→f/2, f/1.8·f/2→f/2.2, f/2.8→f/2.8, f/4→f/4. 상황은 렌즈별 숫자 대신 apRule('portrait' | 'wideOpen')만 가진다.
- 바디 최고 셔터(shutterFastest)를 넘으면 조리개를 조인다: N = √(2^EV × t_max × 100 / ISO_min).
- Sunny 16 검산: EV 15에서 f/16, ISO 100 → t = 256/32768 = 1/128 ≈ 1/125 ✓

## 공통 3. Canon WB 프리셋 색온도
출처: https://hk.canon/en/support/8201712000
- 태양광 약 5200K / 그늘 약 7000K / 흐림·황혼·일몰 약 6000K / 텅스텐 약 3200K / 백색형광등 약 4000K / AWB 약 3000–7000K
- AWB 분위기 우선: 텅스텐 조명의 따뜻한 색을 남김. 화이트 우선: 따뜻한 색을 줄임.
- 앱 원칙: 전 상황 AWB 분위기 우선. 프리셋 전환은 "Q 버튼 → WB → …" 조정 규칙으로만.

## 공통 4. 운용 원칙 (사용자 지정)
- 밝은 단렌즈의 인물 기본 조리개는 f/2.2~2.8 (최대 개방은 눈 초점이 자주 빗나감). 야외 맑음만 f/3.2(1/4000 바디에서 1/3200).
- ISO 자동 상한은 바디의 isoUsable, 비상 상한은 isoHard. 하이라이트 톤 우선은 권하지 않는다(최저 ISO가 200이 되어 야외 맑음이 바디 최고 셔터를 넘김).
- 한글 펌웨어 메뉴명은 **미확인**. 앱의 pathKo(화질 / ISO 감도 설정 / 자동 범위 / 최저 셔터 속도 / 픽처 스타일 / 화이트 밸런스 / 오토 라이팅 옵티마이저 / 고감도 ISO 노이즈 감소 / 플리커 방지 촬영 / 커스텀 촬영 모드)는 추정이며 사용자가 카메라에서 확인하면 확정으로 바꾼다.

## 렌즈
| id | 렌즈 | 마운트 | 초점거리 | 조리개 | 최단 | IS | 출처 |
|---|---|---|---|---|---|---|---|
| ef24105 | EF 24-105mm f/4L IS USM (I형/II형 미확인) | EF | 24–105 | f/4–22 | 0.45m | 있음 (I형 3스톱, II형 4스톱. 세대 확인 전까지 스톱 수 보류) | https://www.canon.co.uk/lenses/ef-24-105mm-f-4l-is-ii-usm-lens/specifications/ |
| ef50 | EF 50mm f/1.8 STM | EF | 50 | f/1.8–22 | 0.35m | 없음 | https://www.the-digital-picture.com/Reviews/Lens-Specifications.aspx?Lens=989 |
| ef85_18 | EF 85mm f/1.8 USM | EF | 85 | f/1.8–22 | 0.85m | 없음 | https://in.canon/en/business/ef85mm-f-1-8-usm/specification |
| ef50_14 | EF 50mm f/1.4 USM | EF | 50 | f/1.4–22 | 0.45m | 없음 | https://www.the-digital-picture.com/Reviews/Lens-Specifications.aspx?Lens=115 |
| ef35_2is | EF 35mm f/2 IS USM | EF | 35 | f/2–22 | 0.24m | 4스톱 | https://www.canon.co.uk/lenses/ef-35mm-f-2-is-usm-lens/specification.html |
| ef2470_28 | EF 24-70mm f/2.8L II USM | EF | 24–70 | f/2.8–22 | 0.38m | 없음 | https://www.the-digital-picture.com/Reviews/Lens-Specifications.aspx?Lens=787 |
| ef70200_28 | EF 70-200mm f/2.8L IS III USM | EF | 70–200 | f/2.8–32 | 1.2m | 3.5스톱 | https://canon.co.uk/lenses/ef-70-200mm-f-2-8-l-is-iii-usm-lens/specifications |
| ef70200_4 | EF 70-200mm f/4L IS II USM | EF | 70–200 | f/4–32 | 1.0m | 5스톱 | https://www.canon.co.uk/lenses/ef-70-200mm-f-4l-is-ii-usm-lens/specifications/ |
| rf50 | RF 50mm F1.8 STM | RF | 50 | f/1.8–22 | 0.30m | 없음 | https://www.canon.co.uk/lenses/rf-50mm-f1-8-stm/specifications/ |
| rf85 | RF 85mm F2 Macro IS STM | RF | 85 | f/2–29 | 0.35m | 5스톱 | https://www.canon-europe.com/lenses/canon-rf-85mm-f2-macro-is-stm/specifications/index.html |
| rf24105 | RF 24-105mm F4 L IS USM | RF | 24–105 | f/4–22 | 0.45m | 5스톱 | https://www.canon.co.uk/lenses/canon-rf-24-105mm-f-4l-is-usm-lens/specifications/ |
| rf35 | RF 35mm F1.8 Macro IS STM | RF | 35 | f/1.8–22 | 0.17m | 5스톱 | https://www.canon-europe.com/lenses/rf-35mm-f-1-8-macro-is-stm-lens/specifications/ |

마운트 규칙: EF 바디에는 EF 렌즈만. RF 바디에는 RF 렌즈와 (어댑터로) EF 렌즈.

## 바디: EOS 6D Mark II (id eos6d2, verified: true)
매뉴얼 원문: Canon EOS 6D Mark II Instruction Manual (영문) https://www.adorama.com/col/productManuals/ICA6DM2.pdf — 페이지 번호는 이 PDF 기준.
사양 출처: https://hk.canon/en/support/6200470100 , https://www.canon.co.uk/cameras/eos-6d-mark-ii/specifications/

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 26.2MP 풀프레임 (크롭 1.0), EF 마운트 |
| 모드 다이얼 | A+, CA, SCN, 크리에이티브 필터, P, Tv, Av, M, B, C1, C2 |
| ISO | 100–40000 (1/3 또는 1스톱), 확장 L=50, H1=51200, H2=102400 |
| ISO 자동 범위 | 최소 100–25600, 최대 200–40000 안에서 지정 (p.174) |
| 셔터 | 30초–1/4000초, 벌브 |
| 플래시 동조 | 1/180초. 내장 플래시 없음 |
| 측광 | 평가, 부분(약 6.5%), 스팟(약 3.2%), 중앙부 중점 평균 |
| 노출보정 | 뷰파인더 ±5스톱, 라이브뷰 ±3스톱 |
| M모드 + Auto ISO | 노출보정 적용 가능 (p.242) |
| 화이트밸런스 | AWB(분위기 우선 / 화이트 우선), 태양광, 그늘, 흐림, 텅스텐, 백색형광등, 플래시, 커스텀, 색온도 2500–10000K |
| 픽처스타일 | 자동, 표준, 인물, 풍경, 디테일 중시, 뉴트럴, 충실, 모노크롬, 사용자 1–3. 조정 범위: 샤프니스 강도 0–7, 세밀도 1–5, 임계값 1–5, 콘트라스트 ±4, 채도 ±4, 색조 ±4 (p.180) |
| AF | One-Shot, AI Servo, AI Focus, MF / 45포인트 전부 크로스 / 라이브뷰 듀얼픽셀 AF |
| AF 영역 선택 | 1점 스팟 AF, 1점 AF, 존 AF(9존), 대형 존 AF(3존), 자동 선택(45점) (p.133–134) |
| 연사 | 고속 약 6.5컷/초, 저속 약 3.0컷/초 |
| 셀프타이머 | 10초, 2초, 10초+연속(2–10장) (p.159) |
| 기타 | 안티플리커, HDR 모드, 다중노출 2–9장, 미러락업(촬영 4탭, p.265), 뷰파인더 시야율 약 98% |
| 고감도 노이즈 (리뷰 종합) | ISO 3200까지 디테일 양호, 6400부터 저대비 디테일 손실, 12800은 노이즈가 디테일보다 많음 → isoUsable 6400, isoHard 12800. 출처 https://www.trustedreviews.com/reviews/canon-eos-6d-mark-ii-performance-image-quality-verdict , https://rangefinderonline.com/gear/cameras/lab-test-canon-6d-mark-ii/ |

### 메뉴 경로 (영문 메뉴명, 매뉴얼 페이지). 촬영 메뉴 = 빨간 카메라 아이콘 탭, 설정 = 노란 공구 탭
| menu 키 | 경로 | 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality. RAW는 메인 다이얼, JPEG는 좌우 키 | 162 |
| isoAutoRange | 촬영 2탭 → ISO speed settings → Auto range → Maximum | 174 |
| minShutter | 촬영 2탭 → ISO speed settings → Min. shutter spd. → Auto(기본 1/초점거리, ±스톱) 또는 Manual. ISO 자동 상한에서도 노출이 안 되면 카메라가 이보다 느린 셔터를 사용 | 175 |
| pictureStyle | 촬영 3탭 → Picture Style (선택 p.176, 세부 조정은 스타일 선택 후 INFO → 파라미터 → 좌우 키 p.179–180) | 180 |
| wb | 촬영 2탭 → White balance | 185 |
| awbPriority | 촬영 2탭 → White balance → AWB 선택 후 INFO → Ambience priority / White priority | 187 |
| alo | 촬영 2탭 → Auto Lighting Optimizer. 기본적으로 M·B 모드에선 비활성 | 194 |
| highIsoNr | 촬영 3탭 → High ISO speed NR. 멀티샷 NR은 RAW/RAW+JPEG에서 선택 불가 | 195 |
| antiFlicker | 촬영 4탭 → Anti-flicker shoot. → Enable | 206 |
| customMode | 설정 5탭 → Custom shooting mode (C1, C2) → Register settings → C1/C2 → OK. 현재 촬영 기능·메뉴·커스텀 기능 설정이 통째로 등록. Auto update set. Enable이면 바꾼 값 자동 반영, Clear settings로 해제. C 모드에서도 설정 변경 가능 | 510–511 |
| lensAdapter | 해당 없음 (EF 마운트) | na |

### 버튼·조작 (pages 키)
| 키 | 조작 | 페이지 |
|---|---|---|
| iso | ISO 버튼 → 메인 또는 퀵 컨트롤 다이얼. "A" = 자동 | 170 |
| afMode | AF 버튼 → 다이얼로 One-Shot / AI Focus / AI Servo | 130 |
| afArea | AF 영역 선택 버튼을 누를 때마다 전환 | 136 |
| drive | DRIVE 버튼 → 메인 다이얼로 1매 / 연속 고속·저속 / 셀프타이머 | 156 |
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개. 셔터는 자동 | 238 |
| mMode | 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 = 조리개 | 241 |
| ec | 반셔터 후 퀵 컨트롤 다이얼. 안 되면 LOCK 스위치를 아래로 | 245 |
| 기타 | 측광 버튼 → 다이얼 243 · 하이라이트 톤 우선 199(권하지 않음) · 미러락업 265 | |

### 다이얼 family
ff2dial (메인 다이얼 + 퀵 컨트롤 다이얼, C1/C2 있음). 이번 세션에서 실제 검증된 유일한 family.

## 바디: EOS 5D Mark IV (id eos5d4, verified: true)
매뉴얼 원문: Canon EOS 5D Mark IV Instruction Manual (영문, Canon 공식 배포 서버) https://gdlp01.c-wss.com/gds/8/0300025058/01/EOS_5D_Mark_IV_Instruction_Manual_EN.pdf — 페이지 번호는 이 PDF 기준. (Canon Singapore 안내 페이지 https://sg.canon/en/support/0302497001 의 eos5d-mk4-im10-en.pdf와 같은 문서)
사양 출처: 위 매뉴얼의 Specifications 절(p.575–577). 공식 웹 스펙 페이지 https://www.canon-europe.com/cameras/eos-5d-mark-iv/specifications/ 는 자동 수집이 차단(403)되어 본문 확인 못 함. 교차 확인: https://en.wikipedia.org/wiki/Canon_EOS_5D_Mark_IV

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 약 30.4MP 풀프레임 (크롭 1.0), EF 마운트 (EF-S·EF-M 제외) |
| 모드 다이얼 | A+, P, Tv, Av, M, B, C1, C2, C3 (앱은 C1·C2만 사용) |
| ISO | 100–32000 (1/3 또는 1스톱), 확장 L=50, H1=51200, H2=102400 (p.576) |
| ISO 자동 범위 | 최소 100–25600, 최대 200–32000 (1스톱 단위) (p.181) |
| 셔터 | 1/8000초–30초, 벌브. X-sync 1/200초 (p.577) |
| 연사 | 고속 약 7.0컷/초, 저속 약 3.0컷/초 (p.160) |
| 측광 | 평가(315존), 부분, 스팟, 중앙부 중점 평균 (Specifications) |
| 노출보정 | ±5스톱(1/3 또는 1/2스톱), 뷰파인더 표시는 ±3까지(그 이상은 퀵 컨트롤 화면) (p.255, 576). 퀵 컨트롤 다이얼, LOCK 스위치 왼쪽으로 해제 |
| 화이트밸런스 | AWB(분위기 우선 / 화이트 우선) 있음 (p.194), 프리셋, 커스텀, 색온도 |
| 픽처스타일 | Auto, Standard, Portrait, Landscape, Fine Detail, Neutral, Faithful, Monochrome, User Def. 1–3. 뒷면 Picture Style 버튼 또는 촬영 3탭 (p.183, 세부 조정 p.187) |
| AF | 61점. AF 영역 선택 모드 7종: 1점 스팟 AF, 1점 AF, AF 포인트 확장(상하좌우), AF 포인트 확장(주변), 존 AF, 대형 존 AF, 자동 선택 AF (p.104) |
| 고감도 노이즈 (리뷰) | ISO 3200까지 매우 좋음, 6400은 "at a push", 12800도 색·디테일 유지(What Digital Camera). DxOMark DR: ISO 3200 8.5EV, 6400 7.4EV, 12800 6.5EV → isoUsable 6400, isoHard 12800 (6D2와 같은 값이지만 5D4 자체 리뷰 근거). 출처 https://www.whatdigitalcamera.com/reviews/canon-eos-5d-mark-iv-review/6 , https://www.dxomark.com/canon-eos-5d-mark-iv-sensor-review-game-changer/ |

### 메뉴 경로 (영문 메뉴명, 매뉴얼 페이지)
| menu 키 | 경로 | 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality | 169 |
| isoAutoRange | 촬영 2탭 → ISO speed settings → Auto range | 181 |
| minShutter | 촬영 2탭 → ISO speed settings → Min. shutter spd. → Auto / Manual. ISO 자동 상한에서도 노출이 안 되면 더 느린 셔터 사용 | 182 |
| pictureStyle | 뒷면 Picture Style 버튼 → 선택 (촬영 3탭 Picture Style 화면에서도 가능 p.183). 세부 조정 p.187 | 183 |
| wb | 촬영 2탭 → White balance | 192 |
| awbPriority | 촬영 2탭 → White balance → AWB 선택 후 INFO → Ambience priority / White priority | 194 |
| alo | 촬영 2탭 → Auto Lighting Optimizer | 201 |
| highIsoNr | 촬영 3탭 → High ISO speed NR | 202 |
| antiFlicker | 촬영 4탭 → Anti-flicker shoot. | 215 |
| customMode | 설정 5탭 → Custom shooting mode (C1-C3) → Register settings → C1/C2/C3 → OK | 520 |
| lensAdapter | 해당 없음 (EF 마운트) | na |

### 버튼·조작 (pages 키)
| 키 | 조작 | 페이지 |
|---|---|---|
| iso | ISO 버튼 → 메인 다이얼 | 177 |
| afMode | AF 동작 버튼 → 메인 다이얼로 One-Shot / AI Focus / AI Servo | 100 |
| afArea | AF 영역 선택 버튼(또는 AF 포인트 버튼 후 M-Fn)을 누를 때마다 전환 | 106 |
| drive | DRIVE 버튼 → 퀵 컨트롤 다이얼 (6D2는 메인 다이얼 → 앱 문구는 "다이얼로"로 공통) | 160 |
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개 | 248 |
| mMode | 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 = 조리개 | 251 |
| ec | 반셔터 후 퀵 컨트롤 다이얼. 안 되면 LOCK 스위치를 왼쪽으로 | 255 |

### 다이얼 family
ff2dial. 6D2와 조작이 같아(Av 메인 다이얼 조리개, 퀵 컨트롤 노출보정, M 메인 셔터·퀵 조리개, ISO 버튼→메인 다이얼) 템플릿 분기 없음. 차이는 LOCK 스위치 방향(6D2 아래, 5D4 왼쪽)과 DRIVE 다이얼뿐이며 문구를 공통으로 맞춤.

## 바디: EOS R6 Mark II (id eosr6m2, verified: true, 미러리스 첫 기종)
매뉴얼 원문: Canon 공식 온라인 Advanced User Guide(펌웨어 1.7.0 기준, 영문) https://cam.start.canon/en/C012/manual/ — 항목별 페이지 URL을 `page`로 쓴다. PDF: https://cam.start.canon/en/C012/manual/c012.pdf
사양 출처: 가이드의 Specifications 페이지 https://cam.start.canon/en/C012/manual/html/UG-10_Reference_0100.html , 캐논 공식 스펙 페이지 http://ph.canon/en/consumer/eos-r6-mark-ii/body/specification , Canon Camera Museum https://global.canon/en/c-museum/product/dslr905.html

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 약 24.2MP 풀프레임 (크롭 1.0), RF 마운트. EF/EF-S 렌즈는 마운트 어댑터 EF-EOS R로 사용(EF-M 불가) |
| 모드 다이얼 | A+, SCN, 크리에이티브 필터, Fv, P, Tv, Av, M, B, C1, C2, C3 (앱은 C1·C2만, Av 기준) |
| ISO | 100–102400 (1/3 또는 1스톱), 확장 L=50, H=204800 |
| ISO 자동 범위 | 최소 100–51200, 최대 200–102400 (1스톱 단위) |
| 셔터 | 기계식·전자 선막 1/8000–30초, 벌브. 전자셔터 1/16000 (앱에서 쓰지 않음). X-sync 기계식 1/200, 전자 선막 1/250 |
| 연사 | 기계식·전자 선막 최대 약 12컷/초, 전자셔터 약 40컷/초 (앱은 기계식 12) |
| 측광 | 평가(384존), 부분, 스팟, 중앙부 중점 평균 |
| 노출보정 | ±3스톱 (1/3 또는 1/2스톱) (ph.canon 스펙). Fv·P·Tv·Av·M에서 가능. 기본 조작 = 퀵 컨트롤 다이얼 1 |
| AF | One-Shot AF / Servo AF / AI Focus AF. AF 영역: Spot AF, 1-point AF, Expand AF area(상하좌우 / Around), Flexible Zone AF 1·2·3, Whole area AF. 피사체 검출: People / Animals / Vehicles / Auto, 눈 검출 Enable(Auto, 좌우 우선) |
| 드라이브 | Single shooting, High-speed continuous +(기계식 약 12컷/초), High-speed continuous, Low-speed continuous, 셀프타이머 10초/2초 등. M-Fn 버튼 → 메인 다이얼 |
| 셔터 모드 | Mechanical / Elec. 1st-curtain / Electronic. 전자셔터는 플리커·롤링 셔터 왜곡 주의 → 앱은 Mechanical 권장 |
| 고감도 노이즈 (리뷰) | ISO 12800까지 화질 저하 체감 전, 25600부터 노이즈 두드러지나 사용 가능 (space.com). the-digital-picture: 고감도 노이즈 매우 낮음 → isoUsable 12800, isoHard 25600. 출처 https://space.com/stargazing/skywatching-kit/canon-eos-r6-mark-ii-review , https://www.the-digital-picture.com/Reviews/Canon-EOS-R6-Mark-II.aspx |

### 메뉴 경로 (영문 메뉴명, 온라인 가이드 URL)
| menu 키 | 경로 | 가이드 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality | UG-04_Shooting-1_0030 |
| isoAutoRange | 촬영 2탭 → ISO speed settings → Auto range | UG-04_Shooting-1_0100 |
| minShutter | 촬영 2탭 → ISO speed settings → Min. shutter spd. (Auto / Manual) | UG-04_Shooting-1_0100 |
| pictureStyle | 촬영 4탭 → Picture Style (세부 조정 UG-04_Shooting-1_0240) | UG-04_Shooting-1_0230 |
| wb | 촬영 4탭 → White balance | UG-04_Shooting-1_0200 |
| awbPriority | 촬영 4탭 → White balance → AWB 선택 후 AF 포인트 선택 버튼 → Ambience / White priority | UG-04_Shooting-1_0200 |
| alo | 촬영 2탭 → Auto Lighting Optimizer | UG-04_Shooting-1_0130 |
| highIsoNr | 촬영 5탭 → High ISO speed NR | UG-04_Shooting-1_0300 |
| antiFlicker | 촬영 3탭 → Anti-flicker shoot. | UG-04_Shooting-1_0150 |
| customMode | 설정 6탭 → Custom shooting mode (C1-C3) → Register settings. Auto update set., Clear settings | UG-08_Set-up_0330 |
| lensAdapter | EF/EF-S 렌즈 장착: 마운트 어댑터 EF-EOS R | UG-01_Preparations_0080 |
| subjectDetect (추가) | AF 1탭 → Subject to detect / Eye detection | UG-05_AF-Drive_0060 |
| shutterMode (추가) | 촬영 7탭 → Shutter mode | UG-04_Shooting-1_0370 |
| afOperation / afArea / driveMode (추가) | AF 1탭 → AF operation / AF area, M-Fn 버튼 → 드라이브 (촬영 7탭 Drive mode) | UG-05_AF-Drive_0040 / 0060 / 0120 |

### 다이얼 조작 (pages 키)
| 키 | 조작 | 가이드 페이지 |
|---|---|---|
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개 | UG-03_CustomShooting_0050 |
| ec | 퀵 컨트롤 다이얼 1로 노출보정 (멀티펑션 잠금 스위치 주의) | UG-04_Shooting-1_0080 |
| mMode | 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 1 = 조리개, 퀵 컨트롤 다이얼 2 = ISO | UG-03_CustomShooting_0060 |
| Fv | 퀵 컨트롤 다이얼 2로 항목 선택 → 메인 다이얼로 값. 앱은 Av(C 모드) 기준이라 사용 안 함 | UG-03_CustomShooting_0020 |
| iso | ISO 설정 (M에서는 퀵 컨트롤 다이얼 2) | UG-04_Shooting-1_0100 |
| afMode / afArea / drive | AF 1탭 AF operation / AF area, M-Fn 버튼 → 드라이브 항목 → 메인 다이얼 | UG-05_AF-Drive_0040 / 0060 / 0120 |

### 다이얼 family
rf. 뼈대는 ff2dial과 같고(C1 → 메인 다이얼 조리개 → 퀵 컨트롤 다이얼 노출보정) 이름만 "퀵 컨트롤 다이얼 1", M의 ISO는 "퀵 컨트롤 다이얼 2", 잠금은 "멀티펑션 잠금 스위치".
아이용 세트: Servo AF + Whole area AF + Subject to detect People + Eye detection Enable + High-speed continuous +(기계식). 가이드 UG-05_AF-Drive_0060이 Whole area AF를 움직이는 피사체용으로 설명하고 피사체 검출·눈 검출이 그 안에서 동작함을 명시.

## 바디: EOS R50 (id eosr50, verified: true, 크롭 미러리스·1다이얼 첫 기종)
매뉴얼 원문: Canon 공식 온라인 Advanced User Guide(영문) https://cam.start.canon/en/C011/manual/ — 항목별 페이지 URL을 `page`로 쓴다.
사양 출처: 가이드의 Specifications 페이지 https://cam.start.canon/en/C011/manual/html/UG-11_Reference_0090.html

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 약 24.2MP APS-C (크롭 1.6), RF 마운트(RF-S 포함). EF/EF-S 렌즈는 마운트 어댑터 EF-EOS R로 사용(EF-M 불가) UG-01_Preparations_0070 |
| 모드 다이얼 | A+, 하이브리드 오토, SCN, 크리에이티브 필터, P, Tv, Av, M, 동영상. **스틸 C 모드 없음** — 설정 5탭 "Custom shooting mode (C mode)"는 동영상 모드에서만 표시 (UG-09_Set-up_0020, UG-09_Set-up_0250) → hasCModes false |
| 조작부 | 다이얼 1개(셔터 버튼 뒤 [Dial]), ISO 버튼, ▲ 키 = 노출보정 버튼, 컨트롤 링(RF 렌즈·어댑터). 퀵 컨트롤 다이얼·M-Fn·멀티펑션 잠금 없음 (UG-00_Before_0110, UG-01_Preparations_0100) |
| ISO | 100–32000 (1/3 또는 1스톱). 확장 H=51200은 C.Fn ISO expansion에서(앱 미사용). 하이라이트 톤 우선 시 200부터 |
| ISO 자동 | **Max for Auto 400–32000만 있음.** Auto range(최소/최대)·Min. shutter spd. 메뉴 없음 (Specifications "ISO Auto setting range for still photos: Not supported", UG-05_Shooting-1_0090) → hasMinShutter false, isoAutoMaxMin 400. Av+ISO 자동에서는 카메라가 셔터를 정함(대략 1/환산 초점거리 — 캐논 커뮤니티 답변 기준 추정 https://community.usa.canon.com/t5/EOS-DSLR-Mirrorless-Cameras/Setting-Minimum-Shutter-Speed-on-Aperture-Priority-Canon-eos-R50/td-p/474909 ) |
| 셔터 | 기계식 셔터 없음. 전자 선막 1/4000–30초, 벌브, X-sync 1/250. 전자셔터 1/8000–30초(앱 미사용) → shutterFastest 1/4000 |
| 연사 | High-speed continuous +: 전자 선막 약 12컷/초, 전자셔터 약 15컷/초. High-speed 7.6 / Low-speed 3.0 (UG-06_AF-Drive_0120) → burstFps 12 |
| 측광 | 평가 측광 등 (Specifications) |
| 노출보정 | P, Tv, Av, M(ISO AUTO)에서. ▲(노출보정) 키 누른 뒤 다이얼 (UG-05_Shooting-1_0070). M+ISO AUTO에서는 노출 눈금 터치 / Expo.comp./AEB 메뉴 / 반셔터 상태에서 컨트롤 링 (UG-03_CustomShooting_0050) |
| AF | One-Shot AF / Servo AF / AI Focus AF (UG-06_AF-Drive_0040). AF 영역: Spot AF, 1-point AF, Expand AF area(·Around), Flexible Zone AF 1·2·3, Whole area AF. 피사체 검출 People/Animals/Vehicles/None, 눈 검출 (UG-06_AF-Drive_0060) |
| 드라이브 | ▶(오른쪽 키) 버튼 → 다이얼. Single, High-speed continuous +, High-speed continuous, Low-speed continuous, 셀프타이머 10초/2초/연속 (UG-06_AF-Drive_0120) |
| 셔터 모드 | Elec. 1st-curtain / Electronic만 (UG-05_Shooting-1_0300). 앱은 전자 선막 기준 |
| 고감도 노이즈 (리뷰) | ephotozine: ISO 3200·6400은 노이즈 낮으나 디테일 저하, 12800이 실용 한계. techradar: 1600까지 양호, 12800이 마지막 → isoUsable 6400, isoHard 12800. 출처 https://www.ephotozine.com/article/canon-eos-r50-review-36445/performance , https://www.techradar.com/reviews/canon-eos-r50 |

### 메뉴 경로 (영문 메뉴명, 온라인 가이드 URL). 탭 번호는 UG-05_Shooting-1_0020(촬영), UG-06_AF-Drive_0020(AF), UG-09_Set-up_0020(설정) 기준
| menu 키 | 경로 | 가이드 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality | UG-05_Shooting-1_0030 |
| isoAutoRange | 촬영 2탭 → ISO speed settings → Max for Auto (Auto range 없음) | UG-05_Shooting-1_0090 |
| minShutter | **없음** (na). 같은 ISO 페이지를 page로 연결 | UG-05_Shooting-1_0090 |
| pictureStyle | 촬영 4탭 → Picture Style | UG-05_Shooting-1_0190 |
| wb | 촬영 4탭 → White balance | UG-05_Shooting-1_0160 |
| awbPriority | 촬영 4탭 → White balance → AWB 선택 후 AF 포인트 선택 버튼 → Ambience / White priority | UG-05_Shooting-1_0160 |
| alo | 촬영 2탭 → Auto Lighting Optimizer | UG-05_Shooting-1_0120 |
| highIsoNr | 촬영 5탭 → High ISO speed NR | UG-05_Shooting-1_0260 |
| antiFlicker | 촬영 2탭 → Anti-flicker shoot. | UG-05_Shooting-1_0140 |
| customMode | 스틸 C 모드 없음. 설정 5탭 Custom shooting mode (C mode)는 동영상 전용 | UG-09_Set-up_0250 |
| lensAdapter | EF/EF-S 렌즈 장착: 마운트 어댑터 EF-EOS R | UG-01_Preparations_0070 |
| subjectDetect (추가) | AF 1탭 → Subject to detect / Eye detection | UG-06_AF-Drive_0060 |
| shutterMode (추가) | 촬영 6탭 → Shutter mode → Elec. 1st-curtain (기계식 없음, 설정 화면 문구를 이 바디에서만 덮어씀) | UG-05_Shooting-1_0300 |
| afOperation / afArea / driveMode (추가) | AF 1탭 → AF operation / AF area, ▶ 버튼 → 드라이브 (촬영 6탭 Drive mode) | UG-06_AF-Drive_0040 / 0060 / 0120 |

### 다이얼 조작 (pages 키)
| 키 | 조작 | 가이드 페이지 |
|---|---|---|
| avMode | 모드 다이얼 Av → 다이얼로 조리개 | UG-03_CustomShooting_0040 |
| ec | ▲(노출보정) 키 누른 뒤 다이얼 | UG-05_Shooting-1_0070 |
| mMode | 다이얼 = 셔터, ▲ 키로 조리개 선택 후 다이얼, ISO 버튼 → 다이얼. ISO AUTO면 노출보정 가능(눈금 터치/컨트롤 링) | UG-03_CustomShooting_0050 |
| iso | ISO 버튼 → 다이얼 (AUTO 포함). 상한은 Max for Auto | UG-05_Shooting-1_0090 |
| afMode / afArea / drive | AF 1탭 AF operation / AF area, ▶ 버튼 → 다이얼 | UG-06_AF-Drive_0040 / 0060 / 0120 |

### 다이얼 family
rf1dial. 가만히 있는 사람 = Av(다이얼 조리개 → ▲ 버튼 노출보정 → ISO AUTO → AF·드라이브 직접). 움직이는 아이 = **M + ISO AUTO**(다이얼 셔터 1/500 → ▲ 버튼 후 다이얼 조리개 → ISO AUTO → 노출 눈금 터치로 보정). 최소 셔터 메뉴가 없어 Av로는 1/500을 강제할 수 없기 때문. 계산은 Av와 같다(셔터 하한에서 ISO가 정해짐).
C 모드가 없어 피사체를 바꿀 때마다 AF operation / AF area / 드라이브를 직접 바꾼다. RF-S 18-45mm 키트 렌즈는 LENSES에 아직 없음(사용자 보유 확인 후 추가).

## 바디: EOS R8 (id eosr8, verified: true, 풀프레임 미러리스·2다이얼)
매뉴얼 원문: Canon 공식 온라인 Advanced User Guide(영문) https://cam.start.canon/en/C013/manual/ — 항목별 페이지 URL을 `page`로 쓴다.
사양 출처: 가이드의 Specifications 페이지 https://cam.start.canon/en/C013/manual/html/UG-10_Reference_0100.html

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 약 24.2MP 풀프레임 (크롭 1.0), RF 마운트. EF/EF-S 렌즈는 마운트 어댑터 EF-EOS R로 사용(EF-M 불가) UG-01_Preparations_0070 |
| 모드 다이얼 | A+, 하이브리드 오토, SCN, 크리에이티브 필터, Fv, P, Tv, Av, M, B, C1, C2 (UG-00_Before_0110) → hasCModes true, cModes C1·C2 |
| 조작부 | 메인 다이얼, 퀵 컨트롤 다이얼(뒷면) 1개, M-Fn 버튼, 전원/멀티펑션 잠금 스위치(OFF·ON·LOCK). 퀵 컨트롤 다이얼 2·ISO 버튼 없음 (UG-00_Before_0110). ISO는 화면 오른쪽 아래 ISO 터치 → 퀵 컨트롤 다이얼 (UG-04_Shooting-1_0100) |
| ISO | 100–102400 (1/3 또는 1스톱), 확장 L=50, H=204800 |
| ISO 자동 범위 | Auto range 최소 100–51200, 최대 200–102400 (1스톱 단위). Min. shutter spd. Auto(Slower~Faster) / Manual (UG-04_Shooting-1_0100) → isoAutoMaxMin 200 |
| 셔터 | **기계식 셔터 없음.** 전자 선막 1/4000–30초, 벌브, X-sync 1/200. 전자셔터 1/8000(고속 연사+)·1/16000(Tv·M) (앱 미사용) → shutterFastest 1/4000 |
| 연사 | High-speed continuous +: 전자 선막 약 6.0컷/초, 전자셔터 약 40컷/초. High-speed 6.0/20, Low-speed 3.0/5.0 (UG-05_AF-Drive_0120, Specifications) → burstFps 6 |
| 측광 | 평가 측광 등 (Specifications) |
| 노출보정 | Fv·P·Tv·Av·M에서. 화면을 보며 퀵 컨트롤 다이얼 (UG-04_Shooting-1_0080). 잠금 스위치가 LOCK이면 선택한 조작부가 잠김 (UG-08_Set-up_0250) |
| AF | One-Shot AF / Servo AF / AI Focus AF (UG-05_AF-Drive_0040). AF 영역: Spot AF, 1-point AF, Expand AF area(·Around), Flexible Zone AF 1·2·3, Whole area AF. 피사체 검출 People/Animals/Vehicles/Auto/None, 눈 검출 Auto·Right eye·Left eye (UG-05_AF-Drive_0060) |
| 드라이브 | M-Fn 버튼 → 드라이브 항목 → 메인 다이얼. Single, High-speed continuous +, High-speed continuous, Low-speed continuous, 셀프타이머 (UG-05_AF-Drive_0120) |
| 셔터 모드 | Elec. 1st-curtain / Electronic만 (UG-04_Shooting-1_0370). 앱은 전자 선막 기준(shutterBase) |
| 고감도 노이즈 (리뷰) | ISO 12800까지 노이즈 있어도 디테일 유지·실용, 25600부터 디테일 손실 → isoUsable 12800, isoHard 25600 (R6 II와 같은 24MP 센서). 출처 https://www.ephotozine.com/article/canon-eos-r8-review-36449/performance , https://admiringlight.com/blog/review-canon-eos-r8/4/ , https://www.space.com/canon-eos-r8-review |

### 메뉴 경로 (영문 메뉴명, 온라인 가이드 URL). 탭 번호는 UG-04_Shooting-1_0020(촬영), UG-05_AF-Drive_0020(AF), UG-08_Set-up_0020(설정) 기준
| menu 키 | 경로 | 가이드 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality | UG-04_Shooting-1_0030 |
| isoAutoRange | 촬영 2탭 → ISO speed settings → Auto range | UG-04_Shooting-1_0100 |
| minShutter | 촬영 2탭 → ISO speed settings → Min. shutter spd. (Auto / Manual) | UG-04_Shooting-1_0100 |
| pictureStyle | 촬영 4탭 → Picture Style | UG-04_Shooting-1_0230 |
| wb | 촬영 4탭 → White balance | UG-04_Shooting-1_0200 |
| awbPriority | 촬영 4탭 → White balance → AWB 선택 후 AF 포인트 선택 버튼 → Ambience / White priority | UG-04_Shooting-1_0200 |
| alo | 촬영 2탭 → Auto Lighting Optimizer | UG-04_Shooting-1_0130 |
| highIsoNr | 촬영 5탭 → High ISO speed NR | UG-04_Shooting-1_0300 |
| antiFlicker | 촬영 3탭 → Anti-flicker shoot. | UG-04_Shooting-1_0150 |
| customMode | 설정 5탭 → Custom shooting mode (C1, C2) → Register settings. Auto update set., Clear settings | UG-08_Set-up_0290 |
| lensAdapter | EF/EF-S 렌즈 장착: 마운트 어댑터 EF-EOS R | UG-01_Preparations_0070 |
| subjectDetect (추가) | AF 1탭 → Subject to detect / Eye detection | UG-05_AF-Drive_0060 |
| shutterMode (추가) | 촬영 7탭 → Shutter mode → Elec. 1st-curtain (기계식 없음, 설정 화면 문구를 이 바디에서만 덮어씀) | UG-04_Shooting-1_0370 |
| afOperation / afArea / driveMode (추가) | AF 1탭 → AF operation / AF area, M-Fn 버튼 → 드라이브 (촬영 7탭 Drive mode) | UG-05_AF-Drive_0040 / 0060 / 0120 |

### 다이얼 조작 (pages 키)
| 키 | 조작 | 가이드 페이지 |
|---|---|---|
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개 | UG-03_CustomShooting_0050 |
| ec | 퀵 컨트롤 다이얼로 노출보정 (잠금 스위치 LOCK 주의) | UG-04_Shooting-1_0080 |
| mMode | 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 = 조리개. ISO AUTO면 노출보정 가능(컨트롤 링 반셔터 등) | UG-03_CustomShooting_0060 |
| iso | 화면 ISO 터치 → 퀵 컨트롤 다이얼 (ISO 버튼 없음) | UG-04_Shooting-1_0100 |
| afMode / afArea / drive | AF 1탭 AF operation / AF area, M-Fn 버튼 → 드라이브 항목 → 메인 다이얼 | UG-05_AF-Drive_0040 / 0060 / 0120 |

### 다이얼 family
rf2dial. rf(R6 II)와 같은 뼈대(C1 → 메인 다이얼 조리개 → 퀵 컨트롤 다이얼 노출보정)지만 퀵 컨트롤 다이얼이 하나뿐이라 이름에 번호가 없고, M의 ISO는 "화면 ISO 터치 → 퀵 컨트롤 다이얼", 잠금은 "전원 스위치 LOCK 위치".
아이용 세트: Servo AF + Whole area AF + Subject to detect People + Eye detection + High-speed continuous +(전자 선막 약 6컷/초). 설정 화면의 rf 문구는 RF 마운트 바디 전부에 적용되고 연사 기준은 {shutterBase}로 치환.

## 바디: EOS 90D (id eos90d, verified: true, 크롭 DSLR·2다이얼 첫 기종)
매뉴얼 원문: Canon EOS 90D Advanced User Guide (영문 PDF) https://gdlp01.c-wss.com/gds/3/0300036653/02/EOS_90D_Advanced_User_Guide_EN.pdf — 페이지 번호는 이 PDF 기준(PDF 쪽 = 인쇄 쪽, 전체 648쪽). 메뉴 탭 번호는 p.193–194 "Tab Menus: Still Photo Shooting (Viewfinder Shooting)"과 p.502–503 "Tab Menus: Set-up"의 페이지 참조로 확인.
사양 출처: 위 가이드 p.150(연사)·p.614(ISO 자동 범위)·p.113(셔터 표시 8000) + https://en.wikipedia.org/wiki/Canon_EOS_90D (센서·셔터·동조·무게. Canon 공식 사양 페이지는 403으로 열리지 않음 — 다음에 재확인)

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 32.5MP APS-C 22.3×14.9mm (크롭 1.6), EF 마운트(EF·EF-S) |
| 모드 다이얼 | A+, SCN, 크리에이티브 필터, P, Tv, Av, M, B, C1, C2 (p.39) |
| ISO | 100–25600 (1/3스톱), 확장 H=51200 (p.215, 위키) |
| ISO 자동 범위 | P/Tv/Av/M 100–25600, [Auto range]의 Minimum/Maximum 안에서 (p.216, p.614). **Maximum의 하한값은 매뉴얼 본문에 숫자가 없어 6D2·5D4와 같은 200으로 추정** |
| 셔터 | 30초–1/8000초(기계식), 벌브. 라이브뷰 전자셔터 1/16000 (p.113, 앱은 1/8000 기준) |
| 플래시 동조 | 1/250초. 내장 플래시 있음 (위키) |
| 측광 | 평가, 부분, 스팟, 중앙부 중점 평균 |
| 노출보정 | 뷰파인더 ±5스톱, 라이브뷰 ±3스톱. 퀵 컨트롤 다이얼 (p.160) |
| M모드 + Auto ISO | 노출보정 가능: Expo.comp./AEB 메뉴·퀵 컨트롤 화면·커스텀 컨트롤 (p.118) |
| 화이트밸런스 | AWB(분위기 우선 / 화이트 우선), 태양광, 그늘, 흐림, 텅스텐, 백색형광등, 플래시, 커스텀, 색온도 2500–10000K (p.222) |
| 픽처스타일 | 선택 p.230, 세부 조정(샤프니스 강도 0–7·세밀도·임계값, 콘트라스트, 채도, 색조) p.233–234, 등록 p.236 |
| AF | One-Shot, AI Focus, AI Servo (p.124) / 뷰파인더 45포인트 전부 크로스 / 라이브뷰 듀얼픽셀 AF |
| AF 영역 선택 | 스팟 AF, 1점 AF, 존 AF(9점), 대형 존 AF(3존), 자동 선택 (p.128–129). AF 영역 선택 버튼을 누를 때마다 전환 (p.131) |
| 연사 | 뷰파인더 고속 약 10컷/초, 라이브뷰 11컷/초(Servo AF면 7컷/초) (p.150) |
| 셀프타이머 | 10초, 2초, 10초+연속(2–10장) (p.153) |
| 기타 | 안티플리커(p.261), 미러락업(촬영 5탭, p.263), 멀티펑션 잠금 <R> 스위치(p.60, 기본값은 퀵 컨트롤 다이얼 잠금), 뷰파인더 시야율 100% |
| 고감도 노이즈 (리뷰) | "ISO 6400 이하에서 최상, 12800은 축소 시 사용 가능하나 A4에서 디테일 손실·노이즈" → isoUsable 6400, isoHard 12800. 출처 https://www.photographyblog.com/reviews/canon_eos_90d_review (DPReview는 RAW 고감도 우수·JPEG NR 과함: https://www.dpreview.com/reviews/canon-eos-90d-review) |

### 메뉴 경로 (영문 메뉴명, 매뉴얼 페이지). 촬영 = 빨간 카메라 탭, 설정 = 노란 공구 탭 (탭 번호는 뷰파인더 촬영 기준 p.193–194)
| menu 키 | 경로 | 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality. RAW는 메인 다이얼, JPEG는 좌우 키 | 199 |
| isoAutoRange | 촬영 2탭 → ISO speed settings → Auto range → Maximum | 216 |
| minShutter | 촬영 2탭 → ISO speed settings → Min. shutter spd. → Auto(기본, ±스톱) 또는 Manual. Auto range 상한에서도 노출이 안 되면 카메라가 이보다 느린 셔터 사용 | 217 |
| pictureStyle | 촬영 3탭 → Picture Style (선택 p.230, 세부 조정은 스타일 선택 후 INFO p.233–234) | 233 |
| wb | 촬영 3탭 → White balance | 222 |
| awbPriority | 촬영 3탭 → White balance → AWB 선택 후 INFO → Ambience priority / White priority | 224 |
| alo | 촬영 2탭 → Auto Lighting Optimizer | 218 |
| highIsoNr | 촬영 4탭 → High ISO speed NR. 멀티샷 NR은 RAW/RAW+JPEG에서 선택 불가 | 239 |
| antiFlicker | 촬영 5탭 → Anti-flicker shoot. → Enable (뷰파인더 촬영에만 적용) | 261 |
| customMode | 설정 5탭 → Custom shooting mode (C1, C2) → Register settings → C1/C2 → OK. Auto update set. Enable이면 자동 반영, Clear settings로 해제 | 546 |
| lensAdapter | 해당 없음 (EF 마운트) | na |

### 버튼·조작 (pages 키)
| 키 | 조작 | 페이지 |
|---|---|---|
| iso | ISO 버튼 → 메인 또는 퀵 컨트롤 다이얼. [A]/[AUTO] = 자동 | 213 |
| afMode | AF 버튼 → 메인 또는 퀵 컨트롤 다이얼로 One-Shot / AI Focus / AI Servo | 124 |
| afArea | AF 영역 선택 버튼을 누를 때마다 전환 (모드 설명 p.128–129) | 131 |
| drive | DRIVE 버튼 → 메인 다이얼로 1매 / 고속·저속 연속 / 셀프타이머 | 150 |
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개. "8000"이 깜빡이면 노출 과다 | 114 |
| mMode | 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 = 조리개. ISO 자동이면 노출보정 가능(p.118) | 117 |
| ec | 반셔터 후 퀵 컨트롤 다이얼. 안 돌아가면 <R> 스위치를 아래로(잠금 해제, p.60) | 160 |
| 기타 | 하이라이트 톤 우선 219(권하지 않음) · 미러락업 263 · 멀티펑션 잠금 설정 545 | |

### 다이얼 family
crop2dial. 문구는 ff2dial(6D2·5D4)과 완전히 같다: Av 메인 다이얼 조리개(p.114), 노출보정 퀵 컨트롤 다이얼(p.160), M 메인=셔터·퀵=조리개(p.117), ISO 버튼 → 다이얼(p.213), LOCK = <R> 스위치(p.60).

## 바디: EOS 80D (id eos80d, verified: true, 크롭 DSLR·2다이얼)
매뉴얼 원문: Canon EOS 80D Instruction Manual (영문, eos80d-im3-en.pdf, 526쪽) — Canon 서버(gdlp01)에는 EN 파일이 404라 LensRentals 미러를 링크: https://www.lensrentals.com/product-assets/50f5017f-7e41-48c9-8b09-010a0ac7856c/eos80d-im3-en.pdf . 쪽수 = PDF 쪽 = 인쇄 쪽. 탭 번호는 본문 "Under the [z2] tab" 표기와 p.470–472 Menu Settings로 확인.
사양 출처: 매뉴얼 p.498–500 + https://en.wikipedia.org/wiki/Canon_EOS_80D

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 24.2MP APS-C (크롭 1.6), EF 마운트(EF·EF-S) |
| 모드 다이얼 | A+, 플래시 끔, CA, SCN, 크리에이티브 필터, P, Tv, Av, M, B, C1, C2 (p.499) |
| ISO | 100–16000 (1/3스톱), 확장 H=25600 (p.148, p.499) |
| ISO 자동 범위 | Auto range: 최소 100–12800, **최대 200–16000** (p.152) |
| 최소 셔터 | Min. shutter spd. Auto/Manual (p.153) |
| 셔터 | 30초–1/8000초, 벌브, 동조 1/250 (p.500) |
| 노출보정 | ±5스톱(표시는 ±3), 퀵 컨트롤 다이얼 (p.200). M+ISO Auto 노출보정 가능 (p.197) |
| 화이트밸런스 | AWB(분위기 우선 / 화이트 우선: AWB 선택 후 INFO, p.163), 프리셋, 커스텀, 색온도 2500–10000K |
| 픽처스타일 | 촬영 3탭, 세부 조정은 스타일 선택 후 INFO (p.157) |
| AF | One-Shot, AI Focus, AI Servo (p.116) / 45포인트 전부 크로스 / 1점·존(9점)·대형 존·45점 자동 (p.120, 선택 버튼 p.121) |
| 연사 | 고속 약 7.0컷/초(라이브뷰·Servo AF 5.0), 저속 3.0 (p.138) |
| 기타 | 안티플리커 p.179, 멀티펑션 잠금 <R> 스위치 p.54(위 = 잠금, 아래 = 해제), 뷰파인더 시야율 100% |
| 고감도 노이즈 (리뷰) | "ISO 1600까지 노이즈 없음, 3200부터 보이기 시작, 6400·12800은 점점 심해지고 25600은 비상용" → isoUsable 3200, isoHard 6400. 출처 https://www.photographyblog.com/reviews/canon_eos_80d_review |

### 메뉴 경로
| menu 키 | 경로 | 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality | 142 |
| isoAutoRange | 촬영 2탭 → ISO speed settings → Auto range → Maximum | 152 |
| minShutter | 촬영 2탭 → ISO speed settings → Min. shutter spd. → Auto/Manual | 153 |
| pictureStyle | 촬영 3탭 → Picture Style → 스타일 선택 후 INFO | 157 |
| wb | 촬영 2탭 → White balance | 162 |
| awbPriority | 촬영 2탭 → White balance → AWB 선택 후 INFO → Ambience / White priority | 163 |
| alo | 촬영 2탭 → Auto Lighting Optimizer | 169 |
| highIsoNr | 촬영 3탭 → High ISO speed NR | 170 |
| antiFlicker | 촬영 4탭 → Anti-flicker shoot. → Enable | 179 |
| customMode | 설정 4탭 → Custom shooting mode (C1, C2) → Register settings → C1/C2 → OK. Auto update set. | 445 |
| lensAdapter | 해당 없음 (EF 마운트) | na |

### 버튼·조작 (pages 키)
| 키 | 조작 | 페이지 |
|---|---|---|
| iso | ISO 버튼 → 메인 또는 퀵 컨트롤 다이얼. "A" = 자동, INFO로 AUTO | 148 |
| afMode | AF 버튼 → 메인 또는 퀵 컨트롤 다이얼로 One-Shot / AI Focus / AI Servo | 116 |
| afArea | AF 포인트 선택 버튼 → AF 영역 선택 버튼을 누를 때마다 전환 | 121 |
| drive | DRIVE 버튼 → 메인 또는 퀵 컨트롤 다이얼 | 138 |
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개 | 194 |
| mMode | 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 = 조리개. 안 되면 <R> 스위치 아래로 | 196 |
| ec | 반셔터 후 퀵 컨트롤 다이얼 | 200 |

### 다이얼 family
crop2dial (C 모드 있음 → ff2dial 문구 그대로). 검증: p.194/200/196/148/54.

## 바디: EOS 6D (id eos6d, verified: true, 풀프레임 DSLR·2다이얼, 2012)
매뉴얼 원문: Canon EOS 6D (WG/N) Instruction Manual (영문) https://gdlp01.c-wss.com/gds/7/0300009627/05/EOS_6D_Instruction_Manual_EN.pdf — 402쪽, 쪽수 = PDF 쪽 = 인쇄 쪽. 탭 번호는 본문 "Under the [z3] tab" 표기와 p.346–348 Menu Settings로 확인.
사양 출처: 매뉴얼 p.371–374

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 20.2MP 풀프레임 (크롭 1.0), EF 마운트 |
| 모드 다이얼 | A+, CA, SCN, P, Tv, Av, M, B, C1, C2 (p.373) |
| ISO | 100–25600, 확장 L=50, H1=51200, H2=102400 (p.106, p.373) |
| ISO 자동 범위 | 메뉴 이름이 **Auto ISO range**(Auto range 아님): 최소 100–12800, **최대 200–25600** (p.110) |
| 최소 셔터 | **Min. shutter spd. 범위 1/250–1초** (p.111) → 움직이는 아이용 1/500은 설정 불가 → data.js minShutterCap 1/250. compute가 1/250으로 묶고 현장 조정에 "M + ISO AUTO로 1/500" 안내 |
| 셔터 | 30초–1/4000초, 벌브, 동조 1/180 (p.374) |
| 노출보정 | ±5스톱(표시 ±3), 퀵 컨트롤 다이얼 (p.151). P/Tv/Av에서만 — M+ISO Auto 노출보정 불가 |
| 화이트밸런스 | AWB 하나(분위기/화이트 우선 구분 없음), 프리셋, 커스텀, 색온도 2500–10000K (p.120, p.371) → awbPriority na |
| 픽처스타일 | 촬영 4탭, 세부 조정은 스타일 선택 후 INFO (p.115) |
| AF | One-Shot, AI Focus, AI Servo (p.92) / **11포인트, 중앙만 크로스** / AF 영역 모드 없음: AF 포인트 선택 버튼 → 수동 1점 또는 자동 선택(11점) (p.94) |
| 연사 | **고속 연사 없음**. 연속 약 4.5컷/초, 무음 연속 3.0 (p.98, p.374) → burstLabel '연속' |
| 기타 | **안티플리커 없음**(사양 p.372에 항목 없음) → antiFlicker na. 멀티펑션 잠금 <R> 스위치 p.47(오른쪽 = 잠금, 왼쪽 = 해제), 뷰파인더 시야율 97% |
| 고감도 노이즈 (리뷰) | "ISO 3200까지 노이즈 없음, 6400부터 보이기 시작. 6400·12800·25600은 비교적 적음" → isoUsable 6400, isoHard 12800. 출처 https://www.photographyblog.com/reviews/canon_eos_6d_review |

### 메뉴 경로
| menu 키 | 경로 | 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality | 102 |
| isoAutoRange | 촬영 3탭 → ISO speed settings → Auto ISO range → Maximum | 110 |
| minShutter | 촬영 3탭 → ISO speed settings → Min. shutter spd. (1/250–1초) | 111 |
| pictureStyle | 촬영 4탭 → Picture Style → 스타일 선택 후 INFO | 115 |
| wb | 촬영 3탭 → White balance | 120 |
| awbPriority | 없음 (AWB 하나) | 120 (na) |
| alo | 촬영 3탭 → Auto Lighting Optimizer | 125 |
| highIsoNr | 촬영 4탭 → High ISO speed NR | 126 |
| antiFlicker | 없음 | 372 (na, 사양) |
| customMode | 설정 4탭 → Custom shooting mode (C1, C2) → Register settings → C1/C2 → OK. Auto update set. | 328 |
| lensAdapter | 해당 없음 (EF 마운트) | na |

### 버튼·조작 (pages 키)
| 키 | 조작 | 페이지 |
|---|---|---|
| iso | ISO 버튼 → 메인 또는 퀵 컨트롤 다이얼. "A" = 자동, INFO로 AUTO | 106 |
| afMode | AF 버튼 → 메인 또는 퀵 컨트롤 다이얼로 One-Shot / AI Focus / AI Servo | 92 |
| afArea | AF 포인트 선택 버튼 → 멀티컨트롤러·다이얼로 1점, 전부 켜지면 자동 선택. SET으로 중앙↔자동 전환 | 94 |
| drive | DRIVE 버튼 → 메인 또는 퀵 컨트롤 다이얼 (1매 / 연속 / 무음) | 98 |
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개 | 146 |
| mMode | 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 = 조리개. 안 되면 <R> 스위치 왼쪽으로 | 148 |
| ec | 반셔터 후 퀵 컨트롤 다이얼 | 151 |

### 다이얼 family
ff2dial (6D2·5D4와 같음). 검증: p.146/151/148/106/47. C2 등록 단계는 바디 id 덮어쓰기(SETUP_CMODE_STEPS[].eos6d)로 "Min. shutter spd. → 1/250 (이 기종 상한)".

## 바디: EOS 200D II (id eos250d, verified: true, 크롭 DSLR·1다이얼. 해외명 EOS 250D / Rebel SL3)
매뉴얼 원문: Canon EOS 250D Advanced User Guide (영문) https://gdlp01.c-wss.com/gds/4/0300034864/02/EOS_250D_Advanced_User_Guide_EN.pdf — 495쪽, 쪽수 = PDF 쪽 = 인쇄 쪽. **메뉴 탭 번호는 가이드 본문이 탭을 아이콘으로만 표시해(텍스트 추출에서 "[z]") 확인하지 못함 → 앱에는 '촬영 탭'으로 표기. 카메라에서 확인 후 번호 기입.**
사양 출처: 가이드 p.118–120(ISO)·p.112(드라이브)·p.160(노출보정) + https://en.wikipedia.org/wiki/Canon_EOS_250D (센서·셔터·연사·AF 포인트)

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 24.1MP APS-C (크롭 1.6), EF 마운트(EF·EF-S) |
| 모드 다이얼 | A+, SCN, 크리에이티브 필터, P, Tv, Av, M (p.30). **C 모드 없음** |
| ISO | 100–25600, 확장 H=51200 (p.118–119) |
| ISO 자동 범위 | **Max for Auto 400–25600만** (p.120). Auto range(최소)·Min. shutter spd. 메뉴 없음 → hasMinShutter false, isoAutoMaxMin 400 |
| 셔터 | 30초–1/4000초, 벌브, 동조 1/200 (위키) |
| 노출보정 | ±5스톱(라이브뷰 ±3). **Av± 버튼을 누른 채 메인 다이얼** (p.160). M+ISO Auto 노출보정은 Expo.comp./AEB 메뉴·퀵 컨트롤 (p.156) |
| 화이트밸런스 | AWB(분위기 우선 / 화이트 우선: AWB 선택 후 INFO, p.130), 프리셋, 커스텀, 색온도 |
| 픽처스타일 | 세부 조정은 스타일 선택 후 INFO (p.124) |
| AF | One-Shot, AI Focus, AI Servo — **메뉴 [AF operation]에서 선택**(전용 버튼 없음, p.104) / 뷰파인더 **9포인트** / AF 포인트 선택 버튼 → 수동 1점 또는 자동 선택 (p.108). 존 AF는 라이브뷰에만 |
| 연사 | **고속 연사 모드 없음**. 연속 약 5.0컷/초 (p.112 드라이브, 속도는 위키·리뷰) → burstLabel '연속' |
| 드라이브 | Q 버튼 → 퀵 컨트롤 화면에서 선택 (p.112) |
| 기타 | **안티플리커 없음**(가이드 기능 목록 p.13에 없음) → antiFlicker na. 멀티펑션 잠금 없음. 뷰파인더 시야율 95% |
| 고감도 노이즈 (리뷰) | "ISO 1600까지 노이즈 없음, 3200부터 보이기 시작, 6400·12800은 점점 심해지고 25600은 비상용" → isoUsable 3200, isoHard 6400. 출처 https://www.photographyblog.com/reviews/canon_eos_250d_review |

### 메뉴 경로 (탭 번호 미확인)
| menu 키 | 경로 | 페이지 |
|---|---|---|
| imageQuality | 촬영 탭 → Image quality | 115 |
| isoAutoRange | 촬영 탭 → ISO speed settings → Max for Auto | 120 |
| minShutter | 없음 | 120 (na) |
| pictureStyle | 촬영 탭 → Picture Style → 스타일 선택 후 INFO | 124 |
| wb | 촬영 탭 → White balance | 129 |
| awbPriority | 촬영 탭 → White balance → AWB 선택 후 INFO → Ambience / White priority | 130 |
| alo | 촬영 탭 → Auto Lighting Optimizer | 136 |
| highIsoNr | 촬영 탭 → High ISO speed NR | 138 |
| antiFlicker | 없음 | 13 (na, 기능 목록) |
| customMode | 없음 | 30 (na, 모드 다이얼) |
| lensAdapter | 해당 없음 (EF 마운트) | na |

### 버튼·조작 (pages 키)
| 키 | 조작 | 페이지 |
|---|---|---|
| iso | ISO 버튼(상단, Part Names (10)) → 좌우 키 또는 메인 다이얼. AUTO 선택 가능 | 118 |
| afMode | MENU → 촬영 탭 → AF operation → 좌우 키로 One-Shot / AI Focus / AI Servo | 104 |
| afArea | AF 포인트 선택 버튼 → 십자키·메인 다이얼로 1점, 전부 켜지면 자동 선택. SET으로 중앙↔자동 전환 | 108 |
| drive | Q 버튼 → 드라이브 항목 → 좌우 키 | 112 |
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개 | 152 |
| mMode | 메인 다이얼 = 셔터, Av± 버튼 누른 채 메인 다이얼 = 조리개 | 155 |
| ec | 반셔터 후 Av± 버튼(Part Names (16))을 누른 채 메인 다이얼 | 160 |

### 다이얼 family
crop1dial. 검증: p.152/160/155/118/104/108/112. 움직이는 아이는 M + ISO AUTO(r.mAuto).

## 바디: EOS 850D (id eos850d, verified: true, 크롭 DSLR·2다이얼, C 모드 없음)
매뉴얼 원문: Canon 공식 온라인 Advanced User Guide(영문) https://cam.start.canon/en/C002/manual/ — 항목별 페이지 URL을 `page`로 쓴다. 탭 번호는 UG-06_Shooting-1_0030(Tab Menus: Still Photo Shooting)·UG-09_Set-up_0020(Tab Menus: Set-up)으로 확인.
사양 출처: 가이드 Specifications https://cam.start.canon/en/C002/manual/html/UG-11_Reference_0100.html

### 사양
| 항목 | 값 |
|---|---|
| 센서 | 24.1MP APS-C 22.3×14.9mm (크롭 1.6), EF 마운트(EF·EF-S) |
| 모드 다이얼 | 설정 탭에 Custom shooting mode 항목 없음 (UG-09_Set-up_0020) → **C 모드 없음** |
| ISO | 100–25600, 확장 H=51200 (사양) |
| ISO 자동 범위 | **Max for Auto 400–25600만** (UG-06_Shooting-1_0110). Min. shutter spd. 없음 → hasMinShutter false, isoAutoMaxMin 400 |
| 셔터 | 30초–1/4000초, 벌브 (사양) |
| 노출보정 | 뷰파인더 ±5(라이브뷰 ±3). **퀵 컨트롤 다이얼** (UG-04_AF-Drive_0110). M+ISO Auto 노출보정은 SET 버튼 누른 채 메인 다이얼(커스텀 컨트롤) 또는 퀵 컨트롤 (UG-03_CustomShooting_0050) |
| 화이트밸런스 | AWB(분위기 우선 / 화이트 우선: AWB 선택 후 INFO), 프리셋, 커스텀, 색온도 (UG-06_Shooting-1_0150) |
| 픽처스타일 | 촬영 3탭, 세부 조정은 스타일 선택 후 INFO (UG-06_Shooting-1_0190) |
| AF | One-Shot, AI Focus, AI Servo — AF 버튼 후 좌우 키 (UG-04_AF-Drive_0020) / 45포인트 / 1점·존(9점)·대형 존·자동 선택, AF 영역 선택 버튼으로 전환 (UG-04_AF-Drive_0030) |
| 연사 | 고속 약 7.0컷/초(라이브뷰 7.5, Servo AF 4.5) (UG-04_AF-Drive_0060) |
| 기타 | 안티플리커 촬영 4탭 (UG-06_Shooting-1_0230). 멀티펑션 잠금은 설정 4탭 메뉴 (UG-09_Set-up_0240). 뷰파인더 시야율 95% |
| 고감도 노이즈 (리뷰) | "ISO 1600까지 노이즈 없음, 3200에 입자, 6400은 약간의 채도 저하, 12800·25600은 피할 것" → isoUsable 3200, isoHard 6400. 출처 https://www.photographyblog.com/reviews/canon_eos_850d_review |

### 메뉴 경로 (영문 메뉴명, 가이드 URL)
| menu 키 | 경로 | 페이지 |
|---|---|---|
| imageQuality | 촬영 1탭 → Image quality | UG-06_Shooting-1_0050 |
| isoAutoRange | 촬영 2탭 → ISO speed settings → Max for Auto | UG-06_Shooting-1_0110 |
| minShutter | 없음 | UG-06_Shooting-1_0110 (na) |
| pictureStyle | 촬영 3탭 → Picture Style → 스타일 선택 후 INFO | UG-06_Shooting-1_0190 |
| wb | 촬영 3탭 → White balance | UG-06_Shooting-1_0150 |
| awbPriority | 촬영 3탭 → White balance → AWB 선택 후 INFO → Ambience / White priority | UG-06_Shooting-1_0150 |
| alo | 촬영 2탭 → Auto Lighting Optimizer | UG-06_Shooting-1_0120 |
| highIsoNr | 촬영 4탭 → High ISO speed NR | UG-06_Shooting-1_0210 |
| antiFlicker | 촬영 4탭 → Anti-flicker shoot. → Enable | UG-06_Shooting-1_0230 |
| customMode | 없음 | UG-09_Set-up_0020 (na) |
| lensAdapter | 해당 없음 (EF 마운트) | na |

### 버튼·조작 (pages 키)
| 키 | 조작 | 페이지 |
|---|---|---|
| iso | ISO 버튼 → 좌우 키 또는 메인 다이얼 → SET | UG-06_Shooting-1_0110 |
| afMode | AF 버튼 → 좌우 키로 One-Shot / AI Focus / AI Servo | UG-04_AF-Drive_0020 |
| afArea | AF 포인트 선택 버튼 또는 AF 영역 선택 버튼을 누를 때마다 전환 | UG-04_AF-Drive_0030 |
| drive | 드라이브 버튼 → 선택 | UG-04_AF-Drive_0060 |
| avMode | 모드 다이얼 Av → 메인 다이얼로 조리개. "4000" 깜빡이면 노출 과다 | UG-03_CustomShooting_0040 |
| mMode | 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 = 조리개 | UG-03_CustomShooting_0050 |
| ec | 반셔터 후 퀵 컨트롤 다이얼 | UG-04_AF-Drive_0110 |

### 다이얼 family
crop2dial, C 모드·최소 셔터 메뉴 없음 → 가만히 있는 사람 Av, 움직이는 아이 M + ISO AUTO(r.mAuto). AF·드라이브는 피사체 바꿀 때마다.

## 계산표 (check.js가 자동 생성)
아래 표는 `node check.js` 실행 시 data.js의 값을 공식으로 계산해 다시 쓴다. 손으로 고치지 말 것.
Av 상황은 "조리개·보정·ISO 상한·최소 셔터"를 사용자가 설정하고, 셔터·ISO 열은 그 밝기에서 카메라가 잡을 예상값.

<!-- CALC:BEGIN -->
| 바디 / 상황 / 렌즈 / 피사체 | 모드 | 조리개 | 보정 | ISO 상한 | 최소 셔터 | EV 계산 (EV − 보정) | 예상 셔터 | 예상 ISO | 검산 t = N²·100/(S·2^EV) | 플래그 |
|---|---|---|---|---|---|---|---|---|---|---|
| **EOS 6D Mark II** | | | | | | | | | | |
| 6D2 / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 6D2 / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 6D2 / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D2 / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 6D2 / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 6D2 / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 6D2 / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 6D2 / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D2 / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D2 / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D2 / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D2 / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 6D2 / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 6D2 / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D2 / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D2 / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 6D2 / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 6D2 / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 6D2 / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 6D2 / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 6D2 / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 6D2 / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 6D2 / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 6D2 / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 6D2 / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 6D2 / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 6D2 / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 6D2 / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 6D2 / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 6D2 / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 6D2 / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 6D2 / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 6D2 / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 6D2 / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 6D2 / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 6D2 / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 6D2 / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 6D2 / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 6D2 / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 6D2 / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D2 / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D2 / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D2 / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D2 / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 6D2 / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 6D2 / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D2 / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D2 / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 6D2 / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 6D2 / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 6D2 / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 6D2 / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 6D2 / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 6D2 / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 6D2 / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 6D2 / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 6D2 / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 6D2 / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 6D2 / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 6D2 / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| 6D2 / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| 6D2 / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 6D2 / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 6D2 / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 6D2 / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 6D2 / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 6D2 / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 6D2 / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 6D2 / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 6D2 / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 6D2 / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D2 / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 6D2 / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 6D2 / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 6D2 / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D2 / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 6D2 / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D2 / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 6D2 / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D2 / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 6D2 / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D2 / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 6D2 / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 6D2 / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 6D2 / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D2 / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 6D2 / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D2 / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 6D2 / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D2 / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 6D2 / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D2 / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 6D2 / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 6D2 / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 6D2 / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 6D2 / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D2 / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 6D2 / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D2 / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 6D2 / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS 6D Mark II · 원하는 사진** | | | | | | | | | | |
| 6D2 / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D2 / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 6D2 / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| 6D2 / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 6D2 / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 6400 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 6D2 / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| 6D2 / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D2 / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D2 / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 6400 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS 5D Mark IV** | | | | | | | | | | |
| 5D4 / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 5D4 / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 5D4 / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 5D4 / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 5D4 / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 5D4 / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 5D4 / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 5D4 / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 5D4 / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 5D4 / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 5D4 / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 5D4 / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 5D4 / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 5D4 / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 5D4 / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 5D4 / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 5D4 / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 5D4 / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 5D4 / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 5D4 / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 5D4 / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 5D4 / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 5D4 / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 5D4 / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 5D4 / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 5D4 / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 5D4 / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 5D4 / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 5D4 / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 5D4 / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 5D4 / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 5D4 / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 5D4 / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 5D4 / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 5D4 / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 5D4 / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 5D4 / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 5D4 / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 5D4 / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 5D4 / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 5D4 / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 5D4 / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 5D4 / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 5D4 / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 5D4 / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 5D4 / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 5D4 / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 5D4 / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 5D4 / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 5D4 / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 5D4 / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 5D4 / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 5D4 / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 5D4 / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 5D4 / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 5D4 / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 5D4 / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 5D4 / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 5D4 / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 5D4 / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 5D4 / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 5D4 / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 5D4 / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 5D4 / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 5D4 / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 5D4 / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 5D4 / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 5D4 / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 5D4 / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 5D4 / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 5D4 / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| 5D4 / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| 5D4 / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 5D4 / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 5D4 / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 5D4 / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 5D4 / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 5D4 / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 5D4 / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 5D4 / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 5D4 / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 5D4 / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 5D4 / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 5D4 / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 5D4 / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 5D4 / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 5D4 / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 5D4 / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 5D4 / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 5D4 / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 5D4 / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 5D4 / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 5D4 / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 5D4 / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 5D4 / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 5D4 / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 5D4 / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 5D4 / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 5D4 / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 5D4 / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 5D4 / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 5D4 / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 5D4 / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 5D4 / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 5D4 / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 5D4 / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 5D4 / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 5D4 / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 5D4 / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 5D4 / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 5D4 / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS 5D Mark IV · 원하는 사진** | | | | | | | | | | |
| 5D4 / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 5D4 / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 5D4 / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| 5D4 / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 5D4 / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 6400 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 5D4 / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| 5D4 / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 5D4 / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 5D4 / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 6400 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS R6 Mark II** | | | | | | | | | | |
| R6 II / 야외 맑음 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R6 II / 야외 맑음 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R6 II / 야외 맑음 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R6 II / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R6 II / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| R6 II / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| R6 II / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| R6 II / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| R6 II / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| R6 II / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R6 II / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R6 II / 야외 그늘 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R6 II / 야외 그늘 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R6 II / 야외 그늘 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R6 II / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R6 II / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 12800 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| R6 II / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 12800 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| R6 II / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R6 II / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R6 II / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R6 II / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R6 II / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R6 II / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R6 II / 역광 / RF50 / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R6 II / 역광 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R6 II / 역광 / RF85 / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R6 II / 역광 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R6 II / 역광 / RF24-105 / 움직이는 아이 | Av | f/4 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R6 II / 역광 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R6 II / 역광 / RF35 / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R6 II / 역광 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R6 II / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R6 II / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R6 II / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R6 II / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R6 II / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R6 II / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R6 II / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| R6 II / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| R6 II / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R6 II / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R6 II / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| R6 II / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| R6 II / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| R6 II / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| R6 II / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R6 II / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R6 II / 흐림·비 / RF50 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / RF85 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / RF24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R6 II / 흐림·비 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R6 II / 흐림·비 / RF35 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R6 II / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R6 II / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| R6 II / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| R6 II / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| R6 II / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| R6 II / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| R6 II / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| R6 II / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R6 II / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R6 II / 실내 창가 낮 / RF50 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R6 II / 실내 창가 낮 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R6 II / 실내 창가 낮 / RF85 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R6 II / 실내 창가 낮 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R6 II / 실내 창가 낮 / RF24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R6 II / 실내 창가 낮 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R6 II / 실내 창가 낮 / RF35 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R6 II / 실내 창가 낮 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R6 II / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R6 II / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R6 II / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R6 II / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R6 II / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R6 II / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R6 II / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| R6 II / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| R6 II / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R6 II / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R6 II / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| R6 II / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| R6 II / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| R6 II / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| R6 II / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R6 II / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R6 II / 실내 저녁 조명 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 실내 저녁 조명 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 실내 저녁 조명 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 실내 저녁 조명 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 실내 저녁 조명 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R6 II / 실내 저녁 조명 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R6 II / 실내 저녁 조명 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 실내 저녁 조명 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R6 II / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R6 II / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R6 II / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R6 II / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R6 II / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R6 II / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R6 II / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R6 II / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R6 II / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R6 II / 카페·식당 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 카페·식당 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 카페·식당 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 카페·식당 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 카페·식당 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R6 II / 카페·식당 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R6 II / 카페·식당 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 카페·식당 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R6 II / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R6 II / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R6 II / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R6 II / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R6 II / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R6 II / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R6 II / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R6 II / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R6 II / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R6 II / 야경 배경 인물 / RF50 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 야경 배경 인물 / RF50 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 야경 배경 인물 / RF85 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 야경 배경 인물 / RF85 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 야경 배경 인물 / RF24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R6 II / 야경 배경 인물 / RF24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R6 II / 야경 배경 인물 / RF35 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 야경 배경 인물 / RF35 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R6 II / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R6 II / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R6 II / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R6 II / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R6 II / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R6 II / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R6 II / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R6 II / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R6 II / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R6 II / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS R6 Mark II · 원하는 사진** | | | | | | | | | | |
| R6 II / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R6 II / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R6 II / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| R6 II / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R6 II / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 12800 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R6 II / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| R6 II / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R6 II / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R6 II / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 12800 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS R50** | | | | | | | | | | |
| R50 / 야외 맑음 / RF50 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / RF50 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / RF85 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / RF85 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R50 / 야외 맑음 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R50 / 야외 맑음 / RF35 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / RF35 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R50 / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R50 / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/160 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R50 / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R50 / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R50 / 야외 그늘 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R50 / 야외 그늘 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R50 / 야외 그늘 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R50 / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R50 / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/160 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| R50 / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| R50 / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R50 / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R50 / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R50 / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R50 / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R50 / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R50 / 역광 / RF50 / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R50 / 역광 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R50 / 역광 / RF85 / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R50 / 역광 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R50 / 역광 / RF24-105 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R50 / 역광 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R50 / 역광 / RF35 / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R50 / 역광 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R50 / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R50 / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R50 / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R50 / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R50 / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R50 / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/160 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R50 / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| R50 / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| R50 / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R50 / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R50 / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| R50 / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| R50 / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| R50 / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| R50 / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R50 / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R50 / 흐림·비 / RF50 / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / RF85 / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / RF24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R50 / 흐림·비 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R50 / 흐림·비 / RF35 / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R50 / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R50 / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/160 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| R50 / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| R50 / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| R50 / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| R50 / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| R50 / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| R50 / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R50 / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R50 / 실내 창가 낮 / RF50 / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R50 / 실내 창가 낮 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R50 / 실내 창가 낮 / RF85 / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R50 / 실내 창가 낮 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R50 / 실내 창가 낮 / RF24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R50 / 실내 창가 낮 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R50 / 실내 창가 낮 / RF35 / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R50 / 실내 창가 낮 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R50 / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R50 / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R50 / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R50 / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R50 / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R50 / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/160 | 9* − (+0.3) = 8.7 | 1/160 | 200 | 2.2² × 100 ÷ (200 × 2^8.7) = 1/172 | - |
| R50 / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| R50 / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| R50 / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R50 / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R50 / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| R50 / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| R50 / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| R50 / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| R50 / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R50 / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R50 / 실내 저녁 조명 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 실내 저녁 조명 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 실내 저녁 조명 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 실내 저녁 조명 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 실내 저녁 조명 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| R50 / 실내 저녁 조명 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R50 / 실내 저녁 조명 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 실내 저녁 조명 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| R50 / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R50 / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/160 | 6 = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| R50 / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R50 / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R50 / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R50 / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R50 / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R50 / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R50 / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| R50 / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R50 / 카페·식당 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 카페·식당 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 카페·식당 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 카페·식당 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 카페·식당 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| R50 / 카페·식당 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R50 / 카페·식당 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 카페·식당 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| R50 / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R50 / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| R50 / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R50 / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R50 / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R50 / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R50 / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R50 / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R50 / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| R50 / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R50 / 야경 배경 인물 / RF50 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 야경 배경 인물 / RF50 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 야경 배경 인물 / RF85 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 야경 배경 인물 / RF85 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 야경 배경 인물 / RF24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R50 / 야경 배경 인물 / RF24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R50 / 야경 배경 인물 / RF35 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 야경 배경 인물 / RF35 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R50 / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R50 / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| R50 / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R50 / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R50 / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R50 / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R50 / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R50 / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R50 / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R50 / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R50 / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS R50 · 원하는 사진** | | | | | | | | | | |
| R50 / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R50 / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R50 / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| R50 / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R50 / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 6400 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R50 / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| R50 / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R50 / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R50 / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 6400 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS R8** | | | | | | | | | | |
| R8 / 야외 맑음 / RF50 / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / RF50 / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / RF85 / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / RF85 / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R8 / 야외 맑음 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R8 / 야외 맑음 / RF35 / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / RF35 / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R8 / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R8 / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/3.2 | 0 | 12800 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/3.2 | 0 | 12800 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| R8 / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R8 / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R8 / 야외 그늘 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R8 / 야외 그늘 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R8 / 야외 그늘 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R8 / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R8 / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 12800 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| R8 / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 12800 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| R8 / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R8 / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R8 / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R8 / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| R8 / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| R8 / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| R8 / 역광 / RF50 / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R8 / 역광 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R8 / 역광 / RF85 / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R8 / 역광 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R8 / 역광 / RF24-105 / 움직이는 아이 | Av | f/4 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R8 / 역광 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R8 / 역광 / RF35 / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R8 / 역광 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R8 / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R8 / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R8 / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R8 / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R8 / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R8 / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R8 / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| R8 / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| R8 / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| R8 / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R8 / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| R8 / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| R8 / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| R8 / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| R8 / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 12800 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| R8 / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| R8 / 흐림·비 / RF50 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / RF85 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / RF24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R8 / 흐림·비 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R8 / 흐림·비 / RF35 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R8 / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R8 / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| R8 / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| R8 / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| R8 / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| R8 / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| R8 / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| R8 / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| R8 / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| R8 / 실내 창가 낮 / RF50 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R8 / 실내 창가 낮 / RF50 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R8 / 실내 창가 낮 / RF85 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R8 / 실내 창가 낮 / RF85 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R8 / 실내 창가 낮 / RF24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R8 / 실내 창가 낮 / RF24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R8 / 실내 창가 낮 / RF35 / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R8 / 실내 창가 낮 / RF35 / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R8 / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R8 / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R8 / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R8 / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R8 / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R8 / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R8 / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| R8 / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| R8 / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| R8 / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R8 / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| R8 / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| R8 / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| R8 / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| R8 / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 12800 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| R8 / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| R8 / 실내 저녁 조명 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 실내 저녁 조명 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 실내 저녁 조명 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 실내 저녁 조명 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 실내 저녁 조명 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R8 / 실내 저녁 조명 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R8 / 실내 저녁 조명 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 실내 저녁 조명 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R8 / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R8 / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R8 / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R8 / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R8 / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R8 / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R8 / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R8 / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6 = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R8 / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R8 / 카페·식당 / RF50 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 카페·식당 / RF50 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 카페·식당 / RF85 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 카페·식당 / RF85 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 카페·식당 / RF24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R8 / 카페·식당 / RF24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R8 / 카페·식당 / RF35 / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 카페·식당 / RF35 / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R8 / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R8 / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R8 / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R8 / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R8 / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R8 / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R8 / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R8 / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 12800 | 1/500 | 6* = 6 | 1/500 | 12800 | 4² × 100 ÷ (12800 × 2^6) = 1/512 | - |
| R8 / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R8 / 야경 배경 인물 / RF50 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 야경 배경 인물 / RF50 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 야경 배경 인물 / RF85 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 야경 배경 인물 / RF85 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 야경 배경 인물 / RF24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R8 / 야경 배경 인물 / RF24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R8 / 야경 배경 인물 / RF35 / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 야경 배경 인물 / RF35 / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R8 / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| R8 / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| R8 / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| R8 / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| R8 / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R8 / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R8 / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| R8 / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| R8 / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| R8 / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS R8 · 원하는 사진** | | | | | | | | | | |
| R8 / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 12800 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| R8 / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 12800 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| R8 / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| R8 / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 12800 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| R8 / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 12800 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| R8 / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| R8 / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 12800 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| R8 / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 12800 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| R8 / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 12800 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS 90D** | | | | | | | | | | |
| 90D / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 90D / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 90D / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 90D / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 90D / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 90D / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/160 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 90D / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 90D / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 90D / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 90D / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 90D / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 90D / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 90D / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 90D / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 90D / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 90D / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 90D / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 90D / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 90D / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 90D / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 90D / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 90D / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/160 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 90D / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 90D / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 90D / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 90D / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 90D / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 90D / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 90D / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 90D / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 90D / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 90D / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 90D / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 90D / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 90D / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 90D / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 90D / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 90D / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/160 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 90D / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 90D / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 90D / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 90D / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 90D / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 90D / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 90D / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 90D / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 90D / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 90D / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 90D / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 90D / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 90D / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 90D / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 90D / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 90D / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/160 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 90D / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 90D / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 90D / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 90D / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 90D / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 90D / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 90D / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 90D / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 90D / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 90D / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 90D / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 90D / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 90D / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 90D / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 90D / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 90D / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/160 | 9* − (+0.3) = 8.7 | 1/160 | 200 | 2.2² × 100 ÷ (200 × 2^8.7) = 1/172 | - |
| 90D / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| 90D / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| 90D / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 90D / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 90D / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 90D / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 90D / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 90D / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 90D / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 90D / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 90D / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 90D / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 90D / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 90D / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/160 | 6 = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 90D / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 90D / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 90D / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 90D / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 90D / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 90D / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6 = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 90D / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 90D / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 90D / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 90D / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 90D / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 90D / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 90D / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 90D / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 90D / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 90D / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 90D / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 90D / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 90D / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 90D / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 90D / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/500 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | isoCapped |
| 90D / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 90D / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 90D / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 90D / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 90D / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 90D / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 90D / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 90D / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 90D / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 90D / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 90D / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 90D / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 90D / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 90D / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 90D / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS 90D · 원하는 사진** | | | | | | | | | | |
| 90D / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 90D / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 90D / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| 90D / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 90D / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 6400 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 90D / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| 90D / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 90D / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 90D / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 6400 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS 80D** | | | | | | | | | | |
| 80D / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 80D / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 80D / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 80D / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 80D / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 80D / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 80D / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 80D / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 80D / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 80D / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/6400 | 100 | 2.2² × 100 ÷ (100 × 2^15) = 1/6770 | - |
| 80D / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 80D / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 80D / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 80D / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 15 = 15 | 1/4000 | 100 | 2.8² × 100 ÷ (100 × 2^15) = 1/4180 | - |
| 80D / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 80D / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 80D / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 80D / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 80D / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 80D / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 80D / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 80D / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 80D / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 80D / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 80D / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 80D / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 80D / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 80D / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 80D / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 80D / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 80D / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 80D / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 80D / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 80D / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 80D / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 80D / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 80D / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 80D / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/160 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 80D / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 80D / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 80D / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 80D / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 80D / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 80D / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 80D / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 80D / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 80D / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 80D / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 80D / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 80D / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 80D / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 80D / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 80D / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 80D / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/160 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 80D / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 80D / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 80D / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 80D / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 80D / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 80D / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 80D / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 80D / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 80D / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 80D / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 80D / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 80D / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 80D / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 80D / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 80D / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 80D / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/160 | 9* − (+0.3) = 8.7 | 1/160 | 200 | 2.2² × 100 ÷ (200 × 2^8.7) = 1/172 | - |
| 80D / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| 80D / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| 80D / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 80D / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 80D / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 80D / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 80D / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 80D / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 80D / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 80D / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 80D / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 80D / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 80D / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 80D / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 80D / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 80D / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 6 = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 80D / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 80D / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 80D / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 80D / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 80D / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6 = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 80D / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 80D / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6 = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 80D / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 80D / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 80D / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 80D / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 80D / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 80D / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 80D / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 80D / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 80D / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 80D / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 80D / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 80D / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 80D / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 80D / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 80D / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 80D / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 80D / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 80D / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 80D / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 80D / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 80D / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 80D / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 80D / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 80D / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 80D / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 80D / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 80D / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 80D / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 80D / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 80D / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 80D / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 80D / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 80D / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 80D / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 80D / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS 80D · 원하는 사진** | | | | | | | | | | |
| 80D / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 80D / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 80D / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| 80D / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 80D / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 3200 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 80D / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| 80D / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 80D / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 80D / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 3200 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS 6D** | | | | | | | | | | |
| 6D / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/250 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | minShutterCapped |
| 6D / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 6D / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/250 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | minShutterCapped |
| 6D / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/250 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | minShutterCapped |
| 6D / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/250 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | minShutterCapped |
| 6D / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/250 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | minShutterCapped |
| 6D / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/250 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | minShutterCapped |
| 6D / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/3.2 | 0 | 6400 | 1/250 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | minShutterCapped |
| 6D / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/3.2 | 0 | 6400 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 6D / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/250 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | minShutterCapped |
| 6D / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 6D / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/250 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | minShutterCapped |
| 6D / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 6D / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | minShutterCapped |
| 6D / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | minShutterCapped |
| 6D / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/250 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | minShutterCapped |
| 6D / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 6D / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | minShutterCapped |
| 6D / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/250 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | minShutterCapped |
| 6D / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 6D / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/250 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | minShutterCapped |
| 6D / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 6D / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/250 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | minShutterCapped |
| 6D / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 6D / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/250 | 12 − (+1) = 11 | 1/250 | 200 | 4² × 100 ÷ (200 × 2^11) = 1/256 | minShutterCapped |
| 6D / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 6D / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/250 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | minShutterCapped |
| 6D / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 6D / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/250 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | minShutterCapped |
| 6D / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 6D / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 6400 | 1/250 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | minShutterCapped |
| 6D / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 6D / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 6400 | 1/250 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | minShutterCapped |
| 6D / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 6D / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/250 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | minShutterCapped |
| 6D / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 6D / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 6400 | 1/250 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | minShutterCapped |
| 6D / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 6D / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 6400 | 1/250 | 12 − (+1) = 11 | 1/250 | 200 | 4² × 100 ÷ (200 × 2^11) = 1/256 | minShutterCapped |
| 6D / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 6D / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/250 | 12 − (+0.3) = 11.7 | 1/250 | 125 | 4² × 100 ÷ (125 × 2^11.7) = 1/260 | minShutterCapped |
| 6D / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 6D / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/250 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | minShutterCapped |
| 6D / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/250 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | minShutterCapped |
| 6D / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/250 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | minShutterCapped |
| 6D / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 6D / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/250 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | minShutterCapped |
| 6D / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/250 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | minShutterCapped |
| 6D / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 6D / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/250 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | minShutterCapped |
| 6D / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 6D / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/250 | 12 − (+0.3) = 11.7 | 1/250 | 125 | 4² × 100 ÷ (125 × 2^11.7) = 1/260 | minShutterCapped |
| 6D / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 6D / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/250 | 9* − (+0.3) = 8.7 | 1/250 | 1000 | 4² × 100 ÷ (1000 × 2^8.7) = 1/260 | minShutterCapped |
| 6D / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 6D / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/250 | 9* − (+0.3) = 8.7 | 1/250 | 320 | 2.2² × 100 ÷ (320 × 2^8.7) = 1/275 | minShutterCapped |
| 6D / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 6D / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/250 | 9* − (+0.3) = 8.7 | 1/250 | 320 | 2.2² × 100 ÷ (320 × 2^8.7) = 1/275 | minShutterCapped |
| 6D / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 6D / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 6400 | 1/250 | 9* − (+0.3) = 8.7 | 1/250 | 250 | 2² × 100 ÷ (250 × 2^8.7) = 1/260 | minShutterCapped |
| 6D / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| 6D / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 6400 | 1/250 | 9* − (+0.3) = 8.7 | 1/250 | 320 | 2.2² × 100 ÷ (320 × 2^8.7) = 1/275 | minShutterCapped |
| 6D / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 6D / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/250 | 9* − (+0.3) = 8.7 | 1/250 | 500 | 2.8² × 100 ÷ (500 × 2^8.7) = 1/265 | minShutterCapped |
| 6D / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 6D / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 6400 | 1/250 | 9* − (+0.3) = 8.7 | 1/250 | 500 | 2.8² × 100 ÷ (500 × 2^8.7) = 1/265 | minShutterCapped |
| 6D / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 6D / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 6400 | 1/250 | 9* − (+0.3) = 8.7 | 1/250 | 1000 | 4² × 100 ÷ (1000 × 2^8.7) = 1/260 | minShutterCapped |
| 6D / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 6D / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/250 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | minShutterCapped |
| 6D / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 6 = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 6 = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/250 | 6 = 6 | 1/250 | 1600 | 2² × 100 ÷ (1600 × 2^6) = 1/256 | minShutterCapped |
| 6D / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 6D / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 6 = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/250 | 6 = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | minShutterCapped |
| 6D / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/250 | 6 = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | minShutterCapped |
| 6D / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/250 | 6 = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | minShutterCapped |
| 6D / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | minShutterCapped |
| 6D / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 6* = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 6* = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 6400 | 1/250 | 6* = 6 | 1/250 | 1600 | 2² × 100 ÷ (1600 × 2^6) = 1/256 | minShutterCapped |
| 6D / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 6D / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 6400 | 1/250 | 6* = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/250 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | minShutterCapped |
| 6D / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 6400 | 1/250 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | minShutterCapped |
| 6D / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 6400 | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | minShutterCapped |
| 6D / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 6D / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 6D / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/250 | 6* = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/250 | 6* = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/250 | 6* = 6 | 1/250 | 1600 | 2² × 100 ÷ (1600 × 2^6) = 1/256 | minShutterCapped |
| 6D / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 6D / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/250 | 6* = 6 | 1/250 | 2000 | 2.2² × 100 ÷ (2000 × 2^6) = 1/264 | minShutterCapped |
| 6D / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/250 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | minShutterCapped |
| 6D / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/250 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | minShutterCapped |
| 6D / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 6D / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 6D / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS 6D · 원하는 사진** | | | | | | | | | | |
| 6D / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 6D / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 6400 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 6D / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| 6D / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 6D / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 6400 | 1/250 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | minShutterCapped |
| 6D / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| 6D / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 6400 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 6D / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 6400 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 6D / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 6400 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS 200D II** | | | | | | | | | | |
| 200D II / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 200D II / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 200D II / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/160 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 200D II / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 200D II / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 200D II / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 200D II / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 200D II / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 200D II / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 200D II / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 200D II / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 200D II / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 200D II / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 200D II / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 200D II / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 200D II / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 200D II / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 200D II / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 200D II / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 200D II / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 200D II / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 200D II / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 200D II / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 200D II / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 200D II / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 200D II / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 200D II / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/160 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 200D II / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 200D II / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 200D II / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 200D II / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 200D II / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 200D II / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 200D II / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 200D II / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 200D II / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 200D II / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 200D II / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 200D II / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 200D II / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 200D II / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 200D II / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 200D II / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/160 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 200D II / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 200D II / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 200D II / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 200D II / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 200D II / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 200D II / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 200D II / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 200D II / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 200D II / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 200D II / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 200D II / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 200D II / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 200D II / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 200D II / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 200D II / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 200D II / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/160 | 9* − (+0.3) = 8.7 | 1/160 | 200 | 2.2² × 100 ÷ (200 × 2^8.7) = 1/172 | - |
| 200D II / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| 200D II / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| 200D II / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 200D II / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 200D II / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 200D II / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 200D II / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 200D II / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 200D II / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 200D II / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 200D II / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 200D II / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 200D II / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 200D II / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 200D II / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 200D II / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 6 = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 200D II / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 200D II / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 200D II / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 200D II / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 200D II / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6 = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 200D II / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 200D II / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6 = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 200D II / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 200D II / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 200D II / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 200D II / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 200D II / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 200D II / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 200D II / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 200D II / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 200D II / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 200D II / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 200D II / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 200D II / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 200D II / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 200D II / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 200D II / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 200D II / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 200D II / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 200D II / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 200D II / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 200D II / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 200D II / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 200D II / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 200D II / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 200D II / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 200D II / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 200D II / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 200D II / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 200D II / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 200D II / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 200D II / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 200D II / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 200D II / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 200D II / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 200D II / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 200D II / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS 200D II · 원하는 사진** | | | | | | | | | | |
| 200D II / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 200D II / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 200D II / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| 200D II / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 200D II / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 3200 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 200D II / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| 200D II / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 200D II / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 200D II / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 3200 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |
| **EOS 850D** | | | | | | | | | | |
| 850D / 야외 맑음 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 850D / 야외 맑음 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 850D / 야외 맑음 / 50mm / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 50mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 85mm / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 85mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/160 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 50mm f/1.4 / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 35mm / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 35mm / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 24-70 / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 24-70 / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 70-200 f/2.8 / 움직이는 아이 | Av | f/3.2 | 0 | 3200 | 1/500 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/3.2 | 0 | 3200 | 1/125 | 15 = 15 | 1/3200 | 100 | 3.2² × 100 ÷ (100 × 2^15) = 1/3200 | - |
| 850D / 야외 맑음 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 850D / 야외 맑음 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 850D / 야외 그늘 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 850D / 야외 그늘 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 850D / 야외 그늘 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 850D / 야외 그늘 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 850D / 야외 그늘 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 850D / 야외 그늘 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 850D / 야외 그늘 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 850D / 야외 그늘 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 12 = 12 | 1/1000 | 100 | 2² × 100 ÷ (100 × 2^12) = 1/1024 | - |
| 850D / 야외 그늘 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 850D / 야외 그늘 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 850D / 야외 그늘 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 850D / 야외 그늘 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 850D / 야외 그늘 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 850D / 야외 그늘 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 12 = 12 | 1/500 | 100 | 2.8² × 100 ÷ (100 × 2^12) = 1/522 | - |
| 850D / 야외 그늘 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 12 = 12 | 1/500 | 200 | 4² × 100 ÷ (200 × 2^12) = 1/512 | - |
| 850D / 야외 그늘 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 12 = 12 | 1/250 | 100 | 4² × 100 ÷ (100 × 2^12) = 1/256 | - |
| 850D / 역광 / 24-105 / 움직이는 아이 | Av | f/4 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 850D / 역광 / 24-105 / 가만히 있는 사람 | Av | f/4 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 850D / 역광 / 50mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 850D / 역광 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 850D / 역광 / 85mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 850D / 역광 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/160 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 850D / 역광 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 850D / 역광 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/500 | 100 | 2² × 100 ÷ (100 × 2^11) = 1/512 | - |
| 850D / 역광 / 35mm / 움직이는 아이 | Av | f/2.2 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 125 | 2.2² × 100 ÷ (125 × 2^11) = 1/529 | - |
| 850D / 역광 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 850D / 역광 / 24-70 / 움직이는 아이 | Av | f/2.8 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 850D / 역광 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 850D / 역광 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 200 | 2.8² × 100 ÷ (200 × 2^11) = 1/522 | - |
| 850D / 역광 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/250 | 100 | 2.8² × 100 ÷ (100 × 2^11) = 1/261 | - |
| 850D / 역광 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +1 | 3200 | 1/500 | 12 − (+1) = 11 | 1/500 | 400 | 4² × 100 ÷ (400 × 2^11) = 1/512 | - |
| 850D / 역광 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/125 | 100 | 4² × 100 ÷ (100 × 2^11) = 1/128 | - |
| 850D / 흐림·비 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 850D / 흐림·비 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 850D / 흐림·비 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 850D / 흐림·비 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 850D / 흐림·비 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 850D / 흐림·비 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/160 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 850D / 흐림·비 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 850D / 흐림·비 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/800 | 100 | 2² × 100 ÷ (100 × 2^11.7) = 1/832 | - |
| 850D / 흐림·비 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 850D / 흐림·비 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 850D / 흐림·비 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 850D / 흐림·비 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 850D / 흐림·비 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 125 | 2.8² × 100 ÷ (125 × 2^11.7) = 1/530 | - |
| 850D / 흐림·비 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/400 | 100 | 2.8² × 100 ÷ (100 × 2^11.7) = 1/424 | - |
| 850D / 흐림·비 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 12 − (+0.3) = 11.7 | 1/500 | 250 | 4² × 100 ÷ (250 × 2^11.7) = 1/520 | - |
| 850D / 흐림·비 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/200 | 100 | 4² × 100 ÷ (100 × 2^11.7) = 1/208 | - |
| 850D / 실내 창가 낮 / 24-105 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 850D / 실내 창가 낮 / 24-105 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 850D / 실내 창가 낮 / 50mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 850D / 실내 창가 낮 / 50mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 850D / 실내 창가 낮 / 85mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 850D / 실내 창가 낮 / 85mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/160 | 9* − (+0.3) = 8.7 | 1/160 | 200 | 2.2² × 100 ÷ (200 × 2^8.7) = 1/172 | - |
| 850D / 실내 창가 낮 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 500 | 2² × 100 ÷ (500 × 2^8.7) = 1/520 | - |
| 850D / 실내 창가 낮 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 125 | 2² × 100 ÷ (125 × 2^8.7) = 1/130 | - |
| 850D / 실내 창가 낮 / 35mm / 움직이는 아이 | Av | f/2.2 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 640 | 2.2² × 100 ÷ (640 × 2^8.7) = 1/550 | - |
| 850D / 실내 창가 낮 / 35mm / 가만히 있는 사람 | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 850D / 실내 창가 낮 / 24-70 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 850D / 실내 창가 낮 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 850D / 실내 창가 낮 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 1000 | 2.8² × 100 ÷ (1000 × 2^8.7) = 1/530 | - |
| 850D / 실내 창가 낮 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 250 | 2.8² × 100 ÷ (250 × 2^8.7) = 1/133 | - |
| 850D / 실내 창가 낮 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | +0.3 | 3200 | 1/500 | 9* − (+0.3) = 8.7 | 1/500 | 2000 | 4² × 100 ÷ (2000 × 2^8.7) = 1/520 | - |
| 850D / 실내 창가 낮 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 500 | 4² × 100 ÷ (500 × 2^8.7) = 1/130 | - |
| 850D / 실내 저녁 조명 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 850D / 실내 저녁 조명 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 850D / 실내 저녁 조명 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 850D / 실내 저녁 조명 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 850D / 실내 저녁 조명 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 850D / 실내 저녁 조명 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 6 = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 850D / 실내 저녁 조명 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 6 = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 850D / 실내 저녁 조명 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 850D / 실내 저녁 조명 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6 = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 850D / 실내 저녁 조명 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 850D / 실내 저녁 조명 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6 = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 850D / 실내 저녁 조명 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 850D / 실내 저녁 조명 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6 = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 850D / 실내 저녁 조명 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 850D / 실내 저녁 조명 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 850D / 실내 저녁 조명 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6 = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 850D / 카페·식당 / 24-105 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 850D / 카페·식당 / 24-105 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 850D / 카페·식당 / 50mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 850D / 카페·식당 / 50mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 850D / 카페·식당 / 85mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 850D / 카페·식당 / 85mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 850D / 카페·식당 / 50mm f/1.4 / 움직이는 아이 | Av | f/2 | 0 | 3200 | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 850D / 카페·식당 / 50mm f/1.4 / 가만히 있는 사람 | Av | f/2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 850D / 카페·식당 / 35mm / 움직이는 아이 | Av | f/2.2 | 0 | 3200 | 1/500 | 6* = 6 | 1/400 | 3200 | 2.2² × 100 ÷ (3200 × 2^6) = 1/423 | isoCapped |
| 850D / 카페·식당 / 35mm / 가만히 있는 사람 | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 850D / 카페·식당 / 24-70 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 850D / 카페·식당 / 24-70 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 850D / 카페·식당 / 70-200 f/2.8 / 움직이는 아이 | Av | f/2.8 | 0 | 3200 | 1/500 | 6* = 6 | 1/250 | 3200 | 2.8² × 100 ÷ (3200 × 2^6) = 1/261 | isoCapped |
| 850D / 카페·식당 / 70-200 f/2.8 / 가만히 있는 사람 | Av | f/2.8 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 850D / 카페·식당 / 70-200 f/4 / 움직이는 아이 | Av | f/4 | 0 | 3200 | 1/500 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | isoCapped |
| 850D / 카페·식당 / 70-200 f/4 / 가만히 있는 사람 | Av | f/4 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 850D / 야경 배경 인물 / 24-105 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 850D / 야경 배경 인물 / 24-105 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| 850D / 야경 배경 인물 / 50mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 850D / 야경 배경 인물 / 50mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 850D / 야경 배경 인물 / 85mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 850D / 야경 배경 인물 / 85mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/160 | 6* = 6 | 1/160 | 1250 | 2.2² × 100 ÷ (1250 × 2^6) = 1/165 | - |
| 850D / 야경 배경 인물 / 50mm f/1.4 / 움직이는 아이 | M | f/2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 3200 | 2² × 100 ÷ (3200 × 2^6) = 1/512 | - |
| 850D / 야경 배경 인물 / 50mm f/1.4 / 가만히 있는 사람 | M | f/2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 800 | 2² × 100 ÷ (800 × 2^6) = 1/128 | - |
| 850D / 야경 배경 인물 / 35mm / 움직이는 아이 | M | f/2.2 | 0 | - | 1/500 | 6* = 6 | 1/500 | 4000 | 2.2² × 100 ÷ (4000 × 2^6) = 1/529 | - |
| 850D / 야경 배경 인물 / 35mm / 가만히 있는 사람 | M | f/2.2 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 850D / 야경 배경 인물 / 24-70 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 850D / 야경 배경 인물 / 24-70 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 850D / 야경 배경 인물 / 70-200 f/2.8 / 움직이는 아이 | M | f/2.8 | 0 | - | 1/500 | 6* = 6 | 1/500 | 6400 | 2.8² × 100 ÷ (6400 × 2^6) = 1/522 | - |
| 850D / 야경 배경 인물 / 70-200 f/2.8 / 가만히 있는 사람 | M | f/2.8 | 0 | - | 1/125 | 6* = 6 | 1/125 | 1600 | 2.8² × 100 ÷ (1600 × 2^6) = 1/131 | - |
| 850D / 야경 배경 인물 / 70-200 f/4 / 움직이는 아이 | M | f/4 | 0 | - | 1/250 | 6* = 6 | 1/250 | 6400 | 4² × 100 ÷ (6400 × 2^6) = 1/256 | - |
| 850D / 야경 배경 인물 / 70-200 f/4 / 가만히 있는 사람 | M | f/4 | 0 | - | 1/125 | 6* = 6 | 1/125 | 3200 | 4² × 100 ÷ (3200 × 2^6) = 1/128 | - |
| **EOS 850D · 원하는 사진** | | | | | | | | | | |
| 850D / 배경이 사르르 녹는 아이 얼굴 (50mm) | Av | f/2.2 | 0 | 3200 | 1/125 | 12 = 12 | 1/800 | 100 | 2.2² × 100 ÷ (100 × 2^12) = 1/846 | - |
| 850D / 역광에 머리카락이 빛나는 사진 (50mm) | Av | f/2.2 | +1 | 3200 | 1/125 | 12 − (+1) = 11 | 1/400 | 100 | 2.2² × 100 ÷ (100 × 2^11) = 1/423 | - |
| 850D / 실루엣 (24-105) | M | f/8 | -2 | - | 1/125 | 13 − (-2) = 15 | 1/500 | 100 | 8² × 100 ÷ (100 × 2^15) = 1/512 | - |
| 850D / 창가 빛이 얼굴 반쪽만 든 사진 (50mm) | Av | f/2.2 | +0.3 | 3200 | 1/125 | 9* − (+0.3) = 8.7 | 1/125 | 160 | 2.2² × 100 ÷ (160 × 2^8.7) = 1/137 | - |
| 850D / 뛰는 순간 정지 (24-105) | Av | f/4 | 0 | 3200 | 1/1000 | 15 = 15 | 1/2000 | 100 | 4² × 100 ÷ (100 × 2^15) = 1/2048 | - |
| 850D / 야경 보케 앞 인물 (50mm) | M | f/1.8 | 0 | - | 1/125 | 6* = 6 | 1/640 | 3200 | 1.8² × 100 ÷ (3200 × 2^6) = 1/632 | - |
| 850D / 비 오는 날 차분한 톤 (50mm) | Av | f/2.2 | +0.3 | 3200 | 1/125 | 12 − (+0.3) = 11.7 | 1/640 | 100 | 2.2² × 100 ÷ (100 × 2^11.7) = 1/687 | - |
| 850D / 카페 분위기 (50mm) | Av | f/2.2 | 0 | 3200 | 1/125 | 6* = 6 | 1/125 | 1000 | 2.2² × 100 ÷ (1000 × 2^6) = 1/132 | - |
| 850D / 셀프 가족사진 (24-105) | Av | f/5.6 | 0 | 3200 | 1/125 | 12 = 12 | 1/125 | 100 | 5.6² × 100 ÷ (100 × 2^12) = 1/131 | - |

`*` = 추정 EV. 플래그: isoCapped = ISO 상한 도달(카메라가 최소 셔터보다 느린 셔터 사용) · tooBright = 바디 최고 셔터 초과(조리개 조이기) · tooDark = 비상 ISO 상한으로도 부족.
생성: 2026-10-08 node check.js
<!-- CALC:END -->

## 체크 스크립트용 기준값
check.js가 이 블록을 읽어 data.js와 대조한다. 위 표들과 반드시 일치시킬 것. 바디를 추가하면 `cameras`에 항목 추가.

```json facts
{
  "ecMax": 5,
  "cameras": {
    "eos6d2": {
      "mount": "EF", "crop": 1, "hasCModes": true,
      "isoMin": 100, "isoMax": 40000, "isoAutoMaxMin": 200,
      "shutterFastest": 0.00025, "shutterLongest": 30,
      "menuPages": [130, 136, 156, 159, 162, 170, 174, 175, 176, 179, 180, 185, 187, 194, 195, 199, 206, 238, 241, 242, 243, 245, 265, 510, 511]
    },
    "eos5d4": {
      "mount": "EF", "crop": 1, "hasCModes": true,
      "isoMin": 100, "isoMax": 32000, "isoAutoMaxMin": 200,
      "shutterFastest": 0.000125, "shutterLongest": 30,
      "menuPages": [100, 104, 106, 160, 169, 177, 181, 182, 183, 187, 192, 194, 201, 202, 215, 248, 251, 255, 520]
    },
    "eosr6m2": {
      "mount": "RF", "crop": 1, "hasCModes": true,
      "isoMin": 100, "isoMax": 102400, "isoAutoMaxMin": 200,
      "shutterFastest": 0.000125, "shutterLongest": 30,
      "menuPages": [
        "https://cam.start.canon/en/C012/manual/html/UG-01_Preparations_0080.html",
        "https://cam.start.canon/en/C012/manual/html/UG-03_CustomShooting_0020.html",
        "https://cam.start.canon/en/C012/manual/html/UG-03_CustomShooting_0050.html",
        "https://cam.start.canon/en/C012/manual/html/UG-03_CustomShooting_0060.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0030.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0080.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0100.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0130.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0150.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0200.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0230.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0240.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0300.html",
        "https://cam.start.canon/en/C012/manual/html/UG-04_Shooting-1_0370.html",
        "https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0040.html",
        "https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0060.html",
        "https://cam.start.canon/en/C012/manual/html/UG-05_AF-Drive_0120.html",
        "https://cam.start.canon/en/C012/manual/html/UG-08_Set-up_0330.html",
        "https://cam.start.canon/en/C012/manual/html/UG-10_Reference_0100.html"
      ]
    },
    "eosr50": {
      "mount": "RF", "crop": 1.6, "hasCModes": false, "hasMinShutter": false,
      "isoMin": 100, "isoMax": 32000, "isoAutoMaxMin": 400,
      "shutterFastest": 0.00025, "shutterLongest": 30,
      "menuPages": [
        "https://cam.start.canon/en/C011/manual/html/UG-01_Preparations_0070.html",
        "https://cam.start.canon/en/C011/manual/html/UG-03_CustomShooting_0040.html",
        "https://cam.start.canon/en/C011/manual/html/UG-03_CustomShooting_0050.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0030.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0070.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0090.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0120.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0140.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0160.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0190.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0260.html",
        "https://cam.start.canon/en/C011/manual/html/UG-05_Shooting-1_0300.html",
        "https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0040.html",
        "https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0060.html",
        "https://cam.start.canon/en/C011/manual/html/UG-06_AF-Drive_0120.html",
        "https://cam.start.canon/en/C011/manual/html/UG-09_Set-up_0250.html",
        "https://cam.start.canon/en/C011/manual/html/UG-11_Reference_0090.html"
      ]
    },
    "eosr8": {
      "mount": "RF", "crop": 1, "hasCModes": true,
      "isoMin": 100, "isoMax": 102400, "isoAutoMaxMin": 200,
      "shutterFastest": 0.00025, "shutterLongest": 30,
      "menuPages": [
        "https://cam.start.canon/en/C013/manual/html/UG-01_Preparations_0070.html",
        "https://cam.start.canon/en/C013/manual/html/UG-03_CustomShooting_0050.html",
        "https://cam.start.canon/en/C013/manual/html/UG-03_CustomShooting_0060.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0030.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0080.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0100.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0130.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0150.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0200.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0230.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0300.html",
        "https://cam.start.canon/en/C013/manual/html/UG-04_Shooting-1_0370.html",
        "https://cam.start.canon/en/C013/manual/html/UG-05_AF-Drive_0040.html",
        "https://cam.start.canon/en/C013/manual/html/UG-05_AF-Drive_0060.html",
        "https://cam.start.canon/en/C013/manual/html/UG-05_AF-Drive_0120.html",
        "https://cam.start.canon/en/C013/manual/html/UG-08_Set-up_0250.html",
        "https://cam.start.canon/en/C013/manual/html/UG-08_Set-up_0290.html",
        "https://cam.start.canon/en/C013/manual/html/UG-10_Reference_0100.html"
      ]
    },
    "eos90d": {
      "mount": "EF", "crop": 1.6, "hasCModes": true,
      "isoMin": 100, "isoMax": 25600, "isoAutoMaxMin": 200,
      "shutterFastest": 0.000125, "shutterLongest": 30,
      "menuPages": [39, 60, 113, 114, 117, 118, 124, 128, 129, 131, 150, 153, 160, 199, 213, 215, 216, 217, 218, 219, 222, 224, 230, 233, 234, 236, 239, 261, 263, 545, 546, 614]
    },
    "eos80d": {
      "mount": "EF", "crop": 1.6, "hasCModes": true,
      "isoMin": 100, "isoMax": 16000, "isoAutoMaxMin": 200,
      "shutterFastest": 0.000125, "shutterLongest": 30,
      "menuPages": [54, 116, 120, 121, 138, 142, 148, 150, 152, 153, 157, 162, 163, 169, 170, 179, 194, 196, 197, 200, 445, 470, 471, 472, 498, 499, 500]
    },
    "eos6d": {
      "mount": "EF", "crop": 1, "hasCModes": true,
      "isoMin": 100, "isoMax": 25600, "isoAutoMaxMin": 200,
      "shutterFastest": 0.00025, "shutterLongest": 30,
      "menuPages": [47, 92, 94, 98, 102, 106, 108, 109, 110, 111, 112, 115, 120, 125, 126, 146, 148, 151, 328, 346, 347, 348, 371, 372, 373, 374]
    },
    "eos250d": {
      "mount": "EF", "crop": 1.6, "hasCModes": false, "hasMinShutter": false,
      "isoMin": 100, "isoMax": 25600, "isoAutoMaxMin": 400,
      "shutterFastest": 0.00025, "shutterLongest": 30,
      "menuPages": [13, 29, 30, 104, 108, 112, 115, 118, 119, 120, 124, 129, 130, 136, 138, 152, 155, 156, 160]
    },
    "eos850d": {
      "mount": "EF", "crop": 1.6, "hasCModes": false, "hasMinShutter": false,
      "isoMin": 100, "isoMax": 25600, "isoAutoMaxMin": 400,
      "shutterFastest": 0.00025, "shutterLongest": 30,
      "menuPages": [
        "https://cam.start.canon/en/C002/manual/html/UG-01_Preparations_0080.html",
        "https://cam.start.canon/en/C002/manual/html/UG-03_CustomShooting_0040.html",
        "https://cam.start.canon/en/C002/manual/html/UG-03_CustomShooting_0050.html",
        "https://cam.start.canon/en/C002/manual/html/UG-04_AF-Drive_0020.html",
        "https://cam.start.canon/en/C002/manual/html/UG-04_AF-Drive_0030.html",
        "https://cam.start.canon/en/C002/manual/html/UG-04_AF-Drive_0060.html",
        "https://cam.start.canon/en/C002/manual/html/UG-04_AF-Drive_0110.html",
        "https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0030.html",
        "https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0050.html",
        "https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0110.html",
        "https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0120.html",
        "https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0150.html",
        "https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0190.html",
        "https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0210.html",
        "https://cam.start.canon/en/C002/manual/html/UG-06_Shooting-1_0230.html",
        "https://cam.start.canon/en/C002/manual/html/UG-09_Set-up_0020.html",
        "https://cam.start.canon/en/C002/manual/html/UG-09_Set-up_0240.html",
        "https://cam.start.canon/en/C002/manual/html/UG-11_Reference_0100.html"
      ]
    }
  },
  "lights": {
    "sunny": { "ev": 15, "est": false },
    "shade": { "ev": 12, "est": false },
    "overcast": { "ev": 12, "est": false },
    "preSunset": { "ev": 13, "est": false },
    "home": { "ev": 6, "est": false },
    "window": { "ev": 9, "est": true },
    "dim": { "ev": 6, "est": true },
    "nightFace": { "ev": 6, "est": true }
  },
  "lenses": {
    "ef24105": { "mount": "EF", "wide": 24, "tele": 105, "apMin": 4, "apMax": 22, "is": true, "minFocus": 0.45 },
    "ef50":    { "mount": "EF", "wide": 50, "tele": 50, "apMin": 1.8, "apMax": 22, "is": false, "minFocus": 0.35 },
    "ef85_18": { "mount": "EF", "wide": 85, "tele": 85, "apMin": 1.8, "apMax": 22, "is": false, "minFocus": 0.85 },
    "ef50_14": { "mount": "EF", "wide": 50, "tele": 50, "apMin": 1.4, "apMax": 22, "is": false, "minFocus": 0.45 },
    "ef35_2is": { "mount": "EF", "wide": 35, "tele": 35, "apMin": 2, "apMax": 22, "is": true, "isStops": 4, "minFocus": 0.24 },
    "ef2470_28": { "mount": "EF", "wide": 24, "tele": 70, "apMin": 2.8, "apMax": 22, "is": false, "minFocus": 0.38 },
    "ef70200_28": { "mount": "EF", "wide": 70, "tele": 200, "apMin": 2.8, "apMax": 32, "is": true, "isStops": 3.5, "minFocus": 1.2 },
    "ef70200_4": { "mount": "EF", "wide": 70, "tele": 200, "apMin": 4, "apMax": 32, "is": true, "isStops": 5, "minFocus": 1 },
    "rf50":    { "mount": "RF", "wide": 50, "tele": 50, "apMin": 1.8, "apMax": 22, "is": false, "isStops": 0, "minFocus": 0.3 },
    "rf85":    { "mount": "RF", "wide": 85, "tele": 85, "apMin": 2, "apMax": 29, "is": true, "isStops": 5, "minFocus": 0.35 },
    "rf24105": { "mount": "RF", "wide": 24, "tele": 105, "apMin": 4, "apMax": 22, "is": true, "isStops": 5, "minFocus": 0.45 },
    "rf35":    { "mount": "RF", "wide": 35, "tele": 35, "apMin": 1.8, "apMax": 22, "is": true, "isStops": 5, "minFocus": 0.17 }
  },
  "wbPresets": ["awb", "awbAmb", "daylight", "shade", "cloudy", "tungsten", "fluor"],
  "pictureStyles": ["자동", "표준", "인물", "풍경", "디테일 중시", "뉴트럴", "충실", "모노크롬"]
}
```
