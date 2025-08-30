import { useState } from "react";
import { CiHome, CiMusicNote1, CiMenuFries } from "react-icons/ci";
import { LuLayoutDashboard } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="bg-[#1f2329] p-5 flex md:justify-around justify-between items-center">
        <div className="text-white space-x-3 flex items-center">
          <div>
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-green-500 blur-xl opacity-50"></div>
              <CiMusicNote1
                className="relative bg-green-500 rounded-lg p-1"
                color="white"
                size={45}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-lg font-bold">SpotifyWidget</h1>
            <p>GitHub README Integration</p>
          </div>
        </div>

        <div className="block md:hidden">
          <CiMenuFries
            size={25}
            color="white"
            className="cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        </div>

        <div className="hidden md:block">
          <ul className="font-semibold space-x-9 flex items-center text-white">
            <li className="cursor-pointer flex items-center space-x-3">
              <CiHome size={23} />
              <p>Home</p>
            </li>
            <li className="cursor-pointer flex items-center space-x-3">
              <LuLayoutDashboard size={23} />
              <p>DashBoard</p>
            </li>
            <li className="cursor-pointer flex items-center space-x-3">
              <CgProfile size={23} />
              <p>Account</p>
            </li>
          </ul>
        </div>
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="fixed top-0 left-0 w-64 h-full bg-[#1f2329] z-30 p-5 flex flex-col space-y-10">
            <button
              className="text-white mb-5 self-end cursor-pointer" 
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 text-white">
              <CiHome size={23} />
              <p>Home</p>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <LuLayoutDashboard size={23} />
              <p>DashBoard</p>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <CgProfile size={23} />
              <p>Account</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
