import { useState } from "react";
import axios from "axios";

const SearchPage = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${username}%20in:login&page=1&limit=30`,
        { headers: { Accept: "application/json" } }
      );

      setUsers(response.data.items);
      setError("");

      const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      history.push({
        searchTerm: username,
        users: response.data.items,
      });
      localStorage.setItem("searchHistory", JSON.stringify(history));
    } catch (err) {
      setUsers([]);
      setError("User not found");

      const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      history.push({
        searchTerm: username,
        users: [],
        error: "no result found",
      });
      localStorage.setItem("searchHistory", JSON.stringify(history));
    }
  };

  return (
    <div className="flex flex-col p-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Search GitHub Users
      </h2>

      <form
        onSubmit={handleSearch}
        className="flex items-center flex-col w-full max-w-md m-auto"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="w-full flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 mt-4"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 font-semibold transition duration-200 mt-8"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="w-full max-w-2xl mt-6 m-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Search Results
        </h3>
        {users.length > 0 && (
          <div className="">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4  rounded-lg  hover:shadow-lg  flex justify-around"
              >
                <div className="flex flex-col">
                  <span>User Image</span>
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-24 h-24 border-gray-400 border-2  mx-auto mb-4"
                  />
                </div>
                <div className="flex flex-col justify-around">
                  <span>Github User Name</span>
                  <h4 className="text-lg font-semibold text-gray-800 text-center">
                    {user.login}
                  </h4>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-blue-600 mt-2 hover:underline cursor-pointer"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
