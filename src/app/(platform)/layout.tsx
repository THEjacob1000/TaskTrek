import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ModalProvider } from "@/components/providers/ModalProvider";

const PlatformLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
