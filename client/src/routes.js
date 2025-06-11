import App from "./components/App";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage"

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
      ],
    },
  ];
  
  export default routes;