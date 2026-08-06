import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: '📊' },
  { id: 'jobs',         label: 'My Jobs',        icon: '💼' },
  { id: 'applications', label: 'Applications',   icon: '📋' },
];

const statusOptions = ['pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'selected', 'hired'];

// ── Post Job Modal ────────────────────────────────────────────
function PostJobModal({ onClose, onSuccess, companyName }) {
  const [form, setForm] = useState({
    title: '', company_name: companyName || '', location: '', job_type: 'Full Time',
    salary: '', skills: '', description: '', expires_at: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const payload = {
        ...form,
        company_id: 1,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };
      await api.post('/jobs/', payload);
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
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'var(--surface)', borderRadius: 20, width: '100%', maxWidth: 540, maxHeight: '90vh', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>Post a New Job</h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Posted as {companyName}</div>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ borderRadius: '50%', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: 'calc(90vh - 85px)' }}>
            {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.875rem', borderRadius: 12, fontSize: '0.875rem' }}>{error}</div>}

            <div>
              <label className="label">Job Title *</label>
              <input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
            </div>

            <div>
              <label className="label">Company Name *</label>
              <input className="input" required value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Your company name" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="label">Location *</label>
                <input className="input" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Mumbai / Remote" />
              </div>
              <div>
                <label className="label">Job Type *</label>
                <select className="input" value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })} style={{ paddingRight: '2rem' }}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label className="label">Salary (Optional)</label>
                <input className="input" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="₹15 LPA / $90k" />
              </div>
              <div>
                <label className="label">Application Deadline</label>
                <input className="input" type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">Required Skills</label>
              <input className="input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Python, PostgreSQL" />
            </div>

            <div>
              <label className="label">Job Description *</label>
              <textarea className="input" rows={5} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Responsibilities, qualifications, culture..." style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, padding: '0.875rem' }}>Cancel</button>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1, padding: '0.875rem' }}>
                {submitting ? 'Posting...' : 'Publish Job Opening'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Application Detail & Email Message Modal ───────────────────
function AppDetailModal({ app, job, onClose, onStatusChange, onSendMessage }) {
  const [currentStatus, setCurrentStatus] = useState(app.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/applications/${app.id}/status`, { status: newStatus });
      setCurrentStatus(newStatus);
      onStatusChange(app.id, newStatus);
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendCustomMessage = async (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    setSendingMsg(true);
    setMsgSentSuccess(false);
    try {
      await api.post(`/applications/${app.id}/message`, { message: customMsg });
      setMsgSentSuccess(true);
      if (onSendMessage) onSendMessage(app.id, customMsg);
      setCustomMsg('');
      setTimeout(() => setMsgSentSuccess(false), 4000);
    } catch (err) {
      alert('Failed to send recruiter email message.');
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'var(--surface)', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}
        >
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>Applicant Overview</h3>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Application #{app.id}</div>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ borderRadius: '50%', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', maxHeight: 'calc(90vh - 85px)' }}>
            
            {/* Status update bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)', padding: '1.25rem', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pipeline Status</div>
                <div style={{ marginTop: '0.5rem' }}><StatusBadge status={currentStatus} /></div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select 
                  className="input"
                  value={currentStatus} 
                  onChange={e => handleStatusUpdate(e.target.value)}
                  disabled={updatingStatus}
                  style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem', height: 'auto' }}
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            {/* Applicant Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="card-flat" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Applicant Info</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.5rem', fontSize: '1rem' }}>Student Candidate</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Applicant ID: #{app.student_id || app.id}</div>
              </div>

              <div className="card-flat" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Target Role</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.5rem', fontSize: '1rem' }}>{job.title || 'Role'}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{job.salary || 'Standard Comp'}</div>
              </div>
            </div>

            {/* Cover Letter Section */}
            {app.cover_letter ? (
              <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate Pitch / Cover Letter</div>
                <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{app.cover_letter}</p>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-2)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No custom cover letter attached by applicant.</div>
              </div>
            )}

            {/* Send Custom Letter Form */}
            <form onSubmit={handleSendCustomMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <div>
                <label className="label">Send Custom Message to Candidate</label>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>This will be delivered to the candidate's inbox.</p>
                {msgSentSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>✓ Message dispatched successfully!</div>}
                <textarea 
                  rows={4}
                  value={customMsg}
                  onChange={e => setCustomMsg(e.target.value)}
                  placeholder="e.g. We loved your profile! Let's schedule an interview..."
                  className="input"
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={sendingMsg || !customMsg.trim()}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-end' }}
              >
                {sendingMsg ? 'Dispatching...' : 'Send Message'}
              </button>
            </form>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Recruiter Dashboard ──────────────────────────────────
export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  const companyName = user?.company_name || 'My Company';

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs/'),
        api.get('/applications/')
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    totalJobs: jobs.length,
    totalApps: applications.length,
    shortlisted: applications.filter(a => ['shortlisted', 'interview', 'selected', 'hired'].includes(a.status)).length,
    hired: applications.filter(a => ['hired', 'selected'].includes(a.status)).length,
  };

  const handleStatusChange = (appId, newStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
  };

  const handleSendMessage = (appId, msg) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, recruiter_message: msg } : a));
  };

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      <div className="container">
        
        {/* Header Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}
        >
          <div>
            <span className="badge" style={{ marginBottom: '1rem', background: 'var(--surface-3)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>🏢 Recruiter Portal</span>
            <h1 style={{ fontSize: '3rem', margin: 0, letterSpacing: '-0.04em' }}>Hiring Command Center</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.125rem' }}>Managing recruitment pipelines for <strong style={{ color: 'var(--text-primary)' }}>{companyName}</strong>.</p>
          </div>
          <button onClick={() => setShowPostModal(true)} className="btn btn-primary btn-lg" style={{ padding: '1rem 2rem', fontWeight: 600 }}>
            Post New Opening
          </button>
        </motion.div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="btn"
              style={{
                background: activeTab === t.id ? 'var(--text-primary)' : 'transparent',
                color: activeTab === t.id ? 'var(--bg)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '100px',
                padding: '0.5rem 1.25rem',
                fontWeight: activeTab === t.id ? 600 : 500
              }}
            >
              <span style={{ marginRight: '0.25rem' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card skeleton" style={{ height: '120px' }}></div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div>
                  {/* Stats Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    <div className="stat-card">
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Job Posts</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>{stats.totalJobs}</div>
                    </div>
                    <div className="stat-card">
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Received Apps</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>{stats.totalApps}</div>
                    </div>
                    <div className="stat-card">
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shortlisted Candidates</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>{stats.shortlisted}</div>
                    </div>
                    <div className="stat-card">
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Offers Extended</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>{stats.hired}</div>
                    </div>
                  </div>

                  {/* Recent Applicants list */}
                  <div className="card-flat" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 600 }}>Recent Candidate Submissions</h3>
                    {applications.length > 0 ? (
                      <div style={{ overflowX: 'auto' }}>
                        <table className="table-premium">
                          <thead>
                            <tr>
                              <th>Applicant ID</th>
                              <th>Job ID</th>
                              <th>Status</th>
                              <th>Pitch</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applications.slice(0, 5).map(app => (
                              <tr key={app.id}>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>#{app.student_id || app.id}</td>
                                <td>Job #{app.job_id}</td>
                                <td><StatusBadge status={app.status} /></td>
                                <td>{app.cover_letter ? '✍️ Yes' : '—'}</td>
                                <td>
                                  <button onClick={() => setSelectedApp(app)} className="btn btn-secondary btn-sm">
                                    Review Pitch
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9375rem' }}>No candidate submissions recorded yet.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MY JOBS TAB */}
              {activeTab === 'jobs' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                  {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{job.title}</h3>
                          <span className="badge" style={{ background: 'var(--surface-3)' }}>{job.job_type}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '1.25rem', fontWeight: 500 }}>{job.location} • {job.salary || 'Standard Comp'}</div>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Posted by {job.company_name || companyName}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>You haven't posted any jobs yet.</div>
                      <button onClick={() => setShowPostModal(true)} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Create Your First Job</button>
                    </div>
                  )}
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="card-flat" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 600 }}>All Role Applications</h3>
                  {applications.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="table-premium">
                        <thead>
                          <tr>
                            <th>App ID</th>
                            <th>Candidate</th>
                            <th>Job ID</th>
                            <th>Cover Letter</th>
                            <th>Pipeline Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map(app => (
                            <tr key={app.id}>
                              <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>#{app.id}</td>
                              <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Candidate #{app.student_id || app.id}</td>
                              <td style={{ color: 'var(--text-secondary)' }}>Job #{app.job_id}</td>
                              <td>{app.cover_letter ? '✍️ Pitch Attached' : '—'}</td>
                              <td><StatusBadge status={app.status} /></td>
                              <td>
                                <button onClick={() => setSelectedApp(app)} className="btn btn-secondary btn-sm">
                                  Inspect & Pitch
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>No applications recorded yet.</div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

      </div>

      {showPostModal && (
        <PostJobModal 
          companyName={companyName}
          onClose={() => setShowPostModal(false)}
          onSuccess={() => {
            setShowPostModal(false);
            fetchData();
          }}
        />
      )}

      {selectedApp && (
        <AppDetailModal 
          app={selectedApp}
          job={jobs.find(j => j.id === selectedApp.job_id) || {}}
          onClose={() => setSelectedApp(null)}
          onStatusChange={handleStatusChange}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
