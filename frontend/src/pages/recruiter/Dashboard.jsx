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

const statusOptions = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];

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
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
            <div>
              <h3 style={{ margin: 0 }}>Post a New Job</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.125rem' }}>Posted as {companyName}</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
            {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '0.75rem', fontSize: '0.875rem' }}>{error}</div>}

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
                <input className="input" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="₹15 LPA / ₹50k/mo" />
              </div>
              <div>
                <label className="label">Required Skills *</label>
                <input className="input" required value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, SQL" />
              </div>
            </div>

            <div>
              <label className="label">Closing Date (Optional)</label>
              <input
                className="input" type="date"
                value={form.expires_at}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, expires_at: e.target.value })}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Job automatically disappears from listings after this date</div>
            </div>

            <div>
              <label className="label">Job Description *</label>
              <textarea className="input" required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the role, responsibilities, and requirements..." style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, boxShadow: '0 8px 24px var(--gradient-glow, rgba(99,102,241,0.3))' }}>
                {submitting ? 'Publishing...' : '🚀 Publish Job'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────
function OverviewTab({ applications, jobs, user, onPostJob, isProfileComplete }) {
  const shortlisted = applications.filter(a => a.status === 'shortlisted' || a.status === 'hired').length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const reviewing = applications.filter(a => a.status === 'reviewing').length;

  const stats = [
    { label: 'Active Jobs',          value: jobs.length,           icon: '💼', color: '#6366f1' },
    { label: 'Total Applications',   value: applications.length,   icon: '📋', color: '#f59e0b' },
    { label: 'Pending Review',       value: pending,               icon: '⏳', color: '#06b6d4' },
    { label: 'Shortlisted / Hired',  value: shortlisted,           icon: '⭐', color: '#10b981' },
  ];

  const pipeline = [
    { label: 'Pending',    count: pending,                                                         color: '#f59e0b' },
    { label: 'Reviewing',  count: reviewing,                                                       color: '#6366f1' },
    { label: 'Shortlisted',count: applications.filter(a => a.status === 'shortlisted').length,    color: '#10b981' },
    { label: 'Hired',      count: applications.filter(a => a.status === 'hired').length,           color: '#059669' },
    { label: 'Rejected',   count: applications.filter(a => a.status === 'rejected').length,        color: '#ef4444' },
  ];

  const totalPipeline = pipeline.reduce((s, p) => s + p.count, 0) || 1;

  return (
    <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Profile incomplete warning */}
      {!isProfileComplete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9375rem' }}>Complete Your Company Profile</div>
              <div style={{ fontSize: '0.8125rem', color: '#b45309' }}>Add your company name and origin to start posting jobs.</div>
            </div>
          </div>
          <a href="/recruiter/profile" className="btn btn-sm" style={{ background: '#f59e0b', color: 'white', borderRadius: 'var(--radius-full)', flexShrink: 0 }}>Set up →</a>
        </motion.div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="stat-card"
            style={{ cursor: 'default' }}
            whileHover={{ y: -3 }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Pipeline bar */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ margin: '0 0 1rem' }}>Application Pipeline</h3>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 10, marginBottom: '0.875rem' }}>
          {pipeline.map(p => (
            <motion.div
              key={p.label}
              initial={{ width: 0 }}
              animate={{ width: `${(p.count / totalPipeline) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              style={{ background: p.color, height: '100%' }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {pipeline.map(p => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick action */}
      <motion.button
        whileHover={{ scale: 1.01, boxShadow: '0 12px 40px var(--gradient-glow, rgba(99,102,241,0.35))' }}
        whileTap={{ scale: 0.99 }}
        onClick={onPostJob}
        disabled={!isProfileComplete}
        style={{
          width: '100%', padding: '1.125rem', borderRadius: 16,
          background: isProfileComplete ? 'var(--gradient, linear-gradient(135deg, #6366f1, #8b5cf6))' : 'var(--surface-2)',
          border: isProfileComplete ? 'none' : '2px dashed var(--border)',
          color: isProfileComplete ? 'white' : 'var(--text-tertiary)',
          cursor: isProfileComplete ? 'pointer' : 'not-allowed',
          fontWeight: 700, fontSize: '1rem', fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
          boxShadow: isProfileComplete ? '0 8px 24px var(--gradient-glow, rgba(99,102,241,0.3))' : 'none',
        }}
      >
        {isProfileComplete ? '+ Post a New Job' : '🔒 Complete Company Profile to Post Jobs'}
      </motion.button>
    </motion.div>
  );
}

// ── Tab: My Jobs ──────────────────────────────────────────────
function JobsTab({ jobs, onPostJob, isProfileComplete }) {
  const now = new Date();
  return (
    <motion.div key="jobs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0 }}>My Job Postings <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>({jobs.length})</span></h3>
        <button
          onClick={onPostJob}
          disabled={!isProfileComplete}
          className="btn btn-primary btn-sm"
          style={{ opacity: isProfileComplete ? 1 : 0.5, cursor: isProfileComplete ? 'pointer' : 'not-allowed' }}
          title={!isProfileComplete ? 'Complete company profile first' : ''}
        >
          + Post Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', background: 'white', borderRadius: 16, border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
          <p>No jobs posted yet. Click "+ Post Job" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {jobs.map((job, i) => {
            const isExpired = job.expires_at && new Date(job.expires_at) < now;
            const expiresDate = job.expires_at ? new Date(job.expires_at) : null;
            const daysLeft = expiresDate ? Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24)) : null;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                style={{ background: 'white', borderRadius: 14, border: `1px solid ${isExpired ? '#fecaca' : 'var(--border)'}`, padding: '1.25rem', transition: 'all 0.15s ease', opacity: isExpired ? 0.7 : 1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{job.title}</div>
                  {isExpired
                    ? <span style={{ fontSize: '0.6875rem', background: '#fee2e2', color: '#991b1b', borderRadius: 6, padding: '0.25rem 0.5rem', fontWeight: 600 }}>Expired</span>
                    : daysLeft !== null && <span style={{ fontSize: '0.6875rem', background: daysLeft <= 3 ? '#fff7ed' : '#f0fdf4', color: daysLeft <= 3 ? '#c2410c' : '#065f46', borderRadius: 6, padding: '0.25rem 0.5rem', fontWeight: 600 }}>{daysLeft}d left</span>
                  }
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.625rem' }}>📍 {job.location} · {job.job_type}</div>
                {job.salary && <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>{job.salary}</span>}
                {job.expires_at && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                    Closes: {new Date(job.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ── Application Detail Modal ─────────────────────────────────
function AppDetailModal({ appId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/${appId}/detail`)
      .then(r => setDetail(r.data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [appId]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          onClick={e => e.stopPropagation()}
          style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 460, boxShadow: '0 32px 80px rgba(0,0,0,0.2)', overflow: 'hidden' }}
        >
          {/* Header */}
          <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--gradient, linear-gradient(135deg,#6366f1,#8b5cf6))' }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>📄 Application Details</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Applicant Information & Resume</div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', padding: '0.375rem 0.625rem', fontSize: '1rem' }}>✕</button>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading applicant details...</div>
            ) : !detail ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>Failed to load details.</div>
            ) : (
              <>
                {/* Student Info – like an email card */}
                <div style={{ background: 'var(--surface-2)', borderRadius: 14, padding: '1.125rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Applicant</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gradient, linear-gradient(135deg,#6366f1,#8b5cf6))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.125rem', flexShrink: 0 }}>
                      {detail.student?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{detail.student?.name}</div>
                      <a href={`mailto:${detail.student?.email}`} style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>
                        ✉️ {detail.student?.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Resume Card */}
                {detail.resume ? (
                  <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '1.125rem', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>📎 Resume Attached</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ fontSize: '0.875rem', color: '#047857', fontWeight: 500, wordBreak: 'break-all' }}>{detail.resume.filename}</div>
                      <a
                        href={`http://localhost:8000${detail.resume.download_url}?token=${localStorage.getItem('token')}`}
                        download
                        target="_blank"
                        rel="noreferrer"
                        style={{ flexShrink: 0 }}
                      >
                        <button className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>⬇ Download</button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fff7ed', borderRadius: 14, padding: '1rem', border: '1px solid #fed7aa', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#c2410c' }}>
                    ⚠️ No resume uploaded by this applicant.
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Close</button>
                  <a href={`mailto:${detail.student?.email}?subject=Regarding Your Application&body=Hi ${detail.student?.name?.split(' ')[0]},`} style={{ flex: 2 }}>
                    <button className="btn btn-primary" style={{ width: '100%' }}>📧 Email Applicant</button>
                  </a>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Tab: Applications ─────────────────────────────────────────
function ApplicationsTab({ applications, jobs, updateStatus }) {
  const [viewingAppId, setViewingAppId] = useState(null);
  const jobMap = {};
  jobs.forEach(j => { jobMap[j.id] = j; });

  return (
    <motion.div key="applications" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0 }}>Applications <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>({applications.length})</span></h3>
      </div>

      {viewingAppId && <AppDetailModal appId={viewingAppId} onClose={() => setViewingAppId(null)} />}

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-premium">
            <thead>
              <tr>
                <th>Job Role</th>
                <th>Applicant</th>
                <th>Current Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{jobMap[app.job_id]?.title || `Job #${app.job_id}`}</span>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{jobMap[app.job_id]?.location}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient, linear-gradient(135deg, #6366f1,#8b5cf6))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                        {app.student_id}
                      </div>
                      <span>Applicant #{app.student_id}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select
                        value={app.status}
                        onChange={e => updateStatus(app.id, e.target.value)}
                        className="select"
                        style={{ width: 'auto', padding: '0.375rem 0.75rem', fontSize: '0.8125rem', borderRadius: 8 }}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                      <button
                        onClick={() => setViewingAppId(app.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', padding: '0.375rem 0.625rem' }}
                        title="View applicant details & resume"
                      >👁 View</button>
                    </div>
                  </td>
                </motion.tr>
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
    </motion.div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const navigate = useNavigate();

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  const isProfileComplete = !!(user?.company_name && user?.company_origin);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get('/applications/'), api.get('/jobs/my-jobs')])
      .then(([a, j]) => { setApplications(a.data); setJobs(j.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  // Also refresh user from /me to get latest company profile
  useEffect(() => {
    api.get('/auth/me').then(res => {
      localStorage.setItem('user', JSON.stringify(res.data));
    }).catch(() => {});
  }, []);

  const updateStatus = async (appId, status) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: res.data.status } : a));
    } catch { alert('Failed to update status'); }
  };

  const handlePostJob = () => {
    if (!isProfileComplete) {
      navigate('/recruiter/profile');
      return;
    }
    setPostModalOpen(true);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)' }}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem 1rem 4rem' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ marginBottom: '0.25rem' }}>
                {getGreeting()}, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Recruiter'} 👋</span>
              </h1>
              <p style={{ margin: 0 }}>
                {user?.company_name
                  ? <>Recruiting for <strong>{user.company_name}</strong> · {user.company_origin}</>
                  : 'Complete your company profile to start posting jobs.'
                }
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 12px 40px var(--gradient-glow, rgba(99,102,241,0.4))' }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePostJob}
              className="btn btn-primary btn-lg"
              style={{ boxShadow: '0 8px 24px var(--gradient-glow, rgba(99,102,241,0.3))' }}
            >
              + Post New Job
            </motion.button>
          </div>

          {/* Tab Bar */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'white', borderRadius: 14, padding: '0.25rem', border: '1px solid var(--border)', marginBottom: '1.5rem', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
            {TABS.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                  background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{ position: 'absolute', inset: 0, borderRadius: 10, background: 'var(--primary)', zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <OverviewTab
                key="overview"
                applications={applications}
                jobs={jobs}
                user={user}
                onPostJob={handlePostJob}
                isProfileComplete={isProfileComplete}
              />
            )}
            {activeTab === 'jobs' && (
              <JobsTab
                key="jobs"
                jobs={jobs}
                onPostJob={handlePostJob}
                isProfileComplete={isProfileComplete}
              />
            )}
            {activeTab === 'applications' && (
              <ApplicationsTab
                key="applications"
                applications={applications}
                jobs={jobs}
                updateStatus={updateStatus}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {isPostModalOpen && (
        <PostJobModal
          companyName={user?.company_name}
          onClose={() => setPostModalOpen(false)}
          onSuccess={() => { setPostModalOpen(false); fetchData(); }}
        />
      )}
    </div>
  );
}
