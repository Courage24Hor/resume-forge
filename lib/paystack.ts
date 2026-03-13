export const initiatePayment = async (email: string, amountGHS: number, userId: string) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amountGHS * 100, // Paystack uses pesewas (100 pesewas = 1 GHS)
      currency: "GHS",
      callback_url: `${siteUrl}/api/payments/verify`,
      metadata: {
        userId,
        planType: "PREMIUM_14_DAY",
        custom_fields: [
          {
            display_name: "Service",
            variable_name: "service",
            value: "AI Resume Premium"
          }
        ]
      }
    }),
  });

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || "Failed to initialize payment");
  }
  return data.data.authorization_url;
};

export const verifyPayment = async (reference: string) => {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });
  const data = await res.json();
  return data;
};
