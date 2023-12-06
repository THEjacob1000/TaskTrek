import { OrganizationList } from "@clerk/nextjs";

const CreateOrganizationPage = () => {
  return (
    <OrganizationList
      afterSelectOrganizationUrl={"/organization/:id"}
      afterCreateOrganizationUrl={"/organization/:id"}
      hidePersonal
    />
  );
};

export default CreateOrganizationPage;
