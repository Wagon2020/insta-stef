import propTypes from "prop-types";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import useAvatar from "../../hooks/useAvatar";

const User = ({ username, fullName }) => {
  const avatar = useAvatar(username);

  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <Link
      to={`/p/${username}`}
      className="grid grid-cols-4 gap-4 mb-6 items-center"
    >
      <div className="flex items-center justify-between col-span-1">
        <img className="rounded-full w-16 flex mr-3" src={avatar} alt="" />
      </div>
      <div className="col-span-3">
        <p className="font-bold text-sm">{username}</p>
        <p className="text-sm">{fullName}</p>
      </div>
    </Link>
  );
};

export default memo(User);

User.propTypes = {
  username: propTypes.string,
  fullName: propTypes.string,
};
