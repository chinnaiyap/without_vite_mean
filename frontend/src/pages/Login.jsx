
//=======================================//
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12)
      return "🌅 Good Morning";

    if (hour < 18)
      return "☀️ Good Afternoon";

    return "🌙 Good Evening";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.includes("@")) {
      setError(
        "Please enter a valid email"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/");
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899)",
      }}
    >
      <div
        className="p-4"
        style={{
          width: "420px",
          background:
            "rgba(255,255,255,0.15)",
          backdropFilter:
            "blur(15px)",
          borderRadius: "25px",
          border:
            "1px solid rgba(255,255,255,0.2)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.2)",
          color: "white",
        }}
      >
        <div className="text-center mb-4">
          <div
            style={{
              fontSize: "70px",
            }}
          >
            👨‍💻
          </div>

          <h4>{getGreeting()}</h4>

          <h2 className="fw-bold">
            Login
          </h2>

          <p>
            Access your account
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          <div className="mb-3">
            <label>Password</label>

            <div className="input-group">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="btn btn-light"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <div>
              <input
                type="checkbox"
                className="form-check-input me-2"
              />
              Remember Me
            </div>

            <Link
              to="/forgot-password"
              className="text-white"
            >
              Forgot?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-warning w-100 fw-bold"
          >
            {loading
              ? "⏳ Logging In..."
              : "🚀 Login"}
          </button>
        </form>

        <hr />

        <p className="text-center">
          New User?{" "}
          <Link
            to="/register"
            className="text-warning fw-bold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
//=======================================//
