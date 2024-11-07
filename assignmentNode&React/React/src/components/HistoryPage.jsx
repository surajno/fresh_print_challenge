import { useEffect, useState } from "react";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const clearHistoryItem = (entryIndex, userIndex) => {
    const updatedHistory = [...history];
    updatedHistory[entryIndex].users.splice(userIndex, 1);
    if (updatedHistory[entryIndex].users.length === 0) {
      updatedHistory.splice(entryIndex, 1);
    }
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Search History
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-500">No search history available.</p>
      ) : (
        <>
          <button
            onClick={clearAllHistory}
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Clear All History
          </button>

          <div className="w-full max-w-3xl">
            <div className="grid grid-cols-3 border-b-2 border-r-2 border-gray-300 pb-2 mb-4">
              <div className="font-semibold text-gray-800">Search Term</div>
              <div className="font-semibold text-gray-800">Search Results</div>
              <div className="font-semibold text-gray-800">Actions</div>
            </div>

            {history.map((entry, entryIndex) => (
              <div key={entry.searchTerm}>
                {entry.users.length > 0 ? (
                  entry.users.map((user, userIndex) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-3 items-center gap-4 border-b border-x border-gray-200 py-4"
                    >
                      <div className="text-gray-700 ">
                        <span>{entry.searchTerm}</span>
                      </div>

                      <div className="flex items-center space-x-4 p-4 rounded-lg shadow-sm">
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-16 h-16 border-2 border-gray-400"
                        />
                        <div className="flex flex-col">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {}{" "}
                            {user.login.length > 19
                              ? `${user.login.slice(0, 16)}...`
                              : user.login}
                          </h4>
                          <a
                            href={user.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 mt-2 hover:underline"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => clearHistoryItem(entryIndex, userIndex)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 mx-16"
                      >
                        Clear
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-3 border-b border-gray-200 py-4">
                    <div className="text-gray-700">{entry.searchTerm}</div>
                    <p className="text-gray-500">
                      No users found for this search.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
