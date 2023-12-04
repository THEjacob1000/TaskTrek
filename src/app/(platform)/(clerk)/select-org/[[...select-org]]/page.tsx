import { OrganizationList } from "@clerk/nextjs";

const CreateOrganizationPage = () => {
  return (
    <OrganizationList
      afterSelectOrganizationUrl={"/organization/:id"}
      afterCreateOrganizationUrl={"/organization/:id"}
      afterSelectPersonalUrl={"/personal/:id"}
    />
  );
};

export default CreateOrganizationPage;
