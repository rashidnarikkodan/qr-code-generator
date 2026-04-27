import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    // error is narrowed to ErrorResponse type
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
        {error.data?.message && <p>{error.data.message}</p>}
      </div>
    );
  } else if (error instanceof Error) {
    // error is a standard JS Error
    return (
      <div>
        <h1>Unexpected Error</h1>
        <p>{error.message}</p>
      </div>
    );
  } else {
    // error is some other unknown type
    return <h1>An unknown error occurred</h1>;
  }
}
