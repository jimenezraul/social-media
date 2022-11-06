import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import {
  selectUser,
  user_logout,
  notifications,
} from '../../features/users/userSlice';
import { useAppDispatch } from '../../app/hooks';
import { useMutation, useQuery } from '@apollo/client';
import { LOGOUT } from '../../utils/mutations';
import { Dropdown } from '../Dropdown';
import { useOutside } from '../../utils/useOutside';
import { Notifications } from '../Notifications';
import { GET_ME } from '../../utils/queries';
import { subscribeToFriendRequests } from '../../utils/subscribe';

const Navbar = () => {
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [currentPath, setCurrentPath] = useState<String>(
    window.location.pathname
  );
  const { data, loading, error, subscribeToMore } = useQuery(GET_ME);

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (!data) return;

    if (subscribeToMore) {
      subscribeToFriendRequests(subscribeToMore);
    }
    // add to notifications just one time
    if (data.me.friendRequestCount > 0) {
      const notification = localStorage.getItem('notification');
      console.log(notification);
    }
  }, [data, loading, error, subscribeToMore]);

  // get notifications from the local storage
  const notification = useAppSelector(notifications);

  const [logout] = useMutation(LOGOUT);

  const routes = [
    {
      name: 'feed',
      path: '/feed' || '/',
    },
    {
      name: 'search',
      path: '/search',
    },
  ];

  useOutside(menuRef, setIsOpen);
  useOutside(notificationsRef, setNotificationsOpen);

  const logoutUser = async () => {
    dispatch(user_logout());
    await logout();
    localStorage.removeItem('user');
    window.location.reload();
  };

  const user = useAppSelector(selectUser).user;
  const { profileUrl } = Object(user);

  return (
    <nav className='relative flex items-center justify-between flex-wrap p-6'>
      <div className='container mx-auto flex flex-wrap  justify-between'>
        <div className='flex items-center flex-shrink-0 text-white mr-6'>
          <span className='font-semibold text-xl tracking-tight'>
            Social Media
          </span>
        </div>

        <div
          className={`w-full hidden flex-grow md:flex md:items-center md:w-auto`}
        >
          <div className='text-sm flex'>
            {routes.map((route, index) => {
              // check if the route is active
              const isActive = currentPath === route.path;

              return (
                <Link
                  key={index}
                  to={route.path}
                  onClick={() => setCurrentPath(route.path)}
                  className={`${
                    isActive ? 'text-white' : 'text-gray-400'
                  } uppercase block lg:inline-block lg:mt-0  hover:text-white mr-4`}
                >
                  {route.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className='flex items-center space-x-5'>
          <Link to='/messages'>
            <i className='text-xl fa-solid fa-comment text-slate-300'></i>
          </Link>
          <div className='relative' ref={notificationsRef}>
            <div
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className='cursor-pointer'
            >
              <i className='text-xl fa-solid fa-bell text-slate-300'></i>
              <div
                className={`${
                  notification.length > 0 ? 'flex' : 'hidden'
                } absolute -top-2 -right-4 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900`}
              >
                {notification.length}
              </div>
            </div>
            {notificationsOpen && (
              <Notifications setNotificationsOpen={setNotificationsOpen} />
            )}
          </div>
          <div className='flex relative justify-center items-center cursor-pointer' ref={menuRef}>
            <img
              className='mr-2 h-10 bg-default rounded-full p-0.5'
              src={`${profileUrl}`}
              alt=''
              referrerPolicy='no-referrer'
              onClick={() => setIsOpen(!isOpen)}
            ></img>
            {isOpen && (
              <Dropdown
                logoutUser={logoutUser}
                setIsOpen={setIsOpen}
                setCurrentPath={setCurrentPath}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
