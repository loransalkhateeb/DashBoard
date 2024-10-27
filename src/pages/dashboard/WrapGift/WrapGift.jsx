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
function WrapGift() {
    const navigate = useNavigate();
    const [wrapgift, setwrapgift] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [wrapgiftIdToDelete, setwrapgiftIdToDelete] = useState(null); // Store the ID of the gift to delete
  
    const handleShow = (id) => {
      setwrapgiftIdToDelete(id); // Set the gift ID to delete
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
      setwrapgiftIdToDelete(null); // Reset the ID when closing
    };
  
    const fetchwrapgift = async () => {
      try {
        const response = await axios.get(`${API_URL}/wrapgift`);
        setwrapgift(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/wrapgift/delete/${id}`);
        setwrapgift(wrapgift.filter((b) => b.id !== id));
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchwrapgift();
    }, []);
  
  return (
    <>
    <div className="mt-12 mb-8 flex flex-col gap-12">
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          Wrap Gift Table
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addwrapgift"><Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> Add Wrap Gift
</Button></Link>  
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["Wrap type","cost","Image","Action"].map((el) => (
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
            {wrapgift.map(
              (gift,index) => {
                const className = `py-3 px-5 ${index === wrapgift.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={gift.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {gift.wrap_type}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {gift.cost}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar src={`${API_URL}/${gift.img}`}alt={"gift"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                    {/* <td className={className}>

                    <MdDelete
                    size="1.5rem"
                    className="delete_icon"
                    onClick={() => handleShow(gift.id)} // Pass the gift ID to handleShow
                  />
                  <FaEdit
                    size="1.5rem"
                    className="edit_icon"
                    onClick={() => navigate(`/dashboard/updategift/${gift.id}`)}
                  />

                    </td> */}
                      <td className={className}>
                        <div className="flex items-center">
                          <Button 
                    onClick={() => navigate(`/dashboard/updatewrapgift/${gift.id}`)}
                    className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> Edit
                          </Button>
                          <Button 
                    onClick={() => handleShow(gift.id)} // Pass the gift ID to handleShow
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
       id={wrapgiftIdToDelete} // Pass the gift ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default WrapGift