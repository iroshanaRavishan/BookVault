import React, { useEffect, useState } from 'react';
import styles from './profilesettings.module.css';
import { useUser } from '../../context/UserContext';
import ProfilePicSelectorModal from '../profile-picture-select-modal/ProfilePicSelectorModal';
import { IoCloseCircleSharp } from "react-icons/io5";
import { convertUserImageToBase64 } from '../../utils/convertUserImageToBase64';

export default function ProfileSettings() {
  const { user } = useUser();

  const [errors, setErrors] = useState({});
  const [profileImgData, setProfileImgData] = useState("");
  const [locallyUploadedProfileImg, setLocallyUploadedProfileImg] = useState("");
  const [fileName, setFileName] = useState("");
  
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
      const profilePictureUrl = convertUserImageToBase64(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  function handleModelProfileImgData(data) {
    setProfileImgData(data);
    setErrors(prevErrors => ({ ...prevErrors, ProfilePicture: "" })); // Clear the validation error
  };

  function handleCloseSelectedImage () {
    setLocallyUploadedProfileImg("")
    setProfileImgData("");
    setFileName("");
  }

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
      const res = await fetch('https://localhost:7157/api/Auth/update-profile', {
        method: 'PUT',
        body: data,
        credentials: 'include',
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
          <div className={styles.selectingProfilePic}>
            <ProfilePicSelectorModal 
              onDataSend={handleModelProfileImgData} 
              setLocallyUploadedProfileImg={setLocallyUploadedProfileImg} 
              locallyUploadedProfileImg={locallyUploadedProfileImg} 
              fileName={fileName} 
              setFileName={setFileName}
            />

            { errors.ProfilePicture && <span className={styles.errorMessage} style={{marginLeft: "10px"}}>{errors.ProfilePicture}</span> } 
            { profileImgData && 
              <div className='selectedImageContainer'>
                <IoCloseCircleSharp size={20} className='cancel-profile-picture' color="#e53e3e" onClick={handleCloseSelectedImage}/>
                <img className="profile-picture"  src={profileImgData} alt="select-profile" /> 
              </div>
            } 
          </div>

          <button type="submit" className={styles.submitButton}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}
