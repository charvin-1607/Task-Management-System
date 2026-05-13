const BASE_URL = "http://localhost:8005/api/auth";

//  Signup API
export const signupAPI = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
      const data = await res.json();
      console.log("in signup function = ",data);
  
      return data;
  
  } catch (error) {
    console.error("Signup API error:", error);
    throw new Error(error.message || "Something went wrong during signup");
    
  }
}

//  Login API
export const loginAPI = async (email,password) => {

  try {
    
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // for cookie 
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("in login function = ",data);
  
    return data;

  } catch (error) {
    console.error("Login API error:", error);
    throw new Error(error.message || "Something went wrong during login");
    
  }
}
 

//  Logout API
export const logoutAPI = async () => {
  try {
    const res = await fetch(
      "http://localhost:8005/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    return await res.json();
  } catch (error) {
    return { success: false, message: "Logout failed" };
  }
};

// // Check Auth API get me route
// export const getMeAPI = async () => {
//   try {
//     const res = await fetch("http://localhost:8005/api/auth/me", {
//       credentials: "include", // IMPORTANT
//     });

//     return await res.json();
//   } catch (error) {
//     return { success: false };
//   }
// };