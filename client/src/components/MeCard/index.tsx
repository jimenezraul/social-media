export const MeCard = ({ profileUrl, fullName, posts, friends }: User) => {
  const postCount = posts?.length;
  const postOrPosts = posts?.length === 1 ? "post" : "posts";
  const friendCount = friends?.length;
  const friendOrFriends = friends?.length === 1 ? "friend" : "friends";
  
  return (
    <div className="overflow-hidden bg-slate-800 border border-slate-600 rounded-lg w-full hover:shadow-none relative flex flex-col mx-auto shadow-lg">
      <img
        className="max-h-28 w-full opacity-80 absolute top-0 -z-0"
        src="/assets/img/banner-bg.jpg"
        alt=""
      />
      <div className="flex flex-col items-center mt-16 text-white z-10">
        <img
          className="w-28 h-28 p-1 bg-default rounded-full"
          src={`${profileUrl}`}
          alt=""
        />
        <div className="mt-3 font-bold flex flex-col">{fullName}</div>
      </div>
      {friendCount !== undefined && (
        <div className="flex justify-center font-bold  text-xs text-slate-300 my-4">
          <div className="bg-slate-700 border rounded-l-2xl rounded-r-sm border-gray-300 p-1 px-4">
            {postCount} {postOrPosts}
          </div>
          <div className="bg-slate-700 border rounded-r-2xl rounded-l-sm border-gray-300 p-1 px-4">
            {friendCount} {friendOrFriends}
          </div>
        </div>
      )}
    </div>
  );
};
