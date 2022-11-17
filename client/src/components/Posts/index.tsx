import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LIKE_POST, DELETE_POST, ADD_COMMENT } from '../../utils/mutations';
import { useState, useRef } from 'react';
import { useOutside } from '../../utils/useOutside';

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
}: Post) => {
  const commentRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const menuRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isOpen, setIsOpen] = useState(false);
  const comment = commentCount <= 1 ? 'comment' : 'comments';
  const [likePost] = useMutation(LIKE_POST);
  const [deletePost] = useMutation(DELETE_POST);
  const [AddComment] = useMutation(ADD_COMMENT);

  useOutside(menuRef, setIsOpen);

  const postLikeHandler = async () => {
    try {
      await likePost({
        variables: {
          postId: _id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost({
        variables: {
          postId: _id,
        },
        update(cache: any) {
          cache.evict({ id: `Post:${_id}` });
        },
      });
    } catch (error) {
      console.log(error);
    }

    setIsOpen(false);
  };

  const addCommentHandler = async () => {
    // check if comment is empty
    if (commentRef.current.value.trim() === '') {
      return;
    }

    try {
      await AddComment({
        variables: {
          postId: _id,
          commentText: commentRef.current.value,
        },
      });
    } catch (error) {
      console.log(error);
    }
    // clear the comment form
    commentRef.current.value = '';
  };

  return (
    <article
      className={`${
        isLastEl && 'mb-24 md:mb-4'
      }  border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 flex flex-col bg-clip-border`}
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
                <div className="absolute top-16 right-7 flex flex-col bg-slate-800 border border-slate-600 rounded-lg p-2 space-y-2">
                  <button className="w-full flex justify-between items-center hover:bg-blue-500 px-3 py-1 rounded">
                    Edit <i className="text-xl fa-solid fa-pen-to-square"></i>
                  </button>
                  <button onClick={handleDelete} className="w-full flex justify-between items-center hover:bg-red-500 px-3 py-1 rounded">
                    Delete <i className="ml-2 text-xl fa-solid fa-trash"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex w-full border-b border-slate-500 pb-3">
          <Link className="inline-block mr-4" to={`/profile/${postAuthor._id}`}>
            <img
              className="rounded-full max-w-none w-14 h-14 bg-default p-0.5"
              src={`${postAuthor?.profileUrl}`}
              alt=""
              referrerPolicy="no-referrer"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Link
                className="inline-block text-lg font-bold mr-2"
                to={`/profile/${postAuthor._id}`}
              >
                {postAuthor.given_name} {postAuthor.family_name}
              </Link>
            </div>
            <div>
              <span className="italic text-sm text-slate-400">{createdAtFormatted}</span>
            </div>
          </div>
        </div>
      </div>
      {postImage && (
        <div className="p-2 mb-5 bg-default">
          <img className="w-full" src={`${postImage}`} alt="" />
        </div>
      )}
      <p className="px-6">{postText}</p>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <span className="-m-1 rounded-full border-2 border-slate-800">
            <i
              className={`${likeCount > 0 && 'bg-blue-600 rounded-full'} fa-solid fa-thumbs-up p-2`}
            ></i>
          </span>
          <span className="text-lg font-bold ml-3">{likeCount}</span>
          {/* images of the friends that like the post */}
          {likes.length > 0 && (
            <div className="flex justify-items-start items-center ml-3 w-1/2 h-8 relative">
              {likes.map((like, index) => {
                const position = index === 0 ? 'left-0' : index === 1 ? 'left-4' : 'left-8';
                if (index < 3) {
                  return (
                    <img
                      key={like._id}
                      className={`absolute w-8 h-8 ${position} rounded-full p-px bg-default`}
                      src={`${like.profileUrl}`}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  );
                }
                return null;
              })}
              {likes.length > 3 && (
                <span className="absolute text-sm left-16 font-bold text-slate-300 ml-2">+{likes.length - 3} more</span>
              )}
            </div>
          )}
          <p className="ml-auto text-sm">
            {commentCount} {comment}
          </p>
        </div>
        <div className="mt-6 mb-6 h-px bg-slate-500"></div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={postLikeHandler}
            className="py-2 px-4 font-medium hover:bg-slate-700 rounded-lg"
          >
            <i className="fa-solid fa-thumbs-up"></i> Like
          </button>
          <Link to={`/post/${_id}`}>
            <button className="py-2 px-4 font-medium hover:bg-slate-700 rounded-lg">
              <i className="fa-sharp fa-solid fa-comment-dots"></i> Comment
            </button>
          </Link>
          <button className="py-2 px-4 font-medium hover:bg-slate-700 rounded-lg">
            <i className="fa-sharp fa-solid fa-share-nodes"></i> Share
          </button>
        </div>

        <div className="relative">
          <input
            ref={commentRef}
            className="pt-2 pb-2 pl-3 w-full h-11 bg-slate-700 rounded-lg placeholder:text-slate-300 font-medium pr-20"
            type="text"
            placeholder="Write a comment"
          />
          <span
            onClick={addCommentHandler}
            className="flex absolute right-3 top-2/4 -mt-3 items-center"
          >
            <svg className="fill-slate-50 h-6 cursor-pointer" viewBox="0 0 24 24">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};
