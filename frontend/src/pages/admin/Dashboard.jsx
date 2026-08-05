import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <div className="page hero-gradient">
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-green" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>⚡ Command Center</span>
          <h1 style={{ fontSize: '2.75rem', margin: 0 }}>Platform Administration</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Global placement monitoring, user management, and job analytics.</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Job Openings</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>{stats.totalJobs}</div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Applications</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.25rem' }}>{stats.totalApps}</div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Shortlisted</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>{stats.shortlisted}</div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Offers Extended</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#c084fc', marginTop: '0.25rem' }}>{stats.hired}</div>
          </div>
        </div>

        {/* Section: User Management */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem' }}>User Management Control</h3>
          {users.length > 0 ? (
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
                      <td style={{ fontWeight: 700, color: '#ffffff' }}>#{u.id}</td>
                      <td>{u.full_name}</td>
                      <td style={{ color: 'var(--text-tertiary)' }}>{u.email}</td>
                      <td><span className="badge badge-green">{u.role}</span></td>
                      <td>
                        {u.is_active !== false ? (
                          <span style={{ color: '#34d399', fontSize: '0.8125rem', fontWeight: 700 }}>● Active</span>
                        ) : (
                          <span style={{ color: '#f87171', fontSize: '0.8125rem', fontWeight: 700 }}>🚫 Frozen</span>
                        )}
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleToggleUserStatus(u.id, u.is_active !== false)} 
                          className="btn btn-secondary btn-sm"
                          style={{ borderRadius: 'var(--radius-full)' }}
                        >
                          {u.is_active !== false ? 'Freeze' : 'Unfreeze'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)} 
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-full)' }}
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
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No user records loaded.</div>
          )}
        </div>

        {/* Section: All Applications */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem' }}>System-Wide Applications Log</h3>
          {applications.length > 0 ? (
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
                      <td style={{ fontWeight: 700, color: '#ffffff' }}>#{app.id}</td>
                      <td>Candidate #{app.student_id || app.id}</td>
                      <td>Job #{app.job_id}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>
                        <select 
                          className="select"
                          value={app.status}
                          onChange={e => handleAppStatusChange(app.id, e.target.value)}
                          style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
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
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No system applications found.</div>
          )}
        </div>

      </div>
    </div>
  );
}
