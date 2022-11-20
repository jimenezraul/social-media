import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_POST } from '../../utils/mutations';

interface Iprops {
  _id: string;
  modal: boolean;
  setModal: (value: boolean) => void;
  title: string;
  postText: string;
}

const EditModal = ({ _id, modal, setModal, postText, title }: Iprops) => {
  const [text, setText] = useState(postText);
  const [updatePost] = useMutation(UPDATE_POST);

  const updatePostHandler = async () => {
    if (text.trim() === '') return;

    try {
      await updatePost({
        variables: {
          postId: _id,
          postText: text,
        },
      });
      setModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setText(postText);
    setModal(false);
  };

  return (
    <div
      className={`${
        modal ? 'flex justify-center items-center' : 'hidden'
      } backdrop overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full`}
    >
      <div className="relative w-full max-w-2xl h-auto">
        <div className="relative rounded-lg shadow bg-slate-800 border border-slate-600">
          <div className="flex justify-between items-start p-4 rounded-t border-b border-slate-600">
            <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
            <button
              type="button"
              className="text-slate-400 bg-transparent hover:bg-slate-400 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={handleClose}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div>
            <textarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              className="w-full p-4 text-slate-100 bg-slate-800"
            ></textarea>
          </div>
          <div className="flex justify-end items-center p-6 space-x-2 rounded-b border-t border-slate-600">
            <button
              onClick={updatePostHandler}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Update
            </button>
            <button
              onClick={handleClose}
              type="button"
              className="rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-slate-500 text-gray-100 border-slate-500 hover:text-white hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
