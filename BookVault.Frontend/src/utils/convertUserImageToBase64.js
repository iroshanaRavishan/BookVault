export function convertUserImageToBase64(user) {
      const profilePictureUrl = user?.profilePicture 
    ? `data:${user.profilePictureContentType};base64,${user.profilePicture}` 
    : null;
    return profilePictureUrl;
}