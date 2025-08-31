import { useEffect, useState } from "react";
import { Navbar } from "../components";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { IoCodeSlashOutline } from "react-icons/io5";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";

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
      });

      const userResponse = await userRes.json();
      setUser(userResponse);

      const playlistsRes = await fetch(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const playlistsResponse = await playlistsRes.json();
      setPlaylists(playlistsResponse.items || []);

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
    <div className=" bg-[#111216] w-full h-screen  overflow-y-none ">
      <Navbar />

      <div className="text-center my-10 space-y-5">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Dashboard</h1>
        <p className="text-lg font-semibold text-[#989fab]">
          Customize your Spotify widget and generate embed code
        </p>
      </div>

      <div>
        <div className="bg-[#111216] w-full  flex justify-center  p-6">
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="space-y-4 bg-[#1f2228] p-5 rounded-lg">
              <div className="flex items-center space-x-3">
                <IoColorPaletteOutline size={25} color="#00a63e" />
                <h1 className="text-white font-semibold">Widget Style</h1>
              </div>
              <div className="hover:border-green-500 border-[1px] transition-colors cursor-pointer rounded-lg border border-[#2a2d34] px-4 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <FaRegChartBar size={25} color="#00a63e" />
                  <div>
                    <h2 className="text-white font-semibold">Compact Card</h2>
                    <p className="text-[#989fab] text-sm">
                      Clean and minimal design
                    </p>
                  </div>
                </div>
                <span className="text-[#989fab] text-sm">120×80px</span>
              </div>

              <div className="hover:border-green-500 border-[1px] transition-colors cursor-pointer rounded-lg border border-[#2a2d34] px-4 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <IoCodeSlashOutline size={25} color="#00a63e" />
                  <div>
                    <h2 className="text-white font-semibold">Banner Style</h2>
                    <p className="text-[#989fab] text-sm">
                      Wide horizontal layout
                    </p>
                  </div>
                </div>
                <span className="text-[#989fab] text-sm">400×120px</span>
              </div>

              <div className="hover:border-green-500 border-[1px] transition-colors cursor-pointer rounded-lg border border-[#2a2d34] px-4 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <AiOutlineThunderbolt size={25} color="#00a63e" />
                  <div>
                    <h2 className="text-white font-semibold">Waveform</h2>
                    <p className="text-[#989fab] my-2 text-sm">
                      Animated audio visualization
                    </p>
                  </div>
                </div>
                <span className="text-[#989fab] text-sm">300×150px</span>
              </div>
            </div>

            <div className="bg-[#1a1b20] rounded-lg border border-[#2a2d34] p-4 flex flex-col justify-start space-y-8">
              <div className="flex items-center space-x-3.5">
                <IoColorPaletteOutline size={25} color="#00a63e" />
                <h1 className="text-white font-semibold">Live Preview</h1>
              </div>
              <div className="bg-[#111216] rounded-lg  w-full h-48 flex flex-col justify-center items-center space-y-3">
                <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                  <FaRegEye size={25} color="black" />
                </div>
                <p className="text-[#989fab] text-sm text-center my-3">
                  Your waveform style widget will appear here
                </p>
                <p className="text-[#989fab] text-xs">
                  Connect your Spotify account to see real data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* {user ? (
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
      )} */
}
