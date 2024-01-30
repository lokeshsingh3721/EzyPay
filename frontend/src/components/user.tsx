import { CiUser } from "react-icons/ci";
import { useSetRecoilState } from "recoil";
import { atomModalDetailsState, modalState } from "../../store/atomModal";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

const User = ({ user }: any) => {
  const { _id: userId, firstName, lastName } = user;
  const setUserDataToModal = useSetRecoilState(atomModalDetailsState);
  const setModal = useSetRecoilState(modalState);
  const modelHandler = () => {
    setModal(true);
    setUserDataToModal({
      _id: userId,
      firstName,
      lastName,
    });
  };
  return (
    <>
      <div className="flex  justify-between">
        <div className="flex gap-2">
          <CiUser className="w-6 h-6 fill-current" />
          <p>{`${
            firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
          } ${
            lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
          }`}</p>
        </div>
        <button
          onClick={() => modelHandler()}
          className="bg-black text-white py-[1px] px-2 rounded-sm "
        >
          send Money
        </button>
      </div>
    </>
  );
};

export default User;
