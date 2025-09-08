import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Widget from "./pages/Widget";
import View from "./pages/View";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      <Route element={<View />} path="/view" />
      <Route element={<Dashboard />} path="/dashboard" />
      <Route
        element={<Widget />}
        path="/:username/widget/:id/:token/:widgetname"
      />
    </Routes>
  );
}

export default App;
