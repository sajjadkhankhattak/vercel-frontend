// Fetch user from localStorage
export const fetchUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;  // No user found
    }

    return JSON.parse(storedUser); // Return stored user
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return null;
  }
};
