import React, { useState } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';

export function AddBags() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: '',
    product_type: '',
    season: '',
    brandID: '',
    BagTypeID: '',
    img: null,
    Size: '',
    color: '#000000', 
    available: '',
    before_price: '',
    after_price: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, img: e.target.files[0] });
  };

  const validateColor = (color) => {
    const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    return hexPattern.test(color);
  };

  const validateData = () => {
    for (const key in productData) {
      if (!productData[key] && key !== 'img') {
        Swal.fire({
          title: 'Error!',
          text: `${key.replace(/_/g, ' ')} is required.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return false;
      }
    }

    if (!validateColor(productData.color)) {
      Swal.fire({
        title: 'Error!',
        text: 'Color must be a valid HEX code (e.g., #FFFFFF).',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return false;
    }

    if (isNaN(productData.before_price) || isNaN(productData.after_price)) {
      Swal.fire({
        title: 'Error!',
        text: 'Before price and After price must be numbers.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return false;
    }

    if (isNaN(productData.Size)) {
      Swal.fire({
        title: 'Error!',
        text: 'Size must be a number.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    const formDataToSend = new FormData();
    for (const key in productData) {
      formDataToSend.append(key, productData[key] || '');
    }

    try {
      const response = await fetch('http://localhost:1010/product/add', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      Swal.fire({
        title: 'Successfully Adding!',
        text: 'The product has been added successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#007BFF',
      });

      setProductData({
        name: '',
        description: '',
        sale: '',
        main_product_type: '',
        product_type: '',
        season: '',
        brandID: '',
        BagTypeID: '',
        img: null,
        Size: '',
        color: '#000000', 
        available: '',
        before_price: '',
        after_price: '',
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the product. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Add Product</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Fill in the details below to add a new product.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(productData).map(([key, value]) => (
              key !== 'img' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">{key.replace(/_/g, ' ')}</Typography>
                  {key === 'Size' || key === 'before_price' || key === 'after_price' ? (
                    <Input type="number" name={key} value={value} onChange={handleChange} />
                  ) : key === 'color' ? (
                    <Input type="text" name={key} value={value} onChange={handleChange} placeholder="Enter color (e.g., #FFFFFF)" />
                  ) : (
                    <Input name={key} value={value} onChange={handleChange} />
                  )}
                </div>
              ) : (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Image</Typography>
                  <Input type="file" name={key} accept="image/*" onChange={handleFileChange} />
                </div>
              )
            ))}
          </div>
          <Button type="submit" className="mt-4" fullWidth>
            Add Product
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddBags;
