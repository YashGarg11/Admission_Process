import axios from 'axios';
import { gsap } from "gsap";
import { AlertCircle, ArrowRight, CheckCircle, FileText, Loader, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Mock config for demonstration
const config = {
  API_BASE_URL: 'https://admission-process-2.onrender.com/api' // Replace with your actual API URL
};

// Form validation helpers
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateMobile = (mobile) => {
  const re = /^[0-9]{10}$/;
  return re.test(mobile);
};

export default function PersonalDetailsForm() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("Your personal details have been saved.");

  // Refs for animations
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const formItemsRef = useRef([]);
  const uploadSectionRef = useRef(null);
  const submitBtnRef = useRef(null);
  const successRef = useRef(null);

  // Initialize animations with fromTo
  useEffect(() => {
    const tl = gsap.timeline();

    // Initially set elements to be invisible
    gsap.set([headerRef.current, ...formItemsRef.current, uploadSectionRef.current, submitBtnRef.current], {
      opacity: 0
    });

    // Header animation
    tl.fromTo(headerRef.current,
      { y: -70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // Form fields staggered animation
    tl.fromTo(formItemsRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power2.out" },
      "-=0.5"
    );

    // Upload section animation 
    tl.fromTo(uploadSectionRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
      "-=0.3"
    );

    // Submit button animation with bounce effect
    tl.fromTo(submitBtnRef.current,
      { y: 20, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
      "-=0.4"
    );

    return () => tl.kill();
  }, []);

  // Check login status on component mount
  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/auth/check-session`, { withCredentials: true })
      .then((res) => {
        console.log("User authenticated", res.data);
      })
      .catch((err) => {
        console.warn("User not authenticated");
        // For demo purposes, we'll comment out the redirect
        // navigate("/login");
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }

    // Create micro-animation for active input field
    gsap.fromTo(
      e.target,
      { borderColor: "#3b82f6", boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" },
      {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
        duration: 0.3,
        yoyo: true,
        repeat: 1
      }
    );
  };

  // Handle file upload with improved animation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setFormErrors({
          ...formErrors,
          file: "Please upload a PDF file"
        });

        // Error animation for wrong file type
        gsap.to(e.target.closest(".file-upload-container"), {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "#ef4444",
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });

        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
        setFormErrors({
          ...formErrors,
          file: "File size should be less than 5MB"
        });

        // Error animation for large file
        gsap.to(e.target.closest(".file-upload-container"), {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "#ef4444",
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });

        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFormErrors({
        ...formErrors,
        file: ""
      });

      // Success animation for file upload
      const fileContainer = e.target.closest(".file-upload-container");
      const tl = gsap.timeline();

      tl.to(fileContainer, {
        backgroundColor: "rgba(22, 163, 74, 0.1)",
        borderColor: "#16a34a",
        duration: 0.3
      });

      tl.fromTo(
        fileContainer.querySelector(".file-success"),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!validateMobile(formData.mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!file) {
      errors.file = "Counseling letter is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission with HTTP cookies authentication
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Animate error shake with improved motion
      gsap.fromTo(formRef.current,
        { x: 0 },
        {
          x: [-10, 10, -8, 8, -5, 5, 0],
          duration: 0.6,
          ease: "power2.out"
        }
      );

      // Highlight errors with animation
      const errorFields = document.querySelectorAll(".error-field");
      gsap.fromTo(errorFields,
        { borderColor: "#ef4444", backgroundColor: "white" },
        {
          borderColor: "#ef4444",
          backgroundColor: "rgba(254, 226, 226, 0.5)",
          duration: 0.4,
          stagger: 0.1,
          yoyo: true,
          repeat: 1
        }
      );

      // Scroll to first error with smooth animation
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    // Button loading animation
    gsap.to(submitBtnRef.current, {
      scale: 0.98,
      duration: 0.2
    });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("address", formData.address);

      // Check if file is valid before adding to FormData
      if (!file) {
        throw new Error("No file selected");
      }

      // Log file details
      console.log("File being uploaded:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });

      formDataToSend.append("counselingLetter", file);

      // Log what's being sent for debugging
      console.log("Sending form data:", {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        file: file ? file.name : 'No file'
      });

      // Send data to the server using HTTP cookies for authentication
      const response = await axios.post(
        `${config.API_BASE_URL}/admission/personal-details`,
        formDataToSend,
        {
          withCredentials: true, // ✅ Uses HTTP cookies for authentication
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Success:", response.data);

      // Success animation
      const tl = gsap.timeline();

      // Fade out form
      tl.to(formRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      });

      setSubmitStatus("success");

      // Setup success elements before animating
      setTimeout(() => {
        // Fade in success message
        tl.fromTo(successRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
        );

        // Staggered animation for success message items
        tl.fromTo(
          ".success-item",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.5 },
          "-=0.4"
        );
      }, 100);

      // Redirect to next page after 2 seconds
      setTimeout(() => {
        // For demo purposes, we'll show an alert instead of navigation
        alert("Would navigate to: /admission/academic-details");
        // navigate(`/admission/academic-details`);
      }, 2000);

    } catch (error) {
      console.error("Submission error details:", error);
      console.error("Response data:", error.response?.data);

      // Handle "pending application" special case
      if (error.response?.data?.message === "You already have a pending application") {
        console.log("You already have a pending application. Redirecting to academic details...");

        // Set success status instead of error
        setSubmitStatus("success");

        // Show custom success message for existing applications
        setSuccessMessage("You already have an application in progress. Redirecting to academic details...");

        // Redirect to academic details page after 2 seconds
        setTimeout(() => {
          // For demo purposes, we'll show an alert instead of navigation
          alert("Would navigate to: /admission/academic-details");
          // navigate('/admission/academic-details');
        }, 2000);

        return;
      }

      // For validation errors and other issues
      setIsSubmitting(false);
      setSubmitStatus("error");

      // Extract specific error message from response
      let errorMsg = error.response?.data?.message ||
        error.response?.data?.details ||
        error.message ||
        "An error occurred. Please try again.";

      // Display specific validation errors when available
      if (error.response?.status === 400) {
        if (error.response?.data?.details) {
          errorMsg = `Validation Error: ${error.response.data.details}`;
        }
      }

      setErrorMessage(errorMsg);

      // Error animation with bounce effect
      const tl = gsap.timeline();

      tl.to(formRef.current, {
        x: [-10, 10, -8, 8, -5, 5, 0],
        duration: 0.6,
        ease: "power2.out"
      });

      tl.fromTo(
        ".error-alert",
        { y: -20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );

      // Reset button state
      gsap.to(submitBtnRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      });

      // Reset status after 5 seconds
      setTimeout(() => {
        gsap.to(".error-alert", {
          opacity: 0,
          y: -10,
          duration: 0.4,
          onComplete: () => setSubmitStatus(null)
        });
      }, 5000);
    }
  };

  // Handle drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    gsap.to(e.currentTarget, {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "#3b82f6",
      duration: 0.3
    });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    gsap.to(e.currentTarget, {
      backgroundColor: formErrors.file ? "rgba(254, 226, 226, 0.5)" : "rgb(249, 250, 251)",
      borderColor: formErrors.file ? "#ef4444" : "#d1d5db",
      duration: 0.3
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Create a new event-like object
      const fileEvent = {
        target: {
          files: [droppedFile],
          closest: (selector) => e.currentTarget
        }
      };
      handleFileChange(fileEvent);
    } else {
      gsap.to(e.currentTarget, {
        backgroundColor: formErrors.file ? "rgba(254, 226, 226, 0.5)" : "rgb(249, 250, 251)",
        borderColor: formErrors.file ? "#ef4444" : "#d1d5db",
        duration: 0.3
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {submitStatus === "success" ? (
          <div
            ref={successRef}
            className="flex flex-col items-center justify-center space-y-6 py-10 bg-white shadow-lg rounded-2xl p-8 border border-green-100"
          >
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 success-item">Details Submitted Successfully!</h2>
            <p className="text-gray-600 text-center success-item">
              {successMessage}
              <br />Redirecting to academic details...
            </p>
            <div className="success-item mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div ref={headerRef} className="text-center mb-8">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Step 1 of 2
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Personal Details
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Let's start with your basic information
              </p>
            </div>

            <div ref={formRef} className="space-y-6">
              <div
                ref={el => formItemsRef.current[0] = el}
                className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                  <User className="mr-2 text-blue-500" size={20} />
                  Personal Information
                </h2>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full border ${formErrors.name ? 'border-red-500 error-field' : 'border-gray-300'} rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-600 error-message flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <div className="relative">
                      <Mail className="absolute top-3.5 left-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full border ${formErrors.email ? 'border-red-500 error-field' : 'border-gray-300'} rounded-lg shadow-sm py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-600 error-message flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number*
                    </label>
                    <div className="relative">
                      <Phone className="absolute top-3.5 left-3 text-gray-400" size={18} />
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        placeholder="10-digit mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`block w-full border ${formErrors.mobile ? 'border-red-500 error-field' : 'border-gray-300'} rounded-lg shadow-sm py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      />
                    </div>
                    {formErrors.mobile && (
                      <p className="mt-2 text-sm text-red-600 error-message flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {formErrors.mobile}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address*
                    </label>
                    <div className="relative">
                      <MapPin className="absolute top-3.5 left-3 text-gray-400" size={18} />
                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        placeholder="Your complete address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`block w-full border ${formErrors.address ? 'border-red-500 error-field' : 'border-gray-300'} rounded-lg shadow-sm py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      />
                    </div>
                    {formErrors.address && (
                      <p className="mt-2 text-sm text-red-600 error-message flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {formErrors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div
                ref={uploadSectionRef}
                className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                  <FileText className="mr-2 text-blue-500" size={20} />
                  Document Upload
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Counseling Letter (PDF, max 5MB)*
                    </label>
                    <div
                      className={`file-upload-container border-2 border-dashed ${formErrors.file ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-300`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {fileName ? (
                        <div className="flex flex-col items-center space-y-3 file-success">
                          <div className="bg-green-100 p-3 rounded-full">
                            <FileText className="text-green-600" size={28} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{fileName}</span>
                          <div className="flex items-center text-green-600 gap-1">
                            <CheckCircle size={16} />
                            <span className="text-sm">File uploaded successfully</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-blue-50 p-4 rounded-full mb-4">
                            <FileText className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="text-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Browse File
                              </span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept="application/pdf"
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="mt-3 text-gray-600">or drag and drop your file here</p>
                          </div>
                          <p className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                            <AlertCircle size={12} /> PDF only, maximum 5MB file size
                          </p>
                        </>
                      )}
                    </div>
                    {formErrors.file && (
                      <p className="mt-2 text-sm text-red-600 error-message flex items-center">
                        <AlertCircle size={14} className="mr-1" /> {formErrors.file}
                      </p>
                    )}
                    {fileName && (
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors duration-300"
                        onClick={() => {
                          setFile(null);
                          setFileName("");

                          // Animation for resetting file
                          gsap.fromTo(
                            ".file-upload-container",
                            { borderColor: "#3b82f6", backgroundColor: "rgba(59, 130, 246, 0.1)" },
                            {
                              borderColor: "#d1d5db",
                              backgroundColor: "rgb(249, 250, 251)",
                              duration: 0.5,
                              ease: "power2.out"
                            }
                          );
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove file
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {submitStatus === "error" && (
                <div className="error-alert bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start shadow-md">
                  <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="font-medium">Submission failed</h3>
                    <p className="text-sm mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-center md:justify-end pt-4">
                <button
                  ref={submitBtnRef}
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center justify-center px-8 py-3.5 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Academic Details
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}