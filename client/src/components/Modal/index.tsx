interface IProps {
  title: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
}

const Modal = ({ title, openModal, setOpenModal, handleDelete }: IProps) => {
  return (
    <div
      className={`${
        openModal ? 'flex justify-center items-center' : 'hidden'
      } backdrop overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full`}
    >
      <div className="relative w-full max-w-2xl h-auto">
        <div className="relative rounded-lg shadow bg-slate-800 border border-slate-500">
          <div className="flex justify-between items-start p-4 rounded-t border-b border-slate-600">
            <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
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
          <div className="flex justify-end items-center p-6 space-x-2 rounded-b ">
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
              className="rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-slate-500 text-gray-100 border-slate-400 hover:text-white hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
