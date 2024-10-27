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

function AddCode() {
    const [code, setCode] = useState("");
  const [discount_percentage, setDiscount_percentage] = useState("");
  const [expiration_date, setexpiration_date] = useState("");
  const navigate = useNavigate();
  const handleAddDiscountCode = async (e) => {
    e.preventDefault();
   
    try {
      const response = await axios.post(
        `${API_URL}/discountcode/addcode`,
        {code,discount_percentage,expiration_date},
      );
      Swal.fire({
        title: "Success!",
        text: "Discount Code added successful.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/codes");
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
          <Typography variant="h2" className="font-bold mb-4">Add Discount Code</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddDiscountCode}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">            Code:
              </Typography>
              <Input
              required
                size="lg"
                placeholder="ds12"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    setCode(e.target.value);
                  }}           />
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">                   Discount Percentage:

              </Typography>
              <Input
              required
                size="lg"
                placeholder="25.00"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setDiscount_percentage(e.target.value)}
                />
             

             <Typography variant="small" color="blue-gray" className="mb-2 font-medium">          Expiration Date:

</Typography>
<Input
type='date'
required
  size="lg"
  placeholder="2024/10/27"
  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
  onChange={(e) => setexpiration_date(e.target.value)}
  />



            </div>            
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Add Code
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddCode;
