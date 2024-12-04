"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPaymentOrder } from "@/service/payment";
import { AddCreditModal } from "../../Modal/AddCreditModal";

const App = () => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Load Razorpay script dynamically when the component mounts
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => console.log("Razorpay script loaded successfully");
      script.onerror = () => alert("Failed to load Razorpay script");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const payNow = async () => {
    try {
      console.log("Starting payment process...");
      // Ensure amount is in paise (1 INR = 100 paise)
      const amountInPaise = amount * 100;

      const response:any = await createPaymentOrder(
        amountInPaise,
        "INR",
        "receipt#1"
      );

      // Handle response
      if (response.success && response.data) {
        const order = response.data;

        const options = {
          key: process.env.NEXT_RAZORPAY_KEY,
          amount: order.amount,
          currency: order.currency,
          name: "VOMYRA",
          description: "Test Transaction",
          order_id: order.id, // This is the order_id created in the backend
          prefill: {
            name: "Your Name",
            email: "your.email@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#1C3537",
          },
          handler: function (response:any) {
            console.log("Payment response received:", response);
            axios
              .post("http://localhost:3000/api/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              .then((res) => {
                console.log("Payment verification response:", res.data);
                if (res.data.status === "ok") {
                  window.location.href = "/payment-success";
                } else {
                  alert("Payment verification failed");
                }
              })
              .catch((error) => {
                console.error("Error verifying payment:", error);
                alert("Error verifying payment");
              });
          },
        };

        console.log("Opening Razorpay Checkout...");
        const rzp = new (window as any).Razorpay(options); // Access Razorpay from window object
        rzp.open();
      } else {
        alert(response.message || "Error creating order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order");
    }
  };

  return (
    <div>
      <AddCreditModal amount={amount} setAmount={setAmount} handlePay={payNow}/>
    </div>
  );
};

export default App;
