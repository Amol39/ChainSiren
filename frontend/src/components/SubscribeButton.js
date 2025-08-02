import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SubscribeButton = ({ userId, user, plan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success | failure | null

  const planDetails = {
    1: 299,
    3: 749,
    12: 1999,
  };

  const handleSubscribe = async () => {
    const amountInRupees = planDetails[plan];
    if (!amountInRupees) {
      toast.error('Invalid plan selected.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const { data } = await axios.post(
        `/api/payments/create-order?userId=${userId}&amountInRupees=${amountInRupees}`
      );

      const options = {
        key: 'rzp_test_ZHD5Uy7ogWP9VE',
        amount: data.amount,
        currency: data.currency,
        name: 'ChainSiren',
        description: `${plan}-Month Subscription`,
        order_id: data.id,
        handler: async function (response) {
          try {
            await axios.post('/api/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              userId,
              months: plan,
            });

            setStatus('success');
            toast.success('🎉 Subscription activated!');
            onSuccess?.();
          } catch (error) {
            console.error('Verification failed:', error);
            setStatus('failure');
            toast.error('Verification failed. Try again.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#2d9cdb',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setStatus('failure');
            toast.warn('Payment cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      toast.error('Error initiating payment.');
      setStatus('failure');
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#00cfff',
    border: 'none',
    borderRadius: '0.75rem',
    color: '#000',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  };

  const retryStyle = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    color: '#fff',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      {loading && <p style={{ color: '#2d9cdb' }}>Processing payment...</p>}

      {status === 'failure' && (
        <button onClick={handleSubscribe} style={retryStyle}>
          Retry Payment
        </button>
      )}

      {!loading && status !== 'success' && (
        <button onClick={handleSubscribe} style={buttonStyle}>
          Subscribe {plan} Month{plan > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
};

export default SubscribeButton;
