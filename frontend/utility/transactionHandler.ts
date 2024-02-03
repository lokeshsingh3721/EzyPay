export const transactionHandler = async (userId: string, balance: number) => {
  try {
    const token = localStorage.getItem("token");
    const apiUrl = "http://localhost:3000/api/v1/account/transfer";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId,
        balance: balance,
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};
