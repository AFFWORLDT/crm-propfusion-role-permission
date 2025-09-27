import { useState, useEffect, useRef } from "react";
import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";

// Gemini API key लाने का function
async function fetchGeminiApiKey() {
  // Token निकालने का तरीका (cookies और localStorage दोनों से)
  let token = null;
  const cookies = new Cookies();
  const cookieUser = cookies.get("USER");
  if (cookieUser?.access_token) token = cookieUser.access_token;
  if (!token) {
    const localUser = localStorage.getItem("CRMUSER");
    if (localUser) {
      try {
        token = JSON.parse(localUser)?.access_token;
      } catch { /* ignore */ }
    }
  }
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(`${getApiUrl()}/ai/get_gemini_api_key`, {
    headers: {
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data.apiKey;
}

// Gemini से chat completion लाने का function
async function fetchGeminiResponse(apiKey, messages) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          ...messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        ],
      }),
    }
  );
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}

export default function GeminiChat() {
  const [messages, setMessages] = useState([
    { role: "user", text: "Hi, I am real estate admin. How can you help me?" },
    { role: "model", text: "नमस्ते! मैं Gemini AI हूँ, आपकी real estate queries में मदद के लिए तैयार हूँ." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    fetchGeminiApiKey().then(setApiKey).catch(() => setApiKey(""));
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = await fetchGeminiResponse(apiKey, newMessages);
      setMessages([...newMessages, { role: "model", text: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "model", text: "AI से जवाब लाने में दिक्कत आ रही है." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", minHeight: 600, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1.2rem 2rem", borderBottom: "1px solid #eee", fontWeight: 700, fontSize: "1.3rem", background: "#f7f8fa", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        Gemini AI Chat (Admin)
      </div>
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "1.2rem 2rem", background: "#f9f9fb" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: "0.7rem 0",
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            <div style={{
              background: msg.role === "user" ? "#e0e7ff" : "#f1f5f9",
              color: "#222",
              borderRadius: 16,
              padding: "0.7rem 1.1rem",
              maxWidth: 320,
              fontSize: "1.08rem",
              boxShadow: msg.role === "user" ? "0 1px 4px #a5b4fc33" : "0 1px 4px #cbd5e133"
            }}>{msg.text}</div>
          </div>
        ))}
        {loading && <div style={{ color: "#888", fontSize: "1.1rem", margin: "0.7rem 0" }}>AI typing...</div>}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid #eee", padding: "1rem 2rem", background: "#fafbfc", borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, fontSize: "1.08rem", border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.7rem 1.1rem", outline: "none" }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{ marginLeft: 12, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "0.7rem 1.5rem", fontWeight: 600, fontSize: "1.08rem", cursor: loading ? "not-allowed" : "pointer" }}>
          Send
        </button>
      </form>
    </div>
  );
} 