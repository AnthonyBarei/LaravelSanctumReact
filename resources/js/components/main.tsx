// react
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
// components
import App from './App';
import Layout from './Layouts/dashboard';
import AuthedRoute from './Routes/AuthedRoute';
import SignIn from './Pages/Auth/SignIn';
import SignUp from './Pages/Auth/SignUp';
import IsAuthenticatedRoutes from './Routes/IsAuthenticatedRoutes';
import PrivateRoutes from './Routes/PrivateRoutes';
import Verify from './Pages/Auth/Verify';
import VerifyEmail from './Pages/Auth/VerifyEmail';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import Home from './Pages/Home';
import ErrorBoundary from './Routes/ErrorBoundary';
import ErrorPage from './Layouts/ErrorPage';

const router = createBrowserRouter([
  {
    Component: App,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        Component: () => (
          <AuthedRoute>
            <Layout />
          </AuthedRoute>
        ),
        children: [
            // ...other authed routes
        ],
      },
      {
        path: '/admin',
        Component: () => (
          <AuthedRoute adminOnly>
            <Layout />
          </AuthedRoute>
        ),
        children: [
          // ...other admin routes
        ],
      },
      {
        path: '/sign-in',
        Component: SignIn,
      },
      {
        path: '/sign-up',
        Component: SignUp,
      },
      {
        path: '/verify-email',
        Component: Verify,
      },
      {
        path: '/verify-email/:token',
        Component: VerifyEmail,
      },
      {
        path: '/forgot-password',
        Component: ForgotPassword,
      },
      {
        path: '/reset-password/:token',
        Component: ResetPassword,
      },
      {
        path: '/',
        Component: () => (
          <PrivateRoutes>
            <Layout />
          </PrivateRoutes>
        ),
        children: [
          {
            path: '/',
            Component: Home,
          },
        ],
      },
      {
        path: '/',
        Component: () => (
          <IsAuthenticatedRoutes>
            <Layout />
          </IsAuthenticatedRoutes>
        ),
        children: [
            // ...other is authenticated routes
        ],
      },
    ],
  },
]);

const Boot = () => {
  return (
    <div className="app">
      <React.StrictMode>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </React.StrictMode>
    </div>
  );
};

export default Boot;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Boot />
);
