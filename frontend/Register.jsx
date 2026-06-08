import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const apiUrl = import.meta.env.REACT_APP_API_URL;

  const handleRegister = async () => {
    const response = await fetch(
      `${apiUrl}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);
  };

  return (
    <>
      <input
        placeholder="Name"
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        onClick={handleRegister}
      >
        Register
      </button>
    </>
  );
}