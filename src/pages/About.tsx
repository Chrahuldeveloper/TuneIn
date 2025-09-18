import { Navbar } from "../components";

export default function About() {
  return (
    <div className="w-full h-screen overflow-y-none  text-gray-200">
      <Navbar />

      <main className="flex-grow px-4 sm:px-6 lg:px-12 py-12 bg-[#0f1114] ">
        <div className="text-center max-w-3xl mx-auto">
          <button className="bg-gray-800 text-sm px-4 py-2 rounded-full border border-gray-700 mb-6 hover:bg-gray-700 transition">
            🎵 About Spotify Widget Generator
          </button>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">
            Showcase Your Music
          </h1>
          <p className="text-lg sm:text-xl text-gray-400">
            Transform your GitHub profile and portfolio with beautiful,
            real-time Spotify widgets that display your currently playing
            tracks and music activity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#101215] border border-gray-800 p-6 rounded-xl hover:border-green-500 transition"
            >
              <div className="text-2xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#101215] border border-gray-800 p-8 rounded-xl py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-400">
            We believe that music is a powerful form of self-expression. Our
            platform bridges the gap between your musical identity and your
            professional presence, allowing developers to showcase their
            personality through their favorite tracks and listening habits.
          </p>
        </div>
      </main>
    </div>
  );
}

const features = [
  {
    icon: "🎧",
    title: "Spotify Integration",
    desc: "Connect seamlessly with Spotify’s API to display your real-time music activity.",
  },
  {
    icon: "💻",
    title: "Developer Focused",
    desc: "Built for developers who want to showcase their music taste on GitHub profiles.",
  },
  {
    icon: "🎨",
    title: "Customizable Widgets",
    desc: "Multiple styles including compact cards, banners, and waveform visualizers.",
  },
  {
    icon: "🔗",
    title: "Easy Embedding",
    desc: "Generate embed codes and URLs ready for GitHub READMEs and portfolios.",
  },
  {
    icon: "⚡",
    title: "Real-time Updates",
    desc: "Live preview of your widgets with instant customization feedback.",
  },
  {
    icon: "📄",
    title: "GitHub Ready",
    desc: "Optimized for GitHub markdown with responsive design that works everywhere.",
  },
];
