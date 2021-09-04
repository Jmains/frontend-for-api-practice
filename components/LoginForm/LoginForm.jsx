import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import s from "./LoginForm.module.scss";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const { login } = useAuth();

  const handlePasswordChange = (ev) => {
    setPassword(ev.target.value);
  };

  const handleUsernameChange = (ev) => {
    setUsername(ev.target.value);
  };

  const handleLogin = async (ev) => {
    ev.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const userData = await res.json();
      login(userData);
      router.push("/home");
    } catch (err) {
      console.log("something went wrong: ", err);
    }
  };

  return (
    <form className={s.loginForm} onSubmit={handleLogin}>
      <label htmlFor="username">username</label>
      <input
        value={username}
        onChange={handleUsernameChange}
        type="text"
        name="username"
        id="username"
      />
      <label htmlFor="password">password</label>
      <input
        value={password}
        onChange={handlePasswordChange}
        type="password"
        name="password"
        id="password"
      />
      <button type="submit">login</button>
    </form>
  );
}
