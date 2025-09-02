import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Widget from "./pages/Widget";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<Dashboard />} path="/dashboard" />
      <Route element={<Widget />} path="/:username/widget/:widgetname" />
    </Routes>
  );
}

export default App;


