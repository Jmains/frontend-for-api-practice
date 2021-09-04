import Link from "next/link";
import { useState } from "react";

export default function PostCard({ post, user }) {
  const [editClicked, setEditClicked] = useState(false);

  const [title, setTitle] = useState(post.title ?? "");
  const [postBody, setPostBody] = useState(post.body ?? "");

  const handleTitleChange = async (ev) => {
    await setTitle(ev.target.value);
  };

  const handleBodyChange = async (ev) => {
    await setPostBody(ev.target.value);
  };

  const handleDeleteClick = async () => {
    try {
      const deleteResponse = await fetch(`http://localhost:8080/post/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: user.token }),
      });

      const data = await deleteResponse.json();
      console.log("Post successfully deleted: ", data);
    } catch (err) {
      console.log("something went wrong: ", err);
    }
  };

  const handleEditClick = () => {
    setTitle(post.title);
    setPostBody(post.body);
    setEditClicked((isClicked) => !isClicked);
  };

  const handleEditPostFormSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const editPostResponse = await fetch(`http://localhost:8080/post/${post._id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: user.token,
          title,
          body: postBody,
        }),
      });

      const data = await editPostResponse.json();
      console.log("Successfully updated post: ", data);
      setEditClicked(false);
    } catch (err) {
      console.log("something went wrong: ", err);
    }
  };

  return (
    <>
      {editClicked ? (
        <form onSubmit={handleEditPostFormSubmit}>
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
            Save changes
          </button>
          <button onClick={handleEditClick} style={{ marginTop: "2rem" }}>
            Cancel Edit
          </button>
        </form>
      ) : (
        <>
          <div style={{ border: "2px solid red", marginTop: "2rem", padding: "1rem" }}>
            <p>
              posted by:{" "}
              <Link href={`/profiles/${post.author.username}`}>
                <a style={{ color: "magenta" }}>{post.author.username}</a>
              </Link>{" "}
            </p>
            <p>Id: {post._id}</p>
            <h4>Title: {post.title}</h4>
            <p>Body: {post.body}</p>
          </div>
          {user && post.author.username === user.username && (
            <>
              <button onClick={handleEditClick}>Edit</button>
              <button onClick={handleDeleteClick}>Delete</button>
            </>
          )}
        </>
      )}
    </>
  );
}
