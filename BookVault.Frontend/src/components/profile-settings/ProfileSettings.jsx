import React, { useState } from 'react';
import styles from './profilesettings.module.css';

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData((prev) => ({
        ...prev,
        profilePicture: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated!');
    console.log(formData);
    // Here you can handle file upload and save logic
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.pageTitle}>Profile Settings</h2>
          <p className={styles.subtitle}>Manage your account information</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}
