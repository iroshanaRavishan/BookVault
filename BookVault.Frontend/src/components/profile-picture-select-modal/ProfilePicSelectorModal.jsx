import React, { useEffect, useRef, useState } from 'react'
import styles from './profilepicselectormodal.module.css'
import { IoCloseCircleSharp } from "react-icons/io5";

export default function ProfilePicSelectorModal({ onDataSend, setLocallyUploadedProfileImg, locallyUploadedProfileImg, fileName, setFileName }) {

  const [isPicModelVisible, setIsPicModelVisible] = useState(false);
  const modalRef = useRef();
  const [images, setImages] = useState([]);
  const [loadingErrr, setLoadingError] = useState("");

  useEffect(() => {
    fetch(`https://localhost:7157/api/DefaultUserProfilePicture/all-with-data`, {
        method: "GET",
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to retrieve images');
        }
        return response.json();
    })
    .then(data => {
        const imageList = data.map(image => {
            const imageUrl = `data:${image.contentType};base64,${image.base64Image}`;
            return { id: image.id, url: imageUrl, imageName: image.fileName };
        });
        setImages(imageList);
        setLoadingError("");
    })
    .catch(err => {
        console.error("Error fetching images:", err);
        setLoadingError("Something went wrong in loading avatars!");
    });
  }, []);

  const handleOpen = () => setIsPicModelVisible(true);
  const handleClose = () => setIsPicModelVisible(false);

  function closeModal(e) {
    if(modalRef.current === e.target){
        handleClose();
    }
  }

  function sendDataToParentFromServer(image) {
    const newProfileImg = image.url;
    onDataSend(newProfileImg);
    setLocallyUploadedProfileImg("");
    setFileName(image.imageName)
    handleClose();
  }

  function sendDataToParentFromLocal() {
    if (locallyUploadedProfileImg) {
      onDataSend(locallyUploadedProfileImg);
      handleClose(); 
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (loadEvent) {
        const uploadedImage = loadEvent.target.result;
        setLocallyUploadedProfileImg(uploadedImage);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    }
  }

  function handleCloseSelectedImage () {
    setLocallyUploadedProfileImg("");
    setFileName("");
  }

  return (
      <div>
          <span onClick={handleOpen} className={styles.openBtn}>Profile Picture?</span>
          { isPicModelVisible && (
              <div className={styles.popupOverlay} ref={modalRef} onClick={closeModal}>
                  <div className={styles.popupContent}>
                      <IoCloseCircleSharp size={30} onClick={handleClose} className="closeBtn"/>

                      <h3 style={{paddingLeft: "10px"}}>Select your Avatar</h3>
                      { loadingErrr ?
                          <div className={styles.lostConnectionInLoadingAvatars}>
                              <img src="./src/assets/disconnected.png" alt="diconnected" className={styles.diconnectedPicture} />
                              <span className='disabled-text'>{loadingErrr}</span> 
                          </div>
                        :
                          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
                              {images.map(image => (
                                  <div key={image.id} >
                                      <img src={image.url} alt={`Image ${image.id}`} className='profile-picture' onClick={() => sendDataToParentFromServer(image)} />
                                  </div>
                              ))}
                          </div>
                      }

                      <span className={styles.avatarSeparator}>or</span>

                      <div className={styles.fileUploader}>
                        {(!fileName && !locallyUploadedProfileImg) && (
                        <>
                          <label htmlFor="fileUpload" className={styles.chooseBtn}> Choose Image</label>
                          <input type="file" id="fileUpload" accept="image/*" className={styles.fileInput} onChange={handleFileUpload} />
                        </>
                        )}
                        {(fileName && locallyUploadedProfileImg) && (
                            <label className={`${styles.chooseBtn} ${styles.blinkingImage}`} onClick={sendDataToParentFromLocal} >Select</label>
                        )}


                        { locallyUploadedProfileImg ? 
                          <div className='selectedImageContainer'>
                              <IoCloseCircleSharp size={20} className='cancel-profile-picture' color="#e53e3e" onClick={handleCloseSelectedImage}/>
                              <img className="profile-picture" src={locallyUploadedProfileImg} alt="profile-avatar" />
                          </div> : 
                          <div className='selectedImageContainer'>
                            <IoCloseCircleSharp size={20} className='cancel-profile-picture' color='#9d9d9d' onClick={handleCloseSelectedImage}/>
                            <img className="profile-picture" src="./src/assets/sample-user.png" alt="profile-avatar"/>
                          </div>
                        }
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
}
