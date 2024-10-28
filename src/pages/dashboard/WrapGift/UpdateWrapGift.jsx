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

function UpdateWrapGift() {
    const [wrapgift, setWrapGift] = useState({
        wrap_type: "",
        cost: "",
        img: null,
    });
    const [existing_img, setExistingImg] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchWrapGift = async () => {
            try {
                const response = await axios.get(`${API_URL}/wrapgift/wrapgiftbyid/${id}`);
                setWrapGift(response.data); // Set the wrapgift state with fetched data
                setExistingImg(response.data.img); // Assuming this is the existing image
            } catch (error) {
                console.error(error);
            }
        };

        fetchWrapGift();
    }, [id]);

    const handleUpdateWrapGift = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("wrap_type", wrapgift.wrap_type);
        formData.append("cost", wrapgift.cost);
        // Only append the new image if it's selected, otherwise leave it out
        if (wrapgift.img) {
            formData.append("img", wrapgift.img);
        }

        try {
            await axios.put(`${API_URL}/wrapgift/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                title: "Success!",
                text: "Wrap Gift Updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/wrapgift");
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
        const { name, value, type, files } = e.target;
        setWrapGift({
            ...wrapgift,
            [name]: type === "file" ? files[0] : value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">Update Wrap Gift</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateWrapGift}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Wrap Type:</Typography>
                            <Input
                                size="lg"
                                placeholder="Solid"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={wrapgift.wrap_type}
                                required
                                name='wrap_type'
                                onChange={handleChange} // Use handleChange for input
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Cost:</Typography>
                            <Input
                                size="lg"
                                placeholder="5.00"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={wrapgift.cost}
                                required
                                name='cost'
                                onChange={handleChange} // Use handleChange for input
                            />
                        </div>

                        <Typography variant="small" color="blue-gray" className="font-medium">Image:</Typography>
                        <div className="flex flex-col">
                            {existing_img && (
                                <img src={`${API_URL}/${existing_img}`} alt="Existing wrap gift" className="mb-2 w-32 h-32 object-cover" />
                            )}
                <Typography variant="small" color="blue-gray" className="mb-2 ">It is recommended to use the WebP format for images.</Typography>

                            <div className="relative">
                                <input
                                    type="file"
                                    id="file_input"
                                    name="img"
                                    onChange={handleChange} // Use handleChange for file input
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                                    Choose an image
                                </Button>
                                <Typography>
                                    {wrapgift.img ? (
                                        <p>{wrapgift.img.name}</p> // Show selected image name
                                    ) : (
                                        <Typography variant="small" color="blue-gray" className="text-gray-500">No image selected</Typography>
                                    )}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="mt-6" fullWidth>
                        Update Wrap Gift
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default UpdateWrapGift;
