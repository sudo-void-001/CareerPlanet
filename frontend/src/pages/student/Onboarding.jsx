import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
          {steps.map((s) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: s.active ? '#10b981' : 'rgba(255,255,255,0.06)',
                color: s.active ? '#000' : 'var(--text-tertiary)',
                fontWeight: 800, fontSize: '0.875rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: s.active ? '0 0 15px rgba(16,185,129,0.5)' : 'none'
              }}>
                {s.num}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: s.active ? 700 : 500, color: s.active ? '#ffffff' : 'var(--text-tertiary)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Welcome Box */}
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <span className="badge badge-green" style={{ marginBottom: '1rem', display: 'inline-flex' }}>✦ Welcome to CareerPlanet</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: '#ffffff' }}>
            Welcome, {user?.full_name?.split(' ')[0] || 'Candidate'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Let's activate your account. Upload your resume so our AI engine can calculate job matches and enable 1-click recruiter applications.
          </p>

          {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.875rem 1rem', borderRadius: 12, fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: 440, margin: '0 auto 1.5rem' }}>{error}</div>}

          {/* Upload Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('onboarding-resume').click()}
            style={{
              border: `2px dashed ${isDragging ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
              backgroundColor: isDragging ? 'rgba(16, 185, 129, 0.08)' : 'rgba(13, 15, 23, 0.6)',
              borderRadius: 24,
              padding: '4rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              maxWidth: 540,
              margin: '0 auto 2rem'
            }}
          >
            {uploading ? (
              <div>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.25rem' }} />
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Analyzing Resume & Creating Profile...</h4>
              </div>
            ) : (
              <>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ☁️
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                  {file ? file.name : 'Upload your PDF Resume'}
                </h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Drag & drop your file here or click to browse</p>
              </>
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
              style={{ color: 'var(--text-tertiary)' }}
            >
              Skip for now →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
