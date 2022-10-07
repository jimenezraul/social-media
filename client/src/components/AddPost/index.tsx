import { Button } from "../CustomButton";
import { useRef } from "react";

interface AddPostProps {
  me: User;
}

export const AddPost = ({ me }: AddPostProps) => {
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handlePost = async () => {
    const postText = textRef.current?.value;
    if (postText) {
      console.log(postText);
    }
  };

  return (
    <div className="hidden md:flex justify-center items-center p-2 border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 bg-clip-border">
      <img
        className="h-12 w-12 bg-default rounded-full p-0.5"
        src={`${me.profileUrl}`}
        alt=""
      />
      <div className="px-3 flex w-full">
        <div className="flex w-full">
          <textarea
            ref={textRef}
            className="block h-10 no-scrollbar p-2 w-full pl-6 text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="What's on your mind?"
          />
          <div className="flex absolute inset-y-0 right-8 items-center pl-3 pointer-events-none"></div>
        </div>
        <Button
          name="POST"
          onClick={handlePost}
          className="ml-1 bg-blue-500 px-4 rounded-full hover:bg-blue-600 cursor-pointer"
        />
      </div>
    </div>
  );
};
