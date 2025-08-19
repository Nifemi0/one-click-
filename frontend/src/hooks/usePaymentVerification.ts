import { useState, useEffect, useCallback } from 'react';
import { paymentService, PaymentVerification } from '../lib/payment';

interface UsePaymentVerificationProps {
  transactionHash?: string;
  autoVerify?: boolean;
  checkInterval?: number;
}

interface UsePaymentVerificationReturn {
  verification: PaymentVerification | null;
  isLoading: boolean;
  error: string | null;
  verifyPayment: () => Promise<void>;
  resetVerification: () => void;
}

export function usePaymentVerification({
  transactionHash,
  autoVerify = true,
  checkInterval = 5000
}: UsePaymentVerificationProps): UsePaymentVerificationReturn {
  const [verification, setVerification] = useState<PaymentVerification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const verifyPayment = useCallback(async () => {
    if (!transactionHash) {
      setError('No transaction hash provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentService.verifyPayment(transactionHash);
      setVerification(result);

      // If still pending, set up interval for continuous monitoring
      if (result.status === 'pending' && !intervalId) {
        const id = setInterval(async () => {
          try {
            const updatedResult = await paymentService.verifyPayment(transactionHash);
            setVerification(updatedResult);

            // Stop monitoring if no longer pending
            if (updatedResult.status !== 'pending') {
              if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
              }
            }
          } catch (err) {
            console.error('Failed to verify payment during monitoring:', err);
          }
        }, checkInterval);

        setIntervalId(id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify payment');
    } finally {
      setIsLoading(false);
    }
  }, [transactionHash, checkInterval, intervalId]);

  const resetVerification = useCallback(() => {
    setVerification(null);
    setError(null);
    setIsLoading(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  // Auto-verify when transaction hash changes
  useEffect(() => {
    if (transactionHash && autoVerify) {
      verifyPayment();
    }

    // Cleanup interval on unmount or hash change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transactionHash, autoVerify, verifyPayment, intervalId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    verification,
    isLoading,
    error,
    verifyPayment,
    resetVerification
  };
}
