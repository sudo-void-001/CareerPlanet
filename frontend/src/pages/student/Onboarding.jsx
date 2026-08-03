import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';

export default function Onboarding() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a resume file.'); return; }
    setUploading(true); setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      await api.post('/resume/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      localStorage.setItem('hasResume', 'true');
      
      // Simulate quick processing delay for UX
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Try again.');
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 60%), var(--bg)', padding: '1rem' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 540 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ marginBottom: '0.75rem', fontSize: '2rem' }}>
            Welcome, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Student'}!</span> 🎉
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)' }}>Let's get your profile set up so our AI can start finding your perfect job matches.</p>
        </div>

        <div style={{ background: 'white', borderRadius: 24, border: '1px solid var(--border)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Step 1: Upload your resume</h3>
          
          <form onSubmit={handleUpload}>
            <div
              style={{
                border: `2px dashed ${file ? '#6366f1' : 'var(--border)'}`,
                borderRadius: 16, padding: '3rem 2rem', textAlign: 'center',
                background: file ? '#f5f3ff' : 'var(--surface-2)', marginBottom: '1.5rem',
                transition: 'all 0.15s ease',
              }}
            >
              <input type="file" id="resume" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                onChange={e => { setFile(e.target.files[0]); setError(''); }} />
              <label htmlFor="resume" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{file ? '📄' : '📤'}</div>
                <div style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem', color: file ? '#6366f1' : 'var(--text-primary)' }}>
                  {file ? file.name : 'Click to select your resume'}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Supported formats: PDF, DOC, DOCX (Max 10MB)</div>
              </label>
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>{error}</div>}

            <button type="submit" disabled={!file || uploading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {uploading ? '⏳ Processing with AI...' : 'Complete Setup →'}
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
             <button onClick={() => navigate('/jobs')} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}>
               Skip for now (I'll upload later)
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
