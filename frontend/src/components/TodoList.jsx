import "./TodoList.css";

export default function TodoList({
  todos,
  editId,
  editTitle,
  editDescription,
  editLocation,
  setEditTitle,
  setEditDesciption,
  setEditLocation,
  handleEdit,
  handleUpdate,
  handleDelete,
  handleEditCancel,
  pageType,
}) {
  return (
    <div className="row mt-3 justify-content-center">
      <h3 className="task-title">Tasks</h3>

      <div className="col-md-6">
        <ul className="list-group todo-wrapper">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item todo-card d-flex justify-content-between align-items-center"            >
              <div className="d-flex flex-column me-2">
                {editId !== item._id ? (
                  <>
                    <span className="todo-title">{item.title}</span>
                    <span className="todo-description">
                      {item.description}
                    </span>
                    <span className="todo-location">
                      {item.location}
                    </span>
                  </>
                ) : (
                  <div className="form-group d-flex gap-2">
                    <input
                      type="text"
                      className="form-control todo-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />

                    <input
                      type="text"
                      className="form-control todo-input"
                      value={editDescription}
                      onChange={(e) =>
                        setEditDesciption(e.target.value)
                      }
                      placeholder="Description"
                    />

                    <input
                      type="text"
                      className="form-control todo-input"
                      value={editLocation}
                      onChange={(e) =>
                        setEditLocation(e.target.value)
                      }
                      placeholder="Location"
                    />
                  </div>
                )}
              </div>

              <div className="todo-actions">
                {editId !== item._id ? (
                  <button
                    className={`todo-btn ${pageType === "summary"
                      ? "summary-edit-btn"
                      : "main-edit-btn"
                      }`}
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    className={`todo-btn ${pageType === "summary"
                      ? "summary-update-btn"
                      : "main-update-btn"
                      }`}
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                )}

                {editId !== item._id ? (
                  <button
                    className={`todo-btn ${pageType === "summary"
                      ? "summary-delete-btn"
                      : "main-delete-btn"
                      }`}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    className={`todo-btn ${pageType === "summary"
                        ? "summary-cancel-btn"
                        : "main-cancel-btn"
                      }`}
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}