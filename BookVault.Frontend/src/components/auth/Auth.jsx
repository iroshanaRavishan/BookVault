import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './auth.module.css';
import ProfilePicSelectorModal from '../profile-picture-select-modal/ProfilePicSelectorModal';
import { IoCloseCircleSharp } from "react-icons/io5";

export default function Auth() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  
  const [loginFormData, setLoginFormData] = useState({
    Email:'',
    Password:''
  });

  const [regFormData, setRegFormData] = useState({
    Email: "",
    Name: "",
    PasswordHash: "",
    UserName: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoding, setIsLoading] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [profileImgData, setProfileImgData] = useState("");
  const [locallyUploadedProfileImg, setLocallyUploadedProfileImg] = useState("");
  const [fileName, setFileName] = useState("");

  const validationErrors = {};
  const loginMessageElement = document.querySelector(".login-message");
  const regMessageElement = document.querySelector(".reg-message");
  
  // here, it does not ask an already logged in user to the login over and over again
  useEffect(()=>{
    const userEmail = localStorage.getItem("userEmail");
    if(userEmail) {
      navigate('/'); // navigating to the home page if the user is there.
    }
        // Disable scroll when the component is mounted
        document.body.style.overflow = 'hidden';

        // Cleanup function to enable scroll when the component is unmounted
        return () => {
          document.body.style.overflow = 'auto';
        };
  }, []);

  function handleModelProfileImgData(data) {
    setProfileImgData(data);
    setErrors(prevErrors => ({ ...prevErrors, ProfilePicture: "" })); // Clear the validation error
  };

  function handleCloseSelectedImage () {
    setLocallyUploadedProfileImg("")
    setProfileImgData("");
    setFileName("");
  }

  function handleLoginChange(e){
    const {name, value} = e.target;
    setLoginFormData({
      ...loginFormData, [name] : value
    });
  }

  function handleRegChange(e){
    const {name, value} = e.target;
    setRegFormData({
      ...regFormData, [name] : value
    });
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  function deactivateContainer() {
    setFormActive(true);
    setErrors({})
    loginMessageElement.innerHTML = '';
  }

  function activateContainer() {
    setFormActive(false);
    setErrors({})
    regMessageElement.innerHTML = '';
  }

  async function loginHandler(e){
    e.preventDefault();  
    setIsLoading(true);

    if(!loginFormData.Email.trim()){
      validationErrors.Email = "Email is required!";
    } else if (!validateEmail(loginFormData.Email)) {
      validationErrors.Email = 'Email is not valid!';
    }

    if(!loginFormData.Password.trim()) {
      validationErrors.Password = "Password is required!";
    }

    setErrors(validationErrors);

    console.log("login data before send", loginFormData);
    if (Object.keys(validationErrors).length === 0) {
      const response = await fetch("https://localhost:7157/api/Auth/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(loginFormData),
        headers: {
          "content-type": "Application/json",
          "Accept": "application/json"
        }
      });

      const data = await response.json();
      if (data.isSuccess == true) {
        setIsLoading(false);
      }

      if(data.message) {
        let errorMessages = "<div><span style='font-size: 15px;'>Attention:</span></div> <ul>";
        errorMessages += "<li>" + data.message + "</li></ul>";
        loginMessageElement.innerHTML = errorMessages;
      }
  
      console.log("login status: ", data);
  
      if(response.ok) {
        localStorage.setItem("userEmail", loginFormData.Email);
        navigate('/');
      }
    }else {
      loginMessageElement.innerHTML = '';
    }
    setIsLoading(false);
  }

  async function registerHandler(e){
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = {};
    if(!regFormData.Name.trim()) {
      validationErrors.Name = "Name is required!";
    } else if (regFormData.Name.length < 4) {
      validationErrors.Name = "Minimum character length is 4!";
    }

    if(!regFormData.Email.trim()){
      validationErrors.Email = "Email is required!";
    } else if (!validateEmail(regFormData.Email)) {
      validationErrors.Email = 'Email is not valid!';
    }

    if(!regFormData.PasswordHash.trim()) {
      validationErrors.PasswordHash = "Password is required!";
    }

    if(!profileImgData) {
      validationErrors.ProfilePicture = "Required field!";
    }

    // creating the user name
    const newUserName = regFormData.Name.trim().split(" ");
    regFormData.UserName = newUserName.join("");

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append('Name', regFormData.Name);
      formData.append('Email', regFormData.Email);
      formData.append('UserName', regFormData.UserName);
      formData.append('Password', regFormData.PasswordHash);
  
      if (profileImgData) {
        const imageBlob = await fetch(profileImgData).then(r => r.blob());
        formData.append('ProfilePicture', imageBlob, fileName);
      } 
      
      console.log('data before submit', formData)
      const response = await fetch("https://localhost:7157/api/Auth/register", {
        method: "POST",
        credentials: 'include',
        body: formData
      })

      const data = await response.json();

      if (data.isSuccess == true) {
        setIsLoading(false);
      }

      if(response.ok) {
        activateContainer();
      }

      if(!data.message) {
        let errorMessages = "<div><span style='font-size: 15px;'>Attention:</span></div> <ul>"
        data.errors.forEach(error=> {
          errorMessages += "<li>"+error.description + "</li>"
        })

        errorMessages += "</ul>"
        regMessageElement.innerHTML = errorMessages;
      }
      console.log("register status: ", data);
    } else {
      regMessageElement.innerHTML = '';
    }
    setIsLoading(false);
  }

  return (
      <div className={styles.mainContainer}>
        <div className={formActive ? `${styles.container} ${styles.active}` : `${styles.container}`}>
          <div className={`${styles.formContainer} ${styles.signIn}`}> 
            <form action="#" className={styles.form} onSubmit={loginHandler}>
              <h1>Sign In</h1>
              <input type="text" name="Email" placeholder='example@hello.com' onChange={handleLoginChange} />
              {errors.Email && <span className={styles.errorMessage}>{errors.Email}</span>}<br />

              <input type="password" name="Password" placeholder="******" onChange={handleLoginChange} />
              {errors.Password && <span className={styles.errorMessage}>{errors.Password}</span>}
              <br />
              
              <button type="submit" disabled={isLoding}>
                { isLoding?
                  <div className={styles.loadingSpinner}></div> : 
                  "Login" 
                }
              </button>
              <p className={`login-message message`}></p>
            </form>
          </div>
          <div className={`${styles.formContainer} ${styles.signUp}`}> 
            <form action="#" className={styles.form} onSubmit={registerHandler} autoComplete="off">
              <h1>Create Account</h1>
              <input type="text" name="Name" id="name" placeholder="Enter your name" onChange={handleRegChange}  />
              {errors.Name && <span className={styles.errorMessage}>{errors.Name}</span>}<br />

              <input type="text" name="Email" id="email" placeholder="example@hello.com" onChange={handleRegChange}  />
              {errors.Email && <span className={styles.errorMessage}>{errors.Email}</span>}<br />

              <input type="password" name="PasswordHash" id="password" placeholder="******" onChange={handleRegChange} />
              {errors.PasswordHash && <span className={styles.errorMessage}>{errors.PasswordHash}</span>} <br />

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
              <button type="submit" disabled={isLoding}>
                { isLoding?
                  <div className={styles.loadingSpinner}></div>
                  : "Register" }
              </button>
              <p className={`reg-message message`}></p>
            </form>
          </div>
          <div className={styles.toggleContainer}>
            <div className={styles.toggle}>
              <img src="../src/assets/book-stack.png" className={styles.authBackground} alt="book background" />
              <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features. Enter your personal details to use all of site features</p>
                <button className={ isLoding ? `${styles.loading}` : `${styles.hidden}`} disabled={isLoding} onClick={activateContainer}> Sign In </button>
              </div>

              <div className={`${styles.togglePanel} ${styles.toggleRight}`} style={{ color: "black" }}>
                <h1>Hello, Friend!</h1>
                <p>Register with your personal details to use all of site features</p>
                  <button  className={ isLoding ? `${styles.loading}` : `${styles.hidden}`} disabled={isLoding} onClick={deactivateContainer} > Sign Up </button>
                </div>
            </div>
          </div>
        </div>
      </div>
  )
}
