import bg from "./assets/bg.png"

function App() {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative flex items-center justify-center min-h-screen">

      </div>
    </div>
  )
}

export default App
