# 출시 메모 (스토어 출시 전 확인)

## 스토어 출시 전 필수 — Gemini API 키 중계 서버
- 지금 구조는 사용자가 설정 페이지에 넣은 Gemini API 키를 폰의 localStorage(`cck.geminiKey`)에 두고 앱이 Google API를 직접 호출한다. **API 키가 앱 안에 있으면 추출 가능하다.** 앱 번들에 키를 넣는 방식은 절대 안 되고, 사용자 입력 키도 개발·테스트용이다.
- 출시 전에 Cloudflare Worker 같은 **중계 서버**를 두고 키는 서버에만 보관한다. 앱은 중계 주소(예: `https://api.<도메인>/analyze`)에 축소본 JPEG만 보내고, 중계가 Gemini를 호출해 Features JSON만 돌려준다.
- **사용량 제한·구독 검증도 중계에서** 한다(기기·계정별 일일 호출 수, Play 결제 영수증 검증). 앱 쪽 분석 모드 pill과 키 입력란은 그때 제거하거나 개발자 전용으로 숨긴다.
- 코드 변경 범위: `js/analyze.js`의 `GEMINI_ENDPOINT`와 헤더만 중계 주소로 바꾸면 된다. 프롬프트·스키마·응답 처리는 중계로 옮기거나 그대로 둔다. 화면(app.js)·매핑(match.js)은 변경 없음.
- 지금은 구현하지 않음 (2026-10-07 기준).

## 참고
- 호출 사양: `docs/match.md`의 Features 스키마가 유일한 계약. 숫자(조리개·셔터·ISO)는 서버가 어떤 모델을 쓰든 돌려주지 않는다.
- Google의 이미지 이해 문서(2026-10)는 새 Interactions API(`/v1beta/interactions`) 예제를 쓴다. 현재 앱은 아직 문서에 있는 `generateContent`를 쓴다. 중계 서버를 만들 때 어느 쪽을 쓸지 다시 확인.
