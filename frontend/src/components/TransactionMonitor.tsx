'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, ExternalLink, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { paymentService, PaymentVerification } from '../lib/payment';

interface Transaction {
  hash: string;
  amount: string;
  recipient: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations?: number;
  blockNumber?: number;
}

interface TransactionMonitorProps {
  transactions: Transaction[];
  onTransactionUpdate?: (hash: string, status: PaymentVerification) => void;
}

export function TransactionMonitor({ transactions, onTransactionUpdate }: TransactionMonitorProps) {
  const [monitoredTransactions, setMonitoredTransactions] = useState<Map<string, PaymentVerification>>(new Map());
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (transactions.length > 0 && !isMonitoring) {
      startMonitoring();
    }
  }, [transactions]);

  const startMonitoring = async () => {
    setIsMonitoring(true);
    
    // Monitor each transaction
    for (const tx of transactions) {
      if (tx.status === 'pending') {
        monitorTransaction(tx.hash);
      }
    }
  };

  const monitorTransaction = async (hash: string) => {
    try {
      const verification = await paymentService.verifyPayment(hash);
      setMonitoredTransactions(prev => new Map(prev.set(hash, verification)));
      
      if (onTransactionUpdate) {
        onTransactionUpdate(hash, verification);
      }

      // Continue monitoring if still pending
      if (verification.status === 'pending') {
        setTimeout(() => monitorTransaction(hash), 5000); // Check every 5 seconds
      }
    } catch (error) {
      console.error(`Failed to monitor transaction ${hash}:`, error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getExplorerUrl = (hash: string) => {
    // Default to Hoodi testnet for now
    return `https://explorer.hoodi.network/tx/${hash}`;
  };

  if (transactions.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No transactions to monitor</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Transaction Monitor</h3>
        <Badge variant="outline" className={isMonitoring ? 'text-green-400 border-green-500' : 'text-yellow-400 border-yellow-500'}>
          {isMonitoring ? 'Monitoring' : 'Idle'}
        </Badge>
      </div>

      {transactions.map((tx) => {
        const verification = monitoredTransactions.get(tx.hash);
        const status = verification?.status || tx.status;
        const confirmations = verification?.confirmations || 0;
        const blockNumber = verification?.blockNumber;

        return (
          <Card key={tx.hash} className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <CardTitle className="text-sm text-white">Transaction</CardTitle>
                    <p className="text-xs text-gray-400 font-mono">
                      {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(status)}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Amount:</span>
                  <p className="text-white font-semibold">{tx.amount} ETH</p>
                </div>
                <div>
                  <span className="text-gray-400">Recipient:</span>
                  <p className="text-white font-mono text-xs">
                    {tx.recipient.slice(0, 6)}...{tx.recipient.slice(-4)}
                  </p>
                </div>
                {blockNumber && (
                  <div>
                    <span className="text-gray-400">Block:</span>
                    <p className="text-white font-semibold">{blockNumber}</p>
                  </div>
                )}
                {confirmations > 0 && (
                  <div>
                    <span className="text-gray-400">Confirmations:</span>
                    <p className="text-white font-semibold">{confirmations}/12</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(tx.hash)}
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Hash
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getExplorerUrl(tx.hash), '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View on Explorer
                </Button>
              </div>

              {status === 'pending' && confirmations > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Confirmation Progress</span>
                    <span>{confirmations}/12</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(confirmations / 12) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
