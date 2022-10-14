import { Button } from "../CustomButton";
import { useRef } from "react";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "../../utils/mutations";
import { GET_ME } from "../../features/users/routes/api/queries";

interface AddPostProps {
  me: User;
}

export const AddPost = ({ me }: AddPostProps) => {
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
            const { me } = cache.readQuery({
              query: GET_ME,
            }) as { me: User };
            
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
        textRef.current!.value = "";
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  return (
    <div className="hidden md:flex items-center p-2 border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 bg-clip-border">
      <img
        className="h-10 w-10 bg-default rounded-full p-0.5"
        src={`${me?.profileUrl}`}
        alt=""
      />
      <div className="px-3 flex w-full">
        <div className="flex w-full">
          <textarea
            ref={textRef}
            className="block h-9 no-scrollbar p-2 w-full pl-6 text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="What's on your mind?"
          />
          <div className="flex absolute inset-y-0 right-8 items-center pl-3 pointer-events-none"></div>
        </div>
        <Button
          name="POST"
          onClick={handlePost}
          className="text-sm ml-1 bg-blue-600 px-4 rounded-full hover:bg-blue-700 cursor-pointer"
        />
      </div>
    </div>
  );
};
