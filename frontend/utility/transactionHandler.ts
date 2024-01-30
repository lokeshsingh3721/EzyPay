export const transactionHandler = async (userId: string, balance: number) => {
  try {
    console.log(userId, Number(balance));
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
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error:", error);
  }
};
