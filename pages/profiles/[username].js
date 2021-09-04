import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import PostCard from "../../components/PostCard/PostCard";
import { useAuth } from "../../context/AuthContext";

export default function Profiles() {
  const router = useRouter();
  const { username } = router.query;
  const { user } = useAuth();

  const [profileInfo, setProfileInfo] = useState({});
  const [profilePosts, setProfilePosts] = useState([]);

  useEffect(() => {
    let controller = new AbortController();
    const fetchProfileInfo = async () => {
      try {
        const res = await fetch(`http://localhost:8080/profile/${username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: user.token }),
          signal: controller.signal,
        });

        const profileInfo = await res.json();
        // console.log(profileInfo);
        await setProfileInfo(profileInfo);
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    };

    const fetchProfilePosts = async () => {
      try {
        const res = await fetch(`http://localhost:8080/profile/${username}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        const profilePosts = await res.json();
        // console.log(profilePosts);
        await setProfilePosts(profilePosts);
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    };

    fetchProfileInfo();
    fetchProfilePosts();

    return () => {
      controller?.abort();
    };
  }, [username, user.token]);

  const handleFollowClick = async () => {
    try {
      const followResponse = await fetch(
        `http://localhost:8080/addFollow/${profileInfo.profileUsername}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: user.token,
          }),
        }
      );
      const data = await followResponse.json();
      console.log(data);
    } catch (err) {
      console.log("something went wrong: ", err);
    }
  };

  const handleUnfollowClick = async () => {
    try {
      const unfollowResponse = await fetch(
        `http://localhost:8080/removeFollow/${profileInfo.profileUsername}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: user.token,
          }),
        }
      );
      const data = await unfollowResponse.json();
      console.log(data);
    } catch (err) {
      console.log("something went wrong: ", err);
    }
  };

  return (
    <>
      {profileInfo && (
        <div className="">
          <div>
            username: <span style={{ color: "blue" }}>{profileInfo.profileUsername}</span>
          </div>
          <div>
            following?
            <span style={{ color: "blue" }}>{profileInfo.isFollowing ? "Yes" : "No"}</span>
          </div>
          <div>
            Followers:{" "}
            <span style={{ color: "blue" }}>{profileInfo.counts?.followerCount}</span>
          </div>
          <div>
            Following:{" "}
            <span style={{ color: "blue" }}>{profileInfo.counts?.followingCount}</span>
          </div>
          <div>
            Posts: <span style={{ color: "blue" }}>{profileInfo.counts?.postCount}</span>
          </div>
          {profileInfo.isFollowing ? (
            <button
              onClick={handleUnfollowClick}
              style={{ background: "red", color: "white" }}
            >
              unfollow
            </button>
          ) : (
            <button
              onClick={handleFollowClick}
              style={{ background: "purple", color: "white" }}
            >
              Follow
            </button>
          )}
        </div>
      )}
      {profilePosts &&
        profilePosts.map((post) => {
          return <PostCard key={post._id} post={post} user={user} />;
        })}

      {}
    </>
  );
}
