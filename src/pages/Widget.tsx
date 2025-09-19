import { useNavigate, useParams } from "react-router-dom";
import { IoPauseOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { MdSkipNext } from "react-icons/md";
import { CiMusicNote1 } from "react-icons/ci";
import { useEffect, useState } from "react";

interface CurrentTrack {
  trackName: string;
  artistName: string;
  albumArt: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Widget() {
  const { username, widgetname, id, token } = useParams();

  const navigate = useNavigate();

  const [currentTrack, setcurrentTrack] = useState<CurrentTrack>({
    trackName: "",
    artistName: "",
    albumArt: "",
  });

  const [currentToken, setCurrentToken] = useState<string | undefined>(token);

  const trackName = currentTrack.trackName;
  const artistName = currentTrack.artistName;
  const albumArt = currentTrack.albumArt;

  const fetchCurrentTrack = async () => {
    if (!currentToken) return;
    try {
      const trackRes = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (trackRes.status === 401) {
        console.log("⚠️ Token expired, getting new one...");

        const getNewToken = await fetch(
          `${BACKEND_URL}/api/get-new-token?email=${atob(id!)}`
        );

        const { accessToken, refreshToken } = await getNewToken.json();
        if (accessToken) {
          setCurrentToken(accessToken);
          localStorage.setItem("spotify_token", accessToken);
          localStorage.setItem("spotify_refreshtoken", refreshToken);

          navigate(`/${username}/widget/${id}/${accessToken}/${widgetname}`, {
            replace: true,
          });

          const retryRes = await fetch(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          if (retryRes.ok) {
            const song = await retryRes.json();
            setcurrentTrack({
              trackName: song?.item?.name || "",
              albumArt: song?.item?.album?.images?.[0]?.url || "",
              artistName:
                song?.item?.artists?.map((a: any) => a.name).join(", ") || "",
            });
          }
        }
        return;
      }

      if (trackRes.status === 204) {
        console.log("No track currently playing");
        return;
      }

      const song = await trackRes.json();
      setcurrentTrack({
        trackName: song?.item?.name || "",
        albumArt: song?.item?.album?.images?.[0]?.url || "",
        artistName:
          song?.item?.artists?.map((a: any) => a.name).join(", ") || "",
      });
    } catch (error) {
      console.log("❌ Error fetching track:", error);
    }
  };

  useEffect(() => {
    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 10000);
    return () => clearInterval(interval);
  }, [token, id]);

  const renderWidget = () => {
    if (widgetname === "compact") {
      return (
        <div className="bg-[#1f2228]  p-4 rounded-lg w-96 flex justify-between items-center shadow-xl">
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
              <div className="h-1.5 bg-green-500 rounded-full w-1/3"></div>
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

    if (widgetname === "banner") {
      return (
        <div className="bg-[#1f2228] p-5 rounded-lg w-96 shadow-xl">
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

    if (widgetname === "waveform") {
      return (
        <div className="w-[380px] h-[210px] rounded-xl shadow-md overflow-hidden bg-[#181818] ">
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
           
          </div>
        </div>
      );
    }

    return (
      <p className="text-red-500 font-semibold">Unknown widget: {widgetname}</p>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111216]">
      {renderWidget()}
    </div>
  );
}
