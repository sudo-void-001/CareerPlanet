import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';

const statusOptions = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];

function PostJobModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', company_name: '', location: '', job_type: 'Full Time', salary: '', skills: '', description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      await api.post('/jobs/', { ...form, company_id: 1 }); // Backend needs company_id integer as fallback
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 500, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Post a New Job</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
            {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '0.75rem', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Job Title *</label>
                <input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Frontend Engineer" />
              </div>
              <div>
                <label className="label">Company Name *</label>
                <input className="input" required value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Location *</label>
                  <input className="input" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Remote, India" />
                </div>
                <div>
                  <label className="label">Job Type *</label>
                  <select className="select" value={form.job_type} onChange={e => setForm({...form, job_type: e.target.value})}>
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Salary (Optional)</label>
                  <input className="input" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="e.g. ₹15 LPA" />
                </div>
                <div>
                  <label className="label">Skills *</label>
                  <input className="input" required value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="React, Node, SQL" />
                </div>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} placeholder="Describe the role..." style={{ resize: 'vertical' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2 }}>
                {submitting ? 'Posting...' : 'Publish Job'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setPostModalOpen] = useState(false);

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  const fetchData = () => {
    Promise.all([api.get('/applications/'), api.get('/jobs/')])
      .then(([a, j]) => { setApplications(a.data); setJobs(j.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (appId, status) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: res.data.status } : a));
    } catch (err) { alert('Failed to update status'); }
  };

  const jobMap = {};
  jobs.forEach(j => { jobMap[j.id] = j; });

  const shortlisted = applications.filter(a => a.status === 'shortlisted' || a.status === 'hired').length;
  const pending = applications.filter(a => a.status === 'pending').length;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="pulse-glow" style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>✦</div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem 1rem 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ marginBottom: '0.25rem' }}>
                Good evening, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Recruiter'} 👋</span>
              </h1>
              <p>Here's your recruitment overview for today</p>
            </div>
            <button onClick={() => setPostModalOpen(true)} className="btn btn-primary btn-lg" style={{ boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
              + Post New Job
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Active Jobs', value: jobs.length, icon: '💼', color: '#6366f1' },
              { label: 'Total Applications', value: applications.length, icon: '📋', color: '#f59e0b' },
              { label: 'Pending Review', value: pending, icon: '⏳', color: '#06b6d4' },
              { label: 'Shortlisted', value: shortlisted, icon: '⭐', color: '#10b981' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ transition: 'all 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Applications table */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Applications</h3>
              <span className="badge badge-gray">{applications.length} total</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>Job Role</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{jobMap[app.job_id]?.title || `Job #${app.job_id}`}</span>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{jobMap[app.job_id]?.location}</div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Applicant #{app.student_id}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>
                        <select
                          value={app.status}
                          onChange={e => updateStatus(app.id, e.target.value)}
                          className="select"
                          style={{ width: 'auto', padding: '0.375rem 0.75rem', fontSize: '0.8125rem', borderRadius: 8 }}
                        >
                          {statusOptions.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                  <p>No applications yet for your job postings.</p>
                </div>
              )}
            </div>
          </div>

          {/* Jobs Posted */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0 }}>My Job Postings</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', padding: '1.25rem' }}>
              {jobs.map(job => (
                <div key={job.id} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '1.125rem', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{job.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>📍 {job.location} • {job.job_type}</div>
                  {job.salary && <span className="badge badge-green">{job.salary}</span>}
                </div>
              ))}
              {jobs.length === 0 && (
                <div style={{ gridColumn: '1/-1', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  You haven't posted any jobs yet.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {isPostModalOpen && (
        <PostJobModal 
          onClose={() => setPostModalOpen(false)} 
          onSuccess={() => { setPostModalOpen(false); fetchData(); }} 
        />
      )}
    </div>
  );
}
