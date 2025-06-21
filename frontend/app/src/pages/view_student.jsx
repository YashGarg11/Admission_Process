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
          // Format the data to match the expected structure
          const formattedData = {
            ...response.data.data,
            name: response.data.data.name || 'Unknown',
            email: response.data.data.email || 'No email',
            phone: response.data.data.phone || 'N/A',
            course: response.data.data.course || 'Not specified',
            status: response.data.data.status || 'pending',
            documents: response.data.data.documents || {},
            createdAt: response.data.data.createdAt || new Date().toISOString()
          };
          setStudent(formattedData);
        } else {
          setError('Failed to load student information. Please try again later.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.response?.data?.message || 'Failed to load student information. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const handleView = async (url) => {
    try {
      const isPdf = url.toLowerCase().endsWith('.pdf');
      
      if (isPdf) {
        // For PDFs, construct the proxy URL explicitly with encoded Cloudinary URL
        const proxyUrl = `/admin/applications/${id}/documents/view-proxy?url=${encodeURIComponent(url)}`;
        const response = await api.get(proxyUrl, {
          responseType: 'blob' // Expect a blob response
        });
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        setViewingDocument(blobUrl);
      } else {
        // For images, use the URL directly in the modal
        setViewingDocument(url);
      }
    } catch (err) {
      console.error('Error viewing document:', err);
      alert('Failed to view document. Please try downloading instead.');
    }
  };

  const handleCloseView = () => {
    if (viewingDocument && viewingDocument.startsWith('blob:')) {
      URL.revokeObjectURL(viewingDocument);
    }
    setViewingDocument(null);
  };

  const handleDownload = async (documentType, documentUrl) => {
    try {
      const isPdf = documentUrl.toLowerCase().endsWith('.pdf');
      let finalUrl;

      if (isPdf) {
        // For PDFs, construct the download proxy URL explicitly
        finalUrl = `/admin/applications/${id}/documents/download-proxy?url=${encodeURIComponent(documentUrl)}`;
      } else {
        // For other document types (images), use the direct Cloudinary URL
        finalUrl = documentUrl;
      }

      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error('Failed to fetch document');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${documentType}_${student.name}.${isPdf ? 'pdf' : 'png'}`); // Assuming images are png for now
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Error downloading ${documentType}:`, err);
      alert(`Failed to download ${documentType}. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Student information not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Applications
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
            <div className="mt-2 flex items-center text-gray-500 dark:text-gray-400">
              <Mail size={16} className="mr-2" />
              {student.email}
            </div>
            <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
              <Phone size={16} className="mr-2" />
              {student.phone || student.mobile}
            </div>
            {student.address && (
              <div className="mt-1 text-gray-500 dark:text-gray-400">
                {student.address}
              </div>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            student.status === 'approved' ? 'bg-green-100 text-green-800' :
            student.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Course Applied</label>
                  <p className="text-gray-900 dark:text-white">{student.course}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Application Date</label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="space-y-3">
                {/* Counseling Letter */}
                {student.documents?.counselingLetter?.url && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-gray-500" />
                      <span className="text-gray-900 dark:text-white">Counseling Letter</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(student.documents.counselingLetter.url)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload('counseling', student.documents.counselingLetter.url)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Download size={16} className="mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                )}

                {/* Academic Documents */}
                {student.documents?.academicDocuments?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-gray-500" />
                      <span className="text-gray-900 dark:text-white capitalize">
                        {doc.name}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(doc.url)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload('academic', doc.url)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Download size={16} className="mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}

                {(!student.documents?.counselingLetter?.url && (!student.documents?.academicDocuments || student.documents.academicDocuments.length === 0)) && (
                  <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No documents available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {student.status === 'pending' && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => {
                api.put(`/admin/applications/${id}`, { status: 'approved' })
                  .then(() => navigate(-1))
                  .catch(err => alert('Failed to approve application'));
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Approve Application
            </button>
            <button
              onClick={() => {
                api.put(`/admin/applications/${id}`, { status: 'rejected' })
                  .then(() => navigate(-1))
                  .catch(err => alert('Failed to reject application'));
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reject Application
            </button>
          </div>
        )}
      </div>

      {/* Document Viewer Modal - Only for images */}
      {viewingDocument && !viewingDocument.toLowerCase().endsWith('.pdf') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-11/12 h-5/6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Viewer</h3>
              <button
                onClick={handleCloseView}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-grow">
              <img
                src={viewingDocument}
                alt="Document"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent; 