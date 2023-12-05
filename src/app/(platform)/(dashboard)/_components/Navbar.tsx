import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  UserButton,
  currentUser,
} from "@clerk/nextjs";
import { Plus } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import FormPopover from "@/components/form/FormPopover";

const Navbar = async () => {
  const userPromise = await currentUser();
  const { id, firstName, imageUrl } = userPromise!;
  const user = {
    id,
    firstName,
    imageUrl,
  };
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <MobileSidebar user={user} />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex ">
          <Logo />
        </div>
        <FormPopover align="start" side="bottom" sideOffset={18}>
          <Button
            size="sm"
            className="rounded-sm hidden md:block h-auto py-1.5 px-2"
          >
            Create
          </Button>
        </FormPopover>
        <FormPopover>
          <Button size="sm" className="rounded-sm block md:hidden">
            <Plus className="h-4 w-4" />
          </Button>
        </FormPopover>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          afterSelectPersonalUrl="/personal/:id"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
