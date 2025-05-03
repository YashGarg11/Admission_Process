import axios from 'axios';
import { gsap } from 'gsap/gsap-core';
import { AlertTriangle, ArrowRight, BookOpen, Check, FileText, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import config from '../config';

// Academic Service - would be better in a separate file
const academicService = {
  // Simplified to not rely on external endpoints
  getCourses: async () => {
    // Return default courses since the endpoint doesn't exist
    return [
      'Computer Science Engineering (CSE)',
      'Computer Science (CS)',
      'Information Technology (IT)',
      'Electronics and Communication (ECE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering (CE)'
    ];
  }
};

// Document types required for admission
const DOCUMENT_TYPES = [
  { id: 'marksheet_10', name: '10th Marksheet', required: true },
  { id: 'marksheet_12', name: '12th Marksheet', required: true },
  { id: 'tc', name: 'Transfer Certificate', required: true },
  { id: 'character_cert', name: 'Character Certificate', required: true },
  { id: 'migration_cert', name: 'Migration Certificate', required: false },
  { id: 'medical_cert', name: 'Medical Certificate', required: false },
  { id: 'income_cert', name: 'Income Certificate', required: false },
  { id: 'aadhar_card', name: 'Aadhar Card', required: true },
  { id: 'passport_photo', name: 'Passport Size Photo', required: true },
  { id: 'signature', name: 'Scanned Signature', required: true },
  { id: 'other', name: 'Other Document', required: false },
];

export default function AcademicDetailsForm() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [course, setCourse] = useState('');
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [customNames, setCustomNames] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  // References for animations
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const courseRef = useRef(null);
  const fileRef = useRef(null);
  const buttonRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);

  // State for available courses (will be loaded from API)
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simple test function to verify file upload works
  const testUpload = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token || files.length === 0) {
      alert("Please select files and ensure you're logged in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a minimal FormData with more detailed test data
      const testFormData = new FormData();
      testFormData.append('course', 'Test Course');
      
      // Create arrays with clear, distinct values
      const testNames = files.slice(0, 1).map(file => `Test Name: ${file.name}`);
      const testTypes = files.slice(0, 1).map(() => 'marksheet_10'); // Using a real document type
      
      console.log('Test names array:', testNames);
      console.log('Test types array:', testTypes);
      
      testFormData.append('documentNames', JSON.stringify(testNames));
      testFormData.append('documentTypes', JSON.stringify(testTypes));
      
      // Only add the first file for testing
      testFormData.append('documents', files[0]);

      console.log('Testing with file:', files[0].name);

      // Make the request
      const response = await axios.post(
        `${config.API_BASE_URL}/admission/academic-details`,
        testFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Test success:', response.data);
      alert('Test upload successful!');
    } catch (error) {
      console.error('Test failed:', error);
      setError(`Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize animations and fetch data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Get auth token from local storage - try both 'token' and 'authToken'
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');

        if (!token) {
          setError("Authentication token not found. Please login again.");
          setIsLoading(false);
          return;
        }

        // Check if we have a personal details data from the previous page
        const personalDetails = location.state?.personalDetails;
        if (personalDetails) {
          console.log('Personal details data received:', personalDetails);
          // You can use personal details if needed
        }

        // Load available courses
        const coursesData = await academicService.getCourses();
        setCourses(coursesData);

        // If in edit mode (applicationId exists), we could pre-fill the form
        // But since we don't have the endpoint, we'll just acknowledge the ID
        if (applicationId) {
          console.log(`Editing application with ID: ${applicationId}`);
        }

      } catch (error) {
        console.error("Error loading initial data:", error);
        setError("Failed to load form data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Initialize animations
    const tl = gsap.timeline();

    tl.fromTo(headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );

    tl.fromTo(formRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );

  }, [applicationId, location.state, navigate]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);

    const newFileNames = selectedFiles.map(file => file.name);
    setFileNames([...fileNames, ...newFileNames]);
    setCustomNames([...customNames, ...newFileNames]);

    // Set default document types based on the first few required documents that might not be added yet
    const newDocTypes = selectedFiles.map(() => {
      // Find required document types that haven't been assigned yet
      const missingRequiredTypes = DOCUMENT_TYPES.filter(
        type => type.required && !documentTypes.includes(type.id)
      );

      if (missingRequiredTypes.length > 0) {
        return missingRequiredTypes[0].id;
      }
      return 'other'; // Default to 'other' if all required types are covered
    });

    setDocumentTypes([...documentTypes, ...newDocTypes]);

    // Animate new files being added
    gsap.fromTo(
      '.file-item:nth-last-child(-n+' + selectedFiles.length + ')',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  };

  // Handle file removal
  const removeFile = (index) => {
    const newFiles = [...files];
    const newFileNames = [...fileNames];
    const newCustomNames = [...customNames];
    const newDocTypes = [...documentTypes];

    // Animate file removal
    gsap.to(
      `.file-item:nth-child(${index + 1})`,
      {
        opacity: 0,
        x: -20,
        duration: 0.3,
        onComplete: () => {
          newFiles.splice(index, 1);
          newFileNames.splice(index, 1);
          newCustomNames.splice(index, 1);
          newDocTypes.splice(index, 1);
          setFiles(newFiles);
          setFileNames(newFileNames);
          setCustomNames(newCustomNames);
          setDocumentTypes(newDocTypes);
        }
      }
    );
  };

  // Handle custom file name change
  const handleNameChange = (index, name) => {
    const newCustomNames = [...customNames];
    newCustomNames[index] = name;
    setCustomNames(newCustomNames);
  };

  // Handle document type change
  const handleDocTypeChange = (index, docType) => {
    const newDocTypes = [...documentTypes];
    newDocTypes[index] = docType;
    setDocumentTypes(newDocTypes);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!course) {
      errors.course = "Course selection is required";
    }

    if (files.length === 0) {
      errors.files = "At least one academic document is required";
    }

    if (customNames.some(name => !name.trim())) {
      errors.names = "All documents must have names";
    }

    // Check required document types
    const requiredDocTypes = DOCUMENT_TYPES.filter(type => type.required).map(type => type.id);
    const missingRequiredDocs = requiredDocTypes.filter(
      reqType => !documentTypes.includes(reqType)
    );

    if (missingRequiredDocs.length > 0) {
      const missingDocNames = missingRequiredDocs.map(
        id => DOCUMENT_TYPES.find(type => type.id === id).name
      );

      errors.docTypes = `Missing required documents: ${missingDocNames.join(', ')}`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      // Shake the form to indicate error
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
      return;
    }

    setLoading(true);

    // Get token from local storage - try both 'token' and 'authToken'
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');

    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    // Create form data for file upload
    const formData = new FormData();
    formData.append('course', course);
    
    // Ensure the arrays align with the files
    if (files.length !== customNames.length || files.length !== documentTypes.length) {
      setError("Internal error: Mismatch between files and their metadata. Please refresh and try again.");
      setLoading(false);
      return;
    }
    
    // Log for verification
    console.log('Submission data:');
    console.log('- Files:', files.map(f => f.name));
    console.log('- Names:', customNames);
    console.log('- Types:', documentTypes);
    
    // Convert names and types to JSON strings
    formData.append('documentNames', JSON.stringify(customNames));
    formData.append('documentTypes', JSON.stringify(documentTypes));
    
    // Add files with the correct field name
    files.forEach(file => {
      formData.append('documents', file);
    });

    // API connection code
    const submitToAPI = async () => {
      try {
        let response;

        try {
          // Use axios instead of fetch for better error handling
          response = await axios.post(
            `${config.API_BASE_URL}/admission/academic-details`,
            formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          // Success handling
          console.log("Success response:", response.data);
          setSuccess(true);
          setError(null);

          // Success animation
          gsap.to(formRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => {
              gsap.fromTo(
                successRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
              );
            }
          });

          // Navigate to the next page after successful submission
          setTimeout(() => {
            navigate('/admission/submission-success');
          }, 2000);
          
        } catch (error) {
          console.error("Error response:", error.response?.data);
          throw new Error(error.response?.data?.message || "Server error processing your academic details.");
        }
      } catch (err) {
        console.error("Error submitting form:", err);
        setError(err.message || "Server error processing your academic details. Please try again.");

        // Error animation
        gsap.fromTo(
          errorRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      } finally {
        setLoading(false);
      }
    };

    submitToAPI();
  };

  // Next step handler
  const handleNextStep = () => {
    if (step === 1 && !course) {
      setValidationErrors({ ...validationErrors, course: "Course selection is required" });

      // Shake the course select to indicate error
      gsap.to(courseRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
      return;
    }

    if (step === 2 && files.length === 0) {
      setValidationErrors({ ...validationErrors, files: "At least one academic document is required" });

      // Shake the file upload section to indicate error
      gsap.to(fileRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
      return;
    }

    // Animate step transition
    gsap.to(formRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.3,
      onComplete: () => {
        setStep(step + 1);
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.5 }
        );
      }
    });
  };

  // Previous step handler
  const handlePrevStep = () => {
    gsap.to(formRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.3,
      onComplete: () => {
        setStep(step - 1);
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.5 }
        );
      }
    });
  };

  // Reset form
  const resetForm = () => {
    setCourse('');
    setFiles([]);
    setFileNames([]);
    setCustomNames([]);
    setSuccess(false);
    setError(null);
    setStep(1);
    setValidationErrors({});

    // Reset animation
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Details Submission</h1>
          <p className="text-gray-600">
            Complete your application by providing your course preference and academic documents
          </p>

          {/* Progress indicator */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-3/4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${step === 1 ? '33%' : step === 2 ? '66%' : '100%'}` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div className={`${step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Course</div>
                <div className={`${step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Documents</div>
                <div className={`${step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Review</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading form data...</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            ref={successRef}
            className="bg-white shadow-lg rounded-lg p-8 text-center"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your academic details and documents have been successfully submitted.
              We'll review your application shortly.
            </p>
            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            ref={errorRef}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        {!success && !isLoading && (
          <div ref={formRef} className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            {/* Step 1: Course Selection */}
            {step === 1 && (
              <div ref={courseRef} className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpen className="mr-2 text-blue-600" />
                  Select Your Course
                </h2>

                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Preference
                </label>
                <select
                  id="course"
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    // Clear validation error when user selects a course
                    if (validationErrors.course) {
                      setValidationErrors({ ...validationErrors, course: "" });
                    }
                  }}
                  className={`w-full px-3 py-2 border ${validationErrors.course ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select a course</option>
                  {courses.map((c, index) => (
                    <option key={index} value={c}>{c}</option>
                  ))}
                </select>
                {validationErrors.course && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.course}</p>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Document Upload */}
            {step === 2 && (
              <div ref={fileRef} className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="mr-2 text-blue-600" />
                  Upload Academic Documents
                </h2>

                <div className={`mt-2 ${validationErrors.files ? 'border-red-300' : 'border-gray-300'} border-2 border-dashed rounded-md p-6 text-center`}>
                  <div className="space-y-1">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX up to 10MB each
                    </p>
                  </div>
                </div>
                {validationErrors.files && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.files}</p>
                )}

                {/* Test button - only show during development */}
                <button
                  type="button"
                  onClick={testUpload}
                  className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  Test Simple Upload
                </button>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h3>
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                      {files.map((file, index) => (
                        <li key={index} className="file-item px-4 py-3 flex items-center bg-white">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{fileNames[index]}</div>
                            <div className="mt-1 space-y-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Document Type</label>
                                <select
                                  value={documentTypes[index] || ''}
                                  onChange={(e) => handleDocTypeChange(index, e.target.value)}
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                  <option value="">Select document type</option>
                                  {DOCUMENT_TYPES.map((docType) => (
                                    <option key={docType.id} value={docType.id}>
                                      {docType.name} {docType.required ? '(Required)' : ''}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Document Name/Description</label>
                                <input
                                  type="text"
                                  value={customNames[index]}
                                  onChange={(e) => handleNameChange(index, e.target.value)}
                                  placeholder="Enter a descriptive name for this document"
                                  className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="font-medium text-blue-600 hover:text-blue-500"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {validationErrors.names && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.names}</p>
                    )}
                    {validationErrors.docTypes && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.docTypes}</p>
                    )}
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review and Submit */}
            {step === 3 && (
              <div ref={buttonRef}>
                <h2 className="text-xl font-semibold mb-4">Review Your Application</h2>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Selected Course</h3>
                  <p className="text-gray-800 bg-white p-3 rounded border border-gray-200">
                    {course}
                  </p>

                  <h3 className="text-md font-medium text-gray-900 mt-4 mb-2">Academic Documents</h3>
                  <ul className="space-y-2">
                    {files.map((file, index) => {
                      // Get document type name from the ID
                      const docTypeObj = DOCUMENT_TYPES.find(type => type.id === documentTypes[index]) || { name: 'Unknown' };

                      return (
                        <li key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex justify-between flex-wrap">
                            <div className="space-y-1">
                              <span className="font-medium block">{customNames[index]}</span>
                              <span className="text-sm text-blue-600 block">{docTypeObj.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">{fileNames[index]} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Show warning if any required documents are missing */}
                  {(() => {
                    const requiredDocTypes = DOCUMENT_TYPES.filter(type => type.required).map(type => type.id);
                    const missingRequiredDocs = requiredDocTypes.filter(
                      reqType => !documentTypes.includes(reqType)
                    );

                    if (missingRequiredDocs.length > 0) {
                      const missingDocNames = missingRequiredDocs.map(
                        id => DOCUMENT_TYPES.find(type => type.id === id).name
                      );

                      return (
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-700">
                                <strong>Warning:</strong> The following required documents are missing:
                                <span className="font-medium"> {missingDocNames.join(', ')}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="text-sm text-gray-500 mb-6">
                    By submitting this form, you confirm that all provided information is accurate and the documents are authentic.
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}