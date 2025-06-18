import App from "./components/App";
import Home from "./components/Home";
import ErrorPage from "./components/shared/ErrorPage";
import ActivityList from "./components/activities/ActivityList";
import UserProfile from "./components/users/UserProfile";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";

const routes = [
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/activity-feed",
          element: <ActivityList />,
        },
        {
          path: "/user-profile",
          element: <UserProfile />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
      ],
    },
  ];
  
  export default routes;