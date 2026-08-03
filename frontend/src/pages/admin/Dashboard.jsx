import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  useEffect(() => {
    Promise.all([api.get('/applications/'), api.get('/jobs/')])
      .then(([a, j]) => { setApplications(a.data); setJobs(j.data); })
      .finally(() => setLoading(false));
  }, []);

  const jobMap = {};
  jobs.forEach(j => { jobMap[j.id] = j; });

  const byStatus = {
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    hired: applications.filter(a => a.status === 'hired').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    pending: applications.filter(a => ['pending', 'reviewing'].includes(a.status)).length,
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="pulse-glow" style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>✦</div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading platform data...</p>
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
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p>Platform-wide analytics and management</p>
          </div>

          {/* Top stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Jobs', value: jobs.length, icon: '💼', color: '#6366f1' },
              { label: 'Applications', value: applications.length, icon: '📋', color: '#f59e0b' },
              { label: 'Shortlisted', value: byStatus.shortlisted, icon: '⭐', color: '#10b981' },
              { label: 'Hired', value: byStatus.hired, icon: '🎉', color: '#8b5cf6' },
              { label: 'Rejected', value: byStatus.rejected, icon: '❌', color: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="stat-card"
                style={{ transition: 'all 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Application Status Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>Application Funnel</h3>
              {[
                { label: 'Applied', value: applications.length, color: '#6366f1', pct: 100 },
                { label: 'Under Review', value: byStatus.pending, color: '#f59e0b', pct: Math.round((byStatus.pending / applications.length || 0) * 100) },
                { label: 'Shortlisted', value: byStatus.shortlisted, color: '#10b981', pct: Math.round((byStatus.shortlisted / applications.length || 0) * 100) },
                { label: 'Hired', value: byStatus.hired, color: '#8b5cf6', pct: Math.round((byStatus.hired / applications.length || 0) * 100) },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: row.color }}>{row.value}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'var(--border)' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${row.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      style={{ height: '100%', borderRadius: 999, background: row.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>Jobs by Type</h3>
              {['Full Time', 'Internship', 'Part Time'].map(type => {
                const count = jobs.filter(j => j.job_type === type).length;
                const pct = jobs.length ? Math.round((count / jobs.length) * 100) : 0;
                const color = type === 'Full Time' ? '#10b981' : type === 'Internship' ? '#8b5cf6' : '#06b6d4';
                return (
                  <div key={type} style={{ marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{type}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{count}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: 'var(--border)' }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct || 5}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ height: '100%', borderRadius: 999, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Applications */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>All Applications</h3>
              <span className="badge badge-gray">{applications.length} total</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Student ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => {
                    const job = jobMap[app.job_id];
                    const companies = { 1: 'Microsoft', 2: 'Google', 3: 'Amazon', 4: 'TCS' };
                    const companyName = job?.company_name || companies[job?.company_id] || '—';
                    return (
                      <tr key={app.id}>
                        <td style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>#{app.id}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job?.title || `Job #${app.job_id}`}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{companyName}</td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>#{app.student_id}</td>
                        <td><StatusBadge status={app.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
