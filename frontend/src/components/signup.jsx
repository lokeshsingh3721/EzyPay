import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSignUp } from "../../utility/submitHandler";

import toast, { Toaster } from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const setLoadingState = useSetRecoilState(atomLoadingState);

  const submit = async (e) => {
    e.preventDefault();
    const data = await handleSignUp(firstName, lastName, email, password);
    if (data.success) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      toast(`${data.error}`);
    }
  };

  return (
    <form className="w-[400px] border-[1.5px] border-solid border-gray-200 mx-auto flex flex-col gap-3 p-5 mt-10">
      <Toaster />
      <div className="p-[6px]">
        <h1 className="text-3xl text-center font-bold ">Sign Up</h1>
        <p className="text-center text-lg text-gray-500 ">
          Enter your information to create an account
        </p>
      </div>
      <label className="font-bold" htmlFor="firstName">
        First Name
      </label>
      <input
        className="border-[1px] py-1 pl-2 outline-none "
        type="text"
        name="firstName"
        placeholder="John"
        value={firstName}
        onChange={(e) => setFirstName(() => e.target.value)}
      />

      <label className="font-bold" htmlFor="lastName">
        Last Name
      </label>
      <input
        className="border-[1px] py-1 pl-2 outline-none "
        type="text"
        name="lastName"
        placeholder="Doe"
        value={lastName}
        onChange={(e) => setLastName(() => e.target.value)}
      />

      <label className="font-bold" htmlFor="email">
        Email
      </label>
      <input
        className="border-[1px] py-1 pl-2 outline-none "
        type="email"
        name="email"
        placeholder="johndoe@example.com"
        value={email}
        onChange={(e) => setEmail(() => e.target.value)}
      />

      <label className="font-bold" htmlFor="password">
        Password
      </label>
      <input
        className="border-[1px] py-1 pl-2 outline-none "
        type="password"
        name="firstName"
        value={password}
        onChange={(e) => setPassword(() => e.target.value)}
      />
      <button
        type="submit"
        className="bg-black text-white py-2"
        onClick={(e) => {
          submit(e);
        }}
      >
        Sign Up
      </button>
      <p className="text-center font-medium ">
        Already have an account?{" "}
        <span
          className="underline hover:cursor-pointer "
          onClick={() => navigate("/signin")}
        >
          Login
        </span>
      </p>
    </form>
  );
};

export default SignUp;
