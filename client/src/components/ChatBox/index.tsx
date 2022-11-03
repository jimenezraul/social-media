import { useState, createRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';

const ChatBox = () => {
  const { data } = useQuery(GET_ME);
  const [friend, setFriend] = useState<User>();
  const [inputValue, setInputValue] = useState('');
  const messageRef = createRef<HTMLInputElement>();

  const filteredFriends = data?.me?.friends.filter((f: User) => {
    if (inputValue === '') {
      return null;
    }
    return f.given_name.toLowerCase().includes(inputValue.toLowerCase());
  });

  const handleFriendClick = (f: User) => {
    setFriend(f);
  };

  const sendMessage = () => {
    if (friend === undefined || messageRef.current?.value === '') return;
    console.log(friend, messageRef.current?.value);
    messageRef.current!.value = '';
  };

  return (
    <div className="min-w-full border border-slate-700 rounded-lg">
      <div className="w-full">
        <div className="relative flex items-center p-2 border-b border-slate-700">
          {friend ? (
            <div className="flex items-center">
              <img
                className="object-cover w-10 h-10 rounded-full bg-default p-0.5"
                src={`${friend.profileUrl}`}
                alt={`${friend.given_name} ${friend.family_name}`}
              />
              <span className="block ml-2 font-bold text-slate-300">
                {friend.given_name} {friend.family_name}
              </span>
              {/* <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span> */}
            </div>
          ) : (
            <div className="relative flex items-center w-full">
              <input
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
                placeholder="Search for friends"
                className="outline-none relative w-full bg-slate-700 text-gray-300 rounded-lg border border-slate-600 p-2"
              />
              <span className="absolute right-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <div
                className={`${
                  filteredFriends?.length >= 1 ? 'opacity-100' : 'opacity-0'
                } absolute z-50 p-2 top-12 w-full bg-slate-700 rounded-lg border border-slate-600`}
              >
                {filteredFriends?.map((f: User, index: number) => {
                  const isLast = index === filteredFriends.length - 1;
                  return (
                    <div
                      key={index}
                      onClick={() => handleFriendClick(f)}
                      className={`${
                        !isLast && 'border-b border-slate-800'
                      } hover:bg-slate-800 px-3 py-2 hover:rounded-lg flex items-center cursor-pointer`}
                    >
                      <img
                        src={`${f.profileUrl}`}
                        alt="avatar"
                        className="bg-default p-0.5 w-10 h-10 rounded-full"
                      />
                      <h1 className="ml-2">
                        {f.given_name} {f.family_name}
                      </h1>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="relative w-full p-6 overflow-y-auto min-h-[30rem] max-h-[40rem]">
          <ul className="space-y-2">
            <li className="flex justify-start">
              <div className="relative max-w-xl px-5 py-1 text-white rounded-full bg-green-500 shadow">
                <span className="block">Hi</span>
              </div>
            </li>
            <li className="flex justify-end">
              <div className="relative max-w-xl px-5 py-1 text-white bg-blue-500 rounded-full shadow">
                <span className="block">Hiiii</span>
              </div>
            </li>
            <li className="flex justify-end">
              <div className="relative max-w-xl px-5 py-1 text-white bg-blue-500 rounded-full shadow">
                <span className="block">how are you?</span>
              </div>
            </li>
            <li className="flex justify-start">
              <div className="relative max-w-xl px-5 py-1 text-white rounded-full bg-green-500 shadow">
                <span className="block">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between w-full p-3 border-t border-slate-700">
          {/* <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button> */}

          <input
            type="text"
            placeholder="Message"
            className="block w-full py-2 pl-4 mx-3 bg-slate-700 rounded-full outline-none focus:text-white"
            name="message"
            ref={messageRef}
            required
          />
          {/* <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button> */}
          <button onClick={sendMessage}>
            <svg
              className="w-8 h-8 text-slate-500 origin-center transform rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
