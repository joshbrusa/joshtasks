import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, SyntheticEvent } from "react";

export default function MyTasksCreates() {
  const [formValues, setFormValues] = useState({ name: "", description: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  }

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setDisabled(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_ORIGIN}/auth/signIn/`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formValues.name,
            description: formValues.description,
          }),
        }
      );

      if (res.ok) {
        navigate("/myTasks");
      } else {
        const json = await res.json();
        setErrorMessage(json.errorMessage);
        setDisabled(false);
      }
    } catch {
      setErrorMessage("cannot reach server");
    }
  }

  return (
    <>
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
        />
        <label>Password</label>
        <input
          className="textBoxInput"
          type="text"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={disabled}>
          Submit
        </button>
        {errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : null}
      </form>
    </>
  );
}