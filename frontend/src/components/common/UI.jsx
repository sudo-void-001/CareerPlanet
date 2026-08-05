import { Link } from 'react-router-dom';

export function CompanyLogo({ name, size = 44 }) {
  const letter = name?.charAt(0).toUpperCase() || '?';
  const colors = {
    'M': 'linear-gradient(135deg, #00a4ef, #0078d4)',
    'G': 'linear-gradient(135deg, #34a853, #1e8e3e)',
    'A': 'linear-gradient(135deg, #ff9900, #e68a00)',
    'F': 'linear-gradient(135deg, #1877f2, #0d6efd)',
    'I': 'linear-gradient(135deg, #0050b3, #003a8c)',
    'T': 'linear-gradient(135deg, #6366f1, #4f46e5)',
    'D': 'linear-gradient(135deg, #86bc25, #6b971e)',
    'N': 'linear-gradient(135deg, #e50914, #b20710)',
  };
  const bg = colors[letter] || 'linear-gradient(135deg, #10b981, #06b6d4)';
  return (
    <div className="company-logo" style={{ 
      width: size, 
      height: size, 
      background: bg, 
      borderRadius: size * 0.28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: size * 0.45,
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.15)'
    }}>
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
    selected:    { label: 'Selected',    cls: 'status-hired' },
  };
  const s = map[status] || { label: status, cls: 'badge-gray' };
  return (
    <span className={`badge ${s.cls}`} style={{ textTransform: 'capitalize', letterSpacing: '0.02em' }}>{s.label}</span>
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
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
      <div className="pulse-glow" style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '1.4rem', fontWeight: 800
      }}>✦</div>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
}

export function EmptyState({ icon = '📭', title, description, actionLabel, actionHref }) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '4rem 2rem',
      background: 'rgba(19, 21, 31, 0.4)',
      borderRadius: 'var(--radius-xl)',
      border: '1px dashed var(--border)',
      margin: '2rem 0'
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>{icon}</div>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.35rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', maxWidth: '420px', margin: '0 auto 1.75rem' }}>{description}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref} className="btn btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}
