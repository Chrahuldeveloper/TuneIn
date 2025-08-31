import { useEffect, useState } from "react";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const getToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      const codeVerifier = localStorage.getItem("code_verifier") || "";

      const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      });

      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem("spotify_token", data.access_token);

      window.history.replaceState({}, document.title, "/dashboard");
    } else {
      const storedToken = localStorage.getItem("spotify_token");
      if (storedToken) setToken(storedToken);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const getData = async (token: string) => {
    if (!token) return;

    try {
      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());
      setUser(userRes);

      const playlistsRes = await fetch(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((res) => res.json());
      setPlaylists(playlistsRes.items || []);

      const trackRes = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (trackRes.status === 204) {
        setCurrentTrack(null);
      } else if (trackRes.status === 401) {
        console.error("Token missing permission");
      } else {
        const data = await trackRes.json();
        console.log(data);
        setCurrentTrack(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) getData(token);
  }, [token]);

  return (
    <div className="text-black text-center mt-20">
      {user ? (
        <>
          <h1 className="text-3xl font-bold">
            Welcome, {user.display_name} 🎵
          </h1>
          <p>Email: {user.email}</p>

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
