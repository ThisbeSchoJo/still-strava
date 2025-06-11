import App from "./components/App";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage"
import ActivityFeed from "./components/ActivityFeed";

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
          element: <ActivityFeed />,
        },
      ],
    },
  ];
  
  export default routes;