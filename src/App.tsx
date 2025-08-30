import { CiMusicNote1 } from "react-icons/ci";
import bg from "./assets/bg.png";
import { Navbar, Readme } from "./components";
import { FaGithub } from "react-icons/fa";

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
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
              <button className="relative bg-green-600 text-white px-6 py-2 rounded-lg font-semibold  flex items-center space-x-3 hover:bg-green-500 transition cursor-pointer">
                <CiMusicNote1 size={24} />
                <span>Connect Spotify</span>
              </button>
            </div>

            <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold  transition  flex items-center space-x-3  transition cursor-pointer">
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
  );
}

export default App;
