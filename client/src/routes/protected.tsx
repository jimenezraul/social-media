import { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { lazyImport } from '../utils/lazyImports';

import Navbar from '../components/Navbar';
import { Dock } from '../components/Dock';
import { SearchForFriends } from '../features/users/routes/SearchForFriends';
import MobileAddPost from '../features/users/routes/MobileAddPost';

const { Profile } = lazyImport(() => import('../features/users'), 'Profile');
const { Friends } = lazyImport(() => import('../features/users'), 'Friends');
const { Feed } = lazyImport(() => import('../features/users'), 'Feed');
const { PostById } = lazyImport(() => import('../features/posts'), 'PostById');
const { FriendProfile } = lazyImport(() => import('../features/users'), 'FriendProfile');
const { Messages } = lazyImport(() => import('../features/messages'), 'Messages');

const Protected = () => {
  return (
    <div className="bg-slate-900 h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center"></div>}>
        <div className="flex max-h-full overflow-hidden">
          <Outlet />
        </div>
      </Suspense>
      <Dock />
    </div>
  );
};

export const protectedRoutes = [
  {
    path: '/',
    element: <Protected />,
    children: [
      {
        path: '/',
        element: <Feed />,
      },
      {
        path: '/feed',
        element: <Feed />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/profile/:id',
        element: <FriendProfile />,
      },
      {
        path: '/friends',
        element: <Friends />,
      },
      {
        path: '/post/:id',
        element: <PostById />,
      },
      {
        path: 'search',
        element: <SearchForFriends />,
      },
      {
        path: '/messages',
        element: <Messages />,
      },
      {
        path: '/messages/new',
        element: <Messages />,
      },
      {
        path: '/messages/:id',
        element: <Messages />,
      },
      {
        path: '/add-post',
        element: <MobileAddPost />,
      },
      { path: '*', element: <Navigate to="." /> },
    ],
  },
];
