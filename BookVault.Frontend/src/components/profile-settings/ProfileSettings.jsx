import React, { useEffect, useState } from 'react';
import styles from './profilesettings.module.css';
import { useUser } from '../../context/UserContext';

export default function ProfileSettings() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        userName: user.userName || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        profilePicture: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match validation
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }

    const data = new FormData();
    data.append('Name', formData.name);
    data.append('UserName', formData.userName);
    data.append('Email', formData.email);
    if (formData.password) {
      data.append('Password', formData.password);
    }
    if (formData.profilePicture) {
      data.append('ProfilePicture', formData.profilePicture);
    }

    try {
      const res = await fetch('https://yourapi.com/api/users/update-profile', {
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Bearer YOUR_TOKEN_HERE`,
        },
      });

      if (res.ok) {
        alert('Profile updated!');
        // You can optionally update context here
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.pageTitle}>Update Profile</h2>
          <p className={styles.subtitle}>Edit your details</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            placeholder="Username"
            onChange={handleChange}
            className={styles.input}
            required
          />

          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className={styles.input}
            required
          />

          <label className={styles.label}>New Password</label>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />

          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}
