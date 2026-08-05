import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <div className="page hero-gradient">
      <div className="container-md">
        
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>🏢 Company Profile</span>
            <h1 style={{ fontSize: '2.25rem', color: '#ffffff' }}>Recruiter Branding</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your employer brand, corporate logo, and location details.</p>
          </div>

          {isProfileIncomplete && (
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem 1.25rem', borderRadius: 16, color: '#fbbf24', fontSize: '0.875rem', marginBottom: '2rem' }}>
              ⚠️ Profile incomplete. Please fill out your company name and headquarters location.
            </div>
          )}

          {/* Identity Section: Avatar + Logo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
            
            {/* Personal Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div 
                onClick={() => avatarInputRef.current.click()}
                style={{
                  width: '84px', height: '84px', borderRadius: '50%', background: '#07080c', border: '2px solid #10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden',
                  marginBottom: '0.75rem', position: 'relative'
                }}
              >
                {isUploadingAvatar ? (
                  <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : user.avatar_url ? (
                  <img src={`${API_BASE}${user.avatar_url}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{getInitials(user.full_name)}</span>
                )}
              </div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{user.full_name || 'Recruiter'}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Recruiter Avatar</div>
              <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
            </div>

            {/* Company Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div 
                onClick={() => logoInputRef.current.click()}
                style={{
                  width: '84px', height: '84px', borderRadius: 16, background: '#07080c', border: '2px solid #06b6d4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden',
                  marginBottom: '0.75rem', position: 'relative'
                }}
              >
                {isUploadingLogo ? (
                  <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#06b6d4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : user.company_logo_url ? (
                  <img src={`${API_BASE}${user.company_logo_url}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.75rem' }}>🏢</span>
                )}
              </div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{form.company_name || 'Company Brand'}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Official Logo</div>
              <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" style={{ display: 'none' }} />
            </div>

          </div>

          {/* Form Details */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '1rem' }}>
              {saveStatus === 'success' && <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.875rem' }}>✓ Company details saved!</span>}
              <button type="submit" disabled={isSaving} className="btn btn-primary btn-lg" style={{ borderRadius: 14 }}>
                {isSaving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
