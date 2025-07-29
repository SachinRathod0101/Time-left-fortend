import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define a type for your event object for better TypeScript safety
interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number;
}

// Utility function to dynamically load a script
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/events/${eventId}`);
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
        alert('Could not load event details.');
      }
    };

    if (eventId) fetchEventDetails();
  }, [eventId]);

  const handlePayment = async () => {
    setIsProcessing(true);

    // 1. Load Razorpay script dynamically
    try {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    } catch (error) {
      console.error(error);
      alert('Failed to load payment gateway. Please try again.');
      setIsProcessing(false);
      return;
    }

    try {
      // 2. Create the order on your back end
      const { data: order } = await axios.post(`${process.env.REACT_APP_API_URL}/payments/create-order`, {
        eventId,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
        amount: order.amount,
        currency: order.currency,
        name: 'Timeleft Events',
        description: `Booking for ${event?.name}`,
        order_id: order.id,
        // 3. This handler sends payment data to your server for verification
        handler: async function (response: any) {
          try {
            const verificationResponse = await axios.post(`${process.env.REACT_APP_API_URL}/payments/verify`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert(`✅ Payment Successful! Status: ${verificationResponse.data.status}`);
            // Redirect to a success page with state to prevent direct access
            navigate('/payment-success', {
              state: { orderId: order.id, eventName: event?.name },
              replace: true,
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('❌ Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: 'Sachin Rathod', // Should be dynamic from user context
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: { color: '#3399cc' },
        modal: {
            ondismiss: function() {
                console.log('Payment modal was closed.');
                setIsProcessing(false);
            }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('❌ Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  if (!event) {
    return <div className="text-center p-10">Loading event details...</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Price:</strong> ₹{event.price}</p>
        <p><strong>Location:</strong> {event.location}</p>
        
        <div className="text-center pt-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : `Pay ₹${event.price} Now`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;