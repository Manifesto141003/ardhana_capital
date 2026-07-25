import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const rupiah = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');
const rupiahShort = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1e9) return 'Rp' + (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'M';
  if (abs >= 1e6) return 'Rp' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'jt';
  if (abs >= 1e3) return 'Rp' + (n / 1e3).toFixed(0) + 'rb';
  return 'Rp' + Math.round(n);
};

const simulate = (P0, D, rPct, n, withDeposit) => {
  const r = rPct / 100;
  const rows = [{ bulan: 0, setoran: P0, bunga: 0, saldo: P0 }];
  let saldo = P0;

  for (let t = 1; t <= n; t += 1) {
    const setoran = withDeposit ? D : 0;
    const saldoAwal = saldo + setoran;
    const bunga = saldoAwal * r;
    saldo = saldoAwal + bunga;
    rows.push({ bulan: t, setoran, bunga, saldo });
  }

  return rows;
};

const toYearly = (rows, n) => {
  const years = Math.ceil(n / 12);
  const out = [];

  for (let y = 1; y <= years; y += 1) {
    const from = (y - 1) * 12 + 1;
    const to = Math.min(y * 12, n);
    let setoran = 0;
    let bunga = 0;

    for (let t = from; t <= to; t += 1) {
      setoran += rows[t].setoran;
      bunga += rows[t].bunga;
    }

    out.push({ tahun: y, setoran, bunga, saldo: rows[to].saldo });
  }

  return out;
};

const niceMax = (v) => {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  let m;
  if (n <= 1) m = 1;
  else if (n <= 2) m = 2;
  else if (n <= 5) m = 5;
  else m = 10;
  return m * pow;
};

