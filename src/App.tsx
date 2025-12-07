import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Participantes from "@/pages/Participantes";
import Sorteo from "@/pages/Sorteo";
import Resultado from "@/pages/Resultado";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/participantes" element={<Participantes />} />
        <Route path="/sorteo/:id" element={<Sorteo />} />
        <Route path="/resultado/:token" element={<Resultado />} />
      </Routes>
    </Router>
  );
}
