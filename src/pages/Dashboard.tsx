import { useEffect, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      const codeVerifier = localStorage.getItem("code_verifier");

      const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier || "",
      });

      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      })
        .then((res) => res.json())
        .then((data) => {
          setToken(data.access_token);
          localStorage.setItem("spotify_token", data.access_token);
          window.history.replaceState({}, document.title, "/dashboard");
        })
        .catch((err) => console.error("Error exchanging code:", err));
    } else {
      const storedToken = localStorage.getItem("spotify_token");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [token]);

  return (
    <div className="text-white text-center mt-20">
      {user ? (
        <>
          <h1 className="text-3xl font-bold">
            Welcome, {user.display_name} 🎵
          </h1>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <h1 className="text-2xl">Loading your Spotify profile...</h1>
      )}
    </div>
  );
}