export const FAQPerhitunganBunga = () => {
  const [p0, setP0] = useState(10000000);
  const [pd, setPd] = useState(1000000);
  const [pr, setPr] = useState(1);
  const [pn, setPn] = useState(24);
  const [tab, setTab] = useState('A');
  const [view, setView] = useState('monthly');
  const [hoverState, setHoverState] = useState({ visible: false, index: 0, left: 0, top: 0 });

  const svgRef = useRef(null);
  const wrapRef = useRef(null);

  const safePn = Math.max(1, Math.min(600, Math.round(pn)));
  const rowsA = useMemo(() => simulate(p0, 0, pr, safePn, false), [p0, pr, safePn]);
  const rowsB = useMemo(() => simulate(p0, pd, pr, safePn, true), [p0, pd, pr, safePn]);

  const totalA = rowsA[safePn].saldo;
  const totalB = rowsB[safePn].saldo;
  const bungaA = totalA - p0;
  const setoranB = rowsB.reduce((sum, row) => sum + row.setoran, 0);
  const bungaB = totalB - setoranB;
  const diff = totalB - totalA;
  const diffPct = totalA > 0 ? (diff / totalA) * 100 : 0;
  const years = Math.floor(safePn / 12);
  const months = safePn % 12;
  const nHint = `= ${years > 0 ? `${years} tahun ` : ''}${months > 0 ? `${months} bulan` : ''}`.trim();
  const chartMax = niceMax(Math.max(totalA, totalB));

  const W = 800;
  const H = 340;
  const padL = 64;
  const padR = 16;
  const padT = 16;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xAt = (i) => padL + (plotW * i) / safePn;
  const yAt = (v) => padT + plotH - (plotH * v) / chartMax;

  const pathFor = (rows) => rows
    .slice(0, safePn + 1)
    .map((row, index) => `${index === 0 ? 'M' : 'L'}${xAt(index).toFixed(1)},${yAt(row.saldo).toFixed(1)}`)
    .join(' ');

  const pathA = pathFor(rowsA);
  const pathB = pathFor(rowsB);

  const tableRows = view === 'monthly'
    ? rowsA.map((row) => row)
    : toYearly(tab === 'A' ? rowsA : rowsB, safePn);

  const selectedRows = tab === 'A' ? rowsA : rowsB;
  const totalSetoran = view === 'monthly'
    ? selectedRows.reduce((sum, row) => sum + row.setoran, 0)
    : toYearly(selectedRows, safePn).reduce((sum, row) => sum + row.setoran, 0);
  const totalBunga = view === 'monthly'
    ? selectedRows.reduce((sum, row) => sum + row.bunga, 0)
    : toYearly(selectedRows, safePn).reduce((sum, row) => sum + row.bunga, 0);

  const updateHover = (event) => {
    if (!svgRef.current || !wrapRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    let i = Math.round(((mx - padL) / plotW) * safePn);
    i = Math.max(0, Math.min(safePn, i));

    const x = xAt(i);
    const y = yAt((tab === 'A' ? rowsA[i] : rowsB[i]).saldo);
    const tooltipLeft = Math.min(event.clientX - wrapRect.left + 12, wrapRect.width - 170);
    const tooltipTop = Math.max(event.clientY - wrapRect.top - 70, 0);

    setHoverState({ visible: true, index: i, left: tooltipLeft, top: tooltipTop });
  };

  const hideHover = () => setHoverState((value) => ({ ...value, visible: false }));

  return (
    <div className="faq-bunga-app">
      <style>{`
        /* NOTE: top padding bumped from 32px -> 110px (14px 60px unchanged) so the
           masthead/eyebrow pill clears the fixed/sticky site navbar on this page.
           Adjust the 110px if your navbar's real rendered height differs
           (check DevTools > select navbar element > Computed > height, then add ~8-16px buffer). */
        .faq-bunga-app{ --navy-deep:hsl(215 24% 10%); --navy-mid:hsl(215 22% 12%); --card-1:hsl(215 22% 11%); --card-2:hsl(215 19% 9%); --border-soft: rgba(255,255,255,0.08); --brand:#A67D32; --brand-soft: rgba(166,125,50,0.12); --brand-strong:#BFAA6B; --chart-orange:#C98A3E; --chart-orange-soft: rgba(201,138,62,0.14); --chart-green:#6FA98A; --neon: rgba(255, 217, 106, 0.88); --text-hi:#FFFFFF; --text-lo: rgba(255,255,255,0.72); --text-faint: rgba(255,255,255,0.55); --font-display:'Lora', Georgia, serif; --font-mono:'IBM Plex Mono', 'Courier New', monospace; --font-sans:'Inter', -apple-system, sans-serif; background-color: #020617; background-image: radial-gradient(circle at 65% 5%, rgba(255,255,255,0.03), transparent 24%), radial-gradient(circle at 6% 20%, rgba(255,255,255,0.02), transparent 18%); min-height:100vh; padding: 110px 14px 60px; color: var(--text-hi); font-family: var(--font-sans); }
        .faq-bunga-app *{ box-sizing:border-box; }
        .faq-bunga-app .page{ max-width: 980px; margin: 0 auto; }
        .faq-bunga-app .masthead{ display:flex; flex-direction:column; align-items:center; text-align:center; gap: 12px; padding: 6px 8px 28px; }
        .faq-bunga-app .eyebrow-pill{ display:inline-flex; align-items:center; font-family: var(--font-mono); font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; font-size: 10.5px; color: var(--brand); background: var(--brand-soft); border: 1px solid rgba(255,255,255,0.16); padding: 7px 16px; border-radius: 999px; }
        .faq-bunga-app .masthead h1{ font-family: var(--font-display); font-weight: 700; font-size: clamp(24px, 4vw, 34px); margin: 0; letter-spacing: 0.01em; }
        .faq-bunga-app .masthead h1 .grad{ background: linear-gradient(90deg, var(--brand), var(--text-hi)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .faq-bunga-app .masthead p{ font-size: 14px; color: var(--text-lo); margin: 0; max-width: 560px; line-height: 1.55; }
        .faq-bunga-app .panel{ position: relative; background: rgba(13,19,32,0.95); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; box-shadow: 0 30px 70px -34px rgba(0,0,0,0.7); padding: 32px 30px 14px; overflow: hidden; }
        .faq-bunga-app .panel::before{ content:''; position:absolute; top:0; left:0; right:0; height:3px; background: linear-gradient(90deg, var(--brand), var(--brand-strong)); }
        .faq-bunga-app .section-label{ font-family: var(--font-mono); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--brand); margin: 0 0 14px; display:flex; align-items:center; gap:10px; }
        .faq-bunga-app .section-label::after{ content:''; flex:1; height:1px; background: var(--border-soft); }
        .faq-bunga-app .inputs{ display:grid; grid-template-columns: repeat(4, 1fr); gap: 16px 18px; margin-bottom: 10px; }
        @media (max-width: 720px){ .faq-bunga-app .inputs{ grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 420px){ .faq-bunga-app .inputs{ grid-template-columns: 1fr; } }
        .faq-bunga-app .field label{ display:block; font-size: 12.5px; font-weight: 600; color: var(--text-lo); margin-bottom: 7px; }
        .faq-bunga-app .field .input-wrap{ display:flex; align-items:center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; padding: 10px 12px; transition: border-color .15s, box-shadow .15s; }
        .faq-bunga-app .field .input-wrap:focus-within{ border-color: var(--brand); box-shadow: 0 0 0 3px rgba(166,125,50,0.12); }
        .faq-bunga-app .field .prefix{ font-family: var(--font-mono); font-size: 13px; color: var(--text-faint); margin-right: 6px; }
        .faq-bunga-app .field input{ border:none; outline:none; background:transparent; font-family: var(--font-mono); font-size: 14.5px; color: var(--text-hi); width: 100%; appearance: textfield; }
        .faq-bunga-app .field input::-webkit-outer-spin-button, .faq-bunga-app .field input::-webkit-inner-spin-button{ -webkit-appearance:none; appearance:none; margin:0; }
        .faq-bunga-app .field .hint{ font-size: 11px; color: var(--text-faint); margin-top: 6px; font-style: italic; }
        .faq-bunga-app details.assumptions{ margin: 16px 0 28px; font-size: 13px; color: var(--text-lo); background: rgba(255,255,255,0.03); border: 1px dashed var(--border-soft); border-radius: 10px; padding: 11px 15px; }
        .faq-bunga-app details.assumptions summary{ cursor:pointer; font-weight:600; color: var(--brand); font-family: var(--font-sans); }
        .faq-bunga-app details.assumptions ul{ margin: 10px 0 4px; padding-left: 18px; line-height:1.65; }
        .faq-bunga-app details.assumptions code{ font-family: var(--font-mono); background: rgba(255,255,255,0.07); color: var(--text-hi); padding:1px 5px; border-radius:4px; }
        .faq-bunga-app .stamps{ display:grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 10px 0 26px; }
        @media (max-width:640px){ .faq-bunga-app .stamps{ grid-template-columns: 1fr; } }
        .faq-bunga-app .stamp{ position:relative; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 20px; background: rgba(255,255,255,0.02); }
        .faq-bunga-app .stamp .tag{ display:inline-block; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 11px; border-radius: 999px; margin-bottom: 12px; }
        .faq-bunga-app .stamp.a .tag{ color: var(--chart-orange); border:1px solid rgba(255,255,255,0.18); background: var(--chart-orange-soft); }
        .faq-bunga-app .stamp.b .tag{ color: var(--chart-green); border:1px solid rgba(255,255,255,0.18); background: rgba(111,169,138,0.16); }
        .faq-bunga-app .stamp h3{ font-family: var(--font-display); margin: 0 0 10px; font-size: 16px; color: var(--text-hi); font-weight: 600; }
        .faq-bunga-app .stamp .total{ font-family: var(--font-mono); font-weight:600; font-size: clamp(20px, 3vw, 26px); }
        .faq-bunga-app .stamp.a .total{ color: var(--chart-orange); }
        .faq-bunga-app .stamp.b .total{ color: var(--chart-green); }
        .faq-bunga-app .stamp .breakdown{ margin-top:12px; padding-top:12px; border-top: 1px solid var(--border-soft); font-family: var(--font-mono); font-size: 12px; color: var(--text-lo); line-height:1.8; }
        .faq-bunga-app .stamp .breakdown b{ color: var(--text-hi); }
        /* Small + darker text: emphasize by bolding and switching to neon brand accent */
        .faq-bunga-app .field .hint,
        .faq-bunga-app details.assumptions,
        .faq-bunga-app .legend,
        .faq-bunga-app tbody td,
        .faq-bunga-app .disclaimer,
        .faq-bunga-app .stamp .tag{
          color: var(--neon) !important;
          font-weight: 700 !important;
          text-shadow: 0 0 6px rgba(255, 217, 106, 0.25);
          -webkit-font-smoothing:antialiased;
        }
        .faq-bunga-app .diff-note{ text-align:center; font-family: var(--font-sans); font-size: 13px; color: var(--text-lo); margin: -12px 0 28px; line-height:1.6; }
        .faq-bunga-app .diff-note b{ color: var(--brand); }
        .faq-bunga-app .chart-card{ margin-bottom: 30px; }
        .faq-bunga-app .legend{ display:flex; gap:18px; font-size:12.5px; color: var(--text-lo); margin-bottom: 8px; font-family: var(--font-sans); }
        .faq-bunga-app .legend span{ display:flex; align-items:center; gap:6px; }
        .faq-bunga-app .legend i{ width:14px; height:3px; display:inline-block; border-radius:2px; }
        .faq-bunga-app .legend .a i{ background: var(--chart-orange); }
        .faq-bunga-app .legend .b i{ background: var(--chart-green); }
        .faq-bunga-app #chartWrap{ position:relative; }
        .faq-bunga-app #tooltip{ position:absolute; pointer-events:none; background: rgba(0,0,0,0.72); color: var(--text-hi); font-family: var(--font-mono); font-size: 11.5px; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); line-height:1.6; box-shadow: 0 10px 24px rgba(0,0,0,0.4); opacity:0; transition: opacity .1s; white-space: nowrap; z-index:5; }
        .faq-bunga-app .toolbar{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom: 14px; }
        .faq-bunga-app .tabs{ display:flex; gap: 8px; }
        .faq-bunga-app .tabs button, .faq-bunga-app .view-toggle button{ font-family: var(--font-sans); font-weight:600; font-size: 12.5px; padding: 8px 15px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: var(--text-lo); cursor:pointer; transition: all .12s; }
        .faq-bunga-app .tabs button.active.a{ background: var(--brand); color: #000; border-color: var(--brand); }
        .faq-bunga-app .tabs button.active.b{ background: var(--brand-strong); color: #000; border-color: var(--brand-strong); }
        .faq-bunga-app .view-toggle{ margin-left:auto; display:flex; gap:6px; }
        .faq-bunga-app .view-toggle button.active{ background: var(--brand); color: #000; border-color: var(--brand); }
        .faq-bunga-app .table-wrap{ max-height: 380px; overflow:auto; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; background: rgba(255,255,255,0.025); margin-bottom: 10px; }
        .faq-bunga-app table{ width:100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 12.5px; }
        .faq-bunga-app thead th{ position:sticky; top:0; background: hsl(215 22% 11%); color: var(--text-hi); text-align:right; padding: 10px 12px; font-weight:600; font-size: 11px; letter-spacing:0.04em; text-transform:uppercase; }
        .faq-bunga-app thead th:first-child, .faq-bunga-app tbody td:first-child{ text-align:left; }
        .faq-bunga-app tbody td{ padding: 7px 12px; text-align:right; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--text-lo); }
        .faq-bunga-app tbody tr:nth-child(even){ background: rgba(255,255,255,0.02); }
        .faq-bunga-app tfoot td{ padding: 10px 12px; text-align:right; font-weight:700; color: var(--text-hi); border-top: 2px solid var(--brand); background: var(--brand-soft); }
        .faq-bunga-app .disclaimer{ font-size: 11.5px; color: var(--text-faint); text-align:center; padding: 18px 10px 26px; line-height:1.6; }
      `}</style>

      <div className="page">
        <div className="masthead">
          <span className="eyebrow-pill">Simulasi · Bukan Nasihat Keuangan</span>
          <h1>Simulasi Buku Tabungan <span className="grad">Digital</span></h1>
          <p>Bandingkan hasil <b>deposit sekali di awal</b> vs <b>deposit rutin tiap bulan</b> dengan bunga majemuk. Isi angka di bawah — tabel dan grafik akan otomatis diperbarui.</p>
        </div>

        <div className="panel">
          <div className="section-label">Data Simulasi</div>
          <div className="inputs">
            <div className="field">
              <label htmlFor="p0">Modal Awal</label>
              <div className="input-wrap"><span className="prefix">Rp</span><input id="p0" type="number" min="0" step="100000" value={p0} onChange={(e) => setP0(Math.max(0, Number(e.target.value) || 0))} /></div>
              <div className="hint">Dipakai di kedua skenario</div>
            </div>
            <div className="field">
              <label htmlFor="pd">Setoran / Bulan</label>
              <div className="input-wrap"><span className="prefix">Rp</span><input id="pd" type="number" min="0" step="100000" value={pd} onChange={(e) => setPd(Math.max(0, Number(e.target.value) || 0))} /></div>
              <div className="hint">Hanya untuk skenario deposit bulanan</div>
            </div>
            <div className="field">
              <label htmlFor="pr">Bunga / Bulan</label>
              <div className="input-wrap"><input id="pr" type="number" min="0" step="0.05" value={pr} onChange={(e) => setPr(Math.max(0, Number(e.target.value) || 0))} /><span className="prefix">%</span></div>
              <div className="hint">Silakan isi sesuai asumsi Anda</div>
            </div>
            <div className="field">
              <label htmlFor="pn">Jangka Waktu</label>
              <div className="input-wrap"><input id="pn" type="number" min="1" step="1" value={pn} onChange={(e) => setPn(Math.max(1, Math.min(600, Number(e.target.value) || 1)))} /><span className="prefix">bulan</span></div>
              <div className="hint">{nHint}</div>
            </div>
          </div>

          <details className="assumptions">
            <summary>Lihat asumsi & rumus perhitungan</summary>
            <ul>
              <li><b>Skenario A — Deposit Sekali:</b> hanya Modal Awal yang berkembang. Setiap bulan, saldo dikalikan <code>(1 + r)</code>. Rumus tertutup: <code>Saldo Akhir = Modal Awal × (1 + r)^n</code>.</li>
              <li><b>Skenario B — Deposit Bulanan:</b> Modal Awal + setoran rutin tiap bulan. Asumsi setoran masuk di <u>awal bulan</u>, lalu bunga bulan itu dihitung dari saldo termasuk setoran tersebut (dikenal sebagai <i>annuity due</i>), baru digabung ke pokok bulan berikutnya.</li>
              <li>Bunga dihitung sebagai bunga majemuk bulanan sederhana (bukan bunga harian), dan diasumsikan tetap (flat) sepanjang periode — belum memperhitungkan pajak bunga, biaya admin, atau perubahan suku bunga di dunia nyata.</li>
              <li><code>r</code> = bunga per bulan (desimal), <code>n</code> = jumlah bulan.</li>
            </ul>
          </details>

          <div className="section-label">Ringkasan Hasil</div>
          <div className="stamps">
            <div className="stamp a">
              <div className="tag">Skenario A</div>
              <h3>Deposit Sekali</h3>
              <div className="total">{rupiah(totalA)}</div>
              <div className="breakdown">
                Modal awal: <b>{rupiah(p0)}</b><br />
                Total bunga: <b>{rupiah(bungaA)}</b>
              </div>
            </div>
            <div className="stamp b">
              <div className="tag">Skenario B</div>
              <h3>Deposit Tiap Bulan</h3>
              <div className="total">{rupiah(totalB)}</div>
              <div className="breakdown">
                Total setoran: <b>{rupiah(setoranB)}</b><br />
                Total bunga: <b>{rupiah(bungaB)}</b>
              </div>
            </div>
          </div>
          <p className="diff-note">Setelah {safePn} bulan, Skenario B unggul <b>{rupiah(Math.abs(diff))}</b> {diff >= 0 ? 'lebih tinggi' : 'lebih rendah'} dibanding Skenario A ({diffPct.toFixed(1)}%) — karena setoran rutin menambah pokok yang ikut berbunga.</p>

          <div className="section-label">Grafik Pertumbuhan Saldo</div>
          <div className="chart-card">
            <div className="legend">
              <span className="a"><i /> Deposit Sekali</span>
              <span className="b"><i /> Deposit Bulanan</span>
            </div>
            <div id="chartWrap" ref={wrapRef}>
              <svg id="chart" ref={svgRef} viewBox="0 0 800 340" width="100%" height="340">
                {[...Array(6).keys()].map((tick) => {
                  const val = (chartMax * tick) / 5;
                  const y = yAt(val);
                  return (
                    <g key={`grid-${tick}`}>
                      <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                      <text x={padL - 8} y={y + 4} textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="10.5" fill="#93A0BD">
                        {rupiahShort(val)}
                      </text>
                    </g>
                  );
                })}
                {[...Array(Math.ceil(safePn / (safePn > 60 ? 12 : safePn > 24 ? 6 : safePn > 12 ? 3 : 1)) + 1).keys()].map((step) => {
                  const i = Math.min(step * (safePn > 60 ? 12 : safePn > 24 ? 6 : safePn > 12 ? 3 : 1), safePn);
                  const x = xAt(i);
                  return (
                    <text key={`x-${i}`} x={x} y={H - padB + 16} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#93A0BD">
                      {i}
                    </text>
                  );
                })}
                <path d={pathA} fill="none" stroke="var(--chart-orange)" strokeWidth="2.5" />
                <path d={pathB} fill="none" stroke="var(--chart-green)" strokeWidth="2.5" />
                {hoverState.visible && (
                  <>
                    <line x1={xAt(hoverState.index)} x2={xAt(hoverState.index)} y1={padT} y2={H - padB} stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx={xAt(hoverState.index)} cy={yAt(rowsA[hoverState.index].saldo)} r="4" fill="var(--chart-orange)" />
                    <circle cx={xAt(hoverState.index)} cy={yAt(rowsB[hoverState.index].saldo)} r="4" fill="var(--chart-green)" />
                  </>
                )}
                <rect x={padL} y={padT} width={plotW} height={plotH} fill="transparent" onMouseMove={updateHover} onMouseLeave={hideHover} />
              </svg>
              <div id="tooltip" style={{ left: hoverState.left, top: hoverState.top, opacity: hoverState.visible ? 1 : 0 }}>
                <div dangerouslySetInnerHTML={{ __html: `Bulan ke-${hoverState.index}<br/>A: ${rupiah(rowsA[hoverState.index]?.saldo || 0)}<br/>B: ${rupiah(rowsB[hoverState.index]?.saldo || 0)}` }} />
              </div>
            </div>
          </div>

          <div className="section-label">Rincian Bulanan</div>
          <div className="toolbar">
            <div className="tabs">
              <button type="button" id="tabA" className={`a${tab === 'A' ? ' active' : ''}`} onClick={() => setTab('A')}>Skenario A — Sekali</button>
              <button type="button" id="tabB" className={`b${tab === 'B' ? ' active' : ''}`} onClick={() => setTab('B')}>Skenario B — Bulanan</button>
            </div>
            <div className="view-toggle">
              <button type="button" id="viewMonthly" className={view === 'monthly' ? 'active' : ''} onClick={() => setView('monthly')}>Bulanan</button>
              <button type="button" id="viewYearly" className={view === 'yearly' ? 'active' : ''} onClick={() => setView('yearly')}>Tahunan</button>
            </div>
          </div>
          <div className="table-wrap">
            <table id="tbl">
              <thead>
                <tr id="tblHead">
                  <th>{view === 'monthly' ? 'Bulan' : 'Tahun'}</th>
                  <th>{view === 'monthly' ? 'Setoran' : 'Total Setoran'}</th>
                  <th>{view === 'monthly' ? 'Bunga' : 'Total Bunga'}</th>
                  <th>{view === 'monthly' ? 'Saldo Akhir' : 'Saldo Akhir Tahun'}</th>
                </tr>
              </thead>
              <tbody id="tblBody">
                {view === 'monthly'
                  ? selectedRows.slice(1).map((row) => (
                    <tr key={row.bulan}>
                      <td>{row.bulan}</td>
                      <td>{rupiah(row.setoran)}</td>
                      <td>{rupiah(row.bunga)}</td>
                      <td>{rupiah(row.saldo)}</td>
                    </tr>
                  ))
                  : toYearly(selectedRows, safePn).map((row) => (
                    <tr key={row.tahun}>
                      <td>Th. {row.tahun}</td>
                      <td>{rupiah(row.setoran)}</td>
                      <td>{rupiah(row.bunga)}</td>
                      <td>{rupiah(row.saldo)}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr id="tblFoot">
                  <td>Total</td>
                  <td>{rupiah(totalSetoran)}</td>
                  <td>{rupiah(totalBunga)}</td>
                  <td>{rupiah(selectedRows[safePn].saldo)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="disclaimer">Alat ini hanya untuk simulasi dan edukasi, bukan nasihat keuangan. Hasil aktual dapat berbeda karena pajak, biaya administrasi, dan perubahan suku bunga. Selalu verifikasi ulang dengan pihak bank/lembaga keuangan terkait.</p>
          <div className="mt-6 text-center">
            <Link to="/faq" className="inline-flex items-center rounded-full border border-[#A67D32]/30 bg-[#A67D32] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#BFAA6B]">
              Kembali ke FAQ overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};