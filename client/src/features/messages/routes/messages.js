import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/userSlice';
import { ChatUsers } from '../../../components/ChatUsers';
import { useQuery } from '@apollo/client';
import { GET_MESSAGES_BY_USER } from '../../../utils/queries';
import ChatBox from '../../../components/ChatBox';
import { useNavigate } from 'react-router-dom';

export const Messages = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const { data, loading, error } = useQuery(GET_MESSAGES_BY_USER);
  const user = useAppSelector(selectUser).user;

  const newMessage = window.location.pathname.split('/').includes('new');

  useEffect(() => {
    if (loading) return;
    if (error) return console.log(error);
    setMembers(
      data?.chatByUser.map((member) => {
        const otherMember = member.members.find((m) => m._id !== user._id);
        return otherMember;
      }),
    );
  }, [data, loading, error, user]);

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="error">{error.message}</div>;

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-row justify-center">
        <div className="p-1 flex flex-col space-y-2 w-full md:w-4/12">
          <div className="text-white bg-slate-800 rounded-lg px-5 py-3">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-2xl font-bold">Messages</h1>
              <i onClick={()=> navigate("/messages/new")} className="cursor-pointer text-2xl fa-solid fa-pen-to-square"></i>
            </div>
            {!members.length ? (
              <div></div>
            ) : (
              members.map((member) => <ChatUsers key={member._id} {...member} />)
            )}
          </div>
        </div>
        <div className="h-full p-1 hidden md:flex md:w-8/12 lg:w-6/12 text-white">
          <div className="min-h-full w-full bg-slate-800 rounded-lg">
            {!members.length && !newMessage ? (
              <div className="w-full flex flex-col justify-center items-center p-5">
                <h1 className="text-2xl font-bold">No Messages</h1>
                <p className="text-center">
                  You have no messages yet. Click the{' '}
                  <span>
                    <i className="text-xl fa-solid fa-pen-to-square"></i>
                  </span>{' '}
                  icon to start a new conversation.
                </p>
              </div>
            ) : (
              <ChatBox />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
