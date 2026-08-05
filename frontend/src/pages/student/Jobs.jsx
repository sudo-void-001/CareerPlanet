import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { CompanyLogo, SkillChip } from '../../components/common/UI';

const COMPANY_NAMES = { 1: 'Microsoft', 2: 'Google', 3: 'Amazon', 4: 'TCS' };

function getMatchScore(jobSkills) {
  const userSkills = ['Python', 'React', 'FastAPI', 'SQL', 'Git', 'JavaScript'];
  if (!jobSkills) return 75;
  const required = jobSkills.split(',').map(s => s.trim().toLowerCase());
  const matched = required.filter(s => userSkills.some(u => u.toLowerCase().includes(s) || s.includes(u.toLowerCase())));
  return Math.min(98, Math.round((matched.length / required.length) * 100));
}

const typeColors = {
  'Internship': { bg: '#ede9fe', color: '#7c3aed' },
  'Full Time':  { bg: '#d1fae5', color: '#065f46' },
  'Part Time':  { bg: '#dbeafe', color: '#1e40af' },
};

function SuccessModal({ job, matchScore, onClose }) {
  const company = job.company_name || COMPANY_NAMES[job.company_id] || 'Company';
  const isHigh = matchScore >= 80;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 440, overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(15,23,42,0.25)', border: '1px solid var(--border)' }}
        >
          {/* Top Banner Accent */}
          <div style={{ height: 8, background: 'linear-gradient(90deg, #10b981, #3b82f6)' }} />
          
          <div style={{ padding: '2rem 1.75rem', textAlign: 'center' }}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 500, damping: 15 }}
              style={{ width: 72, height: 72, borderRadius: '50%', background: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' }}
            >
              🎉
            </motion.div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Application Submitted!</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Your application for <strong>{job.title}</strong> at <strong>{company}</strong> has been successfully processed.
            </p>

            {/* Score Ring Section */}
            <div style={{ background: '#f8fafc', borderRadius: 16, padding: '1.25rem', border: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>CareerPlanet Match Analysis</span>
                <span style={{ fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>AI Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: isHigh ? '#d1fae5' : '#fef3c7', color: isHigh ? '#065f46' : '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.125rem' }}>
                  {matchScore}%
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {isHigh ? 'Excellent match alignment!' : 'Solid match alignment!'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Recruiter has been notified via automatic email.
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications and Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: 100, fontWeight: 600 }}>✉️ Recruiter Emailed</span>
              <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: 100, fontWeight: 600 }}>🔔 Status: Pending</span>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => { onClose(); window.location.href = '/applications'; }} 
                className="btn btn-primary" 
                style={{ width: '100%', borderRadius: 12, padding: '0.75rem' }}
              >
                Track on Applications Panel
              </button>
              <button 
                onClick={onClose} 
                className="btn btn-secondary" 
                style={{ width: '100%', borderRadius: 12, padding: '0.75rem' }}
              >
                Back to Job Board
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ApplyModal({ job, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  
  // Custom AI Loading Step states
  const [loadingStep, setLoadingStep] = useState(0);

  const company = job.company_name || COMPANY_NAMES[job.company_id] || 'Company';
  const match = getMatchScore(job.skills);

  const steps = [
    'Uploading your resume securely...',
    'CareerPlanet AI is extracting parsed resume contents...',
    'Analyzing skill matching matrix & ATS scores...',
    'Creating application record and dispatching recruiter email notification...'
  ];

  useEffect(() => {
    let timer;
    if (submitting) {
      timer = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          return prev;
        });
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please upload your resume to apply.'); return; }
    setSubmitting(true);
    setError('');
    setAlreadyApplied(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const resumeRes = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await api.post('/applications/', { 
        job_id: job.id, 
        resume_id: resumeRes.data.id,
        cover_letter: coverLetter 
      });
      localStorage.setItem('hasResume', 'true');
      onSuccess(match);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail && (detail.includes('Already applied') || detail.includes('already applied') || err.response?.status === 400)) {
        setAlreadyApplied(true);
      } else {
        setError(detail || 'Failed to submit application. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 420, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}
        >
          {/* Header */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CompanyLogo name={company} size={44} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{job.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{company} • {job.location}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
          </div>

          {/* Already Applied Friendly State */}
          {alreadyApplied ? (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📎</div>
              <h4 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Application Already Logged</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                You have already submitted an application for the <strong>{job.title}</strong> role.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Close</button>
                <button onClick={() => { onClose(); window.location.href = '/applications'; }} className="btn btn-primary" style={{ flex: 2 }}>View Applications</button>
              </div>
            </div>
          ) : submitting ? (
            /* AI Loading Stepper */
            <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div className="spinner" style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1.s linear infinite' }} />
              </div>
              
              <h4 style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Processing Application</h4>

              {/* Stepper Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: index === loadingStep ? [1, 1.25, 1] : 1,
                      backgroundColor: index <= loadingStep ? '#6366f1' : '#e5e7eb',
                      boxShadow: index === loadingStep ? '0 0 10px rgba(99,102,241,0.6)' : 'none'
                    }}
                    transition={{ repeat: index === loadingStep ? Infinity : 0, duration: 1.2 }}
                    style={{ width: 10, height: 10, borderRadius: '50%' }}
                  />
                ))}
              </div>

              {/* Stepper Status text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: '0.875rem', color: '#6366f1', fontWeight: 600, minHeight: '40px', lineHeight: '1.4' }}
                >
                  {steps[loadingStep]}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <>
              {/* AI Match Overview Banner */}
              {localStorage.getItem('hasResume') ? (
                <div style={{ margin: '1rem 1.5rem', padding: '0.875rem', background: match >= 80 ? '#f0fdf4' : '#fffbeb', borderRadius: 12, border: `1px solid ${match >= 80 ? '#bbf7d0' : '#fde68a'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🎯</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: match >= 80 ? '#065f46' : '#92400e' }}>{match}% Match Score</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AI estimated based on your loaded skills</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ margin: '1rem 1.5rem', padding: '0.875rem', background: 'var(--surface-2)', borderRadius: 12, border: '1px dashed var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🔒</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>AI Match Analysis Locked</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload your resume below to unlock match insights</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ padding: '0 1.5rem 1.5rem' }}>
                <label className="label">Upload Resume *</label>
                <div style={{
                  border: `2px dashed ${file ? '#6366f1' : 'var(--border)'}`,
                  borderRadius: 12, padding: '1.5rem', textAlign: 'center',
                  background: file ? '#f5f3ff' : 'var(--surface-2)', marginBottom: '1rem',
                  transition: 'all 0.15s ease', cursor: 'pointer',
                }}>
                  <input type="file" id="resume-upload" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => { setFile(e.target.files[0]); setError(''); }} />
                  <label htmlFor="resume-upload" style={{ cursor: 'pointer', display: 'block' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{file ? '📄' : '📎'}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: file ? '#6366f1' : 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {file ? file.name : 'Click to select resume PDF'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PDF, DOC, DOCX</div>
                  </label>
                </div>
                
                <label className="label" style={{ marginTop: '1rem' }}>Cover Letter (Optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write a custom letter to the recruiter..."
                  style={{
                    width: '100%', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)',
                    background: 'var(--surface-2)', outline: 'none', resize: 'vertical', minHeight: '100px',
                    fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box', marginBottom: '1.5rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />

                {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '0.625rem 0.875rem', fontSize: '0.8125rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2 }}>
                    Apply & Evaluate
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Custom success Modal display states
  const [successJob, setSuccessJob] = useState(null);
  const [successScore, setSuccessScore] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/').then(r => setJobs(r.data)).finally(() => setLoading(false));
  }, []);

  const handleApply = (job) => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    setSelectedJob(job);
  };

  const handleSuccess = (matchScore) => {
    const job = selectedJob;
    setSelectedJob(null);
    setSuccessJob(job);
    setSuccessScore(matchScore);
  };

  const filters = ['All', 'Internship', 'Full Time'];
  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchesSearch = !q || j.title.toLowerCase().includes(q) || (j.skills || '').toLowerCase().includes(q);
    const matchesFilter = filter === 'All' || j.job_type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '2rem 1rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 style={{ marginBottom: '0.375rem' }}>Find Your <span className="gradient-text">Dream Role</span></h1>
            <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>{jobs.length} opportunities from top companies</p>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>🔍</span>
                <input
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Search jobs, skills, companies..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {filters.map(f => (
                  <button key={f} onClick={() => setFilter(f)} className="btn" style={{
                    padding: '0.625rem 1rem',
                    background: filter === f ? 'var(--primary)' : 'var(--surface)',
                    color: filter === f ? 'white' : 'var(--text-secondary)',
                    border: `1.5px solid ${filter === f ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '1.5rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />)}
          </div>
        ) : (
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}
          >
            {filtered.map(job => {
              const match = getMatchScore(job.skills);
              const company = job.company_name || COMPANY_NAMES[job.company_id] || 'Company';
              const typeStyle = typeColors[job.job_type] || { bg: '#f3f4f6', color: '#374151' };

              return (
                <motion.div
                  key={job.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                  style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                >
                  <div style={{ height: 6, background: `linear-gradient(90deg, ${job.company_id === 1 ? '#00a4ef' : job.company_id === 2 ? '#34a853' : '#6366f1'}, #8b5cf6)` }} />

                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <CompanyLogo name={company} size={40} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{job.title}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{company}</div>
                        </div>
                      </div>
                      
                      {localStorage.getItem('hasResume') ? (
                        <div className={`match-ring ${match >= 80 ? 'match-high' : match >= 60 ? 'match-mid' : 'match-low'}`} title={`${match}% AI match`}>
                          {match}%
                        </div>
                      ) : (
                        <div onClick={(e) => { e.stopPropagation(); navigate('/resume'); }} className="match-ring" style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)', cursor: 'pointer', border: '1px dashed var(--border)' }} title="Analyze resume to see AI match">
                          🔒
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                      <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>📍 {job.location}</span>
                      <span className="badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>{job.job_type}</span>
                      {job.salary && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065f46', background: '#f0fdf4', padding: '0.2rem 0.5rem', borderRadius: 6 }}>{job.salary}</span>}
                    </div>

                    {job.skills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                        {job.skills.split(',').slice(0, 4).map(s => <SkillChip key={s} skill={s} />)}
                      </div>
                    )}

                    <button onClick={() => handleApply(job)} className="btn btn-primary" style={{ width: '100%', borderRadius: 10 }}>
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p>No jobs match your search. Try different keywords.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {selectedJob && <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} onSuccess={handleSuccess} />}
      {successJob && <SuccessModal job={successJob} matchScore={successScore} onClose={() => setSuccessJob(null)} />}
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
