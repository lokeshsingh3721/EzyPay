import { CiUser } from "react-icons/ci";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { atomModalDetailsState, modalState } from "../../store/atomModal";
import { IoClose } from "react-icons/io5";
import { transactionHandler } from "../../utility/transactionHandler";
import { useState } from "react";
import { atomBalanceState } from "../../store/atomBalance";

import toast, { Toaster } from "react-hot-toast";

const Modal = () => {
  const { _id, firstName, lastName } = useRecoilValue(atomModalDetailsState);
  const [modal, setModal] = useRecoilState(modalState);
  const [balance, setBalance] = useState("");

  const globalBalance = useSetRecoilState(atomBalanceState);

  const close = () => {
    setModal(false);
    setBalance("");
  };

  const initiateTransfer = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!Number(balance)) {
      return toast("invalid amount");
    }
    let data;

    if (_id && Number(balance)) {
      const amount: number = Number(balance);
      data = await transactionHandler(_id, amount);
    }
    if (data.data.success) {
      toast(`successfully transfered to ${firstName}`);
      globalBalance(data.data.balance);
      close();
    } else {
      toast(`Lower Balance please add money`);
    }
  };

  return (
    <>
      <Toaster />
      <div
        className={`${
          modal
            ? "w-full h-full background-color fixed top-0  border-gray-400 border-[1px] bg-black  z-50"
            : "hidden"
        }`}
      >
        <div className="w-[300px] bg-white  fixed top-1/3 left-1/3  h-[230px] border-solid border-black-400 border-[1px] p-3">
          <div className="flex items-baseline justify-between">
            <h1 className="text-xl font-bold mb-5 ">Send Money</h1>
            <IoClose
              onClick={() => close()}
              className="w-6 h-6 fill-current hover:cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <CiUser className="w-6 h-6 fill-current" />
              <p className="font-medium">{`${firstName} ${lastName}`}</p>
            </div>
            <p>Amount (in Rs)</p>
            <input
              type="number"
              placeholder="Enter amount"
              value={balance}
              onChange={(e) => setBalance(() => e.target.value)}
              className="border-[1px] outline-none w-full py-1 pl-2"
            />
            <button
              onClick={(e) => initiateTransfer(e)}
              className="bg-black text-white  p-1 rounded-sm w-full"
            >
              Initiate Transfer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
