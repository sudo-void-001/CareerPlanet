import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const API_BASE = 'http://localhost:8000';
const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };

export default function RecruiterProfile() {
  const [user, setUser] = useState(getUser() || {});
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const [form, setForm] = useState({
    company_name: user.company_name || '',
    company_origin: user.company_origin || '',
    company_website: user.company_website || '',
  });

  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => setUser(getUser() || {});
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const data = new FormData();
    data.append('avatar', file);

    try {
      const response = await api.post('/auth/upload-avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedUser = { ...user, avatar_url: response.data.avatar_url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const data = new FormData();
    data.append('logo', file);

    try {
      const response = await api.post('/auth/upload-company-logo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedUser = { ...user, company_logo_url: response.data.company_logo_url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload company logo.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await api.put('/auth/profile', form);
      const updatedUser = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'R';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isProfileIncomplete = !form.company_name || !form.company_origin;

  return (
    <div className="page" style={{ background: 'var(--bg)' }}>
      <div className="container-md">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-flat" 
          style={{ padding: '3rem' }}
        >
          
          <div style={{ marginBottom: '3rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', background: 'var(--surface-3)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>🏢 Company Profile</span>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>Recruiter Branding</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>Manage your employer brand, corporate logo, and location details.</p>
          </div>

          {isProfileIncomplete && (
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1rem 1.25rem', borderRadius: 12, color: 'var(--warning)', fontSize: '0.875rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>⚠️</span>
              Profile incomplete. Please fill out your company name and headquarters location.
            </div>
          )}

          {/* Identity Section: Avatar + Logo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem', padding: '2rem', background: 'var(--surface-2)', borderRadius: 20, border: '1px solid var(--border)' }}>
            
            {/* Personal Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div 
                onClick={() => avatarInputRef.current.click()}
                style={{
                  width: '88px', height: '88px', borderRadius: '50%', background: 'var(--surface-3)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden',
                  marginBottom: '1rem', position: 'relative', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {isUploadingAvatar ? (
                  <div style={{ width: '24px', height: '24px', border: '2px solid var(--text-muted)', borderTopColor: 'var(--text-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : user.avatar_url ? (
                  <img src={`${API_BASE}${user.avatar_url}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{getInitials(user.full_name)}</span>
                )}
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{user.full_name || 'Recruiter'}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Recruiter Avatar</div>
              <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
            </div>

            {/* Company Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div 
                onClick={() => logoInputRef.current.click()}
                style={{
                  width: '88px', height: '88px', borderRadius: 20, background: 'var(--surface-3)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden',
                  marginBottom: '1rem', position: 'relative', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {isUploadingLogo ? (
                  <div style={{ width: '24px', height: '24px', border: '2px solid var(--text-muted)', borderTopColor: 'var(--text-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : user.company_logo_url ? (
                  <img src={`${API_BASE}${user.company_logo_url}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.75rem' }}>🏢</span>
                )}
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{form.company_name || 'Company Brand'}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Official Logo</div>
              <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" style={{ display: 'none' }} />
            </div>

          </div>

          {/* Form Details */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="label">Company Name *</label>
              <input 
                required 
                className="input" 
                value={form.company_name} 
                onChange={e => setForm({ ...form, company_name: e.target.value })} 
                placeholder="e.g. Microsoft Corporation" 
              />
            </div>

            <div>
              <label className="label">Company Origin / Headquarters *</label>
              <input 
                required 
                className="input" 
                value={form.company_origin} 
                onChange={e => setForm({ ...form, company_origin: e.target.value })} 
                placeholder="e.g. Redmond, WA, USA" 
              />
            </div>

            <div>
              <label className="label">Company Website (Optional)</label>
              <input 
                type="url"
                className="input" 
                value={form.company_website} 
                onChange={e => setForm({ ...form, company_website: e.target.value })} 
                placeholder="https://microsoft.com" 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '1rem' }}>
              <AnimatePresence>
                {saveStatus === 'success' && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0 }} 
                    style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9375rem' }}
                  >
                    ✓ Changes saved
                  </motion.span>
                )}
              </AnimatePresence>
              <button type="submit" disabled={isSaving} className="btn btn-primary btn-lg" style={{ padding: '0.875rem 2rem', fontWeight: 600 }}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>

        </motion.div>

      </div>
    </div>
  );
}
