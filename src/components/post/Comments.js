import { formatDistance } from "date-fns";
import { useState } from "react";
import { Link } from "react-router-dom";
import AddComment from "./AddComment";

export default function Comments({
  docId,
  comments: allComments,
  posted,
  commentInput,
}) {
  const [comments, setComments] = useState(allComments);
  const [showAll, setShowAll] = useState(false);

  const handleShowAll = (e) => {
    e.preventDefault();
    setShowAll((previousComments) => !previousComments);
  };

  const CommentItems = ({ item }) => {
    return (
      <p className="mb-1">
        <Link to={`/p/${item.displayName}`}>
          <span className="mr-1 font-bold">{item.displayName}</span>
        </Link>
        <span>{item.comment}</span>
      </p>
    );
  };

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.length >= 3 && (
          <button
            onClick={handleShowAll}
            className="text-sm text-gray-base mb-1 cursor-pointer"
          >
            {showAll ? <>collapse</> : <>View all {comments.length} comments</>}
          </button>
        )}
        {showAll
          ? comments.map((item) => (
              <CommentItems
                key={`${item.comment}-${item.displayName}`}
                item={item}
              />
            ))
          : comments
              .slice(0, 3)
              .map((item) => (
                <CommentItems
                  key={`${item.comment}-${item.displayName}`}
                  item={item}
                />
              ))}
        <p className="text-gray-base uppercase text-xs mt-2">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}
