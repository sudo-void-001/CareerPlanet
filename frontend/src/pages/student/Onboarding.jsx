import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FiUploadCloud, FiCheckCircle, FiFileText, FiBriefcase, FiTrendingUp } from 'react-icons/fi';

const API_BASE = 'http://localhost:8000';
const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };

const Onboarding = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const user = getUser();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  const steps = ['Upload Resume', 'AI Analysis', 'Job Match', 'Apply'];
  const currentStep = 0;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    setSelectedFile(file);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={styles.welcomeContent}
        >
          <h1 style={styles.title}>
            Welcome aboard, <span style={styles.gradientText}>{firstName}</span>!
          </h1>
          <p style={styles.subtitle}>Let's fast-track your career journey with AI-powered matching.</p>

          <div style={styles.features}>
            {[
              { icon: <FiFileText size={24} />, title: 'Smart Resume Parsing', desc: 'We extract your key skills and experiences instantly.' },
              { icon: <FiBriefcase size={24} />, title: 'Personalized Job Matches', desc: 'Find opportunities perfectly aligned with your profile.' },
              { icon: <FiTrendingUp size={24} />, title: 'Career Growth Insights', desc: 'Get actionable feedback to improve your applications.' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.2 }}
                style={styles.featureCard}
              >
                <div style={styles.iconBox}>{feature.icon}</div>
                <div>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDesc}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.progressContainer}>
          {steps.map((step, idx) => (
            <div key={idx} style={styles.stepWrapper}>
              <div
                style={{
                  ...styles.stepIndicator,
                  background: idx <= currentStep ? '#6366f1' : '#e2e8f0',
                  color: idx <= currentStep ? '#fff' : '#64748b'
                }}
              >
                {idx < currentStep ? <FiCheckCircle size={14} /> : idx + 1}
              </div>
              <span style={{ ...styles.stepText, color: idx <= currentStep ? '#1e293b' : '#94a3b8' }}>
                {step}
              </span>
              {idx < steps.length - 1 && <div style={{...styles.stepLine, background: idx < currentStep ? '#6366f1' : '#e2e8f0'}} />}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={styles.uploadSection}
        >
          <div style={styles.uploadHeader}>
            <h2 style={styles.uploadTitle}>Upload Your Resume</h2>
            <p style={styles.uploadSubtitle}>We'll analyze it to find the best roles for you.</p>
          </div>

          <form
            onDragEnter={handleDrag}
            onSubmit={(e) => e.preventDefault()}
            style={styles.uploadForm}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            
            <motion.div
              style={{
                ...styles.dropZone,
                borderColor: dragActive ? '#6366f1' : '#cbd5e1',
                backgroundColor: dragActive ? '#eff6ff' : '#f8fafc',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
            >
              <AnimatePresence mode="wait">
                {!selectedFile ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.dropZoneContent}
                  >
                    <div style={styles.uploadIconWrapper}>
                      <FiUploadCloud size={40} color="#6366f1" />
                    </div>
                    <p style={styles.dragText}>
                      <span style={styles.dragTextHighlight}>Click to upload</span> or drag and drop
                    </p>
                    <p style={styles.dragSubtext}>PDF, DOCX (Max 5MB)</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.filePreview}
                  >
                    <FiFileText size={48} color="#6366f1" />
                    <div style={styles.fileInfo}>
                      <p style={styles.fileName}>{selectedFile.name}</p>
                      <p style={styles.fileSize}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      style={styles.removeFileBtn}
                    >
                      Remove
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {error && <p style={styles.errorText}>{error}</p>}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.preventDefault(); handleUpload(); }}
              disabled={!selectedFile || uploading}
              style={{
                ...styles.submitBtn,
                opacity: (!selectedFile || uploading) ? 0.6 : 1,
                cursor: (!selectedFile || uploading) ? 'not-allowed' : 'pointer',
              }}
            >
              {uploading ? 'Analyzing Resume...' : 'Continue to Dashboard'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '"Inter", sans-serif',
    backgroundColor: '#f1f5f9',
    flexDirection: window.innerWidth <= 1024 ? 'column' : 'row',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    padding: '4rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  rightPanel: {
    flex: 1.2,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: '3rem 4rem',
    overflowY: 'auto',
  },
  welcomeContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '500px',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: '1.5rem',
  },
  gradientText: {
    background: 'linear-gradient(to right, #818cf8, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#cbd5e1',
    marginBottom: '3rem',
    lineHeight: 1.6,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  featureCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#818cf8',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  featureDesc: {
    color: '#94a3b8',
    lineHeight: 1.5,
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4rem',
    position: 'relative',
  },
  stepWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',
    flex: 1,
  },
  stepIndicator: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  stepText: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  stepLine: {
    flex: 1,
    height: '2px',
    margin: '0 1rem',
    transition: 'background 0.3s ease',
  },
  uploadSection: {
    maxWidth: '560px',
    margin: '0 auto',
    width: '100%',
  },
  uploadHeader: {
    marginBottom: '2.5rem',
    textAlign: 'center',
  },
  uploadTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  uploadSubtitle: {
    color: '#64748b',
    fontSize: '1rem',
  },
  uploadForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  dropZone: {
    border: '2px dashed #cbd5e1',
    borderRadius: '24px',
    padding: '4rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8fafc',
  },
  dropZoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  uploadIconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  dragText: {
    fontSize: '1.125rem',
    color: '#334155',
    fontWeight: 500,
  },
  dragTextHighlight: {
    color: '#6366f1',
    fontWeight: 600,
  },
  dragSubtext: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  filePreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  fileInfo: {
    textAlign: 'center',
  },
  fileName: {
    fontWeight: 600,
    color: '#1e293b',
    fontSize: '1.125rem',
  },
  fileSize: {
    color: '#64748b',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  removeFileBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#ef4444',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: '0.875rem',
    marginTop: '-0.5rem',
  },
  submitBtn: {
    padding: '1rem 2rem',
    borderRadius: '12px',
    backgroundColor: '#0f172a',
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: 600,
    border: 'none',
    boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
    transition: 'all 0.2s ease',
    marginTop: '1rem',
  },
};

export default Onboarding;
