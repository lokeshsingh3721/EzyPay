export const userDetails = async (URL: string, token: string | null) => {
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
