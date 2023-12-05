import { useParams } from "next/navigation";
import OrgControl from "../../_components/OrgControl";

const OrganizationIdLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default OrganizationIdLayout;
