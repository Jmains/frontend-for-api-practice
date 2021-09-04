import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Posts() {
  const router = useRouter();
  const { postId } = router.query;
  const { user } = useAuth();

  const [post, setPost] = useState({});

  useEffect(() => {
    let controller = new AbortController();
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8080/post/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });
        const postData = await res.json();
        await setPost(postData);
      } catch (err) {
        console.log("something went wrong: ", err);
      }
    };

    fetchPost();

    return () => {
      controller?.abort();
    };
  }, [postId]);

  return (
    <>
      {post && post.author ? (
        <div>
          <h4>Title: {post.title}</h4>
          <p>Body: {post.body}</p>

          <span style={{ color: "blue" }}>By user: {post.author.username}</span>

          {user.username && post.author.username == user.username && (
            <div>
              <button onClick={handleEditClick} style={{ display: "block" }}>
                Edit
              </button>
              <button onClick={handleDeleteClick} style={{ display: "block" }}>
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        "Post not found"
      )}
    </>
  );
}
