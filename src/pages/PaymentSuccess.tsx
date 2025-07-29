import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, eventName } = location.state || {};

  // Redirect if the page is accessed directly without state from payment page
  useEffect(() => {
    if (!orderId) {
      navigate('/events', { replace: true });
    }
  }, [orderId, navigate]);

  if (!orderId) {
    // Render nothing while redirecting
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
      <p className="text-lg text-gray-800">Thank you for your booking for <strong>{eventName || 'the event'}</strong>.</p>
      <p className="text-gray-600 mt-2">Your order ID is: <span className="font-mono bg-gray-100 p-1 rounded">{orderId}</span></p>
      <p className="text-gray-600 mt-1">You will receive a confirmation email shortly.</p>
      <div className="mt-8">
        <Link to="/profile" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
