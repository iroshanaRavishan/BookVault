const API_URL = "https://localhost:7157/api/Appearance";

export const getAppearance = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};