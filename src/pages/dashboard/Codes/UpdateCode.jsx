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

function UpdateCode() {
    const [discountCode, setDiscountCode] = useState({
        code: "",
        discount_percentage: "",
        expiration_date: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchDiscountCode = async () => {
            try {
                const response = await axios.get(`${API_URL}/discountcode/getcodebyid/${id}`);
                setDiscountCode(response.data); // Assuming the API response has the same structure
            } catch (error) {
                console.error(error);
            }
        };

        fetchDiscountCode();
    }, [id]);

    const handleUpdateDiscountCode = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${API_URL}/discountcode/updatecode/${id}`, discountCode);
            Swal.fire({
                title: "Success!",
                text: "Discount Code updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate('/dashboard/codes');
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleChange = (e) => {
        setDiscountCode({
            ...discountCode,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Update Discount Code</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateDiscountCode}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Code:</Typography>
                            <Input
                                name="code" // Ensure name is set for correct state mapping
                                size="lg"
                                placeholder="dse1"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={discountCode.code}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Discount Percentage:</Typography>
                            <Input
                                name="discount_percentage" // Ensure name is set for correct state mapping
                                size="lg"
                                placeholder="25.00"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={discountCode.discount_percentage}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Expiration Date:</Typography>
                            <Input
                            type='date'
                                name="expiration_date" // Ensure name is set for correct state mapping
                                size="lg"
                                placeholder="2023-12-31"
                                className="!border-t-blue-gray-200 focus:!border-t-blue-gray-900"
                                value={discountCode.expiration_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="mt-6" fullWidth>
                        Update Code
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default UpdateCode;
