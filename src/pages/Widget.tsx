import { useParams } from "react-router-dom";
import { IoPauseOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { MdSkipNext } from "react-icons/md";
import { CiMusicNote1 } from "react-icons/ci";

const fallbackTrack = {
  name: "Blinding Lights",
  artist: "The Weeknd",
  albumArt:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
};

export default function Widget() {
  const { username, widgetname } = useParams();

  const trackName = fallbackTrack.name;
  const artistName = fallbackTrack.artist;
  const albumArt = fallbackTrack.albumArt;

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
        <div className="bg-[#1f2228] p-4 rounded-lg w-96 shadow-xl">
          <div className="flex items-center space-x-5">
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

    return (
      <p className="text-red-500 font-semibold">Unknown widget: {widgetname}</p>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111216]">
      <h1 className="text-white text-lg mb-6">{username}’s Widget</h1>
      {renderWidget()}
    </div>
  );
}
