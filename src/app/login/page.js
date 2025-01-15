"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", { method: "GET" });
        if (response.ok) {
          router.push("/admin"); // Redirect to admin page if authenticated
        }
      } catch {
        // Do nothing if not authenticated
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/admin"); // Redirect to admin page
      } else {
        const { error } = await response.json();
        setError(error || "Login failed");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Admin Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-md border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-md border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-bold rounded-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <RotatingLines
              visible={true}
              height="40"
              width="40"
              color="grey"
              strokeWidth="5"
              strokeColor="grey"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        )}
      </div>
    </div>
  );
}
