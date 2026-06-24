import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">

      <span className="navbar-brand">
        MERN TODO
      </span>

      <div>
        <span className="text-white me-3">
          {user?.name}
        </span>

        <button
          onClick={logout}
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>

    </nav>
  );
}