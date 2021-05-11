import { useState, useEffect } from "react";

export default function useAvatar(username) {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    function getProfileAvatar(username) {
      const fallback = `/images/avatars/steve.jpg`;
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `/images/avatars/${username}.jpg`;
        img.onload = () => resolve(setAvatar(img.src));
        img.onerror = () => reject(setAvatar(fallback));
      }).catch(() => {
        setAvatar(fallback);
      });
    }
    getProfileAvatar(username);

    return function cleanup() {
      setAvatar("");
      console.log("cleanup");
    };
  }, [username]);

  return avatar;
}
