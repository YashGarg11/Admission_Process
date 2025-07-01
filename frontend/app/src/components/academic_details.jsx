import axios from 'axios';
import { AlertCircle, ArrowRight, CheckCircle, FileText, Loader, Shield, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock config for demonstration
const config = {
  API_BASE_URL: 'https://admission-process-2.onrender.com/api'
};

const AcademicDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'success'
  const [successMessage, setSuccessMessage] = useState('');


  const documentLabels = [
    { key: 'marksheet_10', label: '10th Marksheet', required: true },
    { key: 'marksheet_12', label: '12th Marksheet', required: true },
    { key: 'tc', label: 'Transfer Certificate', required: true },
    { key: 'migration_cert', label: 'Migration Certificate', required: false },
    { key: 'character_cert', label: 'Character Certificate', required: true },
    { key: 'aadhar_card', label: 'Aadhaar Card', required: true },
    { key: 'medical_cert', label: 'Medical Certificate', required: false },
    { key: 'income_cert', label: 'Income Certificate', required: false },
    { key: 'passport_photo', label: 'Passport Photo', required: true },
    { key: 'signature', label: 'Signature', required: true },
  ];

  // Check authentication and get user info
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/auth/check-session`, {
          withCredentials: true
        });

        if (response.data.user) {
          setUserInfo(response.data.user);
          setIsAuthenticated(true);
          console.log('Authenticated user:', response.data.user);

          // Load existing documents if any
          await loadExistingDocuments(response.data.user.id);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setError('Please login to access this page');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    checkAuthentication();
  }, [navigate]);

  // Load existing documents for the user
  const loadExistingDocuments = async (userId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/admission/documents/${userId}`, {
        withCredentials: true
      });

      if (response.data.documents) {
        // Convert S3 URLs back to file representation for display
        const existingDocs = {};
        Object.keys(response.data.documents).forEach(key => {
          if (response.data.documents[key]) {
            existingDocs[key] = {
              name: response.data.documents[key].split('/').pop(),
              url: response.data.documents[key],
              uploaded: true
            };
          }
        });
        setDocuments(existingDocs);
      }
    } catch (error) {
      console.log('No existing documents found or error loading:', error.message);
    }
  };

  // ✅ CORRECT PLACE
  useEffect(() => {
    if (submitStatus === 'success') {
      const timeout = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [submitStatus, navigate]);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
        setError(`Please upload a PDF or image file for ${documentLabels.find(doc => doc.key === key)?.label}`);
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File size should be less than 5MB for ${documentLabels.find(doc => doc.key === key)?.label}`);
        return;
      }

      // Add user ID and timestamp to filename for uniqueness
      const timestamp = Date.now();
      const userId = userInfo?.id || 'unknown';
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${userId}_${timestamp}_${sanitizedFileName}`;

      // Create a new file object with unique name
      const renamedFile = new File([file], uniqueFileName, { type: file.type });

      setDocuments({
        ...documents,
        [key]: renamedFile,
      });
      setError(''); // Clear any previous errors

      console.log(`File selected for ${key}:`, {
        originalName: file.name,
        uniqueName: uniqueFileName,
        size: file.size,
        type: file.type,
        userId: userId
      });
    }
  };

  const removeFile = (key) => {
    const newDocuments = { ...documents };
    delete newDocuments[key];
    setDocuments(newDocuments);

    // Clear upload progress for this file
    const newProgress = { ...uploadProgress };
    delete newProgress[key];
    setUploadProgress(newProgress);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !userInfo) {
      setError('You must be logged in to upload documents');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    // Check if required documents are uploaded
    const requiredDocs = documentLabels.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !documents[doc.key]);

    if (missingDocs.length > 0) {
      setError(`Please upload the following required documents: ${missingDocs.map(doc => doc.label).join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      // Add user identification
      formData.append('userId', userInfo.id);
      formData.append('userEmail', userInfo.email);

      // Add timestamp for this submission
      formData.append('submissionTimestamp', new Date().toISOString());

      // Add all documents with proper naming
      Object.keys(documents).forEach((key) => {
        if (documents[key] && !documents[key].uploaded) {
          formData.append(key, documents[key]);
          console.log(`Adding document ${key} for user ${userInfo.id}:`, documents[key].name);
        }
      });

      // Log the submission attempt
      console.log('Submitting documents for user:', {
        userId: userInfo.id,
        email: userInfo.email,
        documentCount: Object.keys(documents).filter(key => documents[key] && !documents[key].uploaded).length,
        timestamp: new Date().toISOString()
      });

      const response = await axios.post(
        `${config.API_BASE_URL}/admission/academic-details`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      );

      console.log('Documents uploaded successfully:', response.data);

      // Verify the response contains the S3 URLs and user association
      if (response.data.documents && response.data.userId) {
        console.log('S3 URLs saved for user:', {
          userId: response.data.userId,
          documents: response.data.documents
        });

        // Update local state with uploaded document URLs
        const updatedDocs = { ...documents };
        Object.keys(response.data.documents).forEach(key => {
          if (response.data.documents[key]) {
            updatedDocs[key] = {
              name: response.data.documents[key].split('/').pop(),
              url: response.data.documents[key],
              uploaded: true
            };
          }
        });
        setDocuments(updatedDocs);

        setSuccess(`Documents uploaded successfully! All files have been securely stored and associated with your account (${userInfo.email}).`);

        setSuccessMessage(`Documents uploaded successfully! All files have been securely stored and associated with your account (${userInfo.email}).`);
        setSubmitStatus('success');
        // Navigate to next step after successful upload
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        throw new Error('Invalid response: Missing user association or document URLs');
      }

    } catch (err) {
      console.error('Upload error:', err);
      console.error('Error response:', err.response?.data);

      let errorMessage = 'Upload failed. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please ensure you have permission to upload documents.';
      } else if (err.response?.status === 413) {
        errorMessage = 'Files too large. Please reduce file sizes and try again.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName?.toLowerCase().includes('.pdf')) {
      return <FileText className="text-red-500" size={20} />;
    }
    return <FileText className="text-blue-500" size={20} />;
  };

  // Show loading state while checking authentication
  if (!isAuthenticated && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {submitStatus === "success" ? (
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 py-10 bg-white shadow-lg rounded-2xl p-8 border border-green-100">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Details Submitted Successfully!</h2>
            <p className="text-gray-600 text-center">
              {successMessage}
              <br />
              Redirecting to your dashboard...
            </p>
            <div className="mt-4 w-full">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Step 2 of 2
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Academic Documents
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Upload your academic certificates and documents
            </p>

            {/* User Info Display */}
            {userInfo && (
              <div className="mt-4 inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm">
                <Shield className="w-4 h-4 mr-2" />
                Logged in as: {userInfo.email} (ID: {userInfo.id})
              </div>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Upload className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
                <p className="text-gray-600">Please upload all required documents in PDF or image format</p>
              </div>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
                <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
                <div className="ml-3">
                  <h3 className="font-medium">Error</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
                <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                <div className="ml-3">
                  <h3 className="font-medium">Success</h3>
                  <p className="text-sm mt-1">{success}</p>
                </div>
              </div>
            )}

            {/* Document Upload Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {documentLabels.map(({ key, label, required }) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {!required && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Optional
                      </span>
                    )}
                  </div>

                  {documents[key] ? (
                    <div className={`${documents[key].uploaded ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border rounded-lg p-3`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(documents[key].name)}
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                              {documents[key].name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {documents[key].uploaded ? 'Already uploaded' : `${(documents[key].size / 1024).toFixed(1)} KB`}
                            </p>
                            {documents[key].uploaded && documents[key].url && (
                              <p className="text-xs text-blue-600 truncate max-w-[200px]">
                                Stored: {documents[key].url}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(key)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <label className="cursor-pointer">
                        <span className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) => handleFileChange(e, key)}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PDF or Image (Max 5MB)</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                <span className="text-sm text-gray-500">
                  {Object.keys(documents).length} / {documentLabels.length} files
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.keys(documents).length / documentLabels.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading || Object.keys(documents).length === 0 || !isAuthenticated}
                className="inline-flex items-center px-8 py-3.5 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Uploading Documents...
                  </>
                ) : (
                  <>
                    Complete Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Important Notes</h3>
                  <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                    <li>All documents marked with * are required</li>
                    <li>Upload clear, readable copies of your documents</li>
                    <li>Accepted formats: PDF, JPG, PNG (Max 5MB per file)</li>
                    <li>Ensure all information is clearly visible</li>
                    <li>Documents are securely stored and linked to your account</li>
                    <li>You can view your uploaded documents in your profile</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">
                  <strong>Security:</strong> All documents are encrypted and stored securely. Each file is uniquely identified and linked to your account to prevent unauthorized access.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicDocuments;


