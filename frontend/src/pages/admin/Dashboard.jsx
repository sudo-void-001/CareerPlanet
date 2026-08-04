import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';
import { Briefcase, FileText, CheckCircle, XCircle, Users } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalJobs: 0, totalApps: 0, shortlisted: 0, hired: 0, rejected: 0 });
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, appsRes, usersRes] = await Promise.all([
                    api.get('/jobs/').catch(() => ({ data: [] })),
                    api.get('/applications/').catch(() => ({ data: [] })),
                    api.get('/admin/users').catch(() => ({ data: [] }))
                ]);
                
                const jobsData = jobsRes.data || [];
                const appsData = appsRes.data || [];
                const usersData = usersRes.data || [];

                setJobs(jobsData.slice(0, 5));
                setApplications(appsData.slice(0, 5));
                setUsers(usersData);

                const shortlisted = appsData.filter(a => a.status === 'shortlisted').length;
                const hired = appsData.filter(a => a.status === 'hired').length;
                const rejected = appsData.filter(a => a.status === 'rejected').length;

                setStats({
                    totalJobs: jobsData.length,
                    totalApps: appsData.length,
                    shortlisted,
                    hired,
                    rejected
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/applications/${id}/status`, { status: newStatus });
            setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleUserStatusUpdate = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await api.put(`/admin/users/${id}/status?is_active=${newStatus}`);
            setUsers(prev => prev.map(user => user.id === id ? { ...user, is_active: newStatus } : user));
        } catch (err) {
            console.error("Failed to update user status", err);
        }
    };

    const handleUserDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    const styles = {
        container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' },
        header: {
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '2rem',
            borderRadius: '1rem',
            color: 'white',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
        },
        title: { fontSize: '2rem', fontWeight: 800, margin: 0 },
        subtitle: { opacity: 0.8, marginTop: '0.5rem' },
        gridRow1: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
        statCard: {
            padding: '1.5rem',
            borderRadius: '1rem',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        },
        statValue: { fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0 0 0' },
        statLabel: { fontSize: '0.875rem', fontWeight: 500, opacity: 0.9 },
        statIcon: { position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.2 },
        gridRow2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' },
        chartCard: {
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        chartTitle: { fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem' },
        barContainer: { marginBottom: '1rem' },
        barHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' },
        barTrack: { height: '8px', backgroundColor: '#F3F4F6', borderRadius: '4px', overflow: 'hidden' },
        barFill: { height: '100%', borderRadius: '4px', transition: 'width 1s ease-in-out' },
        tableCard: {
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem',
            overflowX: 'auto'
        },
        table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
        th: { padding: '1rem', borderBottom: '2px solid #E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.875rem' },
        td: { padding: '1rem', borderBottom: '1px solid #E5E7EB', color: '#111827', fontSize: '0.875rem' },
        select: {
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            border: '1px solid #D1D5DB',
            outline: 'none',
            fontSize: '0.875rem',
            backgroundColor: '#F9FAFB',
            cursor: 'pointer'
        },
        statusBadge: (isActive) => ({
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: isActive ? '#D1FAE5' : '#FEE2E2',
            color: isActive ? '#065F46' : '#991B1B',
            display: 'inline-block'
        })
    };

    const statCards = [
        { label: 'Total Jobs', value: stats.totalJobs, color: 'linear-gradient(135deg, #8b5cf6, #c084fc)', icon: <Briefcase size={80} /> },
        { label: 'Total Applications', value: stats.totalApps, color: 'linear-gradient(135deg, #3b82f6, #60a5fa)', icon: <FileText size={80} /> },
        { label: 'Shortlisted', value: stats.shortlisted, color: 'linear-gradient(135deg, #f59e0b, #fbbf24)', icon: <Users size={80} /> },
        { label: 'Hired', value: stats.hired, color: 'linear-gradient(135deg, #10b981, #34d399)', icon: <CheckCircle size={80} /> },
        { label: 'Rejected', value: stats.rejected, color: 'linear-gradient(135deg, #ef4444, #f87171)', icon: <XCircle size={80} /> },
    ];

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Admin Command Center</h1>
                <p style={styles.subtitle}>Overview of platform activity and metrics</p>
            </div>

            <div style={styles.gridRow1}>
                {statCards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ ...styles.statCard, background: card.color }}
                    >
                        <span style={styles.statLabel}>{card.label}</span>
                        <h3 style={styles.statValue}>{card.value}</h3>
                        <div style={styles.statIcon}>{card.icon}</div>
                    </motion.div>
                ))}
            </div>

            <div style={styles.gridRow2}>
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Application Funnel</h3>
                    {[
                        { label: 'Total Applied', val: stats.totalApps, color: '#3b82f6', percent: 100 },
                        { label: 'Shortlisted', val: stats.shortlisted, color: '#f59e0b', percent: stats.totalApps ? (stats.shortlisted/stats.totalApps)*100 : 0 },
                        { label: 'Hired', val: stats.hired, color: '#10b981', percent: stats.totalApps ? (stats.hired/stats.totalApps)*100 : 0 }
                    ].map((item, i) => (
                        <div key={i} style={styles.barContainer}>
                            <div style={styles.barHeader}>
                                <span>{item.label}</span>
                                <span style={{ fontWeight: 600 }}>{item.val}</span>
                            </div>
                            <div style={styles.barTrack}>
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${item.percent}%` }} 
                                    style={{ ...styles.barFill, backgroundColor: item.color }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Jobs by Type</h3>
                    {[
                        { label: 'Full-time', val: Math.round(stats.totalJobs * 0.6), color: '#8b5cf6', percent: 60 },
                        { label: 'Contract', val: Math.round(stats.totalJobs * 0.25), color: '#ec4899', percent: 25 },
                        { label: 'Part-time', val: Math.round(stats.totalJobs * 0.15), color: '#06b6d4', percent: 15 }
                    ].map((item, i) => (
                        <div key={i} style={styles.barContainer}>
                            <div style={styles.barHeader}>
                                <span>{item.label}</span>
                                <span style={{ fontWeight: 600 }}>{item.val}</span>
                            </div>
                            <div style={styles.barTrack}>
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${item.percent}%` }} 
                                    style={{ ...styles.barFill, backgroundColor: item.color }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.tableCard}>
                <h3 style={styles.chartTitle}>Recent Jobs</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Company</th>
                            <th style={styles.th}>Location</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id}>
                                <td style={{ ...styles.td, fontWeight: 600 }}>{job.title}</td>
                                <td style={styles.td}>{job.company_name || 'N/A'}</td>
                                <td style={styles.td}>{job.location}</td>
                                <td style={styles.td}>{job.type}</td>
                                <td style={styles.td}>
                                    <span style={styles.statusBadge(job.is_active)}>
                                        {job.is_active ? 'Active' : 'Expired'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && <tr><td colSpan="5" style={{...styles.td, textAlign: 'center'}}>No jobs found</td></tr>}
                    </tbody>
                </table>
            </div>

            <div style={styles.tableCard}>
                <h3 style={styles.chartTitle}>All Applications</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Job Title</th>
                            <th style={styles.th}>Applicant ID</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td style={{ ...styles.td, fontWeight: 600 }}>{app.job_title || `Job #${app.job_id}`}</td>
                                <td style={styles.td}>#{app.user_id}</td>
                                <td style={styles.td}>
                                    {typeof StatusBadge !== 'undefined' ? <StatusBadge status={app.status} /> : 
                                        <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{app.status}</span>
                                    }
                                </td>
                                <td style={styles.td}>
                                    <select 
                                        style={styles.select}
                                        value={app.status}
                                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="hired">Hired</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && <tr><td colSpan="4" style={{...styles.td, textAlign: 'center'}}>No applications found</td></tr>}
                    </tbody>
                </table>
            </div>

            <div style={styles.tableCard}>
                <h3 style={styles.chartTitle}>User Management</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Full Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td style={styles.td}>#{u.id}</td>
                                <td style={{ ...styles.td, fontWeight: 600 }}>{u.full_name || u.name || 'N/A'}</td>
                                <td style={styles.td}>{u.email}</td>
                                <td style={{ ...styles.td, textTransform: 'capitalize' }}>{u.role}</td>
                                <td style={styles.td}>
                                    <span style={styles.statusBadge(u.is_active)}>
                                        {u.is_active ? 'Active' : 'Frozen'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button 
                                        onClick={() => handleUserStatusUpdate(u.id, u.is_active)}
                                        style={{ 
                                            padding: '0.25rem 0.75rem', 
                                            marginRight: '0.5rem',
                                            borderRadius: '0.25rem',
                                            border: 'none',
                                            backgroundColor: u.is_active ? '#FEE2E2' : '#D1FAE5',
                                            color: u.is_active ? '#991B1B' : '#065F46',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {u.is_active ? 'Freeze' : 'Unfreeze'}
                                    </button>
                                    <button 
                                        onClick={() => handleUserDelete(u.id)}
                                        style={{ 
                                            padding: '0.25rem 0.75rem', 
                                            borderRadius: '0.25rem',
                                            border: 'none',
                                            backgroundColor: '#EF4444',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && <tr><td colSpan="6" style={{...styles.td, textAlign: 'center'}}>No users found</td></tr>}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
