export const createPaymentOrder = (amountInPaise:number, currency:string, receipt:string) => {
    return fetch('/api/addCredit/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt,
        notes: {},
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (res.ok) {
          return { success: true, data: result };
        }
        return { success: false, message: result.message || 'Error creating order' };
      })
      .catch(() => ({ success: false, message: 'Something went wrong' }));
  };

  export const verifyPayment = (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    return fetch('/api/addCredit/verifyPayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (res.ok) {
          return { success: true, data: result };
        }
        return { success: false, message: result.message || 'Error verifying payment' };
      })
      .catch(() => ({ success: false, message: 'Something went wrong' }));
  };
  