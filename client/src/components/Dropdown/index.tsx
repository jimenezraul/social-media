type logout = {
  logoutUser: () => void;
};

export const Dropdown = ({ logoutUser }: logout) => {
  return (
    <div className="z-20 absolute top-12 bg-slate-700 p-2 w-32 right-1 rounded-lg border border-slate-600">
      <button onClick={() => logoutUser()} className="text-start px-4 py-2 rounded-lg w-full text-white hover:bg-slate-600">
        Logout
      </button>
    </div>
  );
};