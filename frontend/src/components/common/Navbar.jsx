import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const token = localStorage.getItem('token');
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isAuthPage) return null;

  const studentLinks = [
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/applications', label: 'Applications' },
    { to: '/resume', label: 'AI Resume' },
  ];

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,250,250,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(229,231,235,0.7)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '4rem', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem'
          }}>C</div>
          <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Career<span style={{ color: 'var(--primary)' }}>Planet</span>
          </span>
        </Link>

        {/* Center links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {!user || user.role === 'student' ? (
            studentLinks.map(l => (
              <NavLink key={l.to} to={l.to} active={location.pathname === l.to}>{l.label}</NavLink>
            ))
          ) : user.role === 'recruiter' ? (
            <NavLink to="/recruiter/dashboard" active={location.pathname.includes('recruiter')}>Dashboard</NavLink>
          ) : (
            <NavLink to="/admin/dashboard" active={location.pathname.includes('admin')}>Admin Panel</NavLink>
          )}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {token && user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.375rem 0.75rem', background: 'var(--surface-2)',
                borderRadius: 'var(--radius-full)', border: '1px solid var(--border)'
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.6875rem', fontWeight: 700
                }}>
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.full_name?.split(' ')[0]}
                </span>
              </div>
              <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className="nav-link"
      style={active ? {
        color: 'var(--primary)',
        background: 'var(--primary-light)',
        fontWeight: 600,
      } : {}}
    >
      {children}
    </Link>
  );
}
