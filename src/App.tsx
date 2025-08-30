import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Dashboard/>} path="/dashboard" />
    </Routes>
  );
}

export default App;
