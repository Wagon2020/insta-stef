import { useState } from "react";
import { Link } from "react-router-dom";
import useAvatar from "../../hooks/useAvatar";
import {
  updateFollowedUserFollowers,
  updateLoggedInUserFollowing,
} from "../../services/firebase";

export default function SuggestedProfile({
  spDocId,
  username,
  profileId,
  userId,
  loggedInUserDocId,
}) {
  const [followed, setFollowed] = useState(false);
  const avatar = useAvatar(username);

  async function handleFollowUser() {
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(spDocId, userId, false);
    setFollowed(true);
  }

  return (
    !followed && (
      <div className="flex flex-row items-center align-items justify-between">
        <div className="flex items-center justify-between">
          <img
            className="rounded-full w-8 flex mr-3"
            src={avatar}
            alt={username}
          />
          <Link to={`/p/${username}`}>
            <p className="font-bold text-sm">{username}</p>
          </Link>
        </div>
        <button
          className="text-xs font-bold text-blue-medium"
          type="button"
          onClick={handleFollowUser}
        >
          follow
        </button>
      </div>
    )
  );
}
