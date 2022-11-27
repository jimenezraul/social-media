import { Button } from '../CustomButton';
import { useRef } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_POST } from '../../utils/mutations';
import { GET_ME } from '../../utils/queries';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/userSlice';

interface AddPostProps {
  me: User;
}

export const AddPost = ({ me }: AddPostProps) => {
  const user = useAppSelector(selectUser).user;
  const navigate = useNavigate();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [addPost] = useMutation(ADD_POST);
  if (me === undefined) return <div>Loading...</div>;

  const handlePost = async () => {
    const postText = textRef.current?.value.trim();
    if (postText) {
      try {
        await addPost({
          variables: {
            postText,
          },
          // update user post count
          update(cache, { data: { addPost } }) {
            cache.writeQuery({
              query: GET_ME,
              data: {
                me: {
                  ...me,
                  postCount: me.postCount + 1,
                  posts: [addPost, ...me.posts],
                },
              },
            });
          },
        });
        textRef.current!.value = '';
        navigate('/feed');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex justify-around items-center p-2 border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 bg-clip-border">
      <div className="flex">
        <img
          className="h-10 w-10 bg-default rounded-full p-0.5"
          src={`${user.profileUrl}`}
          alt=""
          referrerPolicy="no-referrer"
        ></img>
      </div>
      <div className="flex flex-grow px-1">
        <div className="flex w-full">
          <textarea
            ref={textRef}
            className="block h-9 no-scrollbar p-2 w-full pl-6 text-sm rounded-full border  bg-slate-700 border-slate-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="What's on your mind?"
          />
          <div className="flex absolute inset-y-0 right-8 items-center pl-3 pointer-events-none"></div>
        </div>
        <Button
          name="POST"
          onClick={handlePost}
          className="text-sm text-white ml-1 bg-blue-600 px-4 rounded-full hover:bg-blue-700 cursor-pointer"
        />
      </div>
    </div>
  );
};
