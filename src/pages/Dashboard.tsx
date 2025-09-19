import { useEffect, useState } from "react";
import { Navbar } from "../components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
import PopUp from "../components/PopUp";

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

  const [isCopied, setisCopied] = useState<boolean>(false);

  useEffect(() => {
    if (selectedStyle && user.name) {
      setreadMeLink(
        `https://tune-in-inky.vercel.app/${btoa(user.name)}/widget/${btoa(
          user.email
        )}/${token}/${selectedStyle}`
      );
    }
  }, [selectedStyle, user.name, token]);

  const refreshAccessToken = async () => {
    try {
      const auth_Token = localStorage.getItem("authToken");
      console.log(auth_Token)
      if (!auth_Token) return null;

      const getUserEmail = await fetch(
        `${BACKEND_URL}/api/get-user-email?authToken=${auth_Token}`
      );

      const { result } = await getUserEmail.json();

      console.log(result);

      const tokenRes = await fetch(
        `${BACKEND_URL}/api/get-new-token?email=${result}`
      );

      const data = await tokenRes.json();
      const { accessToken, refreshToken, expiresIn } = data;

      if (accessToken) {
        const expiresAt = Date.now() + expiresIn * 1000;
        localStorage.setItem("spotify_token", accessToken);
        localStorage.setItem("spotify_refreshtoken", refreshToken);
        localStorage.setItem("spotify_expires_at", expiresAt.toString());
        setToken(accessToken);
        return accessToken;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

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
      const expiresAt = Date.now() + data.expires_in * 1000;

      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const userResponse = await userRes.json();
      const newUser = {
        name: userResponse.display_name,
        email: userResponse.email,
      };
      setUser(newUser);

      const userToken = await fetch(`${BACKEND_URL}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newUser,
          refreshtoken: data.refresh_token,
        }),
      });

      const { authToken } = await userToken.json();
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("spotify_token", data.access_token);
      localStorage.setItem("spotify_refreshtoken", data.refresh_token);
      localStorage.setItem("spotify_expires_at", expiresAt.toString());

      window.history.replaceState({}, document.title, "/dashboard");
    } else {
      const storedToken = localStorage.getItem("spotify_token");
      if (storedToken) setToken(storedToken);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    const scheduleTokenRefresh = () => {
      const expiresAt = parseInt(
        localStorage.getItem("spotify_expires_at") || "0"
      );
      if (!expiresAt) return;

      const now = Date.now();
      const timeLeft = expiresAt - now;
      const refreshTime = timeLeft > 60000 ? timeLeft - 60000 : 0;

      const timer = setTimeout(async () => {
        const newToken = await refreshAccessToken();
        if (newToken) {
          setToken(newToken);
          scheduleTokenRefresh();
        }
      }, refreshTime);

      return () => clearTimeout(timer);
    };

    if (token) {
      scheduleTokenRefresh();
    }
  }, [token]);

  const saveCurrentSong = async () => {
    try {
      const track = {
        trackName: currentTrack?.item?.name,
        artistName: currentTrack?.item?.artists?.[0]?.name,
        albumArt: currentTrack?.item?.album?.images?.[0]?.url,
      };

      await fetch(`${BACKEND_URL}/api/savesong`, {
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

  const getValidToken = async () => {
    const storedToken = localStorage.getItem("spotify_token");
    const expiresAt = parseInt(
      localStorage.getItem("spotify_expires_at") || "0"
    );

    if (Date.now() < expiresAt - 60000) {
      return storedToken;
    }

    const newToken = await refreshAccessToken();
    return newToken;
  };

  const getData = async () => {
    const tokenToUse = await getValidToken();
    if (!tokenToUse) return;

    try {
      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${tokenToUse}` },
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
          headers: { Authorization: `Bearer ${tokenToUse}` },
        }
      );

      if (trackRes.status === 204) {
        setCurrentTrack(null);
      } else if (trackRes.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return getData();
        }
      } else {
        const data = await trackRes.json();
        setCurrentTrack(data);
      }

      if (!localStorage.getItem("authToken")) {
        const res = await fetch(`${BACKEND_URL}/api/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newUser,
            refreshtoken: localStorage.getItem("spotify_refreshtoken"),
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
    if (token) getData();
  }, [token, readMeLink]);

  useEffect(() => {
    saveCurrentSong();
  }, [currentTrack]);

  const copyLink = async (data: any) => {
    try {
      setisCopied(true);
      await navigator.clipboard.writeText(data!);
      setTimeout(() => {
        setisCopied(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const codeString =
    selectedStyle === "banner"
      ? `<iframe                                                
 src=${readMeLink}
 style="border: none; border-radius: 12px; overflow: hidden;"
 scrolling="no"
 width="380px"
 height="180px"
 allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
 loading="lazy"
 ></iframe>
`
      : selectedStyle === "waveform"
      ? `
<iframe                                                
src=${readMeLink}
style="border: none; border-radius: 12px; overflow: hidden;"
scrolling="no"
width="380px"
height="200px"
allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
loading="lazy"
></iframe>`
      : `                       
<iframe                                                
src=${readMeLink}
style="border: none; border-radius: 12px; overflow: hidden;"
scrolling="no"
width="380px"
height="110px"
allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
loading="lazy"
></iframe>`;

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
        <>
          <style>
            {`
            @keyframes barBounce {
              0%, 100% { transform: scaleY(0.3); }
              50% { transform: scaleY(1); }
            }
  `}
          </style>

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
              {Array.from({ length: 30 }).map((_, i) => {
                const duration = 0.6 + Math.random() * 0.6;
                const delay = Math.random() * 0.5;
                return (
                  <div
                    key={i}
                    className="w-2 bg-green-500 rounded"
                    style={{
                      height: "100%",
                      transformOrigin: "bottom",
                      animation: `barBounce ${duration}s ${delay}s infinite ease-in-out`,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-center my-6">
              <IoPauseOutline
                size={30}
                color="black"
                className="bg-green-500 p-1  rounded-lg"
              />
            </div>
          </div>
        </>
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

        <div className="bg-[#1f2228] flex flex-col gap-5 max-w-6xl mx-auto overflow-x-clip justify-center p-5 rounded-lg  text-slate-300 my-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <IoCodeSlashOutline size={25} color="#00a63e" />
              <h1 className="text-2xl font-semibold">Embed Code</h1>
            </div>
            <div>
              <FaRegCopy
                cursor={"pointer"}
                onClick={() => {
                  if (selectedStyle === "waveform") {
                    copyLink(`
                     <iframe                                                
                    src=${readMeLink}
                    style="border: none; border-radius: 12px; overflow: hidden;"
                    scrolling="no"
                    width="380px"
                    height="200px"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>

                    `);
                  } else if (selectedStyle === "banner") {
                    copyLink(`
                        <iframe                                                
                        src=${readMeLink}
                        style="border: none; border-radius: 12px; overflow: hidden;"
                        scrolling="no"
                        width="380px"
                        height="180px"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        ></iframe>
                      `);
                  } else {
                    copyLink(`
                       <iframe                                                
                        src=${readMeLink}
                        style="border: none; border-radius: 12px; overflow: hidden;"
                        scrolling="no"
                        width="380px"
                        height="110px"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        ></iframe>
                      `);
                  }
                }}
              />
            </div>
          </div>
          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            wrapLines={true}
            wrapLongLines={true}
            customStyle={{
              borderRadius: "0.75rem",
              padding: "1rem",
              fontSize: "0.75rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowX: "hidden",
            }}
          >
            {codeString}
          </SyntaxHighlighter>
          <p className="text-slate-200 text-xs font-semibold mt-2">
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
                      Animated bars for visualization
                    </p>
                  </div>
                </div>
                <span className="text-[#989fab] text-sm">View</span>
              </div>
            </div>

            <div className="flex justify-center items-center bg-[#1f2228] p-5 rounded-lg">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>
      {isCopied && <PopUp />}
    </div>
  );
}
