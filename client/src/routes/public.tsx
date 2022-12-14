import { Suspense } from 'react';
import { lazyImport } from '../utils/lazyImports';
import { Outlet, Navigate } from 'react-router-dom';
import { Landing } from '../features/landingPage';
import { VerifyEmail } from '../features/users';
import ForgotPassword from '../features/users/routes/ForgotPassword';
import PrivacyPolicy from '../features/users/routes/PrivacyPolicy';
import DataDeletion from '../features/users/routes/DataDeletion';
import ResetPassword from '../features/users/routes/reset-password';

const { Login } = lazyImport(() => import('../features/users'), 'Login');
const { Register } = lazyImport(() => import('../features/users'), 'Register');

const Public = () => {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center"></div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export const publicRoutes = [
  {
    element: <Public />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register/*',
        element: <Register />,
      },
      {
        path: '/verify',
        element: <VerifyEmail />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/data-deletion',
        element: <DataDeletion />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
      { path: '*', element: <Navigate to="/login" /> },
    ],
  },
];
