import { useRouter } from "next/dist/client/router";
import { useReducer, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import s from "./RegisterForm.module.scss";

// https://epicreact.dev/improve-the-performance-of-your-react-forms
export default function RegisterForm() {
  // Form State
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  // console.log(authDispatch({ type: "logout" }));

  const handleRegister = async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());

    // const formIsValid = Object.values(fieldValues).every((value) => !getFieldError(value));
    // const { username, email, password } = fieldValues;

    setWasSubmitted(true);
    // if (formIsValid) {
    //   alert("form submitted boiiiii");
    // }

    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldValues),
      });

      const userData = await res.json();
      if (!Array.isArray(userData)) {
        console.log(response);
        console.log(response.username);
        login(userData);
        router.push("/home");
      }
    } catch (err) {
      setError(err);
      setWasSubmitted(false);
    }
  };

  // response is token, username, avatar
  // token for test: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTMyOGEyMmEzNDZlNzAwMTM3MGY3MDMiLCJ1c2VybmFtZSI6InRlc3QiLCJhdmF0YXIiOiJodHRwczovL2dyYXZhdGFyLmNvbS9hdmF0YXIvMWFlZGI4ZDlkYzQ3NTFlMjI5YTMzNWUzNzFkYjgwNTg_cz0xMjgiLCJpYXQiOjE2MzA3MDIxMTQsImV4cCI6MTY2MjIzODExNH0.dDLxjD-g-217YmbgmSB7lAWcPZ06wyP6fiPhtH0gPNg

  // Form Input State

  const [usernameValue, setUsernameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // const getFieldError = (val) => {};

  // const errorMessage = getFieldError(value);
  // const displayErrorMessage =
  //   (wasSubmitted || usernameTouched || emailTouched || passwordTouched) && errorMessage;

  const displayErrorMessage = false;

  const inputFields = [
    {
      name: "username",
      wasSubmitted: false,
    },
    {
      name: "email",
      wasSubmitted: false,
    },
    {
      name: "password",
      wasSubmitted: false,
    },
  ];

  return (
    <div>
      <form noValidate className={s.registerForm} onSubmit={handleRegister}>
        <label htmlFor={`${inputFields[0].name}-input`}>{inputFields[0].name}</label>
        <input
          required
          pattern="[a-z]{3,10}"
          onBlur={() => setUsernameTouched(true)}
          onChange={(ev) => setUsernameValue(ev.currentTarget.value)}
          type="text"
          name={inputFields[0].name}
          id={`${inputFields[0].name}-input`}
        />
        {displayErrorMessage ? (
          <span role="alert" id={`${inputFields[0]}-error`} className="error-message">
            {errorMessage}
          </span>
        ) : null}
        <label htmlFor={`${inputFields[1].name}-input`}>email</label>
        <input
          required
          pattern="[a-z]{3,10}"
          onBlur={() => setEmailTouched(true)}
          onChange={(ev) => setEmailValue(ev.currentTarget.value)}
          type="email"
          name={inputFields[1].name}
          id={`${inputFields[1].name}-input`}
        />
        {displayErrorMessage ? (
          <span role="alert" id={`${inputFields[1]}-error`} className="error-message">
            {errorMessage}
          </span>
        ) : null}
        <label htmlFor={`${inputFields[2].name}-input`}>password</label>
        <input
          required
          onBlur={() => setPasswordTouched(true)}
          onChange={(ev) => setPasswordValue(ev.currentTarget.value)}
          type="password"
          name={inputFields[2].name}
          id={`${inputFields[2].name}-input`}
        />
        {displayErrorMessage ? (
          <span role="alert" id={`${inputFields[2]}-error`} className="error-message">
            {errorMessage}
          </span>
        ) : null}
        <button type="submit">Register</button>
      </form>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
