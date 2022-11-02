export const ChatUsers = ({ _id, given_name, family_name, profileUrl }: User) => {

  return (
    <div className="p-3 flex items-center bg-slate-800 rounded-lg border border-slate-700">
      <img src={`${profileUrl}`} alt="avatar" className="bg-default p-0.5 w-10 h-10 rounded-full" />
      <h1 className="ml-2">
        {given_name} {family_name}
      </h1>
    </div>
  );
};
