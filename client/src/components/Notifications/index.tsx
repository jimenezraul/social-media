import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { MARK_NOTIFICATIONS_READ } from '../../utils/mutations';
import { GET_NOTIFICATIONS } from '../../utils/queries';

interface Iprops {
  setNotificationsOpen: (value: boolean) => void;
  notificationsByUser: Notifications[];
}

export const Notifications = ({ setNotificationsOpen, ...args }: Iprops) => {
  const navigate = useNavigate();
  const notifications = args.notificationsByUser || [];

  const [markNotificationsRead] = useMutation(MARK_NOTIFICATIONS_READ);

  if (notifications.length === 0) {
    return (
      <div className="w-80 text-center z-50 absolute bg-slate-800 top-8 -right-16 md:-right-2 p-4 rounded-md border border-slate-700 text-white">
        <h1>No Notifications</h1>
      </div>
    );
  }

  const clearAllHandler = () => {
    setNotificationsOpen(false);
  };

  const removeNotificationHandler = async (id: string, userId: string) => {
    const me = notifications.find((notification) => notification._id === id);

    try {
      await markNotificationsRead({
        variables: {
          notificationId: id,
        },
        update(cache) {
          const data: Iprops | null = cache.readQuery({
            query: GET_NOTIFICATIONS,
            variables: {
              userId: me?.recipient?._id,
            },
          });
          const newData = data?.notificationsByUser.filter(
            (notification: Notifications) => notification._id !== id,
          );

          cache.writeQuery({
            query: GET_NOTIFICATIONS,
            variables: {
              userId: me?.recipient?._id,
            },
            data: {
              notificationsByUser: newData,
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
    setNotificationsOpen(false);
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="overflow-hidden w-80 z-50 absolute bg-slate-800 top-10 -right-16 md:-right-2 rounded-md border border-slate-700 text-white">
      <div className="w-full py-1 px-5 text-end bg-slate-700">
        <span onClick={() => clearAllHandler()} className="cursor-pointer text-sm">
          Clear All
        </span>
      </div>
      {notifications.map((notification: any, index: number) => {
        const isLast = index === notifications.length - 1;

        return (
          <div
            key={index}
            className={`${
              !isLast && 'border-b border-slate-700'
            } flex flex-wrap items-center space-x-2 py-3 px-4`}
          >
            <img
              className="h-8 w-8 rounded-full bg-default p-0.5"
              src={notification.sender.profileUrl}
              alt=""
              referrerPolicy="no-referrer"
            />

            <div className="flex flex-1 flex-col justify-center relative">
              <p className="text-xs w-10/12 mb-2">{notification.message}</p>
              <p className="text-xs text-slate-400 w-10/12">
                {/* check if postText is more than 20 words */}
                {notification.post?.postText?.length > 20
                  ? notification.post?.postText.slice(0, 20) + '...'
                  : notification.post?.postText}
              </p>
              {notification?.type === 'FRIEND_REQUEST' && (
                <button
                  onClick={() =>
                    removeNotificationHandler(notification._id, notification.sender._id)
                  }
                  className="text-xs text-start text-blue-500 z-50"
                >
                  View Profile
                </button>
              )}
              {notification.type === 'comment' && (
                <Link
                  onClick={() =>
                    removeNotificationHandler(notification._id, notification.sender._id)
                  }
                  to={`/post/${notification.postId}/#${notification.post._id}`}
                >
                  see comment
                </Link>
              )}
              <button
                onClick={() => removeNotificationHandler(notification._id, notification.sender._id)}
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
