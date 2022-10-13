import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  notifications,
  setNotifications,
} from "../../features/users/userSlice";

export const Notifications = ({ setNotificationsOpen }: Notifications) => {
  const dispatch = useAppDispatch();
  const myNotification = useAppSelector(notifications);

  if (myNotification.length === 0) {
    return (
      <div className="w-80 text-center z-50 absolute bg-slate-800 top-8 -right-14 md:-right-2 p-4 rounded-md border border-slate-700 text-white">
        <h1>No Notifications</h1>
      </div>
    );
  }

  const clearAllHandler = () => {
    localStorage.setItem("notifications", JSON.stringify([]));
    dispatch(setNotifications([]));
    setNotificationsOpen(false);
  };

  const removeNotificationHandler = (id: string) => {
    const newNotifications = myNotification.filter(
      (n: any) => n.post._id !== id
    );
    localStorage.setItem("notifications", JSON.stringify(newNotifications));
    dispatch(setNotifications(newNotifications));
    setNotificationsOpen(false);
  };

  return (
    <div className="overflow-hidden w-80 z-50 absolute bg-slate-800 top-10 -right-14 md:-right-2 rounded-md border border-slate-700 text-white">
      <div className="w-full py-1 px-5 text-end bg-slate-700">
        <span
          onClick={() => clearAllHandler()}
          className="cursor-pointer text-sm"
        >
          Clear All
        </span>
      </div>
      {myNotification.map((notification: any, index: number) => {
        const isLast = index === myNotification.length - 1;
        return (
          <div
            key={index}
            className={`${
              !isLast && "border-b border-slate-700"
            } flex flex-wrap items-center space-x-2 py-3 px-4`}
          >
            <img
              className="h-8 w-8 rounded-full bg-default p-0.5"
              src={notification.user.profileUrl}
              alt=""
              referrerPolicy="no-referrer"
            />

            <div className="flex flex-1 flex-col justify-center relative">
              <p className="text-xs">{notification.message}</p>
              <p className="text-xs text-slate-400">
                {/* check if postText is more than 20 words */}
                {notification.post.postText?.length > 20
                  ? notification.post.postText.slice(0, 20) + "..."
                  : notification.post.postText}
              </p>
              <button
                onClick={() => removeNotificationHandler(notification.post._id)}
                type="button"
                className="absolute right-0 bg-slate-700 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-slate-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
