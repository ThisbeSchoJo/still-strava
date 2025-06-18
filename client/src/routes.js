import App from "./components/App";
import Home from "./components/Home";
import ErrorPage from "./components/shared/ErrorPage";
import ActivityList from "./components/activities/ActivityList";

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
      ],
    },
  ];
  
  export default routes;