import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx"
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Progress,
    Button,
    slider
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { authorsTableData, projectsTableData } from "@/data";
function Slider() {
    const navigate = useNavigate();
  const [Slider, setSlider] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sliderIdToDelete, setsliderIdToDelete] = useState(null); // Store the ID of the slide to delete

  const handleShow = (id) => {
    setsliderIdToDelete(id); // Set the slide ID to delete
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setsliderIdToDelete(null); // Reset the ID when closing
  };

  const fetchSlider = async () => {
    try {
      const response = await axios.get(`${API_URL}/slider`);
      setSlider(response.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/slider/delete/${id}`);
      setSlider(Slider.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSlider();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add slides</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
         Slider Table
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addslide">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> Add Slide
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["Title","Subtitle","Link To","Image","Action"].map((el) => (
                <th
                  key={el}
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Slider.map(
              (slides,index) => {
                const className = `py-3 px-5 ${index === Slider.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={slides.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {slides.title}
                          </Typography>
                          {/* <Typography className="text-xs font-normal text-blue-gray-500">
                            {slides.last_name}
                          </Typography> */}

                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {slides.subtitle}
                          </Typography>
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {slides.link_to}
                          </Typography>
                      </Typography>
                    </td>
                    <td>
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar src={`${API_URL}/${slides.img}`}alt={"slide"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updateslide/${slides.id}`)}
                            className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> Edit
                          </Button>
                          <Button 
                    onClick={() => handleShow(slides.id)} // Pass the slides ID to handleShow
                    className="text-red-600 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
    <DeleteModule 
        showModal={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
       id={sliderIdToDelete} // Pass the slides ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Slider