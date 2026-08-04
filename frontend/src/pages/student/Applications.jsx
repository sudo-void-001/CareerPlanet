import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { StatusBadge } from '../../components/common/UI'; // Adjust path if necessary
import { FiBriefcase, FiMapPin, FiClock, FiSearch } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

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
          jobMap[job._id] = job;
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
    inProgress: applications.filter(a => ['applied', 'reviewing', 'interview'].includes(a.status)).length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  const getFilteredApps = () => {
    if (filter === 'All') return applications;
    if (filter === 'In Progress') return applications.filter(a => ['applied', 'reviewing', 'interview'].includes(a.status));
    return applications.filter(a => a.status.toLowerCase() === filter.toLowerCase());
  };

  const filteredApps = getFilteredApps();

  const getDomainFromCompany = (companyName) => {
    return companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com'; // Simple fallback approximation
  };

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : 'CO';
  };

  return (
    <div style={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={styles.pageTitle}>My Applications</h1>
        <p style={styles.pageSubtitle}>Track your career journey and application status.</p>
      </motion.div>

      <div style={styles.statsContainer}>
        {[
          { label: 'Total Applied', value: stats.total, color: '#3b82f6', bg: '#eff6ff' },
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

      <div style={styles.filterTabs}>
        {['All', 'In Progress', 'Shortlisted', 'Rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              ...styles.tabButton,
              backgroundColor: filter === tab ? '#0f172a' : 'transparent',
              color: filter === tab ? '#fff' : '#64748b',
              border: filter === tab ? '1px solid #0f172a' : '1px solid #e2e8f0'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.appList}>
        {loading ? (
          <div style={styles.loader}>Loading applications...</div>
        ) : filteredApps.length > 0 ? (
          <AnimatePresence>
            {filteredApps.map((app, index) => {
              const job = jobs[app.jobId] || {};
              const companyName = job.company || 'Unknown Company';
              const domain = job.website || getDomainFromCompany(companyName);
              const logoUrl = `https://logo.clearbit.com/${domain}`;
              
              const timelineSteps = ['applied', 'reviewing', 'shortlisted', 'hired'];
              let currentStepIndex = timelineSteps.indexOf(app.status.toLowerCase());
              if(currentStepIndex === -1 && app.status.toLowerCase() === 'interview') currentStepIndex = 1;

              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  style={styles.appCard}
                >
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
                        <h3 style={styles.jobTitle}>{job.title || 'Job Title'}</h3>
                        <p style={styles.companyName}>{companyName}</p>
                      </div>
                    </div>
                    {StatusBadge ? <StatusBadge status={app.status} /> : <span style={styles.fallbackBadge}>{app.status.toUpperCase()}</span>}
                  </div>

                  <div style={styles.jobDetails}>
                    <div style={styles.detailItem}>
                      <FiMapPin style={styles.detailIcon} /> {job.location || 'Remote'}
                    </div>
                    <div style={styles.detailItem}>
                      <FiBriefcase style={styles.detailIcon} /> {job.type || 'Full-time'}
                    </div>
                    <div style={styles.detailItem}>
                      <FiClock style={styles.detailIcon} /> 
                      {app.appliedAt ? formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true }) : 'Recently'}
                    </div>
                  </div>

                  {app.status.toLowerCase() !== 'rejected' && (
                    <div style={styles.timelineContainer}>
                      {timelineSteps.map((step, idx) => (
                        <React.Fragment key={step}>
                          <div style={{
                            ...styles.timelineDot,
                            backgroundColor: idx <= currentStepIndex ? '#10b981' : '#e2e8f0',
                            borderColor: idx <= currentStepIndex ? '#10b981' : '#cbd5e1'
                          }}>
                            {idx <= currentStepIndex && <div style={styles.dotInner} />}
                          </div>
                          <span style={{
                            ...styles.timelineText,
                            color: idx <= currentStepIndex ? '#0f172a' : '#94a3b8',
                            fontWeight: idx === currentStepIndex ? 600 : 400
                          }}>
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </span>
                          {idx < timelineSteps.length - 1 && (
                            <div style={{
                              ...styles.timelineLine,
                              backgroundColor: idx < currentStepIndex ? '#10b981' : '#f1f5f9'
                            }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                  {app.status.toLowerCase() === 'rejected' && (
                    <div style={styles.rejectedBanner}>
                      This application was not moved forward. Keep applying!
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
            <h3 style={styles.emptyTitle}>No applications found</h3>
            <p style={styles.emptyText}>You haven't applied to any jobs that match this filter yet.</p>
            <button style={styles.browseJobsBtn} onClick={() => window.location.href = '/jobs'}>
              <FiSearch style={{marginRight: '8px'}}/> Browse Jobs
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    padding: '1.5rem',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginTop: '0.25rem',
  },
  filterTabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '0.5rem 1.25rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 600,
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
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
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
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '1.5rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: 500,
  },
  detailIcon: {
    color: '#94a3b8',
  },
  timelineContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.5rem 0',
  },
  timelineDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotInner: {
    width: '6px',
    height: '6px',
    backgroundColor: '#fff',
    borderRadius: '50%',
  },
  timelineText: {
    fontSize: '0.75rem',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  timelineLine: {
    flex: 1,
    height: '2px',
    minWidth: '20px',
    margin: '0 0.5rem',
  },
  rejectedBanner: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1px dashed #cbd5e1',
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
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: 600,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loader: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b',
    fontWeight: 500,
  }
};

export default Applications;
