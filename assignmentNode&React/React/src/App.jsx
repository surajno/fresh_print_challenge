import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import SearchPage from "./components/SearchPage";
import HistoryPage from "./components/HistoryPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="flex justify-end items-center p-4 w-[100vw] pr-[8vw]">
          <div className="flex">
            <NavLink
              to="/"
              className="no-underline ml-4 text-4 hover:underline p-4"
              style={({ isActive }) => ({
                borderBottom: isActive ? "4px solid skyblue" : "none",
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/history"
              className="no-underline ml-4 text-4 hover:underline p-4"
              style={({ isActive }) => ({
                borderBottom: isActive ? "4px solid skyblue" : "none",
              })}
            >
              History
            </NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
