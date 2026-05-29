import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoList from "./components/TodoList";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDesciption] = useState("");
  const [location, setLocation] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const [search, setSearch] = useState("");
  //Add inside component:
  const navigate = useNavigate();

  //Add pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); //

  //Update handleFilter()
  const handleFilter = () => {
    setPage(1);
    getItems();
  };




  // Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDesciption] = useState("");
  const [editLocation, setEditLocation] = useState("");

  // const apiUrl = import.meta.env.VITE_API;
  // const apiUrl = "http://localhost:8000";
  const apiUrl = https://backend-gkms.onrender.com;
  // const apiUrl = "";

  const handleSubmit = () => {
    //Supmit
    setError("");
    //check inputs
    if (
      title.trim() !== "" &&
      description.trim() !== "" &&
      location.trim() !== ""
    ) {
      // fetch("/todos", {

      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json", //
      //   },
      //   body: JSON.stringify({ title, description, location }), //
      // })
      fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          location,
        }),
      })
        .then((res) => {
          if (res.ok) {
            //add item to list
            setTodos([...todos, { title, description, location }]);
            setTitle("");
            setDesciption("");
            setLocation("");
            setMessage("Item added successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            //set error
            setError("Unable to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  //Fix useEffect AJAX Call
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // empty search
      if (search.trim() === "") {
        getItems();
        return;
      }

      // minimum 3 chars
      if (search.trim().length < 3) {
        return;
      }

      fetch(`${apiUrl}/todos?page=${page}&limit=5&search=${search}`)
        .then((res) => res.json())
        .then((data) => {
          setTodos(data.todos);
          setTotalPages(data.totalPages);
        })
        .catch(() => {
          setError("Search failed");
        });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  //Fix useEffect AJAX Call

  //AJAX02 useEffect
  const handleSearch = (value) => {
    setSearch(value);

    // empty search
    if (value.trim() === "") {
      getItems();
      return;
    }

    // minimum 3 chars
    if (value.trim().length < 3) {
      return;
    }

    fetch(`${apiUrl}/todos/search?query=${value}`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setError("Search failed");
      });
  };

  //Update getItems()
  const getItems = () => {
    fetch(
      `${apiUrl}/todos?page=${page}&limit=5&startDate=${startDate}&endDate=${endDate}&filterLocation=${filterLocation}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos);
        setTotalPages(data.totalPages);
      });
  };


  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDesciption(item.description);
    setEditLocation(item.location);
  };

  const handleUpdate = () => {
    setError("");
    //check inputs
    if (
      editTitle.trim() !== "" &&
      editDescription.trim() !== "" &&
      editLocation.trim() !== ""
    ) {
      fetch(apiUrl + "/todos/" + editId, {
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
        .then((res) => {
          if (res.ok) {
            //update item to list
            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = editTitle;
                item.description = editDescription;
                item.location = editLocation;
              }
              return item;
            });

            setTodos(updatedTodos);
            setEditTitle("");
            setEditDesciption("");
            setEditLocation("");
            setMessage("Item updated successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);

            setEditId(-1);
          } else {
            //set error
            setError("Unable to create Todo item");
          }
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  return (
    <div className="container py-3" style={{ backgroundColor: "#586f723a" }}>
      {/* Header */}
      <div
        className="text-center text-light py-4 rounded mb-4"
        style={{ backgroundColor: "#1d5058" }}
      >
        <h1 className="fw-bold">ToDo Project with MERN Stack</h1>

      </div>

      {/* Add Item */}
      <div className="card shadow-sm p-3 mb-4">
        <h3 className="mb-3">Add Item</h3>

        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <input
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="form-control"
              type="text"
            />
          </div>

          <div className="col-12 col-md-4">
            <input
              placeholder="Description"
              onChange={(e) => setDesciption(e.target.value)}
              value={description}
              className="form-control"
              type="text"
            />
          </div>

          <div className="col-12 col-md-4">
            <input
              placeholder="Location"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              className="form-control"
              type="text"
            />
          </div>

          <div className="col-12">
            <button className="btn btn-dark w-100" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card shadow-sm p-3 mb-4">
        <h3 className="mb-3">Filter</h3>

        <div className="row g-3">
          <div className="col-12 col-md-3">
            <input
              type="date"
              className="form-control"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <input
              type="date"
              className="form-control"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <input
              type="text"
              placeholder="Location"
              className="form-control"
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>

          <div className="col-6 col-md-1">
            <button className="btn btn-primary w-100" onClick={handleFilter}>
              Filter
            </button>
          </div>

          <div className="col-6 col-md-2">
            <button className="btn btn-secondary w-100" onClick={getItems}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <h3 className="m-0">AJAX Smart Search</h3>

          <button
            className="btn btn-success"
            onClick={() => navigate("/smart-search")}
          >
            Smart Search
          </button>
        </div>

        <input
          type="text"
          placeholder="Search title, description or location..."
          className="form-control"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Pagination */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-warning"
            onClick={() => navigate("/summary")}
          >
            Summary Page
          </button>

          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <button
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

        <div className="d-flex gap-2 flex-wrap justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn ${page === i + 1 ? "btn-primary" : "btn-outline-secondary"
                }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
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
            pageType="main"
          />
        </div>
      </div>
    </div>
  );
}
