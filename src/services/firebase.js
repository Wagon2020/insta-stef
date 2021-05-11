import { firebase, FieldValue } from "../lib/firebase";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.length > 0 ? true : false;
}

export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();

  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

export async function getSuggestetProfiles(userId, following) {
  const result = await firebase.firestore().collection("users").limit(10).get();

  const profiles = result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );

  return profiles;
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user (stefan) (docId)
  profileId, // the user that stefan requests to follow (userId)
  isFollowing // true/false
) {
  console.log(loggedInUserDocId, profileId, isFollowing);
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowing
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
}

export async function updateFollowedUserFollowers(
  spDocId, // (docId)
  userId, // (userId)
  isFollowing
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(spDocId)
    .update({
      followers: isFollowing
        ? FieldValue.arrayRemove(userId)
        : FieldValue.arrayUnion(userId),
    });
}

export async function getPhotos(userId, following) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  return photos;
}

export async function isUserFollowingProfile(loggedInUser, profileUserId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", loggedInUser)
    .where("following", "array-contains", profileUserId)
    .get();

  // const [isFollowing = {}] = result.docs.map((user) => ({
  //   ...user.data(),
  //   docId: user.id,
  // }));

  const isFollowing = result.docs.length > 0;

  return isFollowing;
}
