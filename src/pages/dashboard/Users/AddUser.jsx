import React, { useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; // Ensure Axios is imported

function AddUser() {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [balance, setBalance] = useState("");
  const navigate = useNavigate();

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/signup/post`, {
        first_name,
        last_name,
        password,
        email,
        role,
        // balance,
      });
      Swal.fire({
        title: "Success!",
        text: "User added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/dashboard/users");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Add User</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddUser}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">First Name</Typography>
              <Input
              required
                size="lg"
                placeholder="John"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setFirst_name(e.target.value)}
              />
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Your email</Typography>
              <Input
              required
              type='email'
                size="lg"
                placeholder="name@mail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Password</Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setPassword(e.target.value)}
              required
              />
            </div>

            {/* Second Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Last Name</Typography>
              <Input
                size="lg"
                placeholder="Doe"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setLast_name(e.target.value)}
              required

              />
             <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Role</Typography>
<select
  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  onChange={(e) => setRole(e.target.value)}
  required
>
  <option value="">Choose a Role</option> {/* Set value to empty string */}
  <option value="user">User</option>
  <option value="admin">Admin</option>
</select>
{/* 
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Balance</Typography>
              <Input
                size="lg"
                placeholder="10.00"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setBalance(e.target.value)}
              /> */}
            </div>
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Add User
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddUser;
