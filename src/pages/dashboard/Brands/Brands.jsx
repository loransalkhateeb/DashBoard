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
    Button
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { authorsTableData, projectsTableData } from "@/data";
function Brands() {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [brandIdToDelete, setBrandIdToDelete] = useState(null); // Store the ID of the brand to delete
  
    const handleShow = (id) => {
      setBrandIdToDelete(id); // Set the brand ID to delete
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
      setBrandIdToDelete(null); // Reset the ID when closing
    };
  
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/get/brands`);
        setBrands(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/product/delete/brand/${id}`);
        setBrands(brands.filter((b) => b.id !== id));
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchBrands();
    }, []);
  
  return (
    <>
    {/* <Link to="/dashboard/addbrand"><Button className="mt-6" >Add Brand</Button></Link> */}
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          Brands Table
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addbrand"><Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> Add Brand
</Button></Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["Brand Name","Image","Action"].map((el) => (
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
            {brands.map(
              (brand,index) => {
                const className = `py-3 px-5 ${index === brands.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={brand.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {brand.brand_name}
                          </Typography>
                          {/* <Typography className="text-xs font-normal text-blue-gray-500">
                            {brand.last_name}
                          </Typography> */}

                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar src={`${API_URL}/${brand.brand_img}`}alt={"brand"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                    {/* <td className={className}>

                    <MdDelete
                    size="1.5rem"
                    className="delete_icon"
                    onClick={() => handleShow(brand.id)} // Pass the brand ID to handleShow
                  />
                  <FaEdit
                    size="1.5rem"
                    className="edit_icon"
                    onClick={() => navigate(`/dashboard/updatebrand/${brand.id}`)}
                  />

                    </td> */}
                      <td className={className}>
                        <div className="flex items-center">
                          <Button 
                    onClick={() => navigate(`/dashboard/updatebrand/${brand.id}`)}
                    className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> Edit
                          </Button>
                          <Button 
                    onClick={() => handleShow(brand.id)} // Pass the brand ID to handleShow
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
       id={brandIdToDelete} // Pass the brand ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Brands