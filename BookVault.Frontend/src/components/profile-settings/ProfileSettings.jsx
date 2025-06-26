import React, { useEffect, useState } from 'react';
import styles from './profilesettings.module.css';
import { useUser } from '../../context/UserContext';
import ProfilePicSelectorModal from '../profile-picture-select-modal/ProfilePicSelectorModal';
import { IoCloseCircleSharp } from "react-icons/io5";
import { convertUserImageToBase64 } from '../../utils/convertUserImageToBase64';
import PasswordInput from '../password-input/PasswordInput';

export default function ProfileSettings() {
  const { user, refreshUser } = useUser(); 

  const [errors, setErrors] = useState({});
  const [profileImgData, setProfileImgData] = useState("");
  const [locallyUploadedProfileImg, setLocallyUploadedProfileImg] = useState("");
  const [fileName, setFileName] = useState("");

  const userPasswordUpdateMessageElement = document.querySelector(".user-password-update-message");
  
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        userName: user.userName || '',
        email: user.email || '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
      const profilePictureUrl = convertUserImageToBase64(user);
      setProfileImgData(profilePictureUrl);
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
    data.append('CurrentPassword', formData.currentPassword?.trim() || '');

    if (profileImgData) {
      const imageBlob = await fetch(profileImgData).then(r => r.blob());
      data.append('ProfilePicture', imageBlob, fileName);
    } 

    try {
      const res = await fetch('https://localhost:7157/api/Auth/update-profile', {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });
      const updatedData = await res.json();

      if(!updatedData.message) {
        let errorMessages = "<div><span style='font-size: 15px;'>Attention:</span></div> <ul>"
        updatedData.errors.forEach(error=> {
          errorMessages += "<li>"+error.description + "</li>"
        })

        errorMessages += "</ul>"
        userPasswordUpdateMessageElement.innerHTML = errorMessages;
      }

      if (res.ok) {
        alert('Profile updated!');
        userPasswordUpdateMessageElement.innerHTML = '';
        await refreshUser(); // Refresh context
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
          <label className={styles.label}>Username <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            placeholder="Username"
            onChange={handleChange}
            className={styles.input}
            required
          />

          <label className={styles.label}>Email <span style={{ color: 'red' }}>*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className={styles.input}
            required
          />

          <label className={styles.label}>Current Password <span style={{ color: 'red' }}>*</span></label>
          <PasswordInput
            name="currentPassword"
            value={formData.currentPassword || ''}
            onChange={handleChange}
            placeholder="Current Password"
            className={styles.input}
          />

          <label className={styles.label}>New Password</label>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password"
            className={styles.input}
          />

          <label className={styles.label}>Confirm Password</label>
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
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
          <p className={`user-password-update-message message`}></p>
        </form>
      </div>
    </div>
  );
}
