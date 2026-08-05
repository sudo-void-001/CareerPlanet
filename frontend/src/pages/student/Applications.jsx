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
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={styles.pageTitle}>My Applications</h1>
        <p style={styles.pageSubtitle}>Track your career journey and real-time email status.</p>
      </motion.div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        {[
          { label: 'Total Applied', value: stats.total, color: '#6366f1', bg: '#e0e7ff' },
          { label: 'In Progress', value: stats.inProgress, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Shortlisted', value: stats.shortlisted, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Rejected', value: stats.rejected, color: '#ef4444', bg: '#fef2f2' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            style={{ ...styles.statCard, backgroundColor: stat.bg }}
          >
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>{stat.label}</p>
              <h2 style={{ ...styles.statValue, color: stat.color }}>{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.filterTabs}>
        {['All', 'In Progress', 'Shortlisted', 'Rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              ...styles.tabButton,
              backgroundColor: filter === tab ? 'var(--primary)' : 'transparent',
              color: filter === tab ? '#fff' : '#64748b',
              border: filter === tab ? '1px solid var(--primary)' : '1px solid #e2e8f0',
              boxShadow: filter === tab ? '0 4px 12px rgba(99,102,241,0.25)' : 'none'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div style={styles.appList}>
        {loading ? (
          <div style={styles.loader}>
            <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            Loading your applications...
          </div>
        ) : filteredApps.length > 0 ? (
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  style={styles.appCard}
                >
                  {/* Card Top / Company Header */}
                  <div style={styles.cardHeader}>
                    <div style={styles.companyInfo}>
                      <img 
                        src={logoUrl} 
                        alt={companyName} 
                        style={styles.logo}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div style={styles.logoFallback}>{getInitials(companyName)}</div>
                      <div>
                        <h3 style={styles.jobTitle}>{job.title || 'Job Role'}</h3>
                        <p style={styles.companyName}>{companyName}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge + Score */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      {StatusBadge ? <StatusBadge status={app.status} /> : <span style={styles.fallbackBadge}>{app.status.toUpperCase()}</span>}
                      {/* Email System Delivery Status Badges */}
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {app.application_email_sent && (
                          <span style={{ fontSize: '0.6875rem', background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>✉️ Recruiter Emailed</span>
                        )}
                        {app.shortlist_email_sent && (
                          <span style={{ fontSize: '0.6875rem', background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>🌟 Shortlist Emailed</span>
                        )}
                        {app.interview_email_sent && (
                          <span style={{ fontSize: '0.6875rem', background: '#e0e7ff', color: '#4338ca', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>🎤 Interview Emailed</span>
                        )}
                        {app.selection_email_sent && (
                          <span style={{ fontSize: '0.6875rem', background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>🎉 Offer Emailed</span>
                        )}
                        {app.rejection_email_sent && (
                          <span style={{ fontSize: '0.6875rem', background: '#fee2e2', color: '#991b1b', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>💌 Status Emailed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div style={styles.jobDetails}>
                    <div style={styles.detailItem}>
                      <FiMapPin style={styles.detailIcon} /> {job.location || 'Remote'}
                    </div>
                    <div style={styles.detailItem}>
                      <FiBriefcase style={styles.detailIcon} /> {job.job_type || 'Full Time'}
                    </div>
                    <div style={styles.detailItem}>
                      <FiClock style={styles.detailIcon} /> {formatDate(app.applied_at)}
                    </div>
                  </div>

                  {/* Horizontal Progress Timeline */}
                  {app.status.toLowerCase() !== 'rejected' ? (
                    <div style={styles.timelineWrapper}>
                      <div style={styles.timelineStepsRow}>
                        {timelineSteps.map((step, idx) => {
                          const isActive = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;
                          
                          return (
                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                              
                              {/* Left connect line */}
                              {idx > 0 && (
                                <div style={{
                                  position: 'absolute',
                                  left: '-50%',
                                  right: '50%',
                                  top: '12px',
                                  height: '3px',
                                  background: idx <= currentStepIndex ? '#10b981' : '#e2e8f0',
                                  zIndex: 1
                                }} />
                              )}

                              {/* Dot */}
                              <div style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                border: '2.5px solid',
                                borderColor: isActive ? '#10b981' : '#cbd5e1',
                                backgroundColor: isCurrent ? '#10b981' : '#white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2,
                                boxShadow: isCurrent ? '0 0 10px rgba(16,185,129,0.5)' : 'none',
                                animation: isCurrent ? 'pulse-glow-green 2s infinite' : 'none'
                              }}>
                                {isActive && <div style={{ width: '8px', height: '8px', backgroundColor: isCurrent ? 'white' : '#10b981', borderRadius: '50%' }} />}
                              </div>

                              {/* Label */}
                              <span style={{
                                marginTop: '0.5rem',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                color: isCurrent ? '#10b981' : isActive ? '#334155' : '#94a3b8',
                                fontWeight: isActive ? 700 : 500,
                                textAlign: 'center'
                              }}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={styles.rejectedBanner}>
                      🚫 This application has been rejected. CareerPlanet recommends using the AI assistant to upgrade skills before applying again.
                    </div>
                  )}

                  {/* Recruiter Custom Message */}
                  {app.recruiter_message && (
                    <div style={{ padding: '1rem', background: '#f5f3ff', borderLeft: '4px solid #8b5cf6', borderRadius: '0 0 16px 16px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6d28d9', marginBottom: '0.5rem', textTransform: 'uppercase' }}>✉️ Message from Recruiter</div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#4c1d95', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{app.recruiter_message}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.emptyState}
          >
            <div style={styles.emptyIcon}>🚀</div>
            <h3 style={styles.emptyTitle}>No applications yet</h3>
            <p style={styles.emptyText}>You haven't submitted any applications for this filter status yet.</p>
            <button style={styles.browseJobsBtn} onClick={() => window.location.href = '/jobs'}>
              <FiSearch style={{ marginRight: '8px' }}/> Find Internships & Jobs
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
    fontFamily: '"Inter", sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '2.5rem',
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  pageSubtitle: {
    fontSize: '1.125rem',
    color: '#64748b',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
    marginBottom: '3rem',
  },
  statCard: {
    padding: '1.25rem 1.5rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  statValue: {
    fontSize: '2.25rem',
    fontWeight: 800,
    marginTop: '0.125rem',
  },
  filterTabs: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '0.5rem 1.25rem',
    borderRadius: '9999px',
    fontSize: '0.8125rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  appList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  appCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 10px 30px -5px rgba(15,23,42,0.06)',
    border: '1px solid #f1f5f9',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  logo: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    objectFit: 'contain',
    backgroundColor: '#fff',
    border: '1px solid #f1f5f9',
  },
  logoFallback: {
    display: 'none',
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  jobTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.25rem',
  },
  companyName: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: 500,
  },
  fallbackBadge: {
    padding: '0.375rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  jobDetails: {
    display: 'flex',
    gap: '1.5rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8125rem',
    color: '#64748b',
    fontWeight: 600,
  },
  detailIcon: {
    color: '#94a3b8',
  },
  timelineWrapper: {
    padding: '1rem 0 0.5rem 0',
  },
  timelineStepsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative'
  },
  rejectedBanner: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    padding: '1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textAlign: 'center',
    border: '1px solid #fee2e2'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1.5px dashed #cbd5e1',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: '#64748b',
    marginBottom: '2rem',
  },
  browseJobsBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontWeight: 700,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loader: {
    textAlign: 'center',
    padding: '4rem',
    color: '#64748b',
    fontWeight: 600,
  }
};

export default Applications;
