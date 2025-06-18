import App from "./components/App";
import Home from "./components/Home";
import ErrorPage from "./components/shared/ErrorPage";
import ActivityList from "./components/activities/ActivityList";
import UserProfile from "./components/users/UserProfile";

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
      ],
    },
  ];
  
  export default routes;