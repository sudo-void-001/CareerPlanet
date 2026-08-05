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
    skills: user.skills ? (typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills) : ['Python', 'React', 'FastAPI', 'SQL'],
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
      await new Promise(resolve => setTimeout(resolve, 800));
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

  const hasResume = user.resume_url ? true : false;

  return (
    <div className="page hero-gradient">
      <div className="container-md">
        
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          
          {/* Header Banner */}
          <div style={{ height: '160px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ position: 'absolute', bottom: '-44px', left: '2.5rem' }}>
              <div 
                onClick={handleAvatarClick}
                style={{ 
                  width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#07080c', 
                  border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              >
                {isUploadingAvatar && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(7,8,12,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                     <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  </div>
                )}
                {user.avatar_url ? (
                  <img src={`${API_BASE}${user.avatar_url}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                    {getInitials(user.name || user.full_name)}
                  </span>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ padding: '3.5rem 2.5rem 2.5rem 2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {user.name || user.full_name || 'Student Candidate'}
                </h1>
                <p style={{ color: 'var(--text-tertiary)', margin: '0.2rem 0 0.75rem 0', fontSize: '0.90625rem' }}>{user.email || 'student@example.com'}</p>
                <span className="badge badge-green">Candidate Account</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              <div>
                <label className="label">About Me / Bio</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share a short introduction about your background, career goals, and experience..."
                  className="input"
                  style={{ minHeight: '110px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="label">Phone Number</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">LinkedIn Profile URL</label>
                  <input 
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">GitHub Profile URL</label>
                  <input 
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="input"
                  />
                </div>
              </div>

              {/* Skills Tags Section */}
              <div>
                <label className="label">Key Technical Skills</label>
                <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 16, backgroundColor: 'rgba(13, 15, 23, 0.6)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: formData.skills.length > 0 ? '0.875rem' : '0' }}>
                    <AnimatePresence>
                      {formData.skills.map((skill) => (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={skill} 
                          className="badge badge-green"
                          style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
                        >
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', padding: 0, marginLeft: '6px' }}>✕</button>
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
                    className="input"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* Resume Status Box */}
              <div style={{ padding: '1.5rem', borderRadius: 18, border: hasResume ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)', backgroundColor: hasResume ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: hasResume ? '#34d399' : '#fbbf24', margin: '0 0 0.25rem 0' }}>
                    {hasResume ? '✓ Resume Document Uploaded' : '⚠️ No Resume Document Found'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
                    {hasResume ? 'Your PDF resume is attached and active for 1-click job applications.' : 'Upload a resume to run AI ATS analysis and submit job applications.'}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/resume')}
                  className="btn btn-primary"
                  style={{ borderRadius: 12 }}
                >
                  {hasResume ? 'View AI Analysis' : 'Upload Resume'}
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                {saveStatus === 'success' && (
                  <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.875rem' }}>
                    ✓ Profile updated successfully!
                  </span>
                )}
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="btn btn-primary btn-lg"
                  style={{ borderRadius: 14 }}
                >
                  {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
