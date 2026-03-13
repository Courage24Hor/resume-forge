import { verifyPayment } from "@/lib/paystack";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const reference = searchParams.get('reference');

  if (!reference) {
    return redirect("/builder?error=no_reference");
  }

  const result = await verifyPayment(reference);

  if (result.status && result.data.status === 'success') {
    const userId = result.data.metadata.userId;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14);

    try {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          tier: "PREMIUM_14_DAY",
          tier_expires_at: expiryDate.toISOString(),
        },
      });
    } catch (error) {
      console.error("Supabase tier update failed", error);
      return redirect("/builder?error=payment_failed");
    }

    return redirect("/builder?success=payment_complete");
  }

  return redirect("/builder?error=payment_failed");
}
