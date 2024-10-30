import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
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
    brandID: '',
    before_price: '',
    after_price: '',
    instock: '',
    img: [],
    bagTypeID: null, 
  });

  const [existingImages, setExistingImages] = useState([]);
  const [watchTypes, setWatchTypes] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:1010/product/${id}`);
        const product = response.data.product;
        setProductData({
          name: product.name,
          description: product.description,
          sale: product.sale,
          main_product_type: product.main_product_type,
          product_type: product.product_type,
          season: product.season,
          brandID: product.brandID,
          before_price: product.before_price,
          after_price: product.after_price,
          instock: product.instock === 'yes' ? 'Yes' : 'No',
          bagTypeID: product.BagTypeID, 
        });
        setExistingImages(response.data.images);
        console.log("prod",response.data)
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = value === "" ? null : value;
    setProductData((prevData) => ({ ...prevData, [name]: finalValue }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prevData) => ({ ...prevData, img: files }));
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
      await axios.put(`http://localhost:1010/product/update/${id}`, formDataToSend, {
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
            <Input
              name="name"
              label="Product Name"
              value={productData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="description"
              label="Description"
              value={productData.description}
              onChange={handleChange}
              required
            />
            <Input
              name="sale"
              label="Sale"
              value={productData.sale}
              onChange={handleChange}
              required
            />
            <Input
              name="main_product_type"
              label="Main Product Type"
              value={productData.main_product_type}
              onChange={handleChange}
              required
            />
            <Input
              name="product_type"
              label="Product Type"
              value={productData.product_type}
              onChange={handleChange}
              required
            />
            <Input
              name="season"
              label="Season"
              value={productData.season}
              onChange={handleChange}
              required
            />
            <Input
              name="brandID"
              label="Brand ID"
              value={productData.brandID}
              onChange={handleChange}
              required
            />
            <Input
              name="before_price"
              label="Before Price"
              type="number"
              value={productData.before_price}
              onChange={handleChange}
              required
            />
            <Input
              name="after_price"
              label="After Price"
              type="number"
              value={productData.after_price}
              onChange={handleChange}
              required
            />
            <Input
              name="instock"
              label="In Stock"
              value={productData.instock}
              onChange={handleChange}
              required
            />
            <Input
              name="bagTypeID"
              label="Bag Type ID"
              value={productData.bagTypeID}
              onChange={handleChange}
              required
            />
            <Input
              type="file"
              onChange={handleFileChange}
              multiple
            />
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
