import { Link } from "react-router-dom";

interface PropsComment extends Comment {
  isLastEl?: boolean;
}

export const Comment = ({
  _id,
  commentAuthor,
  createdAtFormatted,
  commentText,
  likesCount,
  likes,
  replies,
  isLastEl,
}: PropsComment) => {
  const reply = replies.length <= 1 ? "reply" : "replies";
  const repliesCount = replies.length;
  return (
    <div className={`${isLastEl && "mb-24 md:mb-6"} my-2 bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700`}>
      <div className="flex items-start mb-4" key={_id}>
        <img
          className="w-10 h-10 rounded-full mr-4 bg-default p-0.5"
          src={`${commentAuthor.profileUrl}`}
          alt=""
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col w-full">
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
          <div className="">
            <div className="flex justify-between items-center">
              <span className="-m-1 rounded-full border-2 border-white dark:border-slate-800">
                <i
                  className={`${
                    likesCount > 0 && "bg-blue-600 rounded-full"
                  } fa-solid fa-thumbs-up p-2`}
                ></i>
              </span>
              <span className="text-lg font-bold ml-3">{likesCount}</span>
              {/* images of the friends that like the post */}
              {likes.length > 0 && (
                <div className="ml-3 flex items-center relative w-1/2">
                  {likes.map((like, index) => {
                    if (index < 3) {
                      return (
                        <img
                          key={like._id}
                          className={`absolute w-8 h-8 left-${
                            index * 2
                          } rounded-full border border-slate-500 bg-default`}
                          src={`${like.profileUrl}`}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      );
                    }
                    return null;
                  })}
                  {likes.length > 3 && (
                    <span className="text-slate-500 dark:text-slate-300 ml-2">
                      +{likes.length - 3}
                    </span>
                  )}
                </div>
              )}
              <p className="ml-auto">
                {repliesCount} {reply}
              </p>
            </div>
            <div className="mt-6 mb-6 h-px bg-slate-500"></div>
            <div className="flex items-center justify-between mb-6">
              <button
                // onClick={likePostHandler}
                className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
              >
                <i className="fa-solid fa-thumbs-up"></i> Like
              </button>
              <Link to={`/comment/${_id}`}>
                <button className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                  <i className="fa-sharp fa-solid fa-comment-dots"></i> Comment
                </button>
              </Link>
              <button className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                <i className="fa-sharp fa-solid fa-share-nodes"></i> Share
              </button>
            </div>

            <div className="relative">
              <input
                className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 dark:bg-slate-700 rounded-lg placeholder:text-slate-600 dark:placeholder:text-slate-300 font-medium pr-20"
                type="text"
                placeholder="Reply to a comment"
              />
              <span
                // onClick={addCommentHandler}
                className="flex absolute right-3 top-2/4 -mt-3 items-center"
              >
                <svg
                  className="fill-blue-500 dark:fill-slate-50 h-6 cursor-pointer"
                  viewBox="0 0 24 24"
                >
                  <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
