export const userDetails = async (URL, token) => {
  try {
    const res = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    return resData;
  } catch (error) {
    console.log(error);
  }
};
