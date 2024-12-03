"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Load Razorpay script dynamically when the component mounts
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => console.log('Razorpay script loaded successfully');
      script.onerror = () => alert('Failed to load Razorpay script');
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const payNow = async () => {
    try {
      console.log('Starting payment process...');
      // Ensure amount is in paise (1 INR = 100 paise)
      const amountInPaise = amount * 100;

      // Create order by calling the backend API
      const response = await axios.post('http://localhost:3000/api/create-order', {
        amount: amountInPaise,
        currency: 'INR',
        receipt: 'receipt#1',
        notes: {}
      });

      console.log('Order created successfully:', response.data);

      const order = response.data;
      // Open Razorpay Checkout
      const options = {
        key: 'rzp_test_xkNx1lpB3upUcJ', // Replace with your Razorpay key_id
        amount: order.amount,
        currency: order.currency,
        name: 'VOMYRA',
        description: 'Test Transaction',
        order_id: order.id, // This is the order_id created in the backend
        callback_url: 'http://localhost:3000/payment-success', // Your success URL
        prefill: {
          name: 'Your Name',
          email: 'your.email@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#1C3537',
        },
        handler: function (response) {
          console.log('Payment response received:', response);
          axios.post('http://localhost:3000/api/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
          .then((res) => {
            console.log('Payment verification response:', res.data);
            if (res.data.status === 'ok') {
              window.location.href = '/payment-success';
            } else {
              alert('Payment verification failed');
            }
          })
          .catch((error) => {
            console.error('Error verifying payment:', error);
            alert('Error verifying payment');
          });
        }
      };

      console.log(options);
      console.log('Opening Razorpay Checkout...');
      const rzp = new window.Razorpay(options); // Access Razorpay from window object
      rzp.open();
      console.log(rzp);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    }
  };

  return (
    <div>
      <h1>Razorpay Payment Gateway Integration</h1>
      <form id="payment-form">
        <label htmlFor="amount">Amount:</label>
        <input 
          type="number" 
          id="amount" 
          name="amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        />
        <button type="button" onClick={payNow}>Pay Now</button>
      </form>
    </div>
  );
};

export default App;
