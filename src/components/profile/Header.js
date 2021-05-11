import { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import {
  isUserFollowingProfile,
  updateFollowedUserFollowers,
  updateLoggedInUserFollowing,
} from "../../services/firebase";
import UserContext from "../../context/user";
import useUser from "../../hooks/useUser";
import useAvatar from "../../hooks/useAvatar";

export default function Header({
  photosCount,
  followerCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername,
  },
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;
  const avatar = useAvatar(profileUsername);

  const toggleFollow = async (e) => {
    await updateLoggedInUserFollowing(
      user.docId,
      profileUserId,
      isFollowingProfile
    );
    await updateFollowedUserFollowers(
      profileDocId,
      user.userId,
      isFollowingProfile
    );

    setIsFollowingProfile((follow) => !follow);
    setFollowerCount({
      followerCount: isFollowingProfile
        ? (followerCount -= 1)
        : (followerCount += 1),
    });
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.userId,
        profileUserId
      );
      setIsFollowingProfile(isFollowing);
    };

    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [user?.username, profileUserId, user?.userId]);

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {profileUsername ? (
          <img
            className="rounded-full h-40 w-40 flex"
            alt={`${fullName} profile`}
            src={avatar}
          />
        ) : (
          <img
            className="rounded-full h-40 w-40 flex"
            alt={"Karl Hadwen's profile"}
            src="/images/avatars/karl.jpg"
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
              type="button"
              onClick={toggleFollow}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  toggleFollow();
                }
              }}
            >
              {isFollowingProfile ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
        <div className="container flex mt-4">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">{photosCount}</span> photos
              </p>
              <p className="mr-10">
                <span className="font-bold">{followerCount}</span>
                {` `}
                {followerCount === 1 ? `follower` : `followers`}
              </p>
              <p className="mr-10">
                <span className="font-bold">{following?.length}</span> following
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
        </div>
      </div>
    </div>
  );
}
