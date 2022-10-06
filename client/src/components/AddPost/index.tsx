import { Button } from "../CustomButton";

interface AddPostProps {
  me: User;
}

export const AddPost = ({ me }: AddPostProps) => {
  return (
    <div className="hidden md:flex justify-center items-center p-2 border border-slate-700 mb-4 break-inside rounded-lg bg-slate-800 bg-clip-border">
      <img
        className="h-12 w-12 bg-default rounded-full p-0.5"
        src={`${me.profileUrl}`}
        alt=""
      />
      <div className="px-3 flex w-full">
        <div className="relative w-full">
          <input
            type="search"
            id="default-search"
            className="block p-2 pl-6 w-full text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="What's on your mind?"
            onChange={(e) => console.log(e.target.value)}
          />
          <div className="flex absolute inset-y-0 right-8 items-center pl-3 pointer-events-none">
            <Button
              name="POST"
              onClick={() => console.log("Post")}
              className="bg-blue-500 px-4 py-1 rounded-full absolute -right-7 z-50 hover:bg-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
