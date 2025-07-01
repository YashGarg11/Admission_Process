// src/pages/AcademicDocuments.jsx
import axios from 'axios';
import { AlertCircle, ArrowRight, CheckCircle, FileText, Loader, Upload, X } from 'lucide-react';
import { useState } from 'react';
import config from "../config";

const AcademicDocuments = () => {
  const [documents, setDocuments] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      setDocuments({
        ...documents,
        [key]: file,
      });
      setError(''); // Clear any previous errors
    }
  };

  const removeFile = (key) => {
    const newDocuments = { ...documents };
    delete newDocuments[key];
    setDocuments(newDocuments);
  };

  const handleSubmit = async () => {
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

    const formData = new FormData();
    Object.keys(documents).forEach((key) => {
      if (documents[key]) {
        formData.append(key, documents[key]);
      }
    });

    try {
      await axios.post(`${config.API_BASE_URL}/admission/academic-details`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Documents uploaded successfully!');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(documents[key].name)}
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {documents[key].name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(documents[key].size / 1024).toFixed(1)} KB
                          </p>
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
              disabled={loading || Object.keys(documents).length === 0}
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDocuments;