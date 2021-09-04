import { useState } from "react";

export default function PostForm({ user }) {
  const [title, setTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postRes, setPostRes] = useState({});

  const handleTitleChange = (ev) => {
    setTitle(ev.target.value);
  };

  const handleBodyChange = (ev) => {
    setPostBody(ev.target.value);
  };

  const handlePostSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: postBody,
          token: user.token,
        }),
      });

      const data = await res.json();
      console.log(data);
      setPostRes(data);
    } catch (err) {
      console.log("something went wrong: ", err);
    }
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          style={{ display: "block" }}
          value={title}
          onChange={handleTitleChange}
          type="text"
          name="title"
          id="title"
        />
      </div>
      <div style={{ marginTop: "2rem" }}>
        <label htmlFor="body">Body</label>
        <textarea
          style={{ display: "block" }}
          value={postBody}
          onChange={handleBodyChange}
          name="body"
          id="body"
          cols="40"
          rows="10"
        ></textarea>
      </div>
      <button style={{ marginTop: "2rem" }} type="submit">
        post
      </button>

      {postRes && <pre>{JSON.stringify(postRes, null, 2)}</pre>}
    </form>
  );
}
