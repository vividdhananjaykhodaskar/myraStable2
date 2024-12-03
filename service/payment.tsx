export const createPaymentOrder = (amountInPaise:number, currency:string, receipt:string) => {
    return fetch('http://localhost:3000/api/create-order', {
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
  