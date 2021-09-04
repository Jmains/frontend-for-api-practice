import { useEffect, useState } from "react";
import PostCard from "../components/PostCard/PostCard";
import PostForm from "../components/PostForm/PostForm";
import Search from "../components/Search/Search";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/getHomeFeed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: user.token,
          }),
        });
        const postsData = await res.json();
        // console.log(postsData);
        await setPosts(postsData);
      } catch (err) {
        console.log("something went wrong: ", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Search />
      <h1>Home</h1>
      <PostForm user={user} />
      <h2>Follower Posts</h2>

      {posts &&
        posts.map((post) => {
          return <PostCard key={post._id} post={post} />;
        })}
    </>
  );
}
