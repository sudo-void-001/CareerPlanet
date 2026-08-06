import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };

export default function Onboarding() {
  const navigate = useNavigate();
  const user = getUser();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { num: 1, label: 'Upload Resume', active: true },
    { num: 2, label: 'AI Deep Scan', active: false },
    { num: 3, label: 'Job Matching', active: false },
    { num: 4, label: 'One-Click Apply', active: false }
  ];

  const handleUpload = async (selectedFile) => {
    const fileToUpload = selectedFile || file;
    if (!fileToUpload) {
      setError('Please choose a PDF resume file.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      localStorage.setItem('hasResume', 'true');
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      setError('Failed to process resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf'))) {
      setFile(droppedFile);
      handleUpload(droppedFile);
    } else {
      setError('Please upload a PDF file.');
    }
  };

  return (
    <div className="page hero-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container-md">
        
        {/* Step Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: s.active ? 'var(--primary)' : 'var(--surface-3)',
                color: s.active ? '#000' : 'var(--text-tertiary)',
                fontWeight: 800, fontSize: '0.9375rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: s.active ? 'var(--shadow-glow)' : 'none',
                border: s.active ? 'none' : '1px solid var(--border)'
              }}>
                {s.num}
              </div>
              <span style={{ fontSize: '0.9375rem', fontWeight: s.active ? 700 : 500, color: s.active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                {s.label}
              </span>
              {i !== steps.length - 1 && (
                <div style={{ width: '40px', height: '2px', background: 'var(--border-light)', marginLeft: '1.75rem' }} />
              )}
            </div>
          ))}
        </div>

        {/* Welcome Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="glass-card" 
          style={{ padding: '4rem 3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
        >
          <span className="badge badge-indigo" style={{ marginBottom: '1.25rem', display: 'inline-flex', padding: '0.35rem 0.85rem' }}>✦ Welcome to CareerPlanet</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 800 }}>
            Welcome, {user?.full_name?.split(' ')[0] || 'Candidate'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: 560, margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Let's activate your account. Upload your resume so our AI engine can calculate job matches and enable 1-click recruiter applications.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: 'var(--radius)', fontSize: '0.9375rem', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('onboarding-resume').click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-strong)'}`,
              backgroundColor: isDragging ? 'var(--surface-3)' : 'var(--surface-2)',
              borderRadius: 'var(--radius-xl)',
              padding: '5rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              maxWidth: 600,
              margin: '0 auto 2.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isDragging && <div className="ambient-glow" style={{ opacity: 0.5 }} />}
            
            {uploading ? (
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 64, height: 64, border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800 }}>Analyzing Resume & Creating Profile...</h4>
              </div>
            ) : (
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  ☁️
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {file ? file.name : 'Upload your PDF Resume'}
                </h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9375rem' }}>Drag & drop your file here or click to browse</p>
              </div>
            )}
            <input 
              id="onboarding-resume"
              type="file" 
              accept=".pdf" 
              onChange={(e) => {
                const selected = e.target.files[0];
                if (selected) {
                  setFile(selected);
                  handleUpload(selected);
                }
              }}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/jobs')} 
              className="btn btn-ghost"
              style={{ fontSize: '1rem' }}
            >
              Skip for now →
            </button>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
