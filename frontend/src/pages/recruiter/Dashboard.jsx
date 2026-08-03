import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';

const statusOptions = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  useEffect(() => {
    Promise.all([api.get('/applications/'), api.get('/jobs/')])
      .then(([a, j]) => { setApplications(a.data); setJobs(j.data); })
      .finally(() => setLoading(false));
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
  const reviewing = applications.filter(a => a.status === 'reviewing').length;

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
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ marginBottom: '0.25rem' }}>
              Good evening, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Recruiter'} 👋</span>
            </h1>
            <p>Here's your recruitment overview for today</p>
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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
