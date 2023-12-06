"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    throw new Error("Unauthorized");
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url = "";

  try {
    const orgSubscription = await db.orgSubscription.findFirst({
      where: {
        orgId,
      },
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession =
        await stripe.billingPortal.sessions.create({
          customer: orgSubscription.stripeCustomerId,
          return_url: settingsUrl,
        });

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "TaskTrek Pro",
                description: "Unlimited board for organization",
              },
              unit_amount: 2000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        customer_email: user.emailAddresses[0].emailAddress,
        billing_address_collection: "auto",
        mode: "subscription",
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        metadata: {
          orgId,
        },
      });

      url = stripeSession.url || "";
    }
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  return { data: url };
};

export const stripeRedirect = createSafeAction(
  StripeRedirect,
  handler
);
