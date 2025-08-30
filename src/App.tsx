import bg from "./assets/bg.png";
import { Navbar } from "./components";

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
      </div>
    </div>
  );
}

export default App;
