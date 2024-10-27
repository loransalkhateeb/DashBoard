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
function Users() {
    const navigate = useNavigate();
    const [users, setusers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setuserIdToDelete] = useState(null); // Store the ID of the user to delete
  
    const handleShow = (id) => {
      setuserIdToDelete(id); // Set the user ID to delete
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
      setuserIdToDelete(null); // Reset the ID when closing
    };
  
    const fetchusers = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/getalluser`);
        setusers(response.data);
        console.log("first user",response.data)
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/auth/deleteuser/${id}`);
        setusers(users.filter((b) => b.id !== id));
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchusers();
    }, []);
  return (
    <>
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          Users Table
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/adduser"><Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> Add User
</Button></Link> 
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["Full Name","Email","role","Balance", "Action"].map((el) => (
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
            {users.map(
              (user,index) => {
                const className = `py-3 px-5 ${index === users.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={user.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {user.first_name}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {user.last_name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.email}
                      </Typography>
                      {/* <Typography className="text-xs font-normal text-blue-gray-500">
                      </Typography> */}
                    </td>
                    <td className={className}>
                       <Typography className="text-xs font-normal text-blue-gray-500">
                       {user.role}

                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.balance}
                      </Typography>
                    </td>
                    {/* <td className={className}>

                    <MdDelete
                    size="1.5rem"
                    className="delete_icon"
                    onClick={() => handleShow(user.id)} // Pass the user ID to handleShow
                  />
                  <FaEdit
                    size="1.5rem"
                    className="edit_icon"
                    onClick={() => navigate(`/dashboard/updateuser/${user.id}`)}
                  />

                    </td> */}
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                    onClick={() => navigate(`/dashboard/updateuser/${user.id}`)}
                    className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> Edit
                          </Button>
                          <Button 
  onClick={() => handleShow(user.id)}                    className="text-red-600 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
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
       id={userIdToDelete} // Pass the user ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Users