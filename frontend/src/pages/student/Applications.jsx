import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';
import { FiBriefcase, FiMapPin, FiClock, FiSearch } from 'react-icons/fi';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get('/applications/'),
          api.get('/jobs/')
        ]);
        
        const jobMap = {};
        jobsRes.data.forEach(job => {
          jobMap[job.id] = job;
        });

        setJobs(jobMap);
        setApplications(appsRes.data);
      } catch (error) {
        console.error('Error fetching applications data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    total: applications.length,
    inProgress: applications.filter(a => ['pending', 'reviewing', 'shortlisted', 'interview'].includes(a.status)).length,
    shortlisted: applications.filter(a => ['shortlisted', 'interview', 'hired', 'selected'].includes(a.status)).length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  const getFilteredApps = () => {
    if (filter === 'All') return applications;
    if (filter === 'In Progress') {
      return applications.filter(a => ['pending', 'reviewing', 'shortlisted', 'interview'].includes(a.status));
    }
    return applications.filter(a => a.status.toLowerCase() === filter.toLowerCase());
  };

  const filteredApps = getFilteredApps();

  const getDomainFromCompany = (companyName) => {
    return (companyName || '').toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  };

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : 'CO';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const diff = new Date() - new Date(dateStr);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days <= 0) return 'Today';
      if (days === 1) return 'Yesterday';
      return `${days} days ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="page hero-gradient">
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-green" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>✦ Application Tracking</span>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '2.75rem' }}>My Applications</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Track your career applications, pipeline status, and recruiter dispatches.</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Submitted', value: stats.total, color: '#38bdf8' },
            { label: 'In Review', value: stats.inProgress, color: '#fbbf24' },
            { label: 'Shortlisted', value: stats.shortlisted, color: '#34d399' },
            { label: 'Rejected', value: stats.rejected, color: '#f87171' }
          ].map((s, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{s.label}</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '2rem' }}>
          {['All', 'In Progress', 'Shortlisted', 'Rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="btn"
              style={{
                background: filter === tab ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: filter === tab ? '#34d399' : 'var(--text-secondary)',
                border: filter === tab ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[1,2,3].map(n => <div key={n} className="skeleton" style={{ height: 180 }} />)}
          </div>
        ) : filteredApps.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AnimatePresence>
              {filteredApps.map((app, index) => {
                const job = jobs[app.job_id] || {};
                const companyName = job.company_name || 'Unknown Company';
                const domain = getDomainFromCompany(companyName);
                const logoUrl = `https://logo.clearbit.com/${domain}`;
                
                const timelineSteps = ['pending', 'reviewing', 'shortlisted', 'interview', 'selected'];
                let currentStepIndex = timelineSteps.indexOf(app.status.toLowerCase());
                if (currentStepIndex === -1 && app.status.toLowerCase() === 'hired') {
                  currentStepIndex = 4;
                }

                return (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card"
                    style={{ padding: '1.75rem' }}
                  >
                    {/* Header line */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <img 
                          src={logoUrl} 
                          alt={companyName} 
                          style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div style={{ display: 'none', width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #06b6d4)', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000' }}>
                          {getInitials(companyName)}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.2rem' }}>{job.title || 'Role Application'}</h3>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{companyName} • {job.location || 'Remote'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <StatusBadge status={app.status} />
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {app.application_email_sent && <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>✉️ Recruiter Emailed</span>}
                          {app.shortlist_email_sent && <span className="badge badge-blue" style={{ fontSize: '0.6875rem' }}>🌟 Shortlisted</span>}
                          {app.interview_email_sent && <span className="badge badge-violet" style={{ fontSize: '0.6875rem' }}>🎤 Interview Invited</span>}
                          {app.selection_email_sent && <span className="badge badge-amber" style={{ fontSize: '0.6875rem' }}>🎉 Offer Received</span>}
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    {app.status.toLowerCase() !== 'rejected' ? (
                      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: app.recruiter_message ? '1.25rem' : 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                          {timelineSteps.map((step, idx) => {
                            const isActive = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;
                            
                            return (
                              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                                {idx > 0 && (
                                  <div style={{
                                    position: 'absolute',
                                    left: '-50%',
                                    right: '50%',
                                    top: '12px',
                                    height: '3px',
                                    background: idx <= currentStepIndex ? '#10b981' : 'rgba(255,255,255,0.1)',
                                    zIndex: 1
                                  }} />
                                )}
                                <div style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderColor: isActive ? '#10b981' : 'rgba(255,255,255,0.2)',
                                  backgroundColor: isCurrent ? '#10b981' : '#0d0f17',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 2,
                                  boxShadow: isCurrent ? '0 0 15px rgba(16,185,129,0.6)' : 'none',
                                }}>
                                  {isActive && <div style={{ width: '8px', height: '8px', backgroundColor: isCurrent ? '#000000' : '#10b981', borderRadius: '50%' }} />}
                                </div>
                                <span style={{
                                  marginTop: '0.625rem',
                                  fontSize: '0.75rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                  color: isCurrent ? '#34d399' : isActive ? '#f8fafc' : 'var(--text-tertiary)',
                                  fontWeight: isActive ? 700 : 500
                                }}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem 1.25rem', borderRadius: 14, color: '#f87171', fontSize: '0.875rem' }}>
                        🚫 Application status updated to Rejected. Use AI Assistant to prep & refine skills before applying to new opportunities.
                      </div>
                    )}

                    {/* Custom Recruiter Message */}
                    {app.recruiter_message && (
                      <div style={{ padding: '1.25rem', background: 'rgba(139, 92, 246, 0.1)', borderLeft: '4px solid #8b5cf6', borderRadius: '0 0 16px 16px', marginTop: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.35rem', textTransform: 'uppercase' }}>✉️ Personal Note from Recruiter</div>
                        <p style={{ margin: 0, fontSize: '0.90625rem', color: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{app.recruiter_message}</p>
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(19, 21, 31, 0.5)', borderRadius: 24, border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.5rem' }}>No applications recorded</h3>
            <p style={{ color: 'var(--text-secondary)' }}>You haven't submitted any job applications under this status filter.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Applications;
