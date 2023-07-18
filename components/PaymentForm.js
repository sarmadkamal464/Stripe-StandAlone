import { useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useState } from "react";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const createSubscription = async (id, quantity) => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ id, quantity }],
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location = url;
      } else {
        const error = await response.json();
        console.error(error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <button onClick={() => createSubscription(1, 1)}>
        Monthly Subscribe - 100 USD
      </button>
      <button onClick={() => createSubscription(2, 1)}>
        Yearly Subscribe - 200 USD
      </button>
    </>
  );
}

export default PaymentForm;
