import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { CompanyLogo, SkillChip } from '../../components/common/UI';

const COMPANY_NAMES = { 1: 'Microsoft', 2: 'Google', 3: 'Amazon', 4: 'TCS' };

function getMatchScore(jobSkills) {
  const userSkills = ['Python', 'React', 'FastAPI', 'SQL', 'Git', 'JavaScript'];
  if (!jobSkills) return Math.floor(Math.random() * 30) + 55;
  const required = jobSkills.split(',').map(s => s.trim().toLowerCase());
  const matched = required.filter(s => userSkills.some(u => u.toLowerCase().includes(s) || s.includes(u.toLowerCase())));
  return Math.min(98, Math.round((matched.length / required.length) * 100));
}

const typeColors = {
  'Internship': { bg: '#ede9fe', color: '#7c3aed' },
  'Full Time':  { bg: '#d1fae5', color: '#065f46' },
  'Part Time':  { bg: '#dbeafe', color: '#1e40af' },
};

function ApplyModal({ job, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const company = COMPANY_NAMES[job.company_id] || 'Company';
  const match = getMatchScore(job.skills);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please upload your resume to apply.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const resumeRes = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await api.post('/applications/', { job_id: job.id, resume_id: resumeRes.data.id });
      localStorage.setItem('hasResume', 'true');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
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

          {/* AI Match */}
          {localStorage.getItem('hasResume') ? (
            <div style={{ margin: '1rem 1.5rem', padding: '0.875rem', background: match >= 80 ? '#f0fdf4' : '#fffbeb', borderRadius: 12, border: `1px solid ${match >= 80 ? '#bbf7d0' : '#fde68a'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🎯</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: match >= 80 ? '#065f46' : '#92400e' }}>{match}% Match</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Based on your profile skills</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ margin: '1rem 1.5rem', padding: '0.875rem', background: 'var(--surface-2)', borderRadius: 12, border: '1px dashed var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🔒</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>AI Match Hidden</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload your resume below to unlock AI insights</div>
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
                  {file ? file.name : 'Click to upload resume'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PDF, DOC, DOCX</div>
              </label>
            </div>

            {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '0.625rem 0.875rem', fontSize: '0.8125rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2 }}>
                {submitting ? '⏳ Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
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
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs/').then(r => setJobs(r.data)).finally(() => setLoading(false));
  }, []);

  const handleApply = (job) => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    setSelectedJob(job);
  };

  const handleSuccess = () => {
    setSelectedJob(null);
    setSuccess('Application submitted! Check My Applications for status updates.');
    setTimeout(() => setSuccess(''), 6000);
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
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#065f46', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1.25rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✅ {success}
          </motion.div>
        )}

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
              const company = COMPANY_NAMES[job.company_id] || 'Company';
              const typeStyle = typeColors[job.job_type] || { bg: '#f3f4f6', color: '#374151' };

              return (
                <motion.div
                  key={job.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                  style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                >
                  {/* Company bar */}
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
                        <div onClick={(e) => { e.stopPropagation(); navigate('/onboarding'); }} className="match-ring" style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)', cursor: 'pointer', border: '1px dashed var(--border)' }} title="Upload resume to unlock">
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
    </div>
  );
}
