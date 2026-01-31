
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Error = () => (
  <>
    <div className="h-screen flex items-center justify-center bg-white dark:bg-dark">
      <div className="text-center">
        <h1 className="text-ld text-4xl mb-6">Opps!!!</h1>
        <h6 className="text-xl text-ld">
          This page you are looking for could not be found.
        </h6>
        <Button
          variant={"default"}
          className="w-fit mt-6 mx-auto rounded-md"
        >
          <Link to={"/"}>Go Back to Home</Link>
        </Button>
      </div>
    </div>
  </>
);

export default Error;
