import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Building, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const API_BASE = 'http://localhost:8000';
const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };

export default function RecruiterProfile() {
    const [user, setUser] = useState(getUser());
    const [formData, setFormData] = useState({
        company_name: '',
        company_origin: '',
        company_website: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const avatarInputRef = useRef(null);
    const logoInputRef = useRef(null);
    
    useEffect(() => {
        if (user) {
            setFormData({
                company_name: user.company_name || '',
                company_origin: user.company_origin || '',
                company_website: user.company_website || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await api.put('/auth/profile', formData);
            if (res.data) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                showToast('Profile updated successfully', 'success');
            }
        } catch (error) {
            showToast('Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('avatar', file);
        try {
            const res = await api.post('/auth/upload-avatar', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.avatar_url) {
                const updatedUser = { ...user, avatar_url: res.data.avatar_url };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                showToast('Avatar updated', 'success');
            }
        } catch (err) {
            showToast('Avatar upload failed', 'error');
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('logo', file);
        try {
            const res = await api.post('/auth/upload-company-logo', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.company_logo_url) {
                const updatedUser = { ...user, company_logo_url: res.data.company_logo_url };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                showToast('Company logo updated', 'success');
            }
        } catch (err) {
            showToast('Company logo upload failed', 'error');
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const isIncomplete = !formData.company_name || !formData.company_origin;

    const styles = {
        container: { maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'Inter, sans-serif' },
        banner: {
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            padding: '1rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            fontWeight: 500
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            padding: '2rem',
            marginBottom: '2rem'
        },
        identitySection: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '2rem',
            marginBottom: '2rem'
        },
        avatars: {
            display: 'flex',
            gap: '3rem',
            justifyContent: 'center'
        },
        uploadZone: {
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
            backgroundColor: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        avatarZone: {
            width: '120px',
            height: '120px',
            borderRadius: '50%'
        },
        logoZone: {
            width: '120px',
            height: '120px',
            borderRadius: '1rem'
        },
        overlay: {
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s',
            color: 'white'
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        infoRow: {
            textAlign: 'center'
        },
        name: { fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' },
        email: { color: '#6B7280', margin: '0.25rem 0' },
        badge: {
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#DBEAFE',
            color: '#1D4ED8',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginTop: '0.5rem'
        },
        formGroup: { marginBottom: '1.5rem' },
        label: { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' },
        input: {
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #D1D5DB',
            outline: 'none',
            fontSize: '1rem',
            transition: 'border-color 0.2s, box-shadow 0.2s'
        },
        button: {
            backgroundColor: '#2563EB',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            transition: 'background-color 0.2s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        toast: {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 50
        }
    };

    if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in to view this page.</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={styles.container}
        >
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#111827' }}>Recruiter Profile</h1>
            
            {isIncomplete && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={styles.banner}>
                    <AlertCircle size={20} />
                    <span>Profile Incomplete. Please fill in your company name and origin to fully utilize the platform.</span>
                </motion.div>
            )}

            <div style={styles.card}>
                <div style={styles.identitySection}>
                    <div style={styles.avatars}>
                        {/* Avatar */}
                        <div>
                            <div style={{...styles.uploadZone, ...styles.avatarZone}} 
                                 onClick={() => avatarInputRef.current?.click()}
                                 onMouseEnter={(e) => e.currentTarget.lastChild.style.opacity = '1'}
                                 onMouseLeave={(e) => e.currentTarget.lastChild.style.opacity = '0'}
                            >
                                {user.avatar_url ? (
                                    <img src={`${API_BASE}${user.avatar_url}`} alt="Avatar" style={styles.image} />
                                ) : (
                                    <span style={{ fontSize: '2rem', fontWeight: 600, color: '#9CA3AF' }}>
                                        {user.name?.charAt(0) || 'U'}
                                    </span>
                                )}
                                <div style={{...styles.overlay}}><Camera size={24} /></div>
                            </div>
                            <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
                            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>Avatar</div>
                        </div>

                        {/* Company Logo */}
                        <div>
                            <div style={{...styles.uploadZone, ...styles.logoZone}} 
                                 onClick={() => logoInputRef.current?.click()}
                                 onMouseEnter={(e) => e.currentTarget.lastChild.style.opacity = '1'}
                                 onMouseLeave={(e) => e.currentTarget.lastChild.style.opacity = '0'}
                            >
                                {user.company_logo_url ? (
                                    <img src={`${API_BASE}${user.company_logo_url}`} alt="Company Logo" style={styles.image} />
                                ) : (
                                    <Building size={48} color="#9CA3AF" />
                                )}
                                <div style={{...styles.overlay}}><Upload size={24} /></div>
                            </div>
                            <input type="file" ref={logoInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleLogoUpload} />
                            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>Company Logo</div>
                        </div>
                    </div>

                    <div style={styles.infoRow}>
                        <h2 style={styles.name}>{user.name}</h2>
                        <p style={styles.email}>{user.email}</p>
                        <span style={styles.badge}>{user.role || 'Recruiter'}</span>
                    </div>
                </div>

                <form onSubmit={handleSave}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#111827' }}>Company Details</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Company Name *</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Enter your company name"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Company Origin/HQ *</label>
                        <input
                            type="text"
                            name="company_origin"
                            value={formData.company_origin}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="e.g. San Francisco, CA"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Company Website</label>
                        <input
                            type="url"
                            name="company_website"
                            value={formData.company_website}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="https://example.com"
                        />
                    </div>
                    
                    <motion.button 
                        whileHover={{ backgroundColor: '#1D4ED8' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        style={styles.button}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Profile'}
                    </motion.button>
                </form>
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        style={{
                            ...styles.toast,
                            backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'
                        }}
                    >
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
