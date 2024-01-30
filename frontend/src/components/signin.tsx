import { ChangeEvent, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSignIn } from "../../utility/submitHandler";

import toast, { Toaster } from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submit = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    const data = await handleSignIn(email, password);
    if (data.success) {
      const token: string = data.token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      toast(`${data.error}`);
    }
  };

  return (
    <form className="w-[400px] border-[1.5px] border-solid border-gray-200 mx-auto flex flex-col gap-3 p-5 mt-28">
      <Toaster />
      <div className="p-[6px]">
        <h1 className="text-3xl text-center font-bold mb-2">Sign In</h1>
        <p className="text-center text-lg text-gray-500 ">
          Enter your credentials to access your account
        </p>
      </div>

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
        onClick={(e) => submit(e)}
        type="submit"
        className="bg-black text-white py-2"
      >
        Sign In
      </button>
      <p className="text-center font-medium ">
        Don't have an account?{" "}
        <span
          className="underline hover:cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </p>
    </form>
  );
};

export default SignIn;
