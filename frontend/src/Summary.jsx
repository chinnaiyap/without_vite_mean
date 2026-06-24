import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Summary.css";

import TodoList from "./components/TodoList";

import { useEffect, useState } from "react";

export default function Summary() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  // Modal state
  const [selectedItem, setSelectedItem] = useState(null);

  // Todo details inside modal
  const [todos, setTodos] = useState([]);

  // Edit states
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDesciption] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const apiUrl = import.meta.env.REACT_APP_API_URL;

  // Summary data
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/todos/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.summary);
        setTotal(res.totalTodos);
      });
  }, []);

  // Open modal and get todos by location
  const handleView = (item) => {
    setSelectedItem(item);

    fetch(`${apiUrl}/todos/location/${item.location}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);

        setTodos(data.todos || []);
      })
      .catch((err) => {
        console.log(err);
        setTodos([]);
      });
  };


  // Edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDesciption(item.description);
    setEditLocation(item.location);
  };

  // Update
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
    }).then((res) => {
      if (res.ok) {
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
      }
    });
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditId(-1);
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(`${apiUrl}/todos/${id}`, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="container summary-page">
        <h2 className="summary-title">Todo Summary</h2>

        <h4 className="summary-total">Total Todos: {total}</h4>

        {/* Summary Table */}
        <table className="table summary-table mt-3">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Location</th>
              <th>Total Todos</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.location}</td>
                <td>{item.totalTodos}</td>

                <td>
                  <button
                    className="view-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#todoModal"
                    onClick={() => handleView(item)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Near Table */}
        <div
          className="modal fade"
          id="todoModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-fullscreen-sm-down modal-xl">
            <div className="modal-content border-0 custom-modal">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Todo Details</h5>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body overflow-hidden">
                {selectedItem && (
                  <>
                    <p>
                      <strong className="location-text">Location:</strong>{" "}
                      {selectedItem.location}
                    </p>

                    <p>
                      <strong className="total-text">Total Todos:</strong>{" "}
                      {todos.length}
                    </p>
                  </>
                )}

                <div className="container-fluid">
                  <TodoList
                    todos={todos}
                    editId={editId}
                    editTitle={editTitle}
                    editDescription={editDescription}
                    editLocation={editLocation}
                    setEditTitle={setEditTitle}
                    setEditDesciption={setEditDesciption}
                    setEditLocation={setEditLocation}
                    handleEdit={handleEdit}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    handleEditCancel={handleEditCancel}
                    pageType="summary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
