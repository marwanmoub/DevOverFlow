import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = () => {
  return (
    <h1 className="text-3xl dark:text-white font-black">
      Welcome to the world of Next.js

      <form className="px-10 pt-[100px]" action={async () => {
        "use server";
        await signOut({redirectTo: ROUTES.SIGN_IN});
      }}>
        <Button type="submit">Logout</Button>
      </form>
      
    </h1>
  );
};

export default Home;
