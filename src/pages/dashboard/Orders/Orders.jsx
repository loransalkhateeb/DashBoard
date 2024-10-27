import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { TrashIcon,CheckIcon  } from "@heroicons/react/24/outline";
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
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { authorsTableData, projectsTableData } from "@/data";
function Orders() {
    const navigate = useNavigate();
    const [Orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null); // Store the ID of the order to delete
  
    const handleShow = (id) => {
      setcodeIdToDelete(id); // Set the order ID to delete
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
      setOrderIdToDelete(null); // Reset the ID when closing
    };
  
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/getallorders`);
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchOrders();
    }, []);
    const handleStatusOrder = async (order_id, status) => {
      try {
        const response = await axios.post(`${API_URL}/orders/confirmorrejectorder`, {
          order_id,
          status
        });
        console.log(response.data);
        Swal.fire({
          title: "Success!",
          text: "Order status updated successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === order_id ? { ...order, order_status: status } : order
          )
        );
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        Swal.fire({
          title: "Error!",
          text: "Failed to update Order status. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
  return (
    <>
    {/* <Link to="/dashboard/addorder"><Button className="mt-6" >Add order</Button></Link> */}
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          Orders Table
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[" Name","Email","address","address optional","city","country","phone","Order Items","shipping method","payment method","total price","order status","status"].map((el) => (
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
            {Orders.map(
              (order,index) => {
                const className = `py-3 px-5 ${index === Orders.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={order.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {order.first_name}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {order.last_name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.email}
                      </Typography>
                      {/* <Typography className="text-xs font-normal text-blue-gray-500">
                      </Typography> */}
                    </td>
                    <td className={className}>
                       <Typography className="text-xs font-normal text-blue-gray-500">
                       {order.address}

                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.addressoptional}
                      </Typography>
                    </td>

                      <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.city}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.country}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.phone}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 "style={{width:"300px"}}>
                      {order.items.map((item)=>(
                 <li key={item.order_item_id}>
                 {item.product_name} (Qty: {item.quantity}, Price: {item.price} JD
                 {item.color && `, Color: ${item.color}`}
                 {item.size && `, Size: ${item.size}`}
                 {item.message && `, Message: ${item.message}`}
                 {item.wrap_type && `, Wrap Type: ${item.wrap_type}`}
                 {item.delivery_date && `, Delivery Date: ${item.delivery_date}`}
                 )
             </li>
                ))}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.shipping_method}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.payment_method}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.total_price}
                      </Typography>
                    </td>
                    <td className={className}>
                      {/* <Typography className="text-xs font-semibold text-blue-gray-600">
                        {order.order_status}
                      </Typography> */}
                     <Chip
  variant="gradient"
  color={order.order_status === "Confirmed" ? "green" :order.order_status === "Pending" ? "blue": "red"}
  value={
    order.order_status === "Confirmed"
      ? "Confirmed"
      : order.order_status === "Pending"
      ? "Pending"
      : "Rejected"
  }
  className="py-0.5 px-2 text-[11px] font-medium w-fit"
/>

                    </td>
                    {order.order_status === "Pending" ? (
                //   <div>
                //     <button
                //       type="button"
                //       className="btn btn-success d-flex justify-content-center px-3 py-2 mb-3" onClick={()=>{handleStatusOrder(order.order_id,'Confirmed')}}
                //     >
                //       Confirm
                //     </button>
                //     <button
                //       type="button"
                //       className="btn btn-danger d-flex justify-content-center px-4 py-2 mb-3" onClick={()=>handleStatusOrder(order.order_id,'Rejected')}
                //     >
                //       Reject
                //     </button>
                //   </div>
                <td className={className}>
                <div className="flex items-center">
                  <Button 
 className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
 onClick={()=>{handleStatusOrder(order.order_id,'Confirmed')}}>
                         <CheckIcon className="h-5 w-5 mr-1" />
                         Confirm
                  </Button>
                  <Button 
className="text-red-600 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
onClick={()=>handleStatusOrder(order.order_id,'Rejected')}    >
                    <TrashIcon className="h-5 w-5 mr-1" /> Reject
                  </Button>
                </div>
              </td>
                ):  <td></td>}

                   
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  
  </div>  
  </>
  )
}

export default Orders