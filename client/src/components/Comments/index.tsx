import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LIKE_COMMENT } from "../../utils/mutations";
import { useRef, useEffect } from "react";

export const CommentCard = ({
  _id,
  commentAuthor,
  createdAtFormatted,
  commentText,
  likesCount,
  likes,
  replies,
  isLastEl,
}: Comments) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [LikeComment] = useMutation(LIKE_COMMENT);
  const reply = replies.length <= 1 ? "reply" : "replies";
  const repliesCount = replies.length;

  useEffect(() => {
    const hashLink = window.location.hash;
    if (commentRef.current && hashLink === `#${_id}`) {
      commentRef.current.scrollIntoView({ behavior: "smooth" });
      // get the div element with the id of newComment
      const newComment = document.querySelector('#new-comment');
      
      if (!newComment) {
        const div = document.createElement("div");
        div.id = "new-comment";
        div.classList.add("bg-default", "p-2", "rounded-md", "text-white", "mb-2");
        div.innerText = `New comment from ${commentAuthor.fullName}.`;
        commentRef.current.prepend(div);
      }
    }
  }, [_id, commentAuthor.fullName]);

  const likeCommentHandler = async () => {
    try {
      await LikeComment({
        variables: {
          commentId: _id,
        },
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div
      ref={commentRef}
      id={_id}
      className={`${
        isLastEl && "mb-24 md:mb-6"
      } my-2 bg-slate-800 rounded-lg shadow-xl p-5 border border-slate-700 transition-all duration-300`}
    >
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
          <div className="mb-3 pb-2 text-slate-300 border-b">
            <span className="text-sm text-slate-400 italic">
              {createdAtFormatted}
            </span>
          </div>
          <p className="text-slate-300">{commentText}</p>
          <div className="pt-6">
            <div className="flex justify-between items-center">
              <span className="-m-1 rounded-full border-2 border-slate-800">
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
                    const position = index === 0 ? "left-0" : index === 1 ? "left-4" : "left-8";
                    if (index < 3) {
                      return (
                        <img
                          key={like._id}
                          className={`absolute w-8 h-8 ${position} rounded-full border border-slate-500 bg-default`}
                          src={`${like.profileUrl}`}
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      );
                    }
                    return null;
                  })}
                  {likes.length > 3 && (
                    <span className="text-slate-300 ml-2">
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
                onClick={likeCommentHandler}
                className="py-2 px-4 font-medium hover:bg-slate-700 rounded-lg"
              >
                <i className="fa-solid fa-thumbs-up"></i> Like
              </button>
              <Link to={`/comment/${_id}`}>
                <button className="py-2 px-4 font-medium hover:bg-slate-700 rounded-lg">
                  <i className="fa-sharp fa-solid fa-comment-dots"></i> Replies
                </button>
              </Link>
              <button className="py-2 px-4 font-medium hover:bg-slate-700 rounded-lg">
                <i className="fa-sharp fa-solid fa-share-nodes"></i> Share
              </button>
            </div>

            <div className="relative">
              <input
                className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-700 rounded-lg placeholder:text-slate-300 font-medium pr-20"
                type="text"
                placeholder="Reply to a comment"
              />
              <span
                // onClick={addCommentHandler}
                className="flex absolute right-3 top-2/4 -mt-3 items-center"
              >
                <svg
                  className="fill-slate-50 h-6 cursor-pointer"
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
