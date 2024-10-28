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

function AddBrand() {
    const [brand_name, setBrandName] = useState("");
    const [brand_img, setBrandImg] = useState(null);
    const [imgName, setImgName] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setBrandImg(file);
            setImgName(file.name); // Set the image name
        } else {
          setBrandImg(null);
            setImgName(""); // Reset if no file is selected
        }
    };
    const navigate = useNavigate();
    const handleAddBrand = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("brand_name", brand_name);
      formData.append("brand_img", brand_img);
  
      try {
        const response = await axios.post(
          `${API_URL}/product/addbrand`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: "Brand added successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/brands");
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
          <Typography variant="h2" className="font-bold mb-4">Add Brand</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddBrand}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Brand Name:</Typography>
              <Input
              required
                size="lg"
                placeholder="Espirt"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    setBrandName(e.target.value);
                  }}              />
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Brand Image:</Typography>
                <Typography variant="small" color="blue-gray" className="mb-2 ">It is recommended to use the WebP format for images.</Typography>
                            <div className="relative">
                                <input
                                required
                                    type="file"
                                    id="file_input"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                                Choose an image
                                </Button>
                                 {/* Display the image name if it exists */}
                {imgName && (
                    <Typography variant="small" color="blue-gray" className="mt-2">
                        Selected File: {imgName}
                    </Typography>
                )}
                            </div>

            </div>            
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Add Brand
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddBrand;
