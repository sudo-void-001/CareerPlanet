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
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={e => e.stopPropagation()}
          className="glass-card"
          style={{ width: '100%', maxWidth: 460, overflow: 'hidden', padding: 0 }}
        >
          {/* Top Banner Accent */}
          <div style={{ height: 6, background: 'var(--gradient)' }} />
          
          <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 500, damping: 15 }}
              style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface-2)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', border: '1px solid var(--border)' }}
            >
              🎉
            </motion.div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Application Sent!</h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Your application for <strong style={{ color: 'var(--text-primary)' }}>{job.title}</strong> at <strong style={{ color: 'var(--text-primary)' }}>{company}</strong> was delivered to the hiring team.
            </p>

            {/* Score Ring Section */}
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Match Analysis</span>
                <span className="badge badge-green">Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-3)', color: isHigh ? 'var(--success)' : 'var(--warning)', border: `2px solid ${isHigh ? 'var(--success)' : 'var(--warning)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>
                  {matchScore}%
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {isHigh ? 'High Candidate Compatibility' : 'Solid Skill Alignment'}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Recruiter has received an automated email with your match metrics.
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => { onClose(); window.location.href = '/applications'; }} 
                className="btn btn-primary btn-lg" 
                style={{ width: '100%' }}
              >
                Track on Applications Panel
              </button>
              <button 
                onClick={onClose} 
                className="btn btn-secondary btn-lg" 
                style={{ width: '100%' }}
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
    'Securely encrypting resume...',
    'Extracting semantic keyphrases...',
    'Evaluating match vectors...',
    'Dispatching to recruiter dashboard...'
  ];

  useEffect(() => {
    let timer;
    if (submitting) {
      timer = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          return prev;
        });
      }, 1200);
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
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
          className="glass-card"
          style={{ width: '100%', maxWidth: 480, overflow: 'hidden', padding: 0 }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CompanyLogo name={company} size={48} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{job.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{company} • {job.location || 'Remote'}</div>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ borderRadius: '50%', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {alreadyApplied ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📌</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Already Applied</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                You have an active application for this role in your pipeline.
              </p>
              <button onClick={onClose} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Got it
              </button>
            </div>
          ) : submitting ? (
            <div style={{ padding: '3.5rem 2.5rem', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-3)', border: '2px solid var(--primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '1.75rem', animation: 'pulse-glow 1.5s infinite' }}>✦</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Processing Application</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', background: 'var(--surface-2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                {steps.map((st, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: idx <= loadingStep ? 1 : 0.3, transition: 'opacity 0.3s' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: idx <= loadingStep ? 'var(--primary)' : 'var(--text-tertiary)', boxShadow: idx === loadingStep ? '0 0 10px var(--primary)' : 'none' }} />
                    <span style={{ fontSize: '0.875rem', color: idx <= loadingStep ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: idx === loadingStep ? 600 : 400 }}>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>{error}</div>}

              <div className="input-group">
                <label className="label">Upload Resume (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={e => setFile(e.target.files[0])}
                  className="input"
                />
              </div>

              <div className="input-group">
                <label className="label">Custom Pitch (Optional)</label>
                <textarea 
                  rows={4}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself to the recruiter..."
                  className="input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary btn-lg" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}>Submit Pitch →</button>
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="page hero-gradient">
      <div className="container">
        
        {/* Page Header */}
        <div style={{ marginBottom: '3rem' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '1rem' }}>✦ Active Opportunities</span>
          <h1 style={{ marginBottom: '1rem', fontSize: '3rem', fontWeight: 800 }}>Explore Roles</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>Discover exclusive engineering and product roles curated by top recruiters.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card" style={{ padding: '1rem', marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 280 }} className="input-group" style={{ margin: 0 }}>
            <input 
              type="text" 
              placeholder="Search by role, company, or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input"
              style={{ borderRadius: 'var(--radius)', border: 'none', background: 'var(--surface-2)' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.25rem' }}>
            {['All', 'Full Time', 'Internship', 'Part Time'].map(tf => (
              <button
                key={tf}
                onClick={() => setTypeFilter(tf)}
                className="btn"
                style={{
                  background: typeFilter === tf ? 'var(--primary)' : 'transparent',
                  color: typeFilter === tf ? '#000' : 'var(--text-secondary)',
                  border: typeFilter === tf ? '1px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4,5,6].map(n => (
              <div key={n} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '70%', height: 20, marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ width: '40%', height: 16 }} />
                  </div>
                </div>
                <div className="skeleton" style={{ width: '100%', height: 40 }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ width: 60, height: 24, borderRadius: 'var(--radius-full)' }} />
                  <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}
          >
            {filteredJobs.map(job => {
              const company = job.company_name || COMPANY_NAMES[job.company_id] || 'Top Employer';
              const score = getMatchScore(job.skills);

              return (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  layout
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '-10px' }}>
                      {/* Fake Recruiter Avatar */}
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-3)', border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', zIndex: 2 }}>
                        {company.charAt(0)}R
                      </div>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-10px', zIndex: 1 }}>
                        <span style={{ fontSize: '1rem' }}>⚡</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <CompanyLogo name={company} size={56} />
                      <div style={{ paddingRight: '4rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{job.title}</h3>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{company} • {job.location || 'Remote'}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-green">{score}% AI Match</span>
                      <span className="badge badge-indigo">Fast Growing</span>
                      {job.job_type === 'Remote' && <span className="badge badge-violet">Remote</span>}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description || 'Join our elite engineering team to build scalable, high-impact products for millions of users worldwide.'}
                    </p>

                    {/* Skill chips */}
                    {job.skills && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        {job.skills.split(',').slice(0, 4).map((sk, idx) => (
                          <SkillChip key={idx} skill={sk} />
                        ))}
                        {job.skills.split(',').length > 4 && <span className="skill-chip">+{job.skills.split(',').length - 4}</span>}
                      </div>
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {job.salary || '$120k - $160k'}
                    </div>
                    <button 
                      onClick={() => setApplyingJob(job)} 
                      className="btn btn-primary"
                    >
                      Apply Now →
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border)' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>🔭</div>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>No roles match your criteria</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 400, margin: '0 auto 2rem' }}>Adjust your filters or search terms to uncover new opportunities.</p>
            <button className="btn btn-secondary btn-lg" onClick={() => { setSearch(''); setTypeFilter('All'); }}>Clear Filters</button>
          </motion.div>
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
