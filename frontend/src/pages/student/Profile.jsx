import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';
const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };

const Profile = () => {
  const [user, setUser] = useState(getUser() || {});
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: user.bio || '',
    phone: user.phone || '',
    linkedinUrl: user.linkedin_url || '',
    githubUrl: user.github_url || '',
    skills: user.skills ? (typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills) : [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => setUser(getUser() || {});
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAvatarClick = () => fileInputRef.current.click();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      // Mocking save if API isn't ready, but let's try calling it
      // await api.put('/auth/profile-student', formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
      
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Mocking resume upload status (can derive from user object if available)
  const hasResume = user.resume_url ? true : false;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'Inter, sans-serif', color: '#1f2937' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}
      >
        {/* Cover / Header */}
        <div style={{ height: '160px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-50px', left: '40px' }}>
            <div 
              onClick={handleAvatarClick}
              style={{ 
                width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#fff', 
                border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              {isUploadingAvatar && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                   <div style={{ width: '24px', height: '24px', border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
              )}
              {user.avatar_url ? (
                <img src={`${API_BASE}${user.avatar_url}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9ca3af' }}>
                  {getInitials(user.name || user.full_name)}
                </span>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
          </div>
        </div>

        <div style={{ padding: '40px 40px 40px 160px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#111827' }}>
              {user.name || user.full_name || 'Student Name'}
            </h1>
            <p style={{ color: '#6b7280', margin: '0 0 0.75rem 0' }}>{user.email || 'student@example.com'}</p>
            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user.role || 'Student'}
            </span>
          </div>
        </div>

        <div style={{ padding: '0 40px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            
            {/* Main Form Fields */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>About Me</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a short bio about yourself..."
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', resize: 'vertical', minHeight: '120px', fontFamily: 'inherit', fontSize: '0.95rem', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Phone Number</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>LinkedIn URL</label>
                  <input 
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>GitHub URL</label>
                  <input 
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Skills</label>
                <div style={{ padding: '1rem', border: '1px solid #d1d5db', borderRadius: '12px', backgroundColor: '#f9fafb' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: formData.skills.length > 0 ? '1rem' : '0' }}>
                    <AnimatePresence>
                      {formData.skills.map((skill) => (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={skill} 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#3b82f6', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '500' }}
                        >
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, marginLeft: '4px', display: 'flex', alignItems: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <input 
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type a skill and press Enter..."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Resume Status */}
              <div style={{ marginBottom: '2.5rem', padding: '1.5rem', borderRadius: '16px', border: hasResume ? '1px solid #bbf7d0' : '1px solid #fed7aa', backgroundColor: hasResume ? '#f0fdf4' : '#fff7ed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: hasResume ? '#166534' : '#9a3412', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {hasResume ? (
                      <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Resume Uploaded</>
                    ) : (
                      <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> No Resume Found</>
                    )}
                  </h3>
                  <p style={{ color: hasResume ? '#15803d' : '#c2410c', margin: 0, fontSize: '0.875rem' }}>
                    {hasResume ? 'Your resume is ready for applications and AI analysis.' : 'Upload a resume to get AI analysis and apply for jobs.'}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/student/resume')}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: hasResume ? '#fff' : '#ea580c', color: hasResume ? '#166534' : '#fff', border: hasResume ? '1px solid #bbf7d0' : 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: hasResume ? 'none' : '0 4px 6px -1px rgba(234, 88, 12, 0.2)' }}
                >
                  {hasResume ? 'View Analysis' : 'Upload Resume'}
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
                {saveStatus === 'success' && (
                  <span style={{ color: '#10b981', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Saved successfully
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span style={{ color: '#ef4444', fontWeight: '500' }}>Failed to save.</span>
                )}
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  style={{ 
                    padding: '0.75rem 2rem', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '10px', 
                    border: 'none', 
                    fontWeight: '600', 
                    fontSize: '1rem', 
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 4px 14px 0 rgba(59,130,246,0.39)'
                  }}
                >
                  {isSaving ? (
                    <>
                      <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Profile;
