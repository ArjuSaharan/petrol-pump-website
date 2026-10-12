
import React, { useContext, useState } from "react";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [state, setState] = useState("Sign up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    backendURL,
    getuserdata,
    setisLoggedin,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const isSignup = state === "Sign up";
  const isLogin = state === "Login";

  const fieldClass =
    "w-full min-w-0 bg-transparent text-white outline-none placeholder:text-gray-300";

  const inputWrapper =
    "flex items-center gap-3 mb-3 bg-gray-700 rounded-full px-4 py-3";

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isSignup) {
        const { data } = await axios.post(
          `${backendURL}/auth/register`,
          {
            name: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            password,
          },
          {
            withCredentials: true,
          }
        );

        if (!data.success) {
          toast.error(data.message || "Registration failed");
          return;
        }

        await getuserdata();
        setisLoggedin(true);

        toast.success(data.message || "Account created successfully");
        navigate("/user");
        return;
      }

      if (isLogin) {
        const { data } = await axios.post(
          `${backendURL}/auth/login`,
          {
            email: normalizedEmail,
            password,
          },
          {
            withCredentials: true,
          }
        );

        if (!data.success) {
          toast.error(data.message || "Login failed");
          return;
        }

        await getuserdata();
        setisLoggedin(true);

        toast.success(data.message || "Login successful");
        navigate("/user");
      }
    } catch (error) {
      console.error(
        "Authentication error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gradient-to-br from-blue-200 to-white">
      <div className="w-full max-w-md rounded-xl py-7 px-6 sm:px-10 bg-slate-900 text-white shadow-xl">
        <h2 className="text-2xl font-bold text-center">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        <p className="text-sm text-gray-300 text-center mt-2">
          {isSignup
            ? "Create your account"
            : "Enter your email and password to login"}
        </p>

        <form onSubmit={submitHandler} className="mt-6">
          {isSignup && (
            <>
              <div className={inputWrapper}>
                <FaUser className="shrink-0" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className={fieldClass}
                  required
                />
              </div>

              <div className={inputWrapper}>
                <FaPhoneAlt className="shrink-0" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  autoComplete="tel"
                  className={fieldClass}
                  required
                />
              </div>
            </>
          )}

          <div className={inputWrapper}>
            <MdEmail className="shrink-0 text-xl" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              className={fieldClass}
              required
            />
          </div>

          <div className={inputWrapper}>
            <FiLock className="shrink-0" />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? "Create password" : "Enter password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className={fieldClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-full w-full py-3 font-bold text-slate-900 bg-gradient-to-l from-blue-300 to-blue-400 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>

          <p className="text-sm text-center mt-5">
            {isSignup
              ? "Already have an account? "
              : "Don't have an account? "}

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setState(isSignup ? "Login" : "Sign up");
                setPassword("");
              }}
              className="text-blue-400 underline"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
