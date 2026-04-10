export default function Header({ users, activeUser, setActiveUser }) {
  return (
    <div className="flex items-center justify-between mb-4">
      
      {/* TITLE */}
      <h1 className="text-3xl font-bold">📚 Online Library</h1>

      {/* USER SWITCH */}
      <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full shadow-sm">
        <span className="text-xs text-gray-500 mr-1">User</span>

        {users.map((user) => {
          const isActive = activeUser === user;

          return (
            <button
              key={user}
              onClick={() => setActiveUser(user)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                ${isActive
                  ? "bg-black text-white shadow"
                  : "text-gray-600 hover:bg-white"
                }
              `}
            >
              {user}
            </button>
          );
        })}
      </div>
    </div>
  );
}