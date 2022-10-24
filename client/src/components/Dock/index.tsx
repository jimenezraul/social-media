import { Link } from "react-router-dom";

const iconList = [
  {
    name: "Home",
    icon: "fa-house",
    link: "/",
  },
  {
    name: "Search",
    icon: "fa-magnifying-glass",
    link: "/search",
  },
  {
    name: "Add Post",
    icon: "fa-square-plus",
    link: "/add-post",
  },
  {
    name: "Friends",
    icon: "fa-user-group",
    link: "/friends",
  },
  {
    name: "Profile",
    icon: "fa-circle-user",
    link: "/profile",
  },
];

export const Dock = () => {
  return (
    <div className="absolute bottom-0 flex md:hidden w-full px-1 h-20">
      <div className="text-white w-full rounded-t-lg flex justify-around items-center border border-b-0 border-slate-700 bg-slate-800">
        {iconList.map((icon) => (
          <Link key={icon.name} to={icon.link}>
            <div className="flex justify-center">
              <i className={`text-xl fa-solid ${icon.icon}`} />
            </div>
            <p>{icon.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
