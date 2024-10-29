import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/App";
import { useState } from "react";
import Cookies from 'js-cookie';
export function SignIn({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.currentTarget;

    if (!email.value || !password.value) {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/login/post`,
        {
          email: email.value,
          password: password.value,
        },
        { withCredentials: true }
      );

      if (response.data.Status === "Login Succses") {
        const userRole = response.data.user.role;  
        const authtoken = response.data.token;
        Cookies.set('authtoken', authtoken, { expires: 7, secure: true });
        setIsAuthenticated(true)
        if (userRole === 'admin') {
          navigate(`/dashboard/home`);
        } else {
          setErrorMessage("You are not authorized to access.");
        }
      } else {
        setErrorMessage(response.data.Error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login.");
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
               name="email"
                type="email"
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              name="password"
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
         
          <Button type="submit"className="mt-6" fullWidth>
            Sign In
          </Button>
          {errorMessage && (
              <div
                className="error-message mt-3"
                style={{
                  color: "red",
                  fontSize: "14px",
                  textAlign: "center",
                  marginBottom: "2vh",
                }}
              >
                {errorMessage}
              </div>
            )}
          {/* <div className="flex items-center justify-between gap-2 mt-6">
            
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div> */}
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
