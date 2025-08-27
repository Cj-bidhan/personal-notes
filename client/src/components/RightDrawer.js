//utilities tucked into the right drawer. Currency uses exchangerate.host free API. Date conversion is left as optional with a hint to install the Nepali converter package for AD↔BS.

import React, { useEffect, useState } from "react";

function ClockTab() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <div className="card">
      <h4>Clock</h4>
      <div style={{ fontSize: 28 }}>{now.toLocaleTimeString()}</div>
      <div style={{ color: "var(--muted)" }}>{now.toLocaleDateString()}</div>
    </div>
  );
}

function DateTab() {
  // If you want AD<->BS conversion, run: npm install @sbmdkl/nepali-date-converter
  const [ad, setAd] = useState("");
  const [bs, setBs] = useState("");
  useEffect(() => { setBs(""); }, []);
  return (
    <div className="card">
      <h4>Date Converter (AD → BS)</h4>
      <input className="input" type="date" value={ad} onChange={e => setAd(e.target.value)} />
      <div style={{ marginTop: 8, color: "var(--muted)" }}>{bs || "(install @sbmdkl/nepali-date-converter to convert)"}</div>
    </div>
  );
}

function CurrencyTab() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NPR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function convert() {
    setLoading(true);
    try {
      const url = `https://api.exchangerate.host/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`;
      const res = await fetch(url);
      const j = await res.json();
      setResult(j.result ?? null);
    } catch (e) {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { convert(); }, []); // initial

  return (
    <div className="card">
      <h4>Currency</h4>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input className="input" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} style={{ width: 90 }} />
        <select value={from} onChange={e => setFrom(e.target.value)} className="input"><option>USD</option><option>NPR</option><option>EUR</option><option>INR</option></select>
        <span>→</span>
        <select value={to} onChange={e => setTo(e.target.value)} className="input"><option>NPR</option><option>USD</option><option>EUR</option><option>INR</option></select>
        <button className="btn" onClick={convert}>{loading ? "…" : "Convert"}</button>
      </div>

      <div style={{ marginTop: 10, fontSize: 20 }}>
        {result !== null ? `${Number(result).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}` : <span style={{ color: "var(--muted)" }}>—</span>}
      </div>
      <small style={{ color: "var(--muted)" }}>For production, proxy and cache rates via backend for reliability & metrics.</small>
    </div>
  );
}

export default function RightDrawer() {
  const [tab, setTab] = useState("clock");
  return (
    <aside className="right-drawer">
      <div className="card" style={{ padding: 10 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button className="btn" onClick={() => setTab("clock")} aria-pressed={tab==="clock"}>Clock</button>
          <button className="btn" onClick={() => setTab("date")} aria-pressed={tab==="date"}>Date</button>
          <button className="btn" onClick={() => setTab("currency")} aria-pressed={tab==="currency"}>Currency</button>
        </div>

        <div>
          {tab === "clock" && <ClockTab />}
          {tab === "date" && <DateTab />}
          {tab === "currency" && <CurrencyTab />}
        </div>
      </div>
    </aside>
  );
}
