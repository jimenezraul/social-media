import { Link } from 'react-router-dom';

export const ChatUsers = ({ _id, given_name, family_name, profileUrl, isLast, isRead }: User) => {
  return (
    <Link to={`/messages/${_id}`}>
      <div
        className={`hover:bg-slate-700 p-3 flex items-center bg-slate-800  ${!isLast && 'border-b border-slate-700'} `}
      >
        {isRead && (
          <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
          )}
        <img
          src={`${profileUrl}`}
          alt="avatar"
          className="bg-default p-0.5 w-10 h-10 rounded-full"
          referrerPolicy="no-referrer"
        />
        <h1 className="ml-2">
          {given_name} {family_name}
        </h1>
      </div>
    </Link>
  );
};
