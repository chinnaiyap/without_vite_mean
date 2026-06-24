//=======================================//
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const getPasswordStrength = () => {
    if (password.length < 6)
      return "Weak";

    if (password.length < 10)
      return "Medium";

    return "Strong";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Name is required"
      );
      return;
    }

    if (!email.includes("@")) {
      setError(
        "Enter a valid email"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
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

      alert(
        "Registration Successful!"
      );

      navigate("/login");
    } catch (error) {
      setError(
        "Registration Failed"
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
          "linear-gradient(135deg,#06b6d4,#3b82f6,#8b5cf6)",
      }}
    >
      <div
        className="p-4"
        style={{
          width: "450px",
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
            📝
          </div>

          <h2 className="fw-bold">
            Create Account
          </h2>

          <p>
            Register to continue
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
        >
          <div className="mb-3">
            <label>
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="mb-3">
            <label>Email</label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
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
                placeholder="Password"
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

            {password && (
              <small>
                Strength:{" "}
                {getPasswordStrength()}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label>
              Confirm Password
            </label>

            <div className="input-group">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                className="form-control"
                placeholder="Confirm Password"
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="btn btn-light"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-warning w-100 fw-bold"
          >
            {loading
              ? "⏳ Creating Account..."
              : "🚀 Register"}
          </button>
        </form>

        <hr />

        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-warning fw-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
//=======================================//
