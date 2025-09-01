import { useEffect, useState } from "react";
import { Navbar } from "../components";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

import { IoColorPaletteOutline, IoCodeSlashOutline } from "react-icons/io5";
import { FaRegChartBar, FaRegEye } from "react-icons/fa";
import { AiOutlineThunderbolt } from "react-icons/ai";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [selectedStyle, setSelectedStyle] = useState<
    "compact" | "banner" | "waveform" | null
  >(null);

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
        setCurrentTrack(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) getData(token);
  }, [token]);

  const renderPreview = () => {
    if (!selectedStyle) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-[#989fab]">
          <FaRegEye size={40} className="mb-2" />
          <p>Select a widget style to preview</p>
        </div>
      );
    }

    const trackName = currentTrack?.item?.name || "Blinding Lights";
    const artistName = currentTrack?.item?.artists?.[0]?.name || "The Weeknd";
    const albumArt =
      currentTrack?.item?.album?.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center";

    if (selectedStyle === "compact") {
      return (
        <div className="bg-[#1f2228] p-4 rounded-lg w-72">
          <div className="flex items-center space-x-3">
            <img
              src={albumArt}
              alt={trackName}
              className="w-12 h-12 rounded-md"
            />
            <div>
              <h3 className="text-white font-semibold">{trackName}</h3>
              <p className="text-[#989fab] text-sm">{artistName}</p>
            </div>
          </div>
          <div className="mt-3 w-full h-1.5 bg-[#2a2d34] rounded-full">
            <div className="h-1.5 bg-green-500 rounded-full w-1/3"></div>
          </div>
          <p className="text-[#989fab] text-xs mt-1 text-right">1:45</p>
        </div>
      );
    }

    if (selectedStyle === "banner") {
      return (
        <div className="bg-[#1f2228] p-5 rounded-lg w-96">
          <div className="flex items-center space-x-4">
            <img
              src={albumArt}
              alt={trackName}
              className="w-16 h-16 rounded-lg"
            />
            <div>
              <p className="text-green-500 text-xs mb-1">Now Playing</p>
              <h3 className="text-white font-semibold text-lg">{trackName}</h3>
              <p className="text-[#989fab] text-sm">{artistName}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-[#989fab] text-sm">
            <p>❤</p>
            <p>⏯</p>
            <p>↻</p>
            <p>Spotify</p>
          </div>
        </div>
      );
    }

    if (selectedStyle === "waveform") {
      return (
        <div className="bg-[#1f2228] p-4 rounded-lg w-80">
          <div className="flex items-center space-x-3">
            <img
              src={albumArt}
              alt={trackName}
              className="w-12 h-12 rounded-md"
            />
            <div>
              <h3 className="text-white font-semibold">{trackName}</h3>
              <p className="text-[#989fab] text-sm">{artistName}</p>
            </div>
          </div>
          <div className="mt-4 flex items-end space-x-1 h-12">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-green-500 rounded"
                style={{ height: `${Math.random() * 40 + 10}px` }}
              />
            ))}
          </div>
          <p className="text-[#989fab] text-xs mt-2 text-right">1:45 / 3:20</p>
        </div>
      );
    }
  };

  return (
    <div className=" bg-[#111216] w-full min-h-screen overflow-y-auto">
      <Navbar />

      <div className="text-center my-10 space-y-5">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Dashboard</h1>
        <p className="text-lg font-semibold text-[#989fab]">
          Customize your Spotify widget and generate embed code
        </p>
      </div>

      <div className="bg-[#111216] w-full flex justify-center p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-[#1f2228] p-5 rounded-lg">
            <div className="flex items-center space-x-3">
              <IoColorPaletteOutline size={25} color="#00a63e" />
              <h1 className="text-white font-semibold">Widget Style</h1>
            </div>

            <div
              onClick={() => setSelectedStyle("compact")}
              className={`border-[1px] transition-colors cursor-pointer rounded-lg px-4 py-5 flex items-center justify-between ${
                selectedStyle === "compact"
                  ? "border-green-500"
                  : "border-[#2a2d34]"
              }`}
            >
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

            <div
              onClick={() => setSelectedStyle("banner")}
              className={`border-[1px] transition-colors cursor-pointer rounded-lg px-4 py-5 flex items-center justify-between ${
                selectedStyle === "banner"
                  ? "border-green-500"
                  : "border-[#2a2d34]"
              }`}
            >
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

            <div
              onClick={() => setSelectedStyle("waveform")}
              className={`border-[1px] transition-colors cursor-pointer rounded-lg px-4 py-5 flex items-center justify-between ${
                selectedStyle === "waveform"
                  ? "border-green-500"
                  : "border-[#2a2d34]"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <AiOutlineThunderbolt size={25} color="#00a63e" />
                <div>
                  <h2 className="text-white font-semibold">Waveform</h2>
                  <p className="text-[#989fab] text-sm">
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
            <div className="flex justify-center items-center min-h-[200px]">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
