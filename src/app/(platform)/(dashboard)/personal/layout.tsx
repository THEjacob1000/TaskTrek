import { currentUser } from "@clerk/nextjs";
import Sidebar from "../_components/Sidebar";

const PersonalLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userPromise = await currentUser();
  const { id, firstName, imageUrl } = userPromise!;
  const user = {
    id,
    firstName,
    imageUrl,
  };
  return (
    <main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar user={user} />
        </div>
        {children}
      </div>
    </main>
  );
};

export default PersonalLayout;
