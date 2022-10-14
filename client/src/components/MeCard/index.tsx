interface ME {
  me: User;
}

export const MeCard = ({ me }: ME) => {
  if (me === undefined)
    return (
      <div className="overflow-hidden bg-slate-800 border border-slate-600 rounded-lg w-full hover:shadow-none relative flex flex-col mx-auto shadow-lg">
        <div className="absolute bg-slate-900 h-28 w-full"></div>
        <div className="flex flex-col items-center mt-16 text-white z-10">
          <div className="rounded-full bg-slate-700 h-28 w-28"></div>
          <div className="h-2 mt-3 w-40 bg-slate-700 rounded col-span-2"></div>
        </div>

        <div className="flex-1 space-y-6 py-6">
          <div className="space-y-3 flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-52">
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );

  const { profileUrl, fullName, posts, friends } = me;
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
