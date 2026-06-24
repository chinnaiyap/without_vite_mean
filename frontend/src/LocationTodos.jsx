import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TodoList from "./components/TodoList";

export default function LocationTodos() {
  const [todos, setTodos] = useState([]);

  const { city } = useParams();

   const apiUrl = import.meta.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/todos/location/${city}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, [city]);

  return (
    <div className="container mt-4">
      <h2>{city} Todos</h2>

      {/* Reused Again */}
      <TodoList todos={todos} />
    </div>
  );
}