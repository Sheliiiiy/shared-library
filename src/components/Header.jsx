import { useState } from "react";

export default function Header({ users, activeUser, setActiveUser, onAddUser, onRemoveUser }) {
    const [newUser, setNewUser] = useState("");
    const [userToDelete, setUserToDelete] = useState(users[0] || "");
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
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">

            {/* TITLE + SUBTITLE */}
            <div>
                <h1 className="text-3xl font-bold">📚 Online Library of <span className="font-medium text-gray-700">{activeUser}</span></h1>
            </div>

            {/* USER SWITCH */}
            <div className="flex items-center gap-2 p-3 border rounded-lg shadow-sm bg-white flex-wrap">
                <span className="text-xs text-gray-500 mr-1">User</span>

                <select
                    value={activeUser}
                    onChange={(e) => setActiveUser(e.target.value)}
                    className="px-3 py-1 rounded text-xs font-medium bg-white border border-gray-300 focus:outline-none focus:border-black"
                >
                    {users.map((user) => (
                        <option key={user} value={user}>
                            {user}
                        </option>
                    ))}
                </select>

                {/* REMOVE USER (GG only) */}
                {isGG && users.length > 1 && (
                    <div className="flex items-center gap-1 ml-2">
                        <select
                            value={userToDelete}
                            onChange={(e) => setUserToDelete(e.target.value)}
                            className="px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300 focus:outline-none focus:border-black"
                        >
                            {users.map((user) => (
                                <option key={user} value={user}>
                                    {user}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleRemove(userToDelete)}
                            className="text-[10px] text-red-500 hover:text-red-700"
                            title={`Remove ${userToDelete}`}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* ADD USER (GG only) */}
                {isGG && (
                    <div className="flex items-center gap-1 ml-2">
                        <input
                            type="text"
                            value={newUser}
                            onChange={(e) => setNewUser(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="New user"
                            className="w-20 px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:border-black"
                        />
                        <button
                            onClick={handleAdd}
                            className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800"
                        >
                            ＋
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

