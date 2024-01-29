import { useLocation, useNavigate, useRouteError } from "react-router-dom";
const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  return (
    <div className="bg-blue-300 min-h-screen">
      <div className="flex flex-col items-center space-y-3 py-10">
        <h1 className="text-5xl text-red-500 font-bold">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          May be the Page is{" "}
          <span className="font-bold">Under construction or</span>
        </p>
        <p className="text-3xl text-red-500 font-bold-bold">
          <i>{error.statusText || error.message}</i>
        </p>

        <button
          onClick={() => navigate(from, { replace: true })}
          className="btn btn-secondary"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
