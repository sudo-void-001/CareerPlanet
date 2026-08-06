import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes, usersRes] = await Promise.all([
        api.get('/jobs/'),
        api.get('/applications/'),
        api.get('/admin/users').catch(() => ({ data: [] }))
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status?is_active=${!currentStatus}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
    } catch (err) {
      alert('Failed to update user status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user account?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleAppStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Failed to update application status.');
    }
  };

  const stats = {
    totalJobs: jobs.length,
    totalApps: applications.length,
    shortlisted: applications.filter(a => ['shortlisted', 'interview'].includes(a.status)).length,
    hired: applications.filter(a => ['hired', 'selected'].includes(a.status)).length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      <div className="container">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '3rem' }}
        >
          <span className="badge" style={{ marginBottom: '1rem', background: 'var(--surface-3)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>⚡ Command Center</span>
          <h1 style={{ fontSize: '3rem', margin: 0, letterSpacing: '-0.04em' }}>Platform Administration</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.125rem' }}>Global placement monitoring, user management, and job analytics.</p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card skeleton" style={{ height: '120px' }}></div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}
          >
            <div className="stat-card">
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Job Openings</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>{stats.totalJobs}</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applications</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>{stats.totalApps}</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shortlisted</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>{stats.shortlisted}</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Offers Extended</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>{stats.hired}</div>
            </div>
          </motion.div>
        )}

        {/* Section: User Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-flat" 
          style={{ padding: '2rem', marginBottom: '3rem' }}
        >
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 600 }}>User Management Control</h3>
          {loading ? (
            <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
          ) : users.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Account Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>#{u.id}</td>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.full_name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td><span className="badge" style={{ background: 'var(--surface-3)' }}>{u.role}</span></td>
                      <td>
                        {u.is_active !== false ? (
                          <span style={{ color: 'var(--success)', fontSize: '0.8125rem', fontWeight: 600 }}>Active</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>Frozen</span>
                        )}
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleToggleUserStatus(u.id, u.is_active !== false)} 
                          className="btn btn-secondary btn-sm"
                        >
                          {u.is_active !== false ? 'Freeze' : 'Unfreeze'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)} 
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--danger)' }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', padding: '2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>No user records loaded.</div>
          )}
        </motion.div>

        {/* Section: All Applications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-flat" 
          style={{ padding: '2rem' }}
        >
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 600 }}>System-Wide Applications Log</h3>
          {loading ? (
            <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
          ) : applications.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Candidate</th>
                    <th>Job ID</th>
                    <th>Status</th>
                    <th>Update Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>#{app.id}</td>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Candidate #{app.student_id || app.id}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>Job #{app.job_id}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>
                        <select 
                          className="input"
                          value={app.status}
                          onChange={e => handleAppStatusChange(app.id, e.target.value)}
                          style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8125rem', height: 'auto' }}
                        >
                          {['pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'].map(s => (
                            <option key={s} value={s}>{s.toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', padding: '2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius)' }}>No system applications found.</div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
