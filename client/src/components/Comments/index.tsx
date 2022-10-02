import { Link } from "react-router-dom";

export const Comment = ({
  _id,
  commentAuthor,
  createdAtFormatted,
  commentText,
}: Comment) => {
  return (
    <div className="flex items-start mb-4" key={_id}>
      <img
        className="w-10 h-10 rounded-full mr-4"
        src={`${commentAuthor.profileUrl}`}
        alt=""
        referrerPolicy="no-referrer"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <Link className="inline-block text-lg font-bold mr-2" to="#">
            {commentAuthor.fullName}
          </Link>
        </div>
        <div className="mb-3 pb-2 text-slate-500 dark:text-slate-300 border-b">
          <span className="text-sm text-slate-500 dark:text-slate-300">
            {createdAtFormatted}
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300">{commentText}</p>
      </div>
    </div>
  );
};
