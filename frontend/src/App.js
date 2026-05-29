import { BrowserRouter, Routes, Route } from "react-router-dom";
import Todo from "./Todo";
import Summary from "./Summary";
import SmartSearch from "./SmartSearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/smart-search" element={<SmartSearch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
