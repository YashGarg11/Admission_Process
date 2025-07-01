// src/pages/IDCard.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '../config';

const IDCard = () => {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvedPayments, setApprovedPayments] = useState([]);

  const userId = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/auth/me`, { withCredentials: true });
      return response.data._id; // Assuming the user ID is returned in this format
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null; // Handle error appropriately
    }
  };

  // Fetch approved payments on component mount
  useEffect(() => {
    fetchApprovedPayments();
  }, []);

  const fetchApprovedPayments = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/payment/${userId}`,
        { withCredentials: true }
      );
      // Filter only approved payments
      const approved = response.data.filter(payment => payment.status === 'approved');
      setApprovedPayments(approved);
    } catch (error) {
      console.error('Error fetching approved payments:', error);
    }
  };

  const handleFetchStudent = async () => {
    if (!studentId.trim()) {
      setError('Please enter a student ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if student has approved payment
      const approvedPayment = approvedPayments.find(payment => payment.userId === studentId);

      if (!approvedPayment) {
        setError('Student payment is not approved. ID card can only be generated for students with approved payments.');
        setStudent(null);
        setLoading(false);
        return;
      }

      // Use payment data to create student object
      const studentData = {
        id: approvedPayment.userId,
        name: approvedPayment.userName || approvedPayment.name || 'N/A',
        email: approvedPayment.userEmail || approvedPayment.email || 'N/A',
        paymentAmount: approvedPayment.amount || '0',
        paymentDate: approvedPayment.createdAt,
        paymentStatus: 'approved'
      };

      setStudent(studentData);
    } catch (error) {
      console.error('Error processing student data:', error);
      setError('Failed to process student details');
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintCard = () => {
    const printContent = document.getElementById('id-card-print');
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore functionality
  };

  const handleDownloadCard = async () => {
    // This would typically use html2canvas or similar library
    // For now, we'll just trigger print
    handlePrintCard();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Student ID Card Generator</h1>
          <p className="text-gray-600">Generate ID cards for approved students</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Student</h2>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Enter Student ID</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., STU001"
                onKeyPress={(e) => e.key === 'Enter' && handleFetchStudent()}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFetchStudent}
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="text-red-700">{error}</div>
            </div>
          )}

          {/* Approved Students List */}
          {approvedPayments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Students with Approved Payments (Quick Select)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {approvedPayments.map((payment) => (
                  <button
                    key={payment._id || payment.id}
                    onClick={() => {
                      setStudentId(payment.userId);
                      const studentData = {
                        id: payment.userId,
                        name: payment.userName || payment.name || 'N/A',
                        email: payment.userEmail || payment.email || 'N/A',
                        paymentAmount: payment.amount || '0',
                        paymentDate: payment.createdAt,
                        paymentStatus: 'approved'
                      };
                      setStudent(studentData);
                    }}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
                  >
                    <div className="font-medium text-green-800">{payment.userName || payment.name || 'N/A'}</div>
                    <div className="text-sm text-green-600">ID: {payment.userId}</div>
                    <div className="text-sm text-green-600">Amount: ₹{payment.amount}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ID Card Display */}
        {student && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Student ID Card</h2>
              <div className="flex gap-3">
                <button
                  onClick={handlePrintCard}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🖨️ Print Card
                </button>
                <button
                  onClick={handleDownloadCard}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  💾 Download
                </button>
              </div>
            </div>

            {/* ID Card */}
            <div className="flex justify-center">
              <div id="id-card-print" className="bg-gradient-to-br from-indigo-600 to-purple-700 p-1 rounded-xl shadow-2xl">
                <div className="bg-white rounded-lg p-6 w-96">
                  {/* Card Header */}
                  <div className="text-center mb-6">
                    <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg mb-3">
                      <h3 className="text-lg font-bold">STUDENT ID CARD</h3>
                    </div>
                    <div className="text-sm text-gray-600">Academic Year 2024-25</div>
                  </div>

                  {/* Student Photo Placeholder */}
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-indigo-200">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt="Student"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-gray-400">👤</span>
                      )}
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{student.name}</div>
                      <div className="text-lg font-semibold text-indigo-600">ID: {student.id}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Course:</span>
                        <div className="text-gray-800">{student.course || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Batch:</span>
                        <div className="text-gray-800">{student.batch || '2024'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <div className="text-gray-800 truncate">{student.email}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Phone:</span>
                        <div className="text-gray-800">{student.phone || 'N/A'}</div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="text-center py-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Payment Approved
                      </span>
                    </div>

                    {/* Validity */}
                    <div className="text-center text-xs text-gray-500 border-t pt-3">
                      <div>Valid Until: December 2025</div>
                      <div className="mt-1">
                        <span className="font-medium">Institution:</span> Your Institute Name
                      </div>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="flex justify-center mt-4">
                    <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">
                      QR Code
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Additional Details */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Registration Date:</span>
                  <div className="text-gray-800">{student.registrationDate || 'N/A'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Payment Amount:</span>
                  <div className="text-gray-800">₹{student.paymentAmount || '0'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Address:</span>
                  <div className="text-gray-800">{student.address || 'N/A'}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Emergency Contact:</span>
                  <div className="text-gray-800">{student.emergencyContact || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDCard;