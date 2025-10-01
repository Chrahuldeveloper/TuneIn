import { useEffect, useState } from "react";
import { CiMusicNote1 } from "react-icons/ci";
import { Navbar, Readme } from "../components";
import { FaGithub } from "react-icons/fa";
import bg from "../assets/bg.png";
import { Link } from "react-router-dom";
import { MdSettingsSuggest } from "react-icons/md";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

var SCOPE =
  "user-read-private user-read-email user-read-recently-played user-read-currently-playing";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async () => {
    const getCodeVerifier = await fetch(`${BACKEND_URL}/api/login`);

    const { codeVerifier, codeChallenge } = await getCodeVerifier.json();

    console.log(codeVerifier, codeChallenge);

    localStorage.setItem("code_verifier", codeVerifier);
    localStorage.removeItem("spotify_token");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPE,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    });

    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_token");
    if (storedToken) setToken(storedToken);
  }, []);

  const getData = async (token: string) => {
    try {
      if (!token) {
        return;
      }
      const getUser = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await getUser.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getData(token?.toString());
    }
  }, [token]);

  return (
    <div className="w-full h-screen overflow-y-none">
      <div className="relative ">
        <div
          className="absolute inset-0 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          <div className="text-white text-center my-28 space-y-12">
            <h1 className="text-6xl md:text-7xl font-bold">
              Show Your <br />
              <span className="text-green-500">Spotify Vibes</span>
            </h1>
            <p className="max-w-2xl text-xl md:text-2xl mx-auto font-semibold text-[#9ea9ae]">
              Generate beautiful widgets to display your currently playing track
              or recent Spotify activity on your, portfolio,
            </p>

            <div className="flex justify-center flex-col md:flex-row items-center md:space-x-5 space-y-5 md:space-y-0 ">
              {!token ? (
                <button
                  onClick={handleLogin}
                  className=" cursor-pointer relative bg-green-600 text-white px-6 py-3 text-xl rounded-lg font-semibold flex items-center space-x-3 hover:bg-green-500 transition cursor-pointer"
                >
                  <CiMusicNote1 size={24} />
                  <span>Connect Spotify</span>
                </button>
              ) : (
                <Link to={"/dashboard"}>
                  <div className=" cursor-pointer relative bg-green-600 text-white px-6 py-3 text-xl rounded-lg font-semibold flex items-center space-x-3">
                    <CiMusicNote1 size={24} />
                    <span>{"Your Profile"}</span>
                  </div>
                </Link>
              )}

              <Link to={"https://github.com/Chrahuldeveloper/TuneIn"}>
                <button className="bg-gray-800 text-white px-6 py-3 rounded-lg text-xl font-semibold transition flex items-center space-x-3 cursor-pointer">
                  <FaGithub size={24} />
                  <span>View on Github</span>
                </button>
              </Link>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold md:text-2xl text-center text-white ">
              See it in action on a Portfolio
            </h1>
            <Readme />
          </div>
        </div>
      </div>
    </div>
  );
}
