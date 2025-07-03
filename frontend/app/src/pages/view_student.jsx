import { ArrowLeft, Download, Eye, FileText, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const ViewStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/applications/${id}`);

        if (response.data.success && response.data.data) {
          setStudent(response.data.data);
        } else {
          setError('Failed to load student information.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load student info.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudentData();
  }, [id]);

  const handleView = (url) => {
    const isPdf = url.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      const blobUrl = url;
      setViewingDocument(blobUrl);
    } else {
      setViewingDocument(url);
    }
  };

  const handleCloseView = () => {
    setViewingDocument(null);
  };

  const handleDownload = async (name, url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name}.${blob.type === 'application/pdf' ? 'pdf' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert('Download failed');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent" /></div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-black mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{student.name || 'Unknown'}</h1>
            <div className="flex items-center mt-2 text-gray-600 text-sm">
              <Mail className="w-4 h-4 mr-2" />
              {student.email}
            </div>
            <div className="flex items-center mt-1 text-gray-600 text-sm">
              <Phone className="w-4 h-4 mr-2" />
              {student.phone || student.mobile || 'N/A'}
            </div>
          </div>
          <div className={`mt-4 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium 
            ${student.status === 'approved' ? 'bg-green-100 text-green-800' :
              student.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Course Info</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Course:</strong> {student.course || 'Not specified'}</p>
              <p><strong>Date:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Documents</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {(student.documents?.academicDocuments?.length > 0)
                ? student.documents.academicDocuments.map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center space-x-2">
                      <FileText size={18} className="text-gray-500" />
                      <span className="capitalize text-sm text-gray-800">{doc.type.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={() => handleView(doc.path)} className="text-blue-600 hover:underline text-sm flex items-center">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </button>
                      <button onClick={() => handleDownload(doc.type, doc.path)} className="text-blue-600 hover:underline text-sm flex items-center">
                        <Download className="w-4 h-4 mr-1" /> Download
                      </button>
                    </div>
                  </div>
                ))
                : <p className="text-gray-500 text-sm">No documents uploaded.</p>}
            </div>
          </div>
        </div>

        {/* Application Controls */}
        {student.status === 'pending' && (
          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={() => api.put(`/admin/applications/${id}`, { status: 'approved' }).then(() => navigate(-1))}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Approve
            </button>
            <button onClick={() => api.put(`/admin/applications/${id}`, { status: 'rejected' }).then(() => navigate(-1))}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Modal to View Image or PDF */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-4xl h-[90vh] flex flex-col relative">
            <button onClick={handleCloseView} className="absolute top-3 right-3 text-gray-700 hover:text-black text-lg">✕</button>
            {viewingDocument.endsWith('.pdf') ? (
              <iframe src={viewingDocument} title="PDF Viewer" className="flex-grow w-full rounded-lg border" />
            ) : (
              <img src={viewingDocument} alt="Document" className="w-full h-full object-contain rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;
