import { useState, useEffect, useRef } from "react";

export default function LoginModal({ 
  isOpen, 
  user, 
  onClose, 
  onSuccess, 
  isAdmin = false, 
  hasPassword = false,
  onVerify,
  onSetPassword 
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRef = useRef(null);

useEffect(() => {
    if (isOpen && inputRef.current) {
      setPassword("");
      setError("");
      setNewPassword("");
      setConfirmPassword("");
      // Only show password setup if no password is set
      setShowPasswordSetup(!hasPassword);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hasPassword]);

  if (!isOpen) return null;

const handleSubmit = (e) => {
    e.preventDefault();
    
    if (showPasswordSetup) {
      if (!newPassword || newPassword.length < 3) {
        setError("Password must be at least 3 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      onSetPassword(newPassword);
      onSuccess();
      return;
    }

    // Verify password - ALL users need to verify when they have a password
    if (hasPassword) {
      const isValid = onVerify(password);
      if (!isValid) {
        setError("Incorrect password");
        return;
      }
    }
    
    onSuccess();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1f2028] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {showPasswordSetup ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Set Your Password</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user} - Choose a password to protect your profile
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-(--accent) text-white font-medium hover:bg-[#9333ea] transition-colors"
            >
              Set Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-(--accent-bg) text-(--accent) flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Switch Profile</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enter password for <span className="font-medium text-(--accent)">{user}</span>
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>
            )}

            <div>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-(--accent) text-white font-medium hover:bg-[#9333ea] transition-colors"
            >
              Unlock
            </button>

            {isAdmin && (
              <p className="text-xs text-center text-gray-400">
                Admin users can skip password entry
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
