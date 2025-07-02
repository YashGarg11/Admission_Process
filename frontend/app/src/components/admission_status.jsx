import { useEffect, useState } from 'react';

const Payment = () => {
  const [course, setCourse] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science');
  const [amount, setAmount] = useState(143600.00);
  const [status, setStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://admission-process-2.onrender.com/api'; // Replace with your actual API URL
  const judoLink = 'https://college-judo-payment-link.com/pay';

  // Fee structure
  const feeStructure = {
    'B.Tech': {
      'Computer Science': 143600,
      'IT': 143600,
      'Electronics': 150000,
      'Mechanical': 150000,
      'Civil': 150000
    },
    'MCA': {
      'Computer Science': 155000,
      'IT': 155000,
      'Electronics': 155000,
      'Mechanical': 155000,
      'Civil': 155000
    }
  };

  // Update fee based on course and branch selection
  useEffect(() => {
    const fee = feeStructure[course]?.[branch] || 150000;
    setAmount(fee);
  }, [course, branch]);

  // Fetch existing payment data on component mount
  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/payment/payment/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentData(data);
        if (data.transactionId) {
          setTransactionId(data.transactionId);
          setStatus(data.paymentStatus);
        }
      } else if (response.status === 401) {
        setError('Please log in to access payment information');
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError('Unable to fetch payment data');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async () => {
    if (!transactionId.trim()) {
      setError('Please enter a valid transaction ID');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/payment/student/payment`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: transactionId.trim(),
          amount,
          status: 'success'
        })
      });

      if (response.ok) {
        setStatus('success');
        setPaymentData(prev => ({
          ...prev,

          transactionId: transactionId.trim(),
          amount,
          paymentDate: new Date().toISOString(),
          isApproved: false
        }));
      } else {
        const errorData = await response.json();
        setStatus('failed');
        setError(errorData.message || 'Error recording payment. Please try again.');
      }

    } catch (error) {
      console.error('Payment recording error:', error);
      setStatus('failed');
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getApprovalStatus = (isApproved, paymentStatus) => {
    if (paymentStatus !== 'success') return null;
    return isApproved ? 'Approved' : 'Pending Admin Approval';
  };

  if (loading && !paymentData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-white text-center">
                College Fee Payment Portal
              </h1>
              <p className="text-indigo-100 text-center mt-2">
                Secure Online Payment System
              </p>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Existing Payment Status */}
              {paymentData && paymentData.paymentStatus && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Status:</span>
                      <p className={`font-semibold capitalize ${getStatusColor(paymentData.paymentStatus)}`}>
                        {paymentData.paymentStatus}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Transaction ID:</span>
                      <p className="font-mono text-sm text-gray-800">{paymentData.transactionId}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Amount:</span>
                      <p className="font-semibold text-gray-800">{formatCurrency(paymentData.amount)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Payment Date:</span>
                      <p className="text-gray-800">{new Date(paymentData.paymentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {getApprovalStatus(paymentData.isApproved, paymentData.paymentStatus) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-gray-600 text-sm">Approval Status:</span>
                      <p className={`font-semibold ${paymentData.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                        {getApprovalStatus(paymentData.isApproved, paymentData.paymentStatus)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Form */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Fee Payment</h2>

                  {/* Course Selection */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Select Course</label>
                    <select
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                    >
                      <option value="B.Tech">B.Tech</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>

                  {/* Branch Selection */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Select Branch</label>
                    <select
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="IT">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>

                  {/* Fee Display */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Fee Amount</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatCurrency(amount)}
                        readOnly
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50 cursor-not-allowed text-lg font-semibold"
                      />
                    </div>
                  </div>

                  {/* Transaction ID Input */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Transaction ID</label>
                    <input
                      type="text"
                      placeholder="Enter transaction ID after payment"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Instructions</h2>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-yellow-800 mb-3">How to Pay:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-yellow-700 text-sm">
                      <li>Click the "Pay via JudoPay" button below</li>
                      <li>Complete payment on the secure payment portal</li>
                      <li>Note down your transaction ID</li>
                      <li>Return here and enter the transaction ID</li>
                      <li>Click "Record Payment" to complete the process</li>
                    </ol>
                  </div>

                  {/* JudoPay Link */}
                  <div className="text-center">
                    <a
                      href={`${judoLink}?amount=${amount}&course=${course}&branch=${branch}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 font-semibold text-lg shadow-lg transform hover:scale-105 transition-all"
                    >
                      🔒 Pay via JudoPay
                    </a>
                    <p className="text-xs text-gray-600 mt-2">
                      Secure payment powered by JudoPay
                    </p>
                  </div>

                  {/* Record Payment Button */}
                  <div className="text-center">
                    <button
                      onClick={handlePaymentComplete}
                      disabled={loading || !transactionId.trim()}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-green-800 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Recording Payment...
                        </span>
                      ) : (
                        '✅ Record Payment'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Result Message */}
              {status && (
                <div className="mt-8 text-center">
                  {status === 'success' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="text-green-600 text-lg font-semibold">
                        ✅ Payment Successfully Recorded!
                      </div>
                      <p className="text-green-700 mt-2">
                        Transaction ID: <span className="font-mono">{transactionId}</span>
                      </p>
                      <p className="text-green-600 text-sm mt-2">
                        Your payment is now pending admin approval
                      </p>
                    </div>
                  ) : status === 'failed' ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="text-red-600 text-lg font-semibold">
                        ❌ Payment Recording Failed
                      </div>
                      <p className="text-red-600 text-sm mt-2">
                        Please check your transaction ID and try again
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;