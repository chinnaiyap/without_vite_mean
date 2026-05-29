
import { useState } from "react";
import TodoList from "./components/TodoList";
import { useNavigate } from "react-router-dom";

export default function SmartSearch() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");

  // Edit states
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const navigate = useNavigate();

  // const apiUrl = "http://localhost:8000";
  const apiUrl = "https://backend-gkms.onrender.com";

  // SEARCH
  const handleSearch = (value) => {
    setSearch(value);

    if (value.trim() === "") {
      setTodos([]);
      return;
    }

    if (value.trim().length < 3) {
      return;
    }

    fetch(`${apiUrl}/todos/search?query=${value}`)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item._id);

    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditLocation(item.location);
  };

  // UPDATE
  const handleUpdate = () => {
    fetch(`${apiUrl}/todos/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        location: editLocation,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedTodos = todos.map((item) => {
          if (item._id === editId) {
            return {
              ...item,
              title: editTitle,
              description: editDescription,
              location: editLocation,
            };
          }

          return item;
        });

        setTodos(updatedTodos);

        setEditId(-1);
      });
  };

  // DELETE
  const handleDelete = (id) => {
    fetch(`${apiUrl}/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      const filteredTodos = todos.filter((item) => item._id !== id);

      setTodos(filteredTodos);
    });
  };

  // CANCEL
  const handleEditCancel = () => {
    setEditId(-1);
  };

  return (
    <div
      className="container-fluid min-vh-100 py-4"
      style={{ backgroundColor: "#f5f7fa" }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {/* Header */}
          <div
            className="text-white text-center p-4 rounded shadow-sm mb-4"
            style={{ backgroundColor: "#085360" }}
          >
            <h1 className="fw-bold mb-2">Smart Search</h1>

            <p className="mb-0">
              Search todos by title, description or location
            </p>
          </div>

          {/* Search Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            {/* Search Input */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Search Todo</label>

              <input
                type="text"
                placeholder="Type minimum 3 characters..."
                className="form-control form-control-lg"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
              <button
                className="btn btn-secondary w-100"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>

              <button
                className="btn btn-dark w-100"
                onClick={() => {
                  setSearch("");
                  setTodos([]);
                }}
              >
                Clear Search
              </button>
            </div>

            {/* Results */}
            <div className="mt-3">
              {search.length > 0 && search.length < 3 && (
                <p className="text-muted">Enter at least 3 characters...</p>
              )}

              {todos.length > 0 ? (
                <TodoList
                  todos={todos}
                  editId={editId}
                  editTitle={editTitle}
                  editDescription={editDescription}
                  editLocation={editLocation}
                  setEditTitle={setEditTitle}
                  setEditDescription={setEditDescription}
                  setEditLocation={setEditLocation}
                  handleEdit={handleEdit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleEditCancel={handleEditCancel}
                />
              ) : (
                search.length >= 3 && (
                  <div className="text-center py-5">
                    <h5 className="text-muted">No matching todos found</h5>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
