import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx"
import { PencilIcon, TrashIcon,CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
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
 
function Wallet() {
    const navigate = useNavigate();
  const [payments, setpayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paymentIdToDelete, setpaymentIdToDelete] = useState(null); // Store the ID of the pay to delete

  const handleShow = (id) => {
    setpaymentIdToDelete(id); // Set the pay ID to delete
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setpaymentIdToDelete(null); // Reset the ID when closing
  };

  const fetchpayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/wallet/getpaymenttable`);
      setpayments(response.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/wallet/deletepayment/${id}`);
      setpayments(payments.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

const handleConfirmPayment = async (userId, id) => {
    try {
        const response = await axios.post(`${API_URL}/wallet/confirmpayment`, { userId });
        if (response.status === 200) {
            const updatedPayment = response.data.updatedPayment; // Access the updated payment  
            Swal.fire({
                title: "Success!",
                text: "Status updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });          
            setpayments((prevPayments) =>
                prevPayments.map((payment) =>
                    payment.id === id ? { ...payment, status: updatedPayment.status } : payment
                )
            );  
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "An unexpected error occurred.",
            icon: "error",
            confirmButtonText: "OK",
        });
    }
};

  useEffect(() => {
    fetchpayments();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add pay</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          Wallet Payment Table
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["Full Name","email","amount","Payment Method","status","Created At","Action"].map((el) => (
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
            {payments.map(
              (pay,index) => {
                const className = `py-3 px-5 ${index === payments.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={pay.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {pay.first_name} {pay.last_name}
                          </Typography>
                          {/* <Typography className="text-xs font-normal text-blue-gray-500">
                            {pay.last_name}
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
                            {pay.email}
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
                            {pay.amount}
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
                            {pay.paymentMethod}
                          </Typography>
                      </Typography>
                    </td>
                    <td className={className}>
                      {/* <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {pay.status}
                          </Typography>
                      </Typography> */}
                       <Chip
  variant="gradient"
  color={pay.status === "completed" ? "green" :"blue"}
  value={
    pay.status
  }
  className="py-0.5 px-2 text-[11px] font-medium w-fit"
/>

                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {pay.created_at}
                          </Typography>
                      </Typography>
                    </td>
                     <td className={className}>
                        <div className="flex items-center">
                            {pay.status !="completed" ?(
                        <Button 
                      className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                      onClick={()=>handleConfirmPayment(pay.userId,pay.id)}>
                         <CheckIcon className="h-5 w-5 mr-1" />
                         Confirm
                  </Button> ):
                  (
null                  )}
                          <Button 
                    onClick={() => handleShow(pay.id)} // Pass the pay ID to handleShow
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
       id={paymentIdToDelete} // Pass the pay ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Wallet