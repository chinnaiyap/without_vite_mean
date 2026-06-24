import { BrowserRouter, Routes, Route } from "react-router-dom";

import Todo from "./Todo";
import Summary from "./Summary";
import SmartSearch from "./SmartSearch";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/smart-search"
          element={
            <ProtectedRoute>
              <SmartSearch />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Todo from "./Todo";
// import Summary from "./Summary";
// import SmartSearch from "./SmartSearch";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Todo />} />
//         <Route path="/summary" element={<Summary />} />
//         <Route path="/smart-search" element={<SmartSearch />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
// // // import './App.css';
// // import Todo from './Todo';

// // function App() {
// //   return (
// //   <div
// //     className="App"
// //     style={{
// //        backgroundColor: "rgba(17, 61, 69, 0.73)", height: "170vh", overflow: "hidden"  }} >  <Todo/>
// //     </div>
// //   );
// // }

// // export default App;
