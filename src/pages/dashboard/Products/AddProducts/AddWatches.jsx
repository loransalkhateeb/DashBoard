import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { API_URL } from '@/App';
import { useNavigate } from 'react-router-dom';
export function AddWatch() {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '', 
    main_product_type: 'Watch', 
    product_type: '',
    season: '', 
    brandID: '',
    WatchTypeID: '',
    available: '', 
    before_price: '',
    after_price: '',
    instock: '',
    img: [],
  });

  const [brands, setBrands] = useState([]);
  const [watchTypes, setWatchTypes] = useState([]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/product/get/brands`);
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }, []);

  const fetchWatchTypes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/producttypeid/getwatchtypeid`);
      if (!response.ok) throw new Error('Failed to fetch watch types');
      const data = await response.json();
      setWatchTypes(data);
    } catch (error) {
      console.error('Error fetching watch types:', error);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchWatchTypes();
  }, [fetchBrands, fetchWatchTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_IMG = 5;
    if (files.length + productData.img.length > MAX_IMG) {
      Swal.fire({
        title: 'Error!',
        text: `You can only upload a maximum of ${MAX_IMG} images.`,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      e.target.value = null
      return;
    }
    setProductData(prevData => ({
      ...prevData,
      img: [...prevData.img, ...files], 
    }));
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
    if (productData.main_product_type !== 'Watch') {
      Swal.fire({
        title: 'Error!',
        text: 'Product type must be Watch.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (!validateData()) return;

    const formDataToSend = new FormData();
    for (const key in productData) {
      if (key === 'instock') {
        formDataToSend.append(key, productData[key] === 'Yes' ? 'yes' : 'no');
      } else if (key === 'img') {
        productData.img.forEach(file => formDataToSend.append('img', file)); 
      } else {
        formDataToSend.append(key, productData[key]);
      }
    }

    try {
      const response = await fetch(`${API_URL}/product/add`, {
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
        title: 'Successfully Added!',
        text: 'The product has been added successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#007BFF',
      });
navigate('/dashboard/products')
      // setProductData({
      //   name: '',
      //   description: '',
      //   sale: '',
      //   main_product_type: 'Watch', 
      //   product_type: '',
      //   season: '', 
      //   brandID: '',
      //   WatchTypeID: '',
      //   available: '', 
      //   before_price: '',
      //   after_price: '',
      //   instock: '',
      //   img: [], 
      // });
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

  const watchTypeOptions = useMemo(() => watchTypes.map(type => (
    <option key={type.WatchTypeID} value={type.WatchTypeID}>{type.TypeName}</option>
  )), [watchTypes]);

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4">Add Watch</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Fill in the details below to add a new product.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(productData).map(([key, value]) => (
              key === 'sale' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Sale</Typography>
                  <select 
                    name={key} 
                    value={value} 
                    onChange={handleChange} 
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose Sale</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              ) : key === 'brandID' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Brand</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a brand</option>
                    {brandOptions}
                  </select>
                </div>
              ) : key === 'WatchTypeID' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Watch Type</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a watch type</option>
                    {watchTypeOptions}
                  </select>
                </div>
              ) : key === 'season' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Season</Typography>
                  <select 
                    name={key} 
                    value={value} 
                    onChange={handleChange} 
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose Season</option>
                    <option value="FALL/WINTER">FALL / WINTER</option>
                    <option value="SPRING/SUMMER">SPRING / SUMMER</option>
                  </select>
                </div>
              ) : key === 'available' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Available</Typography>
                  <select 
                    name={key} 
                    value={value} 
                    onChange={handleChange} 
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose Available</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              ) : key === 'instock' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Choose Status</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Choose Status</option>
                    <option value="Yes">In Stock</option>
                    <option value="No">Out of Stock</option>
                  </select>
                </div>
              ) : key !== 'img' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">{key.replace(/_/g, ' ')}</Typography>
                  <Input name={key} value={value} onChange={handleChange} />
                </div>
              ) : (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Image</Typography>
                  <Input type="file" name={key} onChange={handleFileChange} multiple />
                  <div className="mt-4">
                    {productData.img.length > 0 && (
                      <div className="flex gap-4 overflow-x-auto">
                        {productData.img.map((file, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`preview ${index}`} 
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                            <button 
                              type="button" 
                              onClick={() => {
                                setProductData(prevData => ({
                                  ...prevData,
                                  img: prevData.img.filter((_, i) => i !== index)
                                }));
                              }} 
                              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
          <Button type="submit" className="mt-4" fullWidth>
            Add Watch
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddWatch;