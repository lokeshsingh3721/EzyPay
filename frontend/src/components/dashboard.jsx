import { LuLogOut } from "react-icons/lu";
import User from "./user";
import Modal from "./modal";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userDetails } from "../../utility/userDetails";
import { useRecoilState } from "recoil";
import { atomBalanceState } from "../../store/atomBalance";
import { atomLoadingState } from "../../store/atomLoading";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("user");
  const [balance, setBalance] = useRecoilState(atomBalanceState);
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useRecoilState(atomLoadingState);

  const logout = () => {
    localStorage.clear("token");
    navigate("/signin");
  };

  useEffect(() => {
    const init = async () => {
      const firstName = await userDetails(
        "http://localhost:3000/api/v1/user/getUser",
        token
      );
      const balance = await userDetails(
        "http://localhost:3000/api/v1/account/balance",
        token
      );
      const users = await userDetails(
        "http://localhost:3000/api/v1/user/bulk?filter",
        token
      );
      setFirstName(firstName.user.firstName);
      setBalance(balance.balance);
      setUsers(users.user);
      setIsLoading(false);
    };

    init();
  }, [token]);

  if (isLoading) {
    return <h1>loading...</h1>;
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <nav className="flex justify-between p-5 border-b-2">
          <h1 className="font-bold text-xl">Payments App </h1>
          <div className="flex justify-center items-center gap-3">
            <p>
              Hello,
              {firstName.charAt(0).toUpperCase() +
                firstName.slice(1).toLowerCase()}
            </p>
            <button
              className="hover:cursor-pointer p-1 bg-black text-white  rounded-md "
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </nav>
        <Modal />

        <div className="px-5 flex flex-col gap-4 ">
          <p className="font-bold text-base">Your Balance ₹{balance}</p>
          <p className="font-bold text-base">Users</p>
          <input
            type="text"
            placeholder="Search users..."
            className="border-[1px] outline-none w-full py-1 pl-2 "
          />
          <div className="flex  flex-col gap-3">
            {users.map((user) => {
              if (user.firstName != firstName)
                return <User key={user._id} user={user} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
