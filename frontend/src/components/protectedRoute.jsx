import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { atomLoadingState } from "../../store/atomLoading";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(false);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useRecoilState(atomLoadingState);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/v1/user/bulk?filter",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const resData = await res.json();
        if (!resData.success) {
          setIsLoading({ loading: false });
          return setIsValid(false);
        }
        setIsValid(true);
        setIsLoading({ loading: false });
      } catch (error) {
        setIsValid(false);
      }
    };
    init();
  }, [token, setIsLoading]);

  if (isLoading.loading) {
    return <h1>Loading...</h1>;
  }

  if (!isValid) {
    return <h1>sorry you are not signed in</h1>;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
