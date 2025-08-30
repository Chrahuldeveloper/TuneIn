import { useEffect, useState } from "react";
import { CiMusicNote1 } from "react-icons/ci";
import bg from "../assets/bg.png";
import { Navbar, Readme } from "../components";
import { FaGithub } from "react-icons/fa";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const scope = "user-read-private user-read-email";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  //  Read https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
  const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  //  Read https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values)
      .map((x) => possible[x % possible.length])
      .join("");
  };

  const handleLogin = async () => {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("code_verifier", codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: scope,
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

  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setUser)
        .catch(console.error);
    }
  }, [token]);

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          {/* Hero Section */}
          <div className="text-white text-center mt-28 space-y-12">
            <h1 className="text-6xl md:text-7xl font-bold">
              Show Your <br />{" "}
              <span className="text-green-500">Spotify Vibes</span>
            </h1>
            <p className="max-w-2xl text-xl md:text-2xl mx-auto font-semibold  text-[#9ea9ae]">
              Generate beautiful widgets to display your currently playing track
              or recent Spotify activity on your GitHub README, portfolio, or
              anywhere else.
            </p>

            <div className="flex justify-center items-center space-x-5">
              <div className="relative inline-block">
                <div className="absolute -inset-1 rounded-lg bg-green-500 blur-2xl opacity-70 animate-pulse"></div>
                {!token ? (
                  <button
                    onClick={handleLogin}
                    className="relative bg-green-600 text-white px-6 py-3 text-xl rounded-lg font-semibold  flex items-center space-x-3 hover:bg-green-500 transition cursor-pointer"
                  >
                    <CiMusicNote1 size={24} />
                    <span>Connect Spotify</span>
                  </button>
                ) : (
                  <div className="relative bg-green-600 text-white px-6 py-3 text-xl rounded-lg font-semibold flex items-center space-x-3">
                    <CiMusicNote1 size={24} />
                    <span>{user?.display_name}</span>
                  </div>
                )}
              </div>

              <button className="bg-gray-800 text-white px-6 py-3 rounded-lg text-xl font-semibold  transition  flex items-center space-x-3 cursor-pointer">
                <FaGithub size={24} />
                <span>View on Github</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold md:text-2xl  text-center text-white mt-12">
              See it in action on a GitHub README
            </h1>
            <Readme />
          </div>
        </div>
      </div>
    </>
  );
}
