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
        style={{ position: 'fixed', inset: 0, background: 'rgba(7, 8, 12, 0.8)', backdropFilter: 'blur(12px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
          style={{ background: '#13151f', borderRadius: 24, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <h3 style={{ margin: 0, color: '#ffffff' }}>Post a New Job</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>Posted as {companyName}</div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', borderRadius: '50%', width: 28, height: 28 }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
            {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: 12, fontSize: '0.85rem' }}>{error}</div>}

            <div>
              <label className="label">Job Title *</label>
              <input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer" />
            </div>

            <div>
              <label className="label">Company Name *</label>
              <input className="input" required value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Your company name" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Location *</label>
                <input className="input" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Mumbai / Remote" />
              </div>
              <div>
                <label className="label">Job Type *</label>
                <select className="select" value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <label className="label">Required Skills (comma separated)</label>
              <input className="input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Python, PostgreSQL" />
            </div>

            <div>
              <label className="label">Job Description *</label>
              <textarea className="input" rows={4} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Responsibilities, qualifications, culture..." style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, borderRadius: 14 }}>Cancel</button>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1, borderRadius: 14 }}>
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
        style={{ position: 'fixed', inset: 0, background: 'rgba(7, 8, 12, 0.8)', backdropFilter: 'blur(12px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
          style={{ background: '#13151f', borderRadius: 24, width: '100%', maxWidth: 580, maxHeight: '90vh', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#ffffff' }}>Applicant Overview</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>Application #{app.id}</div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', borderRadius: '50%', width: 28, height: 28 }}>✕</button>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
            
            {/* Status update bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>Current Pipeline Status</div>
                <div style={{ marginTop: '0.25rem' }}><StatusBadge status={currentStatus} /></div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select 
                  className="select"
                  value={currentStatus} 
                  onChange={e => handleStatusUpdate(e.target.value)}
                  disabled={updatingStatus}
                  style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.8125rem' }}
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </div>
            </div>

            {/* Applicant Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Applicant Info</div>
                <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '0.25rem', fontSize: '0.95rem' }}>Student Candidate</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Applicant ID: #{app.student_id || app.id}</div>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Target Role</div>
                <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '0.25rem', fontSize: '0.95rem' }}>{job.title || 'Role'}</div>
                <div style={{ fontSize: '0.8125rem', color: '#34d399' }}>{job.salary || 'Standard Comp'}</div>
              </div>
            </div>

            {/* Cover Letter Section */}
            {app.cover_letter ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem', textTransform: 'uppercase' }}>✍️ Candidate Pitch / Cover Letter</div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{app.cover_letter}</p>
              </div>
            ) : (
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No custom cover letter attached by applicant.</div>
            )}

            {/* Send Custom Letter Form */}
            <form onSubmit={handleSendCustomMessage} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <label className="label">Send Custom Email Pitch / Message to Candidate</label>
              {msgSentSuccess && <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.5rem 0.75rem', borderRadius: 10, fontSize: '0.8125rem' }}>✓ Message dispatched to candidate email via Resend!</div>}
              <textarea 
                rows={3}
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder="Write a custom letter or update (e.g. We loved your profile! Let's schedule an interview...)"
                className="input"
                style={{ resize: 'vertical' }}
              />
              <button 
                type="submit" 
                disabled={sendingMsg || !customMsg.trim()}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-end', borderRadius: 12, padding: '0.6rem 1.25rem' }}
              >
                {sendingMsg ? 'Dispatching Email...' : 'Send Custom Email →'}
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
    <div className="page hero-gradient">
      <div className="container">
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>🏢 Recruiter Portal</span>
            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Hiring Command Center</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Managing recruitment pipelines for <strong style={{ color: '#ffffff' }}>{companyName}</strong>.</p>
          </div>
          <button onClick={() => setShowPostModal(true)} className="btn btn-primary btn-lg" style={{ borderRadius: 14 }}>
            + Post New Opening
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="btn"
              style={{
                background: activeTab === t.id ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: activeTab === t.id ? '#34d399' : 'var(--text-secondary)',
                border: activeTab === t.id ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Active Job Posts</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>{stats.totalJobs}</div>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Received Apps</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.25rem' }}>{stats.totalApps}</div>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Shortlisted Candidates</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>{stats.shortlisted}</div>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Offers Extended</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#c084fc', marginTop: '0.25rem' }}>{stats.hired}</div>
              </div>
            </div>

            {/* Recent Applicants list */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem' }}>Recent Candidate Submissions</h3>
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
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>#{app.student_id || app.id}</td>
                          <td>Job #{app.job_id}</td>
                          <td><StatusBadge status={app.status} /></td>
                          <td>{app.cover_letter ? '✍️ Yes' : '—'}</td>
                          <td>
                            <button onClick={() => setSelectedApp(app)} className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
                              Review Pitch
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No candidate submissions recorded yet.</div>
              )}
            </div>
          </div>
        )}

        {/* MY JOBS TAB */}
        {activeTab === 'jobs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {jobs.map(job => (
              <div key={job.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>{job.title}</h3>
                    <span className="badge badge-green">{job.job_type}</span>
                  </div>
                  <div style={{ fontSize: '0.84375rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>{job.location} • {job.salary || 'Standard Comp'}</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.875rem', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                  Posted by {job.company_name || companyName}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem' }}>All Role Applications</h3>
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
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>#{app.id}</td>
                        <td>Candidate #{app.student_id || app.id}</td>
                        <td>Job #{app.job_id}</td>
                        <td>{app.cover_letter ? '✍️ Pitch Attached' : '—'}</td>
                        <td><StatusBadge status={app.status} /></td>
                        <td>
                          <button onClick={() => setSelectedApp(app)} className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
                            Inspect & Pitch
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No applications recorded yet.</div>
            )}
          </div>
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
