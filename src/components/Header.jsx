import { useState, useEffect, useRef } from "react";

function BookLogo({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export default function Header({ users, activeUser, setActiveUser, onAddUser, onRemoveUser }) {
  const [newUser, setNewUser] = useState("");
  const [userToDelete, setUserToDelete] = useState(users[0] || "");
  const [showAdmin, setShowAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isGG = activeUser === "GG";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = () => {
    const trimmed = newUser.trim();
    if (!trimmed) return;
    onAddUser(trimmed);
    setNewUser("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleRemove = (name) => {
    if (!isGG) return;
    onRemoveUser(name);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--accent) text-white flex items-center justify-center shadow">
            <BookLogo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-(--text-h) leading-tight">
              Whispering Pages
            </h1>
          </div>
        </div>

        {/* User Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Admin Toggle */}
          {isGG && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="px-3 py-2 rounded-full text-sm font-medium bg-(--code-bg) text-(--text) hover:bg-(--border) transition-colors border border-(--border)"
            >
              {showAdmin ? "Close" : "Manage"}
            </button>
          )}

          {/* User dropdown switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-(--accent) text-white shadow transition-all"
            >
              <span>{activeUser}</span>
              <svg
                className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-(--border) bg-white dark:bg-[#1f2028] shadow-lg z-50 overflow-hidden">
                {users.map((user) => (
                  <button
                    key={user}
                    onClick={() => {
                      setActiveUser(user);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      user === activeUser
                        ? "bg-(--accent-bg) text-(--accent) font-medium"
                        : "text-(--text) hover:bg-(--code-bg)"
                    }`}
                  >
                    {user}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {isGG && showAdmin && (
        <div className="mt-4 p-4 rounded-xl border border-(--border) bg-(--code-bg) grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
          <div>
            <h3 className="text-sm font-semibold text-(--text-h) mb-2">Add User</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="New user name"
                className="flex-1 px-3 py-2 rounded-lg border border-(--border) bg-white text-sm focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-shadow"
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-(--accent) text-white text-sm font-medium hover:bg-[#9333ea] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {users.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-(--text-h) mb-2">Remove User</h3>
              <div className="flex gap-2">
                <select
                  value={userToDelete}
                  onChange={(e) => setUserToDelete(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-(--border) bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-shadow"
                >
                  {users.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemove(userToDelete)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

