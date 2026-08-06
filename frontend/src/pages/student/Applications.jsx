import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="page hero-gradient">
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>✦ Application Tracking</span>
          <h1 style={{ marginBottom: '0.75rem', fontSize: '3rem', fontWeight: 800 }}>My Applications</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>Track your career applications, pipeline status, and recruiter dispatches in real-time.</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Submitted', value: stats.total, color: 'var(--info)' },
            { label: 'In Review', value: stats.inProgress, color: 'var(--warning)' },
            { label: 'Shortlisted', value: stats.shortlisted, color: 'var(--success)' },
            { label: 'Rejected', value: stats.rejected, color: 'var(--danger)' }
          ].map((s, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card" 
              style={{ padding: '1.75rem', borderTop: `4px solid ${s.color}` }}
            >
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{s.label}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', padding: '0.5rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)', width: 'fit-content' }}>
          {['All', 'In Progress', 'Shortlisted', 'Rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="btn"
              style={{
                background: filter === tab ? 'var(--surface-3)' : 'transparent',
                color: filter === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: filter === tab ? '1px solid var(--border-strong)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                boxShadow: filter === tab ? 'var(--shadow-sm)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[1,2,3].map(n => (
              <div key={n} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 'var(--radius)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: '40%', height: 24, marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ width: '20%', height: 16 }} />
                  </div>
                </div>
                <div className="skeleton" style={{ width: '100%', height: 80, borderRadius: 'var(--radius)' }} />
              </div>
            ))}
          </div>
        ) : filteredApps.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
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
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card"
                    style={{ padding: '2rem' }}
                  >
                    {/* Header line */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <img 
                          src={logoUrl} 
                          alt={companyName} 
                          style={{ width: 56, height: 56, borderRadius: 'var(--radius)', objectFit: 'cover', border: '1px solid var(--border)' }}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div style={{ display: 'none', width: 56, height: 56, borderRadius: 'var(--radius)', background: 'var(--gradient)', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', border: '1px solid var(--border)' }}>
                          {getInitials(companyName)}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{job.title || 'Role Application'}</h3>
                          <div style={{ fontSize: '0.9375rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{companyName} • {job.location || 'Remote'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                        <StatusBadge status={app.status} />
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {app.application_email_sent && <span className="badge badge-green">✉️ Emailed</span>}
                          {app.shortlist_email_sent && <span className="badge badge-indigo">🌟 Shortlisted</span>}
                          {app.interview_email_sent && <span className="badge badge-violet">🎤 Interview</span>}
                          {app.selection_email_sent && <span className="badge badge-amber">🎉 Offer</span>}
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    {app.status.toLowerCase() !== 'rejected' ? (
                      <div style={{ background: 'var(--surface-2)', padding: '2rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', marginBottom: app.recruiter_message ? '1.5rem' : 0 }}>
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
                                    top: '14px',
                                    height: '2px',
                                    background: idx <= currentStepIndex ? 'var(--primary)' : 'var(--border-strong)',
                                    zIndex: 1
                                  }} />
                                )}
                                <div style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderColor: isActive ? 'var(--primary)' : 'var(--border-strong)',
                                  backgroundColor: isCurrent ? 'var(--primary)' : 'var(--surface-3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 2,
                                  boxShadow: isCurrent ? '0 0 20px var(--border-glow)' : 'none',
                                }}>
                                  {isActive && <div style={{ width: '10px', height: '10px', backgroundColor: isCurrent ? '#000000' : 'var(--primary)', borderRadius: '50%' }} />}
                                </div>
                                <span style={{
                                  marginTop: '1rem',
                                  fontSize: '0.8125rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  color: isCurrent ? 'var(--primary)' : isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
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
                      <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', color: 'var(--danger)', fontSize: '0.9375rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem' }}>🚫</span>
                        <div>
                          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Application Rejected</strong>
                          <span>Use the AI Assistant to prep & refine skills before applying to new opportunities.</span>
                        </div>
                      </div>
                    )}

                    {/* Custom Recruiter Message */}
                    {app.recruiter_message && (
                      <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.05)', borderLeft: '4px solid var(--accent-purple)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0', marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✉️ Note from Recruiter</div>
                        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{app.recruiter_message}</p>
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border)' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.8 }}>🚀</div>
            <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>No applications found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>You haven't submitted any job applications under this filter.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Applications;
