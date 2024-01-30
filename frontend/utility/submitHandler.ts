export const handleSignUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const apiUrl = "http://localhost:3000/api/v1/user/signup";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        username: email,
        password,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const handleSignIn = async (email: string, password: string) => {
  try {
    const apiUrl = "http://localhost:3000/api/v1/user/signin";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password,
      }),
    });
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};
