import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!user || !orgId) {
      throw new Error("User not found!");
    }

    const { entityId, entityType, entityTitle, action } = props;

    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const capitalizedFirstName = firstName
      ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
      : "";
    const capitalizedLastName = lastName
      ? lastName.charAt(0).toUpperCase() + lastName.slice(1)
      : "";
    const userName = capitalizedFirstName + " " + capitalizedLastName;

    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};
