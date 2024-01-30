import { ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

interface MyComponentProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<MyComponentProps> = ({ children }) => {
  const [isValid, setIsValid] = useState(false);
  const token = localStorage.getItem("token");

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
          return setIsValid(false);
        }
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      }
    };
    init();
  }, [token]);

  if (!isValid) {
    return <h1>sorry you are not signed in</h1>;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
