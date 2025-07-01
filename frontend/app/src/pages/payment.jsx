// src/pages/ViewPayments.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '../config';

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'

  // Fetch payments list on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // Fixed: Updated endpoint to match backend route
      const response = await axios.get(
        `${config.API_BASE_URL}/payment/admin/all`,
        { withCredentials: true }
      );
      setPayments(response.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setMessage('❌ Failed to fetch payments list');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, userName) => {
    try {
      await axios.post(
        `${config.API_BASE_URL}/payment/admin/payment/approve/${userId}`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setPayments(prev => prev.map(payment =>
        payment.userId === userId
          ? { ...payment, status: 'approved' }
          : payment
      ));

      setMessage(`✅ Payment for ${userName} (ID: ${userId}) approved successfully`);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error approving payment:', error);
      setMessage('❌ Failed to approve payment');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReject = async (userId, userName) => {
    try {
      await axios.post(
        `${config.API_BASE_URL}/payment/admin/payment/reject/${userId}`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setPayments(prev => prev.map(payment =>
        payment.userId === userId
          ? { ...payment, status: 'rejected' }
          : payment
      ));

      setMessage(`❌ Payment for ${userName} (ID: ${userId}) rejected`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error rejecting payment:', error);
      setMessage('❌ Failed to reject payment');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Filter payments based on status
  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return payment.status === 'pending' || !payment.status;
    if (filter === 'approved') return payment.status === 'approved';
    if (filter === 'rejected') return payment.status === 'rejected';
    return true;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6">
          <h2 className="text-3xl font-bold text-center">Student Payment Management</h2>
          <p className="text-indigo-100 text-center mt-2">Approve or reject student payments</p>
        </div>

        {/* Filter Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Payments ({payments.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Pending ({payments.filter(p => p.status === 'pending' || !p.status).length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Approved ({payments.filter(p => p.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Rejected ({payments.filter(p => p.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 text-center font-semibold ${message.includes('✅') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            } border-l-4`}>
            {message}
          </div>
        )}

        {/* Payments List */}
        <div className="p-6">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payments Found</h3>
              <p className="text-gray-500">
                {filter === 'all'
                  ? 'No payment records found.'
                  : `No payments with ${filter} status found.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Payment ID</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">User ID</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Payment Date</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <tr key={payment._id || payment.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-indigo-600">
                        {payment._id || payment.id || 'N/A'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">
                        {payment.userId || 'N/A'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="font-medium text-gray-900">{payment.userName || payment.name || 'N/A'}</div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">
                        {payment.userEmail || payment.email || 'N/A'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 font-semibold text-green-600">
                        ₹{payment.amount || '0'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(payment.status || 'pending')}`}>
                          {(payment.status || 'pending').charAt(0).toUpperCase() + (payment.status || 'pending').slice(1)}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          {(!payment.status || payment.status === 'pending') && (
                            <>
                              <button
                                onClick={() => handleApprove(payment.userId, payment.userName || payment.name || 'Unknown')}
                                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleReject(payment.userId, payment.userName || payment.name || 'Unknown')}
                                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                          {payment.status === 'approved' && (
                            <span className="text-green-600 text-sm font-medium">✓ Approved</span>
                          )}
                          {payment.status === 'rejected' && (
                            <span className="text-red-600 text-sm font-medium">✗ Rejected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="p-6 border-t border-gray-200 text-center">
          <button
            onClick={fetchPayments}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            🔄 Refresh List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPayments;