// JPEG EXIF 최소 파서. 외부 라이브러리 없음. 반드시 원본 File에서 읽는다(축소본·캔버스 출력에는 EXIF가 없음).
// readExif(file) → Promise<{ make, model, lens, fNumber, exposureTime, iso, ec, focal, program } | null>
// JPEG가 아니거나(PNG·WebP 등) Exif APP1이 없으면 null. 태그를 못 찾은 필드는 null.

const EXIF_TAGS = {
  0x010F: 'make', 0x0110: 'model', 0x8769: 'exifIfd',
  0x829A: 'exposureTime', 0x829D: 'fNumber', 0x8827: 'iso', 0x9204: 'ec', 0x920A: 'focal', 0x8822: 'program', 0xA434: 'lens',
};
const EXIF_PROGRAM = { 1: 'M', 2: 'P', 3: 'Av', 4: 'Tv', 5: 'Creative', 6: 'Action', 7: 'Portrait', 8: 'Landscape' };

function readExif(file) {
  if (!file || typeof file.slice !== 'function') return Promise.resolve(null);
  // EXIF는 파일 앞부분 APP1에 있다. 메이커노트가 큰 캐논 파일을 고려해 256KB까지 읽는다.
  return readSlice(file, 0, 256 * 1024).then((buf) => {
    try { return parseExif(buf); } catch (e) { return null; }
  });
}

function readSlice(file, start, end) {
  const blob = file.slice(start, end);
  if (blob.arrayBuffer) return blob.arrayBuffer();
  return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsArrayBuffer(blob); });
}

function parseExif(buf) {
  const v = new DataView(buf);
  if (buf.byteLength < 4 || v.getUint16(0) !== 0xFFD8) return null; // JPEG SOI 아님
  let off = 2;
  while (off + 4 <= buf.byteLength) {
    if (v.getUint8(off) !== 0xFF) return null;
    const marker = v.getUint8(off + 1);
    if (marker === 0xDA || marker === 0xD9) return null; // SOS/EOI: 이미지 데이터 시작, Exif 없음
    const len = v.getUint16(off + 2);
    if (marker === 0xE1 && off + 10 <= buf.byteLength && v.getUint32(off + 4) === 0x45786966 /* 'Exif' */) {
      return parseTiff(buf, off + 10, Math.min(buf.byteLength, off + 2 + len));
    }
    off += 2 + len;
  }
  return null;
}

function parseTiff(buf, tiffStart, end) {
  const v = new DataView(buf);
  const bo = v.getUint16(tiffStart);
  const le = bo === 0x4949; // 'II' = little endian
  if (!le && bo !== 0x4D4D) return null;
  const u16 = (p) => v.getUint16(p, le), u32 = (p) => v.getUint32(p, le), s32 = (p) => v.getInt32(p, le);
  if (u16(tiffStart + 2) !== 42) return null;
  const out = { make: null, model: null, lens: null, fNumber: null, exposureTime: null, iso: null, ec: null, focal: null, program: null };
  const ascii = (p, n) => { let s = ''; for (let i = 0; i < n; i++) { const c = v.getUint8(p + i); if (!c) break; s += String.fromCharCode(c); } return s.trim(); };

  function readIfd(ifdOff) {
    if (ifdOff + 2 > end) return;
    const n = u16(ifdOff);
    for (let i = 0; i < n; i++) {
      const e = ifdOff + 2 + i * 12;
      if (e + 12 > end) return;
      const tag = u16(e), type = u16(e + 2), count = u32(e + 4);
      const name = EXIF_TAGS[tag];
      if (!name) continue;
      const size = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }[type] || 1;
      const total = size * count;
      const p = total > 4 ? tiffStart + u32(e + 8) : e + 8;
      if (p + total > buf.byteLength) continue;
      let val = null;
      if (type === 2) val = ascii(p, count);
      else if (type === 3) val = u16(p);
      else if (type === 4) val = u32(p);
      else if (type === 5) { const d = u32(p + 4); val = d ? u32(p) / d : null; }
      else if (type === 10) { const d = s32(p + 4); val = d ? s32(p) / d : null; }
      if (name === 'exifIfd') { if (typeof val === 'number') readIfd(tiffStart + val); continue; }
      if (name === 'program') val = EXIF_PROGRAM[val] || (val == null ? null : 'other');
      if (name === 'ec' && typeof val === 'number') val = Math.round(val * 10) / 10;
      if (name === 'fNumber' && typeof val === 'number') val = Math.round(val * 10) / 10;
      if (out[name] == null) out[name] = val;
    }
  }
  readIfd(tiffStart + u32(tiffStart + 4));
  return out;
}
