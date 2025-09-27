import React, { useState } from "react";

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "AED", name: "UAE Dirham" },
  { code: "INR", name: "Indian Rupee" },
  { code: "GBP", name: "British Pound" },
  { code: "PKR", name: "Pakistani Rupee" },
  // Add more as needed
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("AED");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConvert(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Use a free API for demonstration (replace with your backend if needed)
      const res = await fetch(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
      );
      const data = await res.json();
      if (!data.result) throw new Error("Conversion failed");
      setResult(data.result);
    } catch (err) {
      setError("Could not fetch conversion rate.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/icons/wallet.svg" alt="Currency Icon" style={{ width: 28, height: 28 }} /> Currency Converter
      </h2>
      <form onSubmit={handleConvert} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          Amount
          <input
            type="number"
            value={amount}
            min={0}
            step={0.01}
            onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </label>
        <label>
          From
          <select value={from} onChange={e => setFrom(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }}>
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
            ))}
          </select>
        </label>
        <label>
          To
          <select value={to} onChange={e => setTo(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4 }}>
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
            ))}
          </select>
        </label>
        <button type="submit" style={{ padding: 10, background: "#1a365d", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600 }} disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 24, fontSize: 18, fontWeight: 600 }}>
          Result: {amount} {from} = {result} {to}
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
    </div>
  );
} 