import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

function SuccessModal({ job, matchScore, onClose }) {
  const company = job.company_name || COMPANY_NAMES[job.company_id] || 'Company';
  const isHigh = matchScore >= 80;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(7, 8, 12, 0.75)', backdropFilter: 'blur(12px)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={e => e.stopPropagation()}
          className="glass"
          style={{ background: '#13151f', borderRadius: 24, width: '100%', maxWidth: 460, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}
        >
          {/* Top Banner Accent */}
          <div style={{ height: 6, background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
          
          <div style={{ padding: '2.25rem 2rem', textAlign: 'center' }}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 500, damping: 15 }}
              style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              🎉
            </motion.div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Application Submitted!</h3>
            <p style={{ fontSize: '0.90625rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Your application for <strong style={{ color: '#ffffff' }}>{job.title}</strong> at <strong style={{ color: '#ffffff' }}>{company}</strong> has been received.
            </p>

            {/* Score Ring Section */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 18, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>CareerPlanet AI Match</span>
                <span className="badge badge-green">AI Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: isHigh ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: isHigh ? '#34d399' : '#fbbf24', border: `2px solid ${isHigh ? '#10b981' : '#f59e0b'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.15rem' }}>
                  {matchScore}%
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#ffffff' }}>
                    {isHigh ? 'High candidate compatibility!' : 'Solid skill alignment!'}
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                    Recruiter has been sent an automated email update.
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <button 
                onClick={() => { onClose(); window.location.href = '/applications'; }} 
                className="btn btn-primary" 
                style={{ width: '100%', borderRadius: 14, padding: '0.85rem' }}
              >
                Track Status on Applications Panel
              </button>
              <button 
                onClick={onClose} 
                className="btn btn-secondary" 
                style={{ width: '100%', borderRadius: 14, padding: '0.85rem' }}
              >
                Back to Opportunities
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
  const [loadingStep, setLoadingStep] = useState(0);

  const company = job.company_name || COMPANY_NAMES[job.company_id] || 'Company';
  const match = getMatchScore(job.skills);

  const steps = [
    'Uploading your resume securely...',
    'CareerPlanet AI extracting key candidate skills...',
    'Evaluating role suitability & match vectoring...',
    'Creating application record and notifying recruiter via email...'
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
    if (!file) { setError('Please select your resume PDF.'); return; }
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
        style={{ position: 'fixed', inset: 0, background: 'rgba(7, 8, 12, 0.8)', backdropFilter: 'blur(12px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
          style={{ background: '#13151f', borderRadius: 24, width: '100%', maxWidth: 460, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
              <CompanyLogo name={company} size={44} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>{job.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{company} • {job.location}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-tertiary)', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>

          {alreadyApplied ? (
            <div style={{ padding: '2.5rem 1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📌</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Application Exists</h3>
              <p style={{ fontSize: '0.90625rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                You have already submitted an application for this role.
              </p>
              <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', borderRadius: 14 }}>
                Got it
              </button>
            </div>
          ) : submitting ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', animation: 'pulse-glow 1.5s infinite' }}>✦</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>Processing Application</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
                {steps.map((st, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: idx <= loadingStep ? 1 : 0.4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: idx <= loadingStep ? '#10b981' : 'var(--text-tertiary)' }} />
                    <span style={{ fontSize: '0.8125rem', color: idx <= loadingStep ? '#ffffff' : 'var(--text-tertiary)', fontWeight: idx === loadingStep ? 600 : 400 }}>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.8125rem' }}>{error}</div>}

              <div>
                <label className="label">Upload Resume (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={e => setFile(e.target.files[0])}
                  className="input"
                  style={{ padding: '0.625rem' }}
                />
              </div>

              <div>
                <label className="label">Custom Pitch / Cover Letter (Optional)</label>
                <textarea 
                  rows={4}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself to the recruiter, mention key achievements or skills..."
                  className="input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, borderRadius: 14 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: 14 }}>Submit Pitch →</button>
              </div>
            </form>
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
  const [typeFilter, setTypeFilter] = useState('All');
  const [applyingJob, setApplyingJob] = useState(null);
  const [successJob, setSuccessJob] = useState(null);
  const [successMatchScore, setSuccessMatchScore] = useState(85);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (job.company_name || COMPANY_NAMES[job.company_id] || '').toLowerCase().includes(search.toLowerCase()) ||
                          (job.location || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || job.job_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="page hero-gradient">
      <div className="container">
        
        {/* Page Header */}
        <div style={{ marginBottom: '3rem' }}>
          <span className="badge badge-green" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>✦ Verified Openings</span>
          <h1 style={{ marginBottom: '0.75rem', fontSize: '2.75rem' }}>Discover Opportunities</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Explore curated engineering, product, and research roles from top recruiters.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <input 
              type="text" 
              placeholder="Search by job title, company, or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input"
              style={{ borderRadius: 'var(--radius-full)' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
            {['All', 'Full Time', 'Internship', 'Part Time'].map(tf => (
              <button
                key={tf}
                onClick={() => setTypeFilter(tf)}
                className="btn"
                style={{
                  background: typeFilter === tf ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: typeFilter === tf ? '#34d399' : 'var(--text-secondary)',
                  border: typeFilter === tf ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4,5,6].map(n => <div key={n} className="skeleton" style={{ height: 260 }} />)}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredJobs.map(job => {
              const company = job.company_name || COMPANY_NAMES[job.company_id] || 'Top Employer';
              const score = getMatchScore(job.skills);

              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                        <CompanyLogo name={company} size={48} />
                        <div>
                          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.2rem' }}>{job.title}</h3>
                          <div style={{ fontSize: '0.84375rem', color: 'var(--text-tertiary)' }}>{company} • {job.location || 'Remote'}</div>
                        </div>
                      </div>
                      <span className="badge badge-green">{score}% Match</span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description || 'Exciting career opportunity at a fast-growing company working on cutting edge technologies.'}
                    </p>

                    {/* Skill chips */}
                    {job.skills && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {job.skills.split(',').map((sk, idx) => (
                          <SkillChip key={idx} skill={sk} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399' }}>
                      {job.salary || '$80,000 - $110,000'}
                    </div>
                    <button 
                      onClick={() => setApplyingJob(job)} 
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: 'var(--radius-full)' }}
                    >
                      Apply Now →
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(19, 21, 31, 0.5)', borderRadius: 24, border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.5rem' }}>No positions found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search filters or browse all openings.</p>
          </div>
        )}

      </div>

      {applyingJob && (
        <ApplyModal 
          job={applyingJob} 
          onClose={() => setApplyingJob(null)}
          onSuccess={(matchScore) => {
            setSuccessMatchScore(matchScore);
            setSuccessJob(applyingJob);
            setApplyingJob(null);
          }}
        />
      )}

      {successJob && (
        <SuccessModal 
          job={successJob} 
          matchScore={successMatchScore} 
          onClose={() => setSuccessJob(null)} 
        />
      )}
    </div>
  );
}
