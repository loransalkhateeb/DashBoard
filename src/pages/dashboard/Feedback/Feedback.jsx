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
function Feedback() {
    const navigate = useNavigate();
  const [feedback, setfeedback] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [feedbackIdToDelete, setfeedbackIdToDelete] = useState(null); // Store the ID of the comment to delete

  const handleShow = (id) => {
    setfeedbackIdToDelete(id); // Set the comment ID to delete
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setfeedbackIdToDelete(null); // Reset the ID when closing
  };

  const fetchfeedback = async () => {
    try {
      const response = await axios.get(`${API_URL}/feedback/getFeedback`);
      setfeedback(response.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/feedback/deletefromFeedback/${id}`);
      setfeedback(feedback.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchfeedback();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add comment</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
         Feedback Table
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["Full Name","Product","Image","Message","Action"].map((el) => (
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
            {feedback.map(
              (comment,index) => {
                const className = `py-3 px-5 ${index === feedback.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={comment.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {comment.first_name} {comment.last_name}
                          </Typography>

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
                            {comment.product_name}
                          </Typography>
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar src={`${API_URL}/${comment.product_image}`}alt={"product_image"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {comment.message}
                          </Typography>
                      </Typography>
                    </td>
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                    onClick={() => handleShow(comment.id)} // Pass the comment ID to handleShow
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
       id={feedbackIdToDelete} // Pass the comment ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Feedback