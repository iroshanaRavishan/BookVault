const API_URL = "https://localhost:7157/api/Appearance";

export const getAppearance = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json" 
    },
  });

  if (!response.ok) 
    throw new Error("Failed to fetch appearance settings");

  return response.json();
};

export const createAppearance = async (payload) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create appearance settings");
  }

  return response.json();
};

export const updateAppearance = async (payload) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
