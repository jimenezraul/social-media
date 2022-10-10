import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LIKE_POST } from "../../utils/mutations";
import { useState, useRef } from "react";
import { useOutside } from "../../utils/useOutside";
import { DELETE_POST, ADD_COMMENT } from "../../utils/mutations";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features//users/userSlice";

interface isLastEl extends Post {
  isLastEl: boolean;
  isProfile?: boolean;
}
export const Post = ({
  _id,
  postAuthor,
  createdAtFormatted,
  likeCount,
  postImage,
  postText,
  commentCount,
  isLastEl,
  isProfile,
  likes,
}: isLastEl) => {
  const commentRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const menuRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isOpen, setIsOpen] = useState(false);
  const comment = commentCount === 1 ? "comment" : "comments";
  const [likePost] = useMutation(LIKE_POST);
  const [deletePost] = useMutation(DELETE_POST);
  const user = useAppSelector(selectUser).user as User;
  const [AddComment] = useMutation(ADD_COMMENT);

  useOutside(menuRef, setIsOpen);

  const likePostHandler = async () => {
    try {
      await likePost({
        variables: {
          postId: _id,
        },
        // update the likeCount in the post cache
        update(cache, { data: { likes: userLike } }) {
          const userLikes = userLike.message === "Like added!" ? +1 : -1;
          cache.modify({
            id: `Post:${_id}`,
            fields: {
              likeCount() {
                return likeCount + userLikes;
              },
              likes() {
                return userLike.message === "Like added!"
                  ? [...likes, user]
                  : likes.filter((like: any) => like._id !== user._id);
              },
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    deletePost({
      variables: {
        postId: _id,
      },
      update(cache) {
        cache.evict({ id: `Post:${_id}` });
      },
    });

    setIsOpen(false);
  };

  const addCommentHandler = () => {
    // console.log values from the comment form
    console.log(commentRef.current.value);
    // add the comment to the database
    AddComment({
      variables: {
        postId: _id,
        commentText: commentRef.current.value,
      },
      // update the commentCount in the post cache
      update(cache, { data: { addComment: comment } }) {
        cache.modify({
          id: `Post:${_id}`,
          fields: {
            commentCount() {
              return commentCount + 1;
            },
          },
        });
      },
    });
    // clear the comment form
    commentRef.current.value = "";
  };

  return (
    <article
      className={`${
        isLastEl && "mb-24 md:mb-4"
      } border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 flex flex-col bg-clip-border`}
    >
      <div className="relative flex p-6 items-center justify-between">
        <div ref={menuRef}>
          {isProfile && (
            <>
              <i
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 absolute cursor-pointer text-xl top-6 right-6 text-slate-400 fa-solid fa-ellipsis-vertical"
              ></i>
              {isOpen && (
                <div className="absolute top-16 right-7 flex bg-slate-800 border border-slate-600 rounded-lg p-5">
                  <button
                    onClick={handleDelete}
                    className="text-red-400 hover:text-red-500"
                  >
                    <i className="text-xl fa-solid fa-trash"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex w-full border-b border-slate-500 pb-3">
          <Link className="inline-block mr-4" to={`/user/${_id}`}>
            <img
              className="rounded-full max-w-none w-14 h-14 border-2 border-slate-500 bg-gradient-to-r from-blue-600 to to-red-500"
              src={`${postAuthor?.profileUrl}`}
              alt=""
              referrerPolicy="no-referrer"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Link
                className="inline-block text-lg font-bold mr-2"
                to={`/user/${_id}`}
              >
                {postAuthor?.fullName}
              </Link>
            </div>
            <div className="text-slate-500 dark:text-slate-300">
              <span className="italic text-sm text-slate-500 dark:text-slate-300">
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
          <span className="-m-1 rounded-full border-2 border-white dark:border-slate-800">
            <i
              className={`${
                likeCount > 0 && "bg-blue-600 rounded-full"
              } fa-solid fa-thumbs-up p-2`}
            ></i>
          </span>
          <span className="text-lg font-bold ml-3">{likeCount}</span>
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
          <Link className="ml-auto" to="#">
            {commentCount} {comment}
          </Link>
        </div>
        <div className="mt-6 mb-6 h-px bg-slate-500"></div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={likePostHandler}
            className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg"
          >
            <i className="fa-solid fa-thumbs-up"></i> Like
          </button>
          <button className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
            <i className="fa-sharp fa-solid fa-comment-dots"></i> Comment
          </button>
          <button className="py-2 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
            <i className="fa-sharp fa-solid fa-share-nodes"></i> Share
          </button>
        </div>

        <div className="relative">
          <input
            ref={commentRef}
            className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-100 dark:bg-slate-700 rounded-lg placeholder:text-slate-600 dark:placeholder:text-slate-300 font-medium pr-20"
            type="text"
            placeholder="Write a comment"
          />
          <span
            onClick={addCommentHandler}
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
    </article>
  );
};
