"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if the current admin user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", { method: "GET" });
        if (!response.ok) throw new Error("Not authenticated");
      } catch (error) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess("Registration successful!");
        setEmail("");
        setPassword("");
        setTimeout(() => router.push("/admin"), 2000); // Redirect to admin page after 2 seconds
      } else {
        setError(result.error || "Failed to register");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Register New User</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              placeholder="user@example.com"
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <RotatingLines
              visible={true}
              height="40"
              width="40"
              color="grey"
              strokeColor="grey"
              strokeWidth="5"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        )}
      </div>
    </div>
  );
}
