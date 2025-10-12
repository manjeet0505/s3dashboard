'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { Upload, FileText, BarChart, CheckCircle, AlertCircle, Loader2, X, Download, Eye, HelpCircle, Sparkles } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1],
      opacity: { duration: 0.4 }
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
      when: "beforeChildren"
    }
  }
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const ResumeAnalysis = ({ user }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeScore, setResumeScore] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const calculateScore = (data) => {
    let score = 0;
    if (data.skills?.length > 5) score += 40;
    if (data.experience?.[0] && !data.experience[0].includes('No work experience')) score += 30;
    if (data.education?.[0] && !data.education[0].includes('No education')) score += 20;
    if (data.contact?.emails?.length > 0 || data.contact?.phones?.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setFileName(file.name);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(40);
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(70);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to process resume');
      }

      const result = await response.json();
      setUploadProgress(90);

      if (result.error) {
        throw new Error(result.error);
      }

      // Store extracted data
      setAnalysisResults({
        extractedData: result
      });
      
      setUploadProgress(100);
      setAnalysisComplete(true);
      
      // Call AI analyzer for detailed feedback
      setIsAnalyzing(true);
      try {
        console.log('Calling AI analyzer...');
        const aiResponse = await fetch('/api/analyze-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resumeData: result,
            jobDescription: null // Can be added later
          }),
        });

        console.log('AI Response status:', aiResponse.status);
        
        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          console.log('AI Result:', aiResult);
          setAiAnalysis(aiResult);
          setResumeScore(aiResult.overall_score || calculateScore(result));
        } else {
          const errorData = await aiResponse.json().catch(() => ({}));
          console.error('AI analysis failed:', errorData);
          // Fallback to basic scoring
          const score = calculateScore(result);
          setResumeScore(score);
        }
      } catch (aiError) {
        console.error('AI analysis error:', aiError);
        // Fallback to basic scoring
        const score = calculateScore(result);
        setResumeScore(score);
      } finally {
        setIsAnalyzing(false);
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to process resume. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const renderUploadArea = () => (
    <motion.div 
      className={`relative p-8 border-2 border-dashed rounded-2xl ${
        dragActive 
          ? 'border-indigo-500 bg-indigo-50/80' 
          : 'border-gray-300 hover:border-indigo-400 bg-white/80 backdrop-blur-sm'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={!dragActive ? {
        borderColor: 'rgba(99, 102, 241, 0.8)',
        transition: { duration: 0.2 }
      } : {}}
      animate={dragActive ? {
        scale: 1.01,
        transition: { duration: 0.2 }
      } : { scale: 1 }}
    >
      <div className="text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
          <Upload className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {dragActive ? 'Drop your resume here' : 'Drag and drop your resume'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <label className="cursor-pointer inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Upload className="h-4 w-4 mr-2" />
          Select a file
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
        </label>
        <p className="mt-3 text-xs text-gray-500">
          PDF, DOC, or DOCX (max. 5MB)
        </p>
      </div>

      {isUploading && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="truncate max-w-[70%]">{fileName}</span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderAnalysisResults = () => {
    if (!analysisComplete || !analysisResults) return null;

    return (
      <motion.div 
        className="space-y-6 w-full"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        key="analysis-results"
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 overflow-hidden w-full"
          variants={fadeIn}
          layoutId="analysisCard"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <motion.h2 
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Resume Analysis
              </motion.h2>
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 10,
                  delay: 0.2
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Analysis Complete
              </motion.span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="col-span-1"
                variants={itemFadeIn}
              >
                {/* Score Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 h-full">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <motion.circle
                        className="text-indigo-600"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - (resumeScore || 0) / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{
                          strokeDashoffset: 251.2 * (1 - (resumeScore || 0) / 100),
                          transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                        }}
                      />
                      <text
                        x="50%"
                        y="50%"
                        className="text-3xl font-bold text-gray-900"
                        textAnchor="middle"
                        dy=".3em"
                      >
                        {resumeScore}%
                      </text>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-center text-gray-900">Overall Score</h3>
                  <p className="text-sm text-center text-gray-500 mt-2">
                    {resumeScore >= 80 
                      ? 'Excellent! Your resume is well-optimized.' 
                      : resumeScore >= 60 
                        ? 'Good, but there\'s room for improvement.'
                        : 'Needs work. Consider the suggestions below.'}
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="md:col-span-2"
                variants={staggerContainer}
              >
                <motion.div 
                  className="space-y-4"
                  variants={staggerContainer}
                >
                  <motion.div variants={itemFadeIn}>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Resume Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-start bg-white p-3 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          Resume parsed successfully! {analysisResults.extractedData?.skills?.length || 0} skills detected.
                        </p>
                      </div>
                      {isAnalyzing && (
                        <div className="flex items-start bg-blue-50 p-3 rounded-lg">
                          <Loader2 className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0 animate-spin" />
                          <p className="text-sm text-blue-900">
                            AI is analyzing your resume for detailed feedback...
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* AI-Powered Suggestions */}
            {isAnalyzing && (
              <motion.div variants={itemFadeIn} className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 text-indigo-600 animate-spin mr-3" />
                  <span className="text-sm text-indigo-900">AI is analyzing your resume...</span>
                </div>
              </motion.div>
            )}

            {aiAnalysis && !isAnalyzing && (
              <motion.div variants={itemFadeIn} className="mt-6 space-y-6">
                {/* Score Breakdown */}
                {aiAnalysis.score_breakdown && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">AI Score Breakdown</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(aiAnalysis.score_breakdown).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span className="text-sm font-bold text-indigo-600">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {aiAnalysis.strengths?.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {aiAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span className="text-sm text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {aiAnalysis.weaknesses?.length > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {aiAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-600 mr-2">!</span>
                          <span className="text-sm text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Suggestions */}
                {aiAnalysis.suggestions?.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                      AI-Powered Suggestions
                    </h3>
                    <div className="space-y-4">
                      {aiAnalysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-semibold text-blue-600 uppercase">{suggestion.category}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                              suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {suggestion.priority} priority
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{suggestion.suggestion}</p>
                          <p className="text-xs text-gray-600">{suggestion.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {aiAnalysis.missing_skills?.length > 0 && (
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Missing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.missing_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Items */}
                {aiAnalysis.action_items?.length > 0 && (
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Action Items</h3>
                    <ol className="space-y-2">
                      {aiAnalysis.action_items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700 mt-0.5">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </motion.div>
            )}

            {/* Skills Section */}
            {analysisResults.extractedData?.skills?.length > 0 && (
              <motion.div variants={itemFadeIn} className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Extracted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.extractedData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {analysisResults.extractedData?.experience && (
              <motion.div variants={itemFadeIn} className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Work Experience</h3>
                <div className="space-y-2">
                  {analysisResults.extractedData.experience.map((exp, index) => (
                    <div key={index} className="flex items-start">
                      <FileText className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{exp}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education Section */}
            {analysisResults.extractedData?.education && (
              <motion.div variants={itemFadeIn} className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Education</h3>
                <div className="space-y-2">
                  {analysisResults.extractedData.education.map((edu, index) => (
                    <div key={index} className="flex items-start">
                      <BarChart className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{edu}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact Information */}
            {analysisResults.extractedData?.contact && (
              <motion.div variants={itemFadeIn} className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {analysisResults.extractedData.contact.emails?.map((email, index) => (
                    <div key={`email-${index}`} className="flex items-center text-sm text-gray-700">
                      <span className="font-medium mr-2">Email:</span>
                      <span>{email}</span>
                    </div>
                  ))}
                  {analysisResults.extractedData.contact.phones?.map((phone, index) => (
                    <div key={`phone-${index}`} className="flex items-center text-sm text-gray-700">
                      <span className="font-medium mr-2">Phone:</span>
                      <span>{phone}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="text-center mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
        >
          Resume Analysis
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4"
        >
          Upload your resume and get instant feedback to improve your job prospects
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-8 sm:p-10">
          {!analysisComplete ? renderUploadArea() : renderAnalysisResults()}
        </div>
      </motion.div>

      {analysisComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => {
              setAnalysisComplete(false);
              setResumeScore(0);
              setAnalysisResults(null);
              setFileName('');
              setError(null);
            }}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Upload className="-ml-1 mr-2 h-5 w-5" />
            Analyze Another Resume
          </button>
          <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            <Download className="-ml-1 mr-2 h-5 w-5" />
            Download PDF Report
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeAnalysis;
