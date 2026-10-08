// 다이얼 조작 문구. family(바디 내부 분류)별 템플릿. compute()는 문구를 만들지 않는다.
// dialSteps(r) → 문자열 배열. r은 exposure.js compute() 결과.
// 검증: ff2dial = 6D Mark II·5D Mark IV, rf = R6 Mark II, rf1dial = R50, rf2dial = R8, crop2dial = 90D(ff2dial 문구 그대로 검증). crop1dial은 틀만.

const DIALS = {
  // 풀프레임·2다이얼(메인 + 퀵 컨트롤), C 모드 있음. 검증: 6D Mark II(p.238/241/245/170), 5D Mark IV(p.248/251/255/177).
  // 두 바디 모두 Av=메인 다이얼 조리개, 노출보정=퀵 컨트롤 다이얼(LOCK 스위치 해제 필요할 수 있음: 6D2는 아래로, 5D4는 왼쪽으로 → 문구는 "해제"로 공통),
  // M=메인 다이얼 셔터·퀵 컨트롤 다이얼 조리개, ISO 버튼 → 메인 다이얼. 그래서 바디별 분기 없음.
  ff2dial: {
    av(r) {
      const steps = [
        `모드 다이얼을 <b>${r.cmode || 'Av'}</b>에`,
        `메인 다이얼(셔터 버튼 뒤)로 조리개 <b>f/${r.aperture}</b>`,
        r.ec
          ? `반셔터 살짝 누른 뒤 퀵 컨트롤 다이얼(뒷면 큰 원형)로 노출보정 <b>${fmtEC(r.ec)}</b> (안 돌아가면 LOCK 스위치 해제)`
          : `퀵 컨트롤 다이얼(뒷면 큰 원형)이 노출보정 <b>0</b>인지 확인`,
      ];
      if (r.minShutter !== r.minShutterDefault) steps.push(`${r.camera.menu.minShutter.path} <b>${fmtShutter(r.minShutter)}</b> (${r.cmode} 기본 ${fmtShutter(r.minShutterDefault)}에서 변경)`);
      return steps;
    },
    m(r) {
      return [
        `모드 다이얼을 <b>M</b>에`,
        `메인 다이얼(셔터 버튼 뒤)로 셔터 <b>${fmtShutter(r.shutter)}</b>`,
        `퀵 컨트롤 다이얼(뒷면 큰 원형)로 조리개 <b>f/${r.aperture}</b>`,
        `ISO 버튼 누른 뒤 메인 다이얼로 <b>ISO ${r.iso}</b> (A=자동이 아니라 숫자)`,
      ];
    },
  },

  // 크롭·2다이얼(메인 + 퀵 컨트롤), C 모드 있음. 검증: 90D PDF — Av 메인 다이얼 조리개(p.114), 노출보정 퀵 컨트롤 다이얼(p.160), M 메인=셔터·퀵=조리개(p.117),
  //  ISO 버튼 → 메인 또는 퀵 다이얼(p.213), LOCK 스위치(<R>) 위로 올리면 기본으로 퀵 컨트롤 다이얼이 잠김 → 아래로 내려 해제(p.60). 문구가 ff2dial과 완전히 같아 재사용. 80D는 미검증.
  crop2dial: {
    av(r) { return DIALS.ff2dial.av(r); },
    m(r) { return DIALS.ff2dial.m(r); },
  },

  // 크롭·1다이얼(메인 다이얼 + Av± 버튼), C 모드 없음. 예: 200D, 850D. 틀만. 2차에서 기종별 검증
  crop1dial: {
    av(r) {
      return [
        `모드 다이얼을 <b>Av</b>에`,
        `메인 다이얼(셔터 버튼 뒤)로 조리개 <b>f/${r.aperture}</b>`,
        r.ec
          ? `Av± 버튼을 누른 채 메인 다이얼로 노출보정 <b>${fmtEC(r.ec)}</b>`
          : `노출보정이 <b>0</b>인지 확인 (Av± 버튼 누른 채 메인 다이얼)`,
        `AF 버튼 → <b>${r.af}</b> / AF 영역 → <b>${r.afAreaName}</b> / DRIVE 버튼 → <b>${r.drive}</b> (C 모드가 없어 피사체 바꿀 때마다)`,
        `${r.camera.menu.minShutter.path} <b>${fmtShutter(r.minShutter)}</b>`,
      ];
    },
    m(r) {
      return [
        `모드 다이얼을 <b>M</b>에`,
        `메인 다이얼로 셔터 <b>${fmtShutter(r.shutter)}</b>`,
        `Av± 버튼을 누른 채 메인 다이얼로 조리개 <b>f/${r.aperture}</b>`,
        `ISO 버튼 → <b>ISO ${r.iso}</b> (자동 아님)`,
      ];
    },
  },

  // RF 미러리스(메인 다이얼 + 퀵 컨트롤 다이얼 1·2 + 컨트롤 링), C1~C3 있음. 검증: R6 Mark II 온라인 가이드
  //  Av: 메인 다이얼 = 조리개 (UG-03_CustomShooting_0050) / 노출보정 = 퀵 컨트롤 다이얼 1 (UG-04_Shooting-1_0080)
  //  M: 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 1 = 조리개, ISO = 퀵 컨트롤 다이얼 2 (UG-03_CustomShooting_0060)
  //  멀티펑션 잠금 스위치가 걸려 있으면 다이얼이 안 돈다 (UG-01_Preparations_0110). Fv 모드도 있지만 앱은 Av(C 모드) 기준.
  rf: {
    av(r) {
      const steps = [
        `모드 다이얼을 <b>${r.cmode || 'Av'}</b>에`,
        `메인 다이얼(셔터 버튼 뒤)로 조리개 <b>f/${r.aperture}</b>`,
        r.ec
          ? `퀵 컨트롤 다이얼 1(뒷면 원형)로 노출보정 <b>${fmtEC(r.ec)}</b> (안 돌아가면 멀티펑션 잠금 스위치 해제)`
          : `퀵 컨트롤 다이얼 1(뒷면 원형)이 노출보정 <b>0</b>인지 화면에서 확인`,
      ];
      if (r.minShutter !== r.minShutterDefault) steps.push(`${r.camera.menu.minShutter.path} <b>${fmtShutter(r.minShutter)}</b> (${r.cmode} 기본 ${fmtShutter(r.minShutterDefault)}에서 변경)`);
      return steps;
    },
    m(r) {
      return [
        `모드 다이얼을 <b>M</b>에`,
        `메인 다이얼(셔터 버튼 뒤)로 셔터 <b>${fmtShutter(r.shutter)}</b>`,
        `퀵 컨트롤 다이얼 1(뒷면 원형)로 조리개 <b>f/${r.aperture}</b>`,
        `퀵 컨트롤 다이얼 2(상단 오른쪽)로 <b>ISO ${r.iso}</b> (AUTO가 아니라 숫자)`,
      ];
    },
  },
  // RF 크롭 미러리스·1다이얼(다이얼 1개 + ▲ 노출보정 버튼 + ISO 버튼), 스틸 C 모드 없음. 검증: R50 온라인 가이드(C011)
  //  Av: 다이얼 = 조리개 (UG-03_CustomShooting_0040) / 노출보정 = ▲ 버튼 누른 뒤 다이얼 (UG-05_Shooting-1_0070)
  //  M: 다이얼 = 셔터, ▲ 버튼으로 조리개 선택 후 다이얼, ISO 버튼 → 다이얼. ISO AUTO일 때 노출보정 = 화면 노출 눈금 터치 또는 반셔터 상태에서 컨트롤 링 (UG-03_CustomShooting_0050)
  //  Min. shutter spd. 메뉴가 없는 바디(hasMinShutter: false)는 움직이는 아이를 M + ISO AUTO로(r.mAuto). AF·드라이브는 C 모드가 없어 피사체 바꿀 때마다 (UG-06_AF-Drive_0040/0060/0120)
  rf1dial: {
    av(r) {
      const c = r.camera;
      const isoLabel = c.isoAutoMaxLabel || 'Auto range';
      const set = `MENU → AF 1탭 → AF operation <b>${r.af}</b> / AF area <b>${r.afAreaName}</b> / ▶ 버튼 → 드라이브 <b>${r.drive}</b> (C 모드가 없어 피사체 바꿀 때마다)`;
      const capStep = r.isoMax !== c.isoUsable ? [`${c.menu.isoAutoRange.path} <b>${r.isoMax}</b> (공통 설정 ${c.isoUsable}에서 변경)`] : [];
      if (r.mAuto) {
        return [
          `모드 다이얼을 <b>M</b>에`,
          `다이얼(셔터 버튼 뒤)로 셔터 <b>${fmtShutter(r.minShutter)}</b>`,
          `▲ 버튼을 눌러 조리개 선택 → 다이얼로 조리개 <b>f/${r.aperture}</b>`,
          `ISO 버튼 → 다이얼로 <b>AUTO</b> (상한은 ${isoLabel} <b>${r.isoMax}</b>)`,
          r.ec
            ? `화면 아래 노출 눈금을 터치한 뒤 다이얼로 노출보정 <b>${fmtEC(r.ec)}</b> (또는 반셔터 상태에서 렌즈 컨트롤 링)`
            : `화면 아래 노출 눈금이 <b>0</b>인지 확인`,
          set,
        ].concat(capStep);
      }
      const steps = [
        `모드 다이얼을 <b>Av</b>에`,
        `다이얼(셔터 버튼 뒤)로 조리개 <b>f/${r.aperture}</b>`,
        r.ec
          ? `▲(노출보정) 버튼을 누른 뒤 다이얼로 노출보정 <b>${fmtEC(r.ec)}</b>`
          : `▲(노출보정) 버튼을 눌러 노출보정이 <b>0</b>인지 확인`,
        `ISO 버튼 → <b>AUTO</b> (상한은 ${isoLabel} <b>${r.isoMax}</b>)`,
        set,
      ].concat(capStep);
      if (c.hasMinShutter === false) steps.push(`반셔터 후 화면 셔터가 <b>${fmtShutter(r.minShutter)}</b>보다 느리면 ISO 버튼으로 ISO를 직접 올리기 (이 기종은 최소 셔터 설정이 없음)`);
      else steps.push(`${c.menu.minShutter.path} <b>${fmtShutter(r.minShutter)}</b>`);
      return steps;
    },
    m(r) {
      return [
        `모드 다이얼을 <b>M</b>에`,
        `다이얼(셔터 버튼 뒤)로 셔터 <b>${fmtShutter(r.shutter)}</b>`,
        `▲ 버튼을 눌러 조리개 선택 → 다이얼로 조리개 <b>f/${r.aperture}</b>`,
        `ISO 버튼 → 다이얼로 <b>ISO ${r.iso}</b> (AUTO가 아니라 숫자)`,
      ];
    },
  },
  // RF 풀프레임·2다이얼(메인 + 퀵 컨트롤 다이얼 1개), 잠금은 전원 스위치의 LOCK 위치. C1·C2 있음. 검증: R8 온라인 가이드(C013)
  //  Av: 메인 다이얼 = 조리개 (UG-03_CustomShooting_0050) / 노출보정 = 퀵 컨트롤 다이얼 (UG-04_Shooting-1_0080)
  //  M: 메인 다이얼 = 셔터, 퀵 컨트롤 다이얼 = 조리개 (UG-03_CustomShooting_0060). ISO 버튼이 없어 화면 오른쪽 아래 ISO를 터치한 뒤 퀵 컨트롤 다이얼 (UG-04_Shooting-1_0100)
  //  전원/멀티펑션 잠금 스위치가 LOCK이면 다이얼이 안 돈다 (UG-08_Set-up_0250)
  rf2dial: {
    av(r) {
      const steps = [
        `모드 다이얼을 <b>${r.cmode || 'Av'}</b>에`,
        `메인 다이얼(셔터 버튼 뒤)로 조리개 <b>f/${r.aperture}</b>`,
        r.ec
          ? `퀵 컨트롤 다이얼(뒷면 원형)로 노출보정 <b>${fmtEC(r.ec)}</b> (안 돌아가면 전원 스위치가 LOCK 위치인지 확인)`
          : `퀵 컨트롤 다이얼(뒷면 원형)이 노출보정 <b>0</b>인지 화면에서 확인`,
      ];
      if (r.minShutter !== r.minShutterDefault) steps.push(`${r.camera.menu.minShutter.path} <b>${fmtShutter(r.minShutter)}</b> (${r.cmode} 기본 ${fmtShutter(r.minShutterDefault)}에서 변경)`);
      return steps;
    },
    m(r) {
      return [
        `모드 다이얼을 <b>M</b>에`,
        `메인 다이얼(셔터 버튼 뒤)로 셔터 <b>${fmtShutter(r.shutter)}</b>`,
        `퀵 컨트롤 다이얼(뒷면 원형)로 조리개 <b>f/${r.aperture}</b>`,
        `화면 오른쪽 아래 ISO를 터치한 뒤 퀵 컨트롤 다이얼로 <b>ISO ${r.iso}</b> (AUTO가 아니라 숫자)`,
      ];
    },
  },
};

function dialSteps(r) {
  const fam = DIALS[r.camera.family] || DIALS.ff2dial;
  const steps = r.mode === 'Av' ? fam.av(r) : fam.m(r);
  return steps.concat(r.dialExtra || []);
}
