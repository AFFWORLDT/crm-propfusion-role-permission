import axios from 'axios';
import { useState } from 'react'

function Apifi() {
    const [actorId, setActorId] = useState("InQrBmnR5hUGk1qze");
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!actorId.trim() || !url.trim()) {
      setError("Actor ID and URL are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const API_TOKEN = import.meta.env.VITE_APIFY_API_TOKEN || "your_apify_token_here";
      const BASE_URL = `https://api.apify.com/v2/actors/${actorId}/runs`;

      const response = await axios.post(
        `${BASE_URL}?token=${API_TOKEN}`,
        { input: { url } },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Apify Actor Data Fetcher</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter Actor ID"
            value={actorId}
            onChange={(e) => setActorId(e.target.value)}
            style={{ marginRight: "10px", padding: "8px", width: "300px" }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ marginRight: "10px", padding: "8px", width: "300px" }}
          />
        </div>
        <button type="submit" style={{ marginTop: "10px", padding: "8px 15px" }}>
          Fetch Data
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "20px" }}>
          <h2>Actor Run Results</h2>
          <pre style={{ background: "#f4f4f4", padding: "15px" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Apifi
