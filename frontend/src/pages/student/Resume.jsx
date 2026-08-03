import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const healthCategories = [
  { label: 'Skills Section',    score: 90 },
  { label: 'Projects',          score: 85 },
  { label: 'Education',         score: 95 },
  { label: 'ATS Compatibility', score: 78 },
  { label: 'Grammar & Format',  score: 88 },
];

export default function Resume() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a resume file.'); return; }
    setUploading(true); setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      await api.post('/resume/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      // Simulate AI analysis
      setTimeout(() => {
        setAnalysis({
          overallScore: 88,
          atsScore: 78,
          summary: 'Strong profile for software engineering roles. Python and React expertise stand out. Consider adding Docker and system design experience to increase match rates.',
          missingSkills: ['Docker', 'Kubernetes', 'TypeScript', 'System Design'],
          strengths: ['Python (Advanced)', 'React (Intermediate)', 'FastAPI', 'SQL', 'REST APIs'],
          recommendations: [
            'Add measurable achievements (e.g., "Improved API response by 40%")',
            'Include a GitHub profile link with 3+ pinned projects',
            'Add Docker to your skills — it appears in 80% of backend JDs',
            'Write a 2-line professional summary at the top',
          ],
        });
        setUploading(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Try again.');
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem 1rem 4rem' }}>
      <div className="container-md">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 style={{ marginBottom: '0.375rem' }}>AI <span className="gradient-text">Resume Analysis</span></h1>
          <p style={{ marginBottom: '2rem' }}>Upload your resume and get instant AI-powered feedback and ATS score</p>

          {/* Upload Card */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Upload Resume</h3>
            <form onSubmit={handleUpload}>
              <div
                style={{
                  border: `2px dashed ${file ? '#6366f1' : 'var(--border)'}`,
                  borderRadius: 14, padding: '2rem', textAlign: 'center',
                  background: file ? '#f5f3ff' : 'var(--surface-2)', marginBottom: '1rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <input type="file" id="resume" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                  onChange={e => { setFile(e.target.files[0]); setError(''); }} />
                <label htmlFor="resume" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{file ? '📄' : '📎'}</div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: file ? '#6366f1' : 'var(--text-primary)' }}>
                    {file ? file.name : 'Click to upload your resume'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>PDF, DOC, DOCX · Max 10MB</div>
                </label>
              </div>

              {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '0.625rem 0.875rem', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}

              <button type="submit" disabled={!file || uploading} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
                {uploading ? '⏳ Analyzing with AI...' : '✦ Analyze Resume with AI'}
              </button>
            </form>
          </div>

          {/* Results */}
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Score Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 16, padding: '1.5rem', color: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>{analysis.overallScore}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.25rem' }}>Overall Score / 100</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', borderRadius: 16, padding: '1.5rem', color: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>{analysis.atsScore}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.25rem' }}>ATS Score / 100</div>
                </div>
              </div>

              {/* Health Categories */}
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>Resume Health Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {healthCategories.map(c => (
                    <div key={c.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{c.label}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: c.score >= 85 ? '#065f46' : c.score >= 70 ? '#92400e' : '#991b1b' }}>{c.score}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 999, background: 'var(--border)' }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${c.score}%` }}
                          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          style={{ height: '100%', borderRadius: 999, background: c.score >= 85 ? '#10b981' : c.score >= 70 ? '#f59e0b' : '#ef4444' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.875rem' }}>✦ AI Summary</h3>
                <p style={{ lineHeight: 1.75, color: 'var(--text-primary)' }}>{analysis.summary}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Strengths */}
                <div style={{ background: '#f0fdf4', borderRadius: 16, border: '1px solid #bbf7d0', padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#065f46' }}>✅ Strengths</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {analysis.strengths.map(s => <span key={s} className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>{s}</span>)}
                  </div>
                </div>

                {/* Missing Skills */}
                <div style={{ background: '#fff7ed', borderRadius: 16, border: '1px solid #fed7aa', padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#92400e' }}>🎯 Add These Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {analysis.missingSkills.map(s => <span key={s} className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>{s}</span>)}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>💡 Recommendations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {analysis.recommendations.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: 'var(--surface-2)', borderRadius: 10 }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{i+1}</span>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
