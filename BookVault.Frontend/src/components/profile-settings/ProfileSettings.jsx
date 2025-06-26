import React, { useEffect, useRef, useState } from 'react';
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

  const userPasswordUpdateMessageElement = useRef(null);
  
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
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

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    // Clear specific error on input
    if (errors[name]) {
      setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }

    // Special case for password mismatch
    if ((name === 'password' || name === 'confirmPassword') && errors.passwordMatch) {
      setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.passwordMatch;
        return updatedErrors;
      });
    }
  };

  function handleModelProfileImgData(data) {
    setProfileImgData(data);
    setErrors(prevErrors => ({ ...prevErrors, profilePicture: "" }));
  };

  function handleCloseSelectedImage () {
    setLocallyUploadedProfileImg("")
    setProfileImgData("");
    setFileName("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if(!formData.userName.trim()) {
      validationErrors.userName = "Username is required!";
    } else if (formData.userName.length < 4) {
      validationErrors.userName = "Minimum character length is 4!";
    }

    if(!formData.email.trim()){
      validationErrors.email = "Email is required!";
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = 'Email is not valid!';
    }

    if(!formData.currentPassword.trim()) {
      validationErrors.currentPassword = "Current Password is required!";
    }

    if(!profileImgData) {
      validationErrors.profilePicture = "Required field!";
    }

    // Password match validation
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        validationErrors.passwordMatch = "Passwords do not match";
      }
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
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
          userPasswordUpdateMessageElement.current.innerHTML = errorMessages;
        }

        if (res.ok) {
          // TODO: need to add proper message upon successful update
          if (userPasswordUpdateMessageElement.current) {
            userPasswordUpdateMessageElement.current.innerHTML = '';
          }
          await refreshUser(); // Refresh context
        } else {
          // TODO: need to add proper message upon fail response
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      if (userPasswordUpdateMessageElement.current) {
        userPasswordUpdateMessageElement.current.innerHTML = '';
      }
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
          <label className={styles.label} style={{marginTop: '0px'}}>Username <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            placeholder="Username"
            onChange={handleChange}
            className={`${styles.input} ${errors.userName? "errorBorder": ''}`} 
          />
          {errors.userName && <span className={"errorMessage"}>{errors.userName}</span>}

          <label className={styles.label}>Email <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className={`${styles.input} ${errors.userName? "errorBorder": ''}`} 
          />
          {errors.email && <span className={"errorMessage"}>{errors.email}</span>}

          <label className={styles.label}>Current Password <span style={{ color: 'red' }}>*</span></label>
          <PasswordInput
            name="currentPassword"
            value={formData.currentPassword || ''}
            onChange={handleChange}
            placeholder="Current Password"
            className={`${styles.input} ${errors.currentPassword? "errorBorder": ''}`} 
          />
          {errors.currentPassword && <span className={"errorMessage"}>{errors.currentPassword}</span>} 
        
          <label className={styles.label}>New Password</label>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password"
             className={`${styles.input} ${(errors.password || errors.passwordMatch)? "errorBorder": ''}`}
          />

          <label className={styles.label}>Confirm Password</label>
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`${styles.input} ${(errors.confirmPassword || errors.passwordMatch)? "errorBorder": ''}`}
          />
          {errors.passwordMatch && <span className={"errorMessage"}>{errors.passwordMatch}</span>}

          <div className={styles.selectingProfilePic} style={ profileImgData ? { margin: '14px 0px' }  : { margin: '40px 0px' } }>
            <ProfilePicSelectorModal 
              onDataSend={handleModelProfileImgData} 
              setLocallyUploadedProfileImg={setLocallyUploadedProfileImg} 
              locallyUploadedProfileImg={locallyUploadedProfileImg} 
              fileName={fileName} 
              setFileName={setFileName}
            />

            { errors.profilePicture && <span className={"errorMessage"} style={{marginLeft: "10px"}}>{errors.profilePicture}</span> } 
            { profileImgData && 
              <div className='selectedImageContainer'>
                <IoCloseCircleSharp size={20} className='cancel-profile-picture' color="#e53e3e" onClick={handleCloseSelectedImage}/>
                <img className="profile-picture"  src={profileImgData} alt="select-profile" /> 
              </div>
            } 
          </div>

          <button type="submit" className={styles.submitButton}>Save Changes</button>
          <p ref={userPasswordUpdateMessageElement} className={`message`}></p>
        </form>
      </div>
    </div>
  );
}
