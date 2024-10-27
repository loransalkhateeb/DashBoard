import React, { useState } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';

export function AddWatch() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: '',
    product_type: '',
    season: '',
    brandID: '',
    WatchTypeID: '',
    available: '',
    before_price: '',
    after_price: '',
    inStock: '',
    img: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, img: e.target.files[0] });
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
        confirmButtonColor: '#007BFF'
      });

      setProductData({
        name: '',
        description: '',
        sale: '',
        main_product_type: '',
        product_type: '',
        season: '',
        brandID: '',
        WatchTypeID: '',
        available: '',
        before_price: '',
        after_price: '',
        inStock: '',
        img: null,
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
    <section className="relative h-screen flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: 'url(https://www.shutterstock.com/image-photo/closeup-luxury-automatic-wristwatch-men-260nw-693928489.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative w-full lg:w-4/5 z-10 mt-5"> 
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4 text-white">Add Watches</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-3xl bg-black bg-opacity-20 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(productData).map(([key, value]) => (
              key !== 'img' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1 text-white">{key.replace(/_/g, ' ')}</Typography>
                  <Input name={key} value={value} onChange={handleChange} className="text-black" />
                </div>
              ) : (
                <div key={key}>
                  <Typography variant="small" className="block mb-1 text-white">Image</Typography>
                  <Input type="file" name={key} onChange={handleFileChange} />
                </div>
              )
            ))}
          </div>
          <Button type="submit" className="mt-4 bg-white bg-opacity-50 text-black hover:bg-opacity-70 w-1/2 mx-auto" fullWidth>
            Add Watch
          </Button>
        </form>
      </div>
    </section>
  );
  
}

export default AddWatch;
