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
  const [openModal, setOpenModal] = useState(false);
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
      setOpenModal(false);
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
      <div
        className={`${
          openModal ? 'flex justify-center items-center' : 'hidden'
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full`}
      >
        <div className="relative w-full max-w-2xl h-auto">
          <div className="relative rounded-lg shadow bg-slate-700 border border-slate-500">
            <div className="flex justify-between items-start p-4 rounded-t border-b border-slate-600">
              <h3 className="text-xl font-semibold text-slate-100">
                Are you sure you want to delete this post?
              </h3>
              <button
                type="button"
                className="text-slate-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setOpenModal(false)}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="flex justify-end items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={handleDelete}
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Delete
              </button>
              <button
                onClick={() => setOpenModal(false)}
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
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
                  <button
                    onClick={() => setOpenModal(true)}
                    className="w-full flex justify-between items-center hover:bg-red-500 px-3 py-1 rounded"
                  >
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
                <span className="absolute text-sm left-16 font-bold text-slate-300 ml-2">
                  +{likes.length - 3} more
                </span>
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
