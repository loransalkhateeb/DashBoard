import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';

function UpdateUser() {
  const { id } = useParams();
  const [balance, setBalance] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/getuserbyid/${id}`);
        // Assuming response.data returns an array with user objects
        if (response.data && response.data.length > 0) {
          setBalance(response.data[0].balance); // Assuming balance is a number
        } else {
          console.error("No user found with that ID");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserById();
  }, [id]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/auth/updateuser/${id}`, {
        balance,
      });
      Swal.fire({
        title: "Success!",
        text: "User updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/dashboard/users");
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Update User</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateUser}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* Balance Input */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Balance</Typography>
              <Input
                size="lg"
                placeholder="10.00"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={balance} // Set the value of the input to balance
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Update User
          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateUser;
