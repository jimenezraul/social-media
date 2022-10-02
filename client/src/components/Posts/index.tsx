import { Link } from "react-router-dom";
export const Post = ({
  _id,
  postAuthor,
  createdAtFormatted,
  likeCount,
  postImage,
  postText,
  commentCount,
}: Post) => {
  const comment = commentCount === 1 ? "comment" : "comments";
  return (
    <article className="border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 flex flex-col bg-clip-border">
      <div className="flex p-6 items-center justify-between">
        <div className="flex w-full border-b border-slate-500 pb-3">
          <Link className="inline-block mr-4" to={`/user/${_id}`}>
            <img
              className="rounded-full max-w-none w-14 h-14 border-2 border-slate-500 bg-gradient-to-r from-blue-600 to to-red-500"
              src={`${postAuthor.profileUrl}`}
              alt=""
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Link className="inline-block text-lg font-bold mr-2" to={`/user/${_id}`}>
                {postAuthor.fullName}
              </Link>
            </div>
            <div className="text-slate-500 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-300">
                {createdAtFormatted}
              </span>
            </div>
          </div>
        </div>
      </div>
      {postImage && (
        <div className="p-2 mb-5 bg-gradient-to-r from-blue-600 to to-red-500">
          <img className="w-full" src={`${postImage}`} alt="" />
        </div>
      )}
      <p className="pr-6 pl-6">{postText}</p>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <Link className="inline-flex items-center" to="#">
            <span className="-m-1 rounded-full border-2 border-white dark:border-slate-800">
              <img
                className="w-6"
                src="https://cdn.iconscout.com/icon/free/png-256/like-2387659-1991059.png"
                alt=""
              />
            </span>
            <span className="text-lg font-bold ml-3">{likeCount}</span>
          </Link>
          <Link className="ml-auto" to="#">
            {commentCount} {comment}
          </Link>
        </div>
        <div className="mt-6 mb-6 h-px bg-slate-500"></div>
        <div className="flex items-center justify-between mb-6">
            <button className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
              Like
            </button>
            <button className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
              Comment
            </button>
            <button className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
              Share
            </button>
          </div>

        <div className="relative">
          <input
            className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 dark:bg-slate-600 rounded-lg placeholder:text-slate-600 dark:placeholder:text-slate-300 font-medium pr-20"
            type="text"
            placeholder="Write a comment"
          />
          <span className="flex absolute right-3 top-2/4 -mt-3 items-center">
            <svg
              className="fill-blue-500 dark:fill-slate-50 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};
