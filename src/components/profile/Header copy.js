import { useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useState } from "react/cjs/react.development";
import UserContext from "../../context/user";
import useUser from "../../hooks/useUser";
import {
  isUserFollowingProfile,
  updateFollowedUserFollowers,
  updateLoggedInUserFollowing,
} from "../../services/firebase";

export default function Header({
  photosCount,
  profile,
  followerCount,
  setFollowerCount,
}) {
  const { user } = useContext(UserContext);
  // const { user: loggedInUser } = useContext(UserContext);
  // console.log(loggedInUser);
  // const { user } = useUser(loggedInUser?.uid);
  console.log(user);
  const [isFollowingProfile, setIsFollowingProfile] = useState();

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.userId,
        profile.userId
      );
      setIsFollowingProfile(isFollowing);
    };
    if (user.username && profile.userId) {
      isLoggedInUserFollowingProfile();
    }
  }, [profile, user]);

  const toggleFollow = async (e) => {
    e.preventDefault();
    console.log(user.docId, profile.docId, isFollowingProfile);
    await updateLoggedInUserFollowing(
      user.docId,
      profile.userId,
      isFollowingProfile
    );
    await updateFollowedUserFollowers(
      profile.docId,
      user.userId,
      isFollowingProfile
    );

    setIsFollowingProfile((follow) => !follow);
    setFollowerCount({
      followerCount: isFollowingProfile
        ? (followerCount -= 1)
        : (followerCount += 1),
    });

    console.log(followerCount);
  };

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center">
        {profile.username ? (
          <img
            className="rounded-full h-40 w-40 flex"
            src={`/images/avatars/${profile.username}.jpg`}
            alt={`${profile.username}`}
          />
        ) : (
          <div className="h-40 w-40 flex">
            <Skeleton count={1} width={"10rem"} height={"10rem"} circle />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profile.username}</p>
          {profile.username !== user.username && (
            <button
              className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
              type="button"
              onClick={toggleFollow}
            >
              {isFollowingProfile ? "unfollow" : "follow"}
            </button>
          )}
        </div>
        <div className="container flex mt-4">
          <>
            <p className="mr-10">
              <span className="font-bold">{photosCount}</span> photos
            </p>
            <p className="mr-10">
              <span className="font-bold">{followerCount}</span>{" "}
              {followerCount === 1 ? "follower" : "followers"}
            </p>
            <p className="mr-10">
              <span className="font-bold">{profile?.following?.length}</span>{" "}
              following
            </p>
          </>
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!profile.fullName ? (
              <Skeleton count={1} height={24} />
            ) : (
              profile.fullName
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
