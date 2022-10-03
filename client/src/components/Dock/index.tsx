import {Link} from "react-router-dom";

export const Dock = () => {
  return (
    <div className="absolute bottom-0 flex md:hidden w-full px-3 h-20">
      <div className="text-white w-full rounded-t-xl flex justify-around items-center border border-b-0 border-slate-700 bg-slate-800 ">
        <Link to="/">
        <div className="text-center">
          <i className="text-xl fa-sharp fa-solid fa-house"></i>
          <p>Home</p>
        </div>
        </Link>
        <Link to="/search">
        <div className="text-center">
        <i className="text-xl fa-solid fa-magnifying-glass"></i>
          <p>Search</p>
        </div>
        </Link>
        <Link to="/addpost">
        <div className="text-center">
          <i className="text-xl fa-solid fa-square-plus"></i>
          <p>Add Post</p>
        </div>
        </Link>
        <Link to="/friends">
        <div className="text-center">
          <i className="text-xl fa-solid fa-user-group"></i>
          <p>Friends</p>
        </div>
        </Link>
        <Link to="/profile">
        <div className="text-center">
        <i className="text-xl fa-solid fa-circle-user"></i>
          <p>Profile</p>
        </div>
        </Link>
      </div>
    </div>
  );
};
