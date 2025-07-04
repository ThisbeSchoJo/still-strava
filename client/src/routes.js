import App from "./components/App";
import Home from "./components/Home";
import ErrorPage from "./components/shared/ErrorPage";
import ActivityList from "./components/activities/ActivityList";
import UserProfile from "./components/users/UserProfile";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import SignUp from "./components/auth/SignUp";
import UserProfilePage from "./components/users/UserProfilePage";
import ActivityForm from "./components/activities/ActivityForm";

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
        path: "/activities/new",
        element: <ActivityForm />,
      },
      {
        path: "/activity-feed",
        element: <ActivityList />,
      },
      {
        path: "/users/:id",
        element: <UserProfilePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
