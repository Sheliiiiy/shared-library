import { useState } from "react";

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
  const isGG = activeUser === "GG";

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
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow">
            <BookLogo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-h)] leading-tight">
              Whispering Pages
            </h1>
            <p className="text-sm text-[var(--text)]">Shared Online Library</p>
          </div>
        </div>

        {/* User Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* User pill switcher */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--code-bg)] border border-[var(--border)]">
            {users.map((user) => (
              <button
                key={user}
                onClick={() => setActiveUser(user)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  user === activeUser
                    ? "bg-[var(--accent)] text-white shadow"
                    : "text-[var(--text)] hover:bg-[var(--border)]"
                }`}
              >
                {user}
              </button>
            ))}
          </div>

          {/* Admin Toggle */}
          {isGG && (
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="px-3 py-2 rounded-full text-sm font-medium bg-[var(--code-bg)] text-[var(--text)] hover:bg-[var(--border)] transition-colors border border-[var(--border)]"
            >
              {showAdmin ? "Close" : "Manage"}
            </button>
          )}
        </div>
      </div>

      {/* Admin Panel */}
      {isGG && showAdmin && (
        <div className="mt-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-h)] mb-2">Add User</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="New user name"
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow"
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[#9333ea] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {users.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-h)] mb-2">Remove User</h3>
              <div className="flex gap-2">
                <select
                  value={userToDelete}
                  onChange={(e) => setUserToDelete(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-shadow"
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

