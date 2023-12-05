"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import {
  Activity,
  CreditCard,
  Layout,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import NavItem, { Organization } from "./NavItem";
import { Separator } from "@/components/ui/separator";
import { User } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  storageKey?: string;
  user: {
    id: string;
    firstName?: string | null;
    imageUrl: string;
  };
}

const Sidebar = ({
  storageKey = "t-sidebar-state",
  user,
}: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<
    Record<string, any>
  >(storageKey, {});
  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();
  const { userMemberships, isLoaded: isLoadedOrgList } =
    useOrganizationList({
      userMemberships: {
        infinite: true,
      },
    });

  const defaultAccordionValue: string[] = Object.keys(
    expanded
  ).reduce((acc: string[], key: string) => {
    if (expanded[key]) {
      acc.push(key);
    }
    return acc;
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const onClick = (href: string) => {
    router.push(href);
  };
  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/personal/${user.id}`,
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/personal/${user.id}/activity`,
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/personal/${user.id}/settings`,
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: `/personal/${user.id}/billing`,
    },
  ];

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships ? (
          <>
            {userMemberships.data.map(({ organization }) => (
              <NavItem
                key={organization.id}
                isActive={activeOrganization?.id === organization.id}
                isExpanded={expanded[organization.id]}
                organization={organization as Organization}
                onExpand={onExpand}
              />
            ))}
            <Separator className="my-10" />
          </>
        ) : null}

        <AccordionItem
          value={user.id}
          className="border-none"
          key={user.id}
        >
          <AccordionTrigger
            onClick={() => onExpand(user.id)}
            className={cn(
              "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
              !activeOrganization &&
                !expanded[user.id] &&
                "bg-sky-500/10 text-sky-700"
            )}
          >
            <div className="flex items-center gap-x-2">
              <div className="w-7 h-7 relative">
                <Image
                  fill
                  src={user.imageUrl}
                  alt="User"
                  className="rounded-sm object-cover"
                />
              </div>
              <span className="font-medium text-sm">
                {user.firstName}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 text-neutral-700">
            {routes.map((route) => (
              <Button
                key={route.href}
                size="sm"
                onClick={() => onClick(route.href)}
                className={cn(
                  "w-full font-normal justify-start pl-10 mb-1",
                  pathname === route.href &&
                    "bg-sky-500/10 text-sky-700"
                )}
                variant="ghost"
              >
                {route.icon}
                {route.label}
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Sidebar;
