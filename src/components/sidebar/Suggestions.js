import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { getSuggestetProfiles } from "../../services/firebase";
import SuggestedProfile from "./SuggestedProfile";

export default function Suggestions({ userId, following, loggedInUserDocId }) {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    async function suggestProfiles() {
      const response = await getSuggestetProfiles(userId, following);
      setProfiles(response);
    }
    if (userId) {
      suggestProfiles();
    }
  }, [userId, following]);
  return !profiles ? (
    <Skeleton count={1} height={150} className="mt-5" />
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-bold text-gray-base">Suggestions for you</p>
      </div>
      <div className="mt-4 grid gap-5">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            spDocId={profile.docId}
            username={profile.username}
            profileId={profile.userId}
            userId={userId}
            loggedInUserDocId={loggedInUserDocId}
          />
        ))}
      </div>
    </div>
  ) : null;
}
