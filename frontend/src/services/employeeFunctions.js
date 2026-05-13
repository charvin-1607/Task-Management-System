


// GET ALL EMPLOYEES
export const getAllEmployeesAPI = async () => {
  try {
    const res = await fetch("http://localhost:8005/api/employees", {
      credentials: "include",
    });

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error(error.message || "Something went wrong while fetching employees");
  }
};

// DELETE EMPLOYEE
export const deleteEmployeeAPI = async (id) => {
  try {
    const res = await fetch(`http://localhost:8005/api/employees/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error deleting employee:", error);
    throw new Error(error.message || "Something went wrong while deleting the employee");
  }
};

// UPDATE ROLE
export const updateEmployeeAPI = async (id, newData) => {
  try {
    const res = await fetch(`http://localhost:8005/api/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newData),
    });

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error updating employee role:", error);
    throw new Error(error.message || "Something went wrong while updating the employee role");
  }
};


// GET ALL TLs

export const getAllTLAPI = async () => {
  try {
    const res = await fetch(
      "http://localhost:8005/api/employees/get-all-tl",
      {
        credentials: "include",
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching TLs:", error);
    throw new Error(error.message || "Something went wrong while fetching TLs");
  }
};


// assign TL to employee

export const assignTLAPI = async (formData) => {
  try {
    const res = await fetch(
      "http://localhost:8005/api/employees/assign/tl",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error assigning TL:", error);
    throw new Error(error.message || "Something went wrong while assigning TL");
  }
};


// get tl their team members
export const getMyTeamAPI = async () => {
  try {
    const res = await fetch(
      "http://localhost:8005/api/employees/my-team",
      {
        credentials: "include",
      }
    );

    const data = await res.json();
    return data;

  } catch (error) {
    return { success: false, message: "Error fetching team" };
  }
};


// manager get tl team size

export const getTLTeamSizeAPI = async () => {
  try {
    const res = await fetch(
      "http://localhost:8005/api/employees/tl-team-size",
      {
        credentials: "include",
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: "Error fetching team size" };
  }
};



//get me
export const getMeAPI = async () => {
  try {
    const res = await fetch("http://localhost:8005/api/employees/me", {
      credentials: "include",
    });

    const data = await res.json();
    return data;

  } catch (error) {
    return { success: false, message: "Error fetching user data" };
  }
};


// FORGOT PASSWORD
export const forgotPasswordAPI = async (email) => {
  const res = await fetch("http://localhost:8005/api/employees/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return await res.json();
};

// RESET PASSWORD
export const resetPasswordAPI = async (token, password) => {
  const res = await fetch(
    `http://localhost:8005/api/employees/reset-password/${token}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }
  );

  return await res.json();
};


// change password
export const changePasswordAPI = async (formData) => {

  try {

    const res = await fetch(
      "http://localhost:8005/api/employees/change-password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    return data;

  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };

  }
};