import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';

const COMPANY_NAMES = { 1: 'Microsoft', 2: 'Google', 3: 'Amazon', 4: 'TCS' };

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [jobMap, setJobMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/applications/'), api.get('/jobs/')])
      .then(([a, j]) => {
        setApplications(a.data);
        const m = {}; j.data.forEach(jb => { m[jb.id] = jb; });
        setJobMap(m);
      }).finally(() => setLoading(false));
  }, []);

  const counts = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted' || a.status === 'hired').length,
    pending: applications.filter(a => a.status === 'pending' || a.status === 'reviewing').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem 1rem 4rem' }}>
      <div className="container-md">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 style={{ marginBottom: '0.375rem' }}>My <span className="gradient-text">Applications</span></h1>
          <p style={{ marginBottom: '2rem' }}>Track all your job applications in one place</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Applied', value: counts.total, color: '#6366f1' },
              { label: 'In Progress', value: counts.pending, color: '#f59e0b' },
              { label: 'Shortlisted', value: counts.shortlisted, color: '#10b981' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 88, borderRadius: 12 }} />)}
            </div>
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3 style={{ marginBottom: '0.5rem' }}>No applications yet</h3>
              <p style={{ marginBottom: '1.5rem' }}>Start by exploring jobs and applying to roles that match your skills.</p>
              <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <motion.div
              initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              {applications.map(app => {
                const job = jobMap[app.job_id];
                const company = job?.company_name || COMPANY_NAMES[job?.company_id] || 'Company';
                return (
                  <motion.div
                    key={app.id}
                    variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                    style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: '1.125rem 1.375rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: app.job_id <= 2 ? '#00a4ef' : '#34a853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                        {company.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{job?.title || `Job #${app.job_id}`}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{company} • {job?.location}</div>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
