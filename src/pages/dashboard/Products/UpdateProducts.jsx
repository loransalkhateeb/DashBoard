import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx"; 
import Swal from "sweetalert2";
import axios from 'axios';

export function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: '',
    product_type: '',
    season: '',
    brand_name: '',
    before_price: '',  
    after_price: '',  
    BagTypeID: null,
    WatchTypeID: null,
    instock: '',
    img: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [watchTypes, setWatchTypes] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/${id}`);
        setProductData(response.data.product);
        setExistingImages(response.data.images);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    const fetchWatchTypes = async () => {
      try {
        const response = await axios.get('http://localhost:1010/producttypeid/getwatchtypeid');
        setWatchTypes(response.data); 
      } catch (error) {
        console.error("Error fetching watch types:", error);
      }
    };

    fetchWatchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prevData) => ({ ...prevData, img: files }));
  };

  const handleRemoveImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in productData) {
      if (key === 'instock') {
        formDataToSend.append(key, productData[key] === 'Yes' ? 'yes' : 'no');
      } else if (key === 'img') {
        productData.img.forEach((file) => formDataToSend.append('img', file));
      } else {
        formDataToSend.append(key, productData[key]);
      }
    }

    try {
      await axios.put(`${API_URL}/product/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Updated!",
        text: "Product information updated successfully!",
        icon: "success",
      });
      navigate('/dashboard/products');
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update the product. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4">Update Product</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Modify the details below to update the product.
          </Typography>
        </div>
        <form onSubmit={handleUpdate} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

           
            <div>
              <Typography variant="small" className="block mb-1">Product Name</Typography>
              <Input name="name" value={productData.name} onChange={handleChange} />
            </div>

           
            <div>
              <Typography variant="small" className="block mb-1">Description</Typography>
              <Input name="description" value={productData.description} onChange={handleChange} />
            </div>

            
            <div>
              <Typography variant="small" className="block mb-1">Sale</Typography>
              <Input name="sale" value={productData.sale} onChange={handleChange} />
            </div>

            
            <div>
              <Typography variant="small" className="block mb-1">Main Product Type</Typography>
              <Input name="main_product_type" value={productData.main_product_type} onChange={handleChange} />
            </div>

           
            <div>
              <Typography variant="small" className="block mb-1">Product Type</Typography>
              <Input name="product_type" value={productData.product_type} onChange={handleChange} />
            </div>

            
            <div>
              <Typography variant="small" className="block mb-1">Season</Typography>
              <Input name="season" value={productData.season} onChange={handleChange} />
            </div>

            
            <div>
              <Typography variant="small" className="block mb-1">Brand Name</Typography>
              <Input name="brand_name" value={productData.brand_name} onChange={handleChange} />
            </div>

            
            <div>
              <Typography variant="small" className="block mb-1">Before Price</Typography>
              <Input type="number" name="before_price" value={productData.before_price} onChange={handleChange} />
            </div>

           
            <div>
              <Typography variant="small" className="block mb-1">After Price</Typography>
              <Input type="number" name="after_price" value={productData.after_price} onChange={handleChange} />
            </div>

           
            <div>
              <Typography variant="small" className="block mb-1">Stock Status</Typography>
              <select name="instock" value={productData.instock === 'yes' ? 'Yes' : 'No'} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="Yes">In Stock</option>
                <option value="No">Out of Stock</option>
              </select>
            </div>

            
            <div>
              <Typography variant="small" className="block mb-1">Watch Type</Typography>
              <select name="WatchTypeID" value={productData.WatchTypeID} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="">Select a Watch Type</option>
                {watchTypes.map((type) => (
                  <option key={type.WatchTypeID} value={type.WatchTypeID}>{type.TypeName}</option>
                ))}
              </select>
            </div>

            
            <div>
              <Typography variant="small" className="block mb-1">Images</Typography>
              <div className="flex flex-col">
                {existingImages.map((image, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <img src={`${API_URL}/${image}`} alt={`Existing product ${index + 1}`} className="mr-2 w-32 h-32 object-cover" />
                    <Button onClick={() => handleRemoveImage(index)} color="red">Remove</Button>
                  </div>
                ))}
                <Input type="file" name="img" onChange={handleFileChange} multiple />
              </div>
            </div>

          </div>
          <Button type="submit" className="mt-4" fullWidth>
            Update Product
          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateProduct;
