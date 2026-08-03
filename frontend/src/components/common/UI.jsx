import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const companyColors = {
  microsoft: '#00a4ef',
  google: '#4285f4',
  amazon: '#ff9900',
  meta: '#1877f2',
  default: '#6366f1',
};

export function CompanyLogo({ name, size = 40 }) {
  const letter = name?.charAt(0).toUpperCase() || '?';
  const colors = {
    'M': '#00a4ef', 'G': '#34a853', 'A': '#ff9900', 'F': '#1877f2',
    'I': '#0050b3', 'T': '#6366f1', 'D': '#86efac', 'N': '#e50914',
  };
  const bg = colors[letter] || '#6366f1';
  return (
    <div className="company-logo" style={{ width: size, height: size, background: bg, borderRadius: size * 0.25 }}>
      {letter}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending:     { label: 'Pending',     cls: 'status-pending' },
    reviewing:   { label: 'Reviewing',   cls: 'status-reviewing' },
    shortlisted: { label: 'Shortlisted', cls: 'status-shortlisted' },
    rejected:    { label: 'Rejected',    cls: 'status-rejected' },
    hired:       { label: 'Hired',       cls: 'status-hired' },
  };
  const s = map[status] || { label: status, cls: 'badge-gray' };
  return (
    <span className={`badge ${s.cls}`} style={{ textTransform: 'capitalize' }}>{s.label}</span>
  );
}

export function MatchScore({ score }) {
  const cls = score >= 80 ? 'match-high' : score >= 60 ? 'match-mid' : 'match-low';
  return (
    <div className={`match-ring ${cls}`} title={`${score}% match`}>
      {score}%
    </div>
  );
}

export function SkillChip({ skill }) {
  return <span className="skill-chip">{skill.trim()}</span>;
}

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div className="pulse-glow" style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem'
      }}>✦</div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{message}</p>
    </div>
  );
}

export function EmptyState({ icon = '📭', title, description, actionLabel, actionHref }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{description}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref} className="btn btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}
