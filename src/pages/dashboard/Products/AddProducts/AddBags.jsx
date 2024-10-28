import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    available: '',
    before_price: '',
    after_price: '',
    instock: '',
  });

  const [brands, setBrands] = useState([]);
  const [bagTypes, setBagTypes] = useState([]);


  const fetchBrands = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:1010/product/get/brands');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }, []);

  
  const fetchBagTypes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:1010/bagtypeid/getbagtypeid');
      if (!response.ok) throw new Error('Failed to fetch bag types');
      const data = await response.json();
      setBagTypes(data);
    } catch (error) {
      console.error('Error fetching bag types:', error);
    }
  }, []);

  
  useEffect(() => {
    fetchBrands();
    fetchBagTypes();
  }, [fetchBrands, fetchBagTypes]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  
  const handleFileChange = (e) => {
    setProductData(prevData => ({ ...prevData, img: e.target.files[0] }));
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
      formDataToSend.append(key, key === 'instock' ? (productData[key] === 'yes' ? 'yes' : 'no') : productData[key]);
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

      Swal.fire({
        title: 'Successfully Added!',
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
        available: '',
        before_price: '',
        after_price: '',
        instock: '',
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

  const brandOptions = useMemo(() => brands.map(brand => (
    <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
  )), [brands]);

  const bagTypeOptions = useMemo(() => bagTypes.map(type => (
    <option key={type.BagTypeID} value={type.BagTypeID}>{type.TypeName}</option>
  )), [bagTypes]);

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Add Bags</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Fill in the details below to add a new product.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(productData).map(([key, value]) => (
              key === 'brandID' ? (
                <div key={key} className="flex flex-col">
                  <Typography variant="small" className="block mb-1">Brand</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a brand</option>
                    {brandOptions}
                  </select>
                </div>
              ) : key === 'BagTypeID' ? (
                <div key={key} className="flex flex-col">
                  <Typography variant="small" className="block mb-1">Bag Type</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a bag type</option>
                    {bagTypeOptions}
                  </select>
                </div>
              ) : key === 'instock' ? (
                <div key={key} className="flex flex-col">
                  <Typography variant="small" className="block mb-1">Instock</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Choose Status</option>
                    <option value="yes">In Stock</option>
                    <option value="no">Out of Stock</option>
                  </select>
                </div>
              ) : key !== 'img' ? (
                <div key={key} className="flex flex-col">
                  <Typography variant="small" className="block mb-1">{key.replace(/_/g, ' ')}</Typography>
                  <Input name={key} value={value} onChange={handleChange} />
                </div>
              ) : (
                <div key={key} className="flex flex-col">
                  <Typography variant="small" className="block mb-1">Image</Typography>
                  <Input type="file" name={key} onChange={handleFileChange} />
                </div>
              )
            ))}
          </div>
          <Button type="submit" className="mt-4" fullWidth>
            Add Bag
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddBags;
