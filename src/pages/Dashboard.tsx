import { useEffect, useState } from "react";
import { Navbar } from "../components";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

import {
  IoColorPaletteOutline,
  IoCodeSlashOutline,
  IoPauseOutline,
} from "react-icons/io5";
import { FaRegChartBar, FaRegEye, FaRegHeart } from "react-icons/fa";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiMusicNote1 } from "react-icons/ci";
import { MdSkipNext } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa6";

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [selectedStyle, setSelectedStyle] = useState<
    "compact" | "banner" | "waveform" | "compact"
  >("compact");

  const [readMeLink, setreadMeLink] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStyle && user.name) {
      setreadMeLink(
        `http://127.0.0.1:8000/${btoa(user.name)}/widget/${btoa(
          user.email
        )}/${token}/${selectedStyle}`
      );
    }
  }, [selectedStyle, user.name]);

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
      const saveToken = await fetch(
        " http://localhost:3001/api/refresh-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refreshToken: data.refresh_token,
            email: user.email,
          }),
        }
      );

      console.log(data.refresh_token);
      console.log(await saveToken.json());
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

  const saveCurrentSong = async () => {
    try {
      const track = {
        trackName: currentTrack?.item?.name,
        artistName: currentTrack?.item?.artists?.[0]?.name,
        albumArt: currentTrack?.item?.album?.images?.[0]?.url,
      };

      await fetch("http://localhost:3001/api/savesong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          songDetails: track,
        }),
      });

      console.log("song saved");
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async (token: string) => {
    if (!token) return;

    try {
      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userResponse = await userRes.json();
      const newUser = {
        name: userResponse.display_name,
        email: userResponse.email,
      };
      setUser(newUser);

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

      if (localStorage.getItem("authToken")) {
        return null;
      } else {
        const res = await fetch("http://localhost:3001/api/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newUser,
          }),
        });
        const { authToken } = await res.json();
        localStorage.setItem("authToken", authToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) getData(token);
  }, [token]);

  useEffect(() => {
    saveCurrentSong();
  }, [currentTrack]);

  const copyLink = async (data: any) => {
    try {
      await navigator.clipboard.writeText(data!);
    } catch (error) {
      console.log(error);
    }
  };

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
        <div className="bg-[#1f2228]  p-4 rounded-lg w-96 flex justify-between items-center shawdow-xl">
          <div>
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
            <div className="mt-4 w-full h-1.5 bg-[#2a2d34] rounded-full">
              <div className="h-1.5 bg-green-500 rounded-full w-1/3 "></div>
            </div>
          </div>
          <div>
            <IoPauseOutline
              size={35}
              color="black"
              className="bg-green-500 p-1 rounded-lg"
            />
          </div>
        </div>
      );
    }

    if (selectedStyle === "banner") {
      return (
        <div className="bg-[#1f2228] p-5 rounded-lg w-96 shawdow-xl">
          <div className="flex items-center space-x-4">
            <img
              src={albumArt}
              alt={trackName}
              className="w-16 h-16 rounded-lg"
            />
            <div>
              <div className="text-green-500 text-xs mb-1 flex items-center space-x-2">
                <CiMusicNote1 size={20} color="#00a63e" />
                <h1 className="font-semibold">Now Playing</h1>
              </div>
              <h3 className="text-white font-semibold text-lg">{trackName}</h3>
              <p className="text-[#989fab] text-sm">{artistName}</p>
            </div>
          </div>
          <div className="flex justify-evenly items-center mt-4 text-[#989fab] text-sm">
            <FaRegHeart size={15} color="white" />
            <IoPauseOutline
              size={30}
              color="black"
              className="bg-green-500 p-1 rounded-lg"
            />
            <MdSkipNext size={20} color="white" />
            <p className="font-semibold text-green-500">Spotify</p>
          </div>
        </div>
      );
    }

    if (selectedStyle === "waveform") {
      return (
        <div className="bg-[#1f2228] p-4 rounded-lg w-96 p-5 shawdow-xl">
          <div className="flex items-center  space-x-5">
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

          <div className="mt-4 flex items-end space-x-1.5 h-16 justify-center">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-2 bg-green-500 rounded"
                style={{ height: `${Math.random() * 40 + 10}px` }}
              />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <IoPauseOutline
              size={30}
              color="black"
              className="bg-green-500 p-1 rounded-lg"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-screen overflow-y-none">
      <div className=" bg-[#111216] h-[110vh] overflow-y-none">
        <Navbar />

        <div className="text-center my-10 space-y-5">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Dashboard
          </h1>
          <p className="text-lg font-semibold text-[#989fab]">
            Customize your Spotify widget and generate embed code
          </p>
        </div>

        {/* <div className="bg-[#1f2228] flex flex-col gap-5 max-w-5xl mx-auto overflow-x-clip justify-center p-5 rounded-lg  text-slate-300 my-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <IoCodeSlashOutline size={25} color="#00a63e" />
              <h1 className="text-2xl font-semibold">Embed Code</h1>
            </div>
            <div>
              <FaRegCopy
                cursor={"pointer"}
                onClick={() => {
                  copyLink(readMeLink);
                }}
              />
            </div>
          </div>
          <p className="w-28">{token ? readMeLink : ""}</p>
          <p className="text-slate-200  text-xs font-semibold">
            Paste this markdown code into your GitHub README or any markdown
            file
          </p>
        </div> */}

        <div className="bg-[#1f2228] flex flex-col gap-5 max-w-5xl mx-auto overflow-x-clip justify-center p-5 rounded-lg  text-slate-300 my-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <IoCodeSlashOutline size={25} color="#00a63e" />
              <h1 className="text-2xl font-semibold">Embed Code</h1>
            </div>
            <div>
              <FaRegCopy
                cursor={"pointer"}
                onClick={() => {
                  copyLink(`
                     <iframe
                      src=${readMeLink}
                      width="400"
                      height="120"
                      style="border:none; border-radius:12px; overflow:hidden;"
                      ></iframe>
                    `);
                }}
              />
            </div>
          </div>
          <p className="w-28">{`
            <iframe
            src=${readMeLink}
            width="400"
            height="120"
            style="border:none; border-radius:12px; overflow:hidden;"
            ></iframe>
          `}</p>
          <p className="text-slate-200  text-xs font-semibold">
            Paste this markdown code into your GitHub README or any markdown
            file
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
                <span className="text-[#989fab] text-sm">View</span>
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
                <span className="text-[#989fab] text-sm">View</span>
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
                <span className="text-[#989fab] text-sm">View</span>
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
    </div>
  );
}
