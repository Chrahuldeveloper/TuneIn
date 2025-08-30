import { useEffect, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

    // use async/await 
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

  console.log(token)

  // use async/await 
  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("Error fetching user:", err));

      fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setPlaylists(data.items || []))
        .catch((err) => console.error("Error fetching playlists:", err));

      fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.status === 204 ? null : res.json()))
        .then((data) => console.log(data))
        .catch((err) => console.error("Error fetching current track:", err));
    }
  }, [token]);

  return (
    <div className="text-black text-center mt-20">
      {user ? (
        <>
          <h1 className="text-3xl font-bold">
            Welcome, {user.display_name} 🎵
          </h1>
          <p>Email: {user.email}</p>

          {/* Currently Playing */}
          {currentTrack && currentTrack.item ? (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Currently Playing 🎧</h2>
              <p>
                {currentTrack.item.name} -{" "}
                {currentTrack.item.artists.map((a: any) => a.name).join(", ")}
              </p>
            </div>
          ) : (
            <p className="mt-6">No song playing right now</p>
          )}

          {/* Playlists */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold">Your Playlists 📂</h2>
            <ul className="mt-4 space-y-2">
              {playlists.map((pl) => (
                <li key={pl.id}>{pl.name}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <h1 className="text-2xl">Loading your Spotify profile...</h1>
      )}
    </div>
  );
}
