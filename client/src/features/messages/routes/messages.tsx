import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/userSlice';
import { ChatUsers } from '../../../components/ChatUsersList';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../../../utils/queries';
import ChatBox from '../../../components/ChatBox';
import { useNavigate, useParams } from 'react-router-dom';
import { subscribeToNewMessage } from '../../../utils/subscribe';

export const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState<User[]>([]);
  const { data, loading, error, subscribeToMore } = useQuery(GET_ME);
  const user = useAppSelector(selectUser).user;

  const newMessage = window.location.pathname.split('/').includes('new');

  useEffect(() => {
    if (loading) return;
    if (error) return console.log(error);

    setMembers(
      data?.me?.messages?.map((member: any) => {
        const otherMember = member?.members?.find((m: User) => m._id !== user._id);
        const isRead =
          member?.messages[member?.messages.length - 1]?.status === 'delivered' &&
          member?.messages[member?.messages.length - 1]?.sender._id !== user._id;

        return {
          ...otherMember,
          isRead,
        };
      }),
    );
  }, [data, loading, error, user]);

  useEffect(() => {
    if (!id && members.length > 0 && !newMessage) {
      navigate(`/messages/${members[0]._id}`);
    }
  }, [id, members, navigate, newMessage]);

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToNewMessage(subscribeToMore);
    }
  }, [subscribeToMore]);

  const messageSelectHandler = () => {
    setSelectedMessage(!selectedMessage);
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="error">{error.message}</div>;

  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-row justify-center">
        <div
          className={`p-1 ${
            !selectedMessage ? 'flex' : 'hidden'
          } md:flex flex-col space-y-2 w-full md:w-4/12`}
        >
          <div className="text-slate-300 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
            <div className="flex flex-row justify-between items-center bg-slate-700 px-5 py-3 border-b border-slate-800">
              <h1 className="text-2xl font-bold">Messages</h1>
              <i
                onClick={() => navigate('/messages/new')}
                className="hover:text-blue-400 cursor-pointer text-2xl fa-solid fa-pen-to-square"
              ></i>
            </div>
            {members.length > 0 &&
              members.map((member: User, index: number) => {
                const isLast = index === members.length - 1;
                return (
                  <ChatUsers
                    key={index}
                    {...member}
                    isLast={isLast}
                    setSelectedMessage={messageSelectHandler}
                  />
                );
              })}
          </div>
        </div>
        <div
          className={`p-1 ${
            !selectedMessage ? 'hidden' : 'flex w-full'
          } md:flex md:w-8/12 lg:w-6/12 text-white`}
        >
          <div className="flex flex-grow max-h-full bg-slate-800 rounded-lg">
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
              <div className="flex w-full h-full">
                <ChatBox id={id} setSelectedMessage={messageSelectHandler} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
