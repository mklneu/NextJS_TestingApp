"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputBar from "@/components/Input";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { login } from "@/services/AuthServices";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      toast.success("Login successful!");
      router.push("/"); // Redirect to home page after login
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1
          className="mb-6 text-center text-gray-700
        text-3xl font-bold"
        >
          Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <InputBar
              type="email"
              placeholder="Email"
              value={username}
              className="placeholder:text-gray-400"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <InputBar
              type="password"
              placeholder="Password"
              value={password}
              className="placeholder:text-gray-700"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button size="lg" className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
