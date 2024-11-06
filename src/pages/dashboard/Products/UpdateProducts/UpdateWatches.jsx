import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '@/App';

export function UpdateWatch() {
  const { id } = useParams(); 
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
    Available: '',  
    before_price: 0,
    after_price: 0,
    instock: '', 
    img: [],
  });

  const [brands, setBrands] = useState([]);
  const [watchTypes, setWatchTypes] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/product/get/brands`);
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      Swal.fire('Error!', 'Could not load brands.', 'error');
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
      Swal.fire('Error!', 'Could not load watch types.', 'error');
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/product/getproductbyid/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product data');
      const data = await response.json();

      const isWatch = data.main_product_type === 'Watch';
      setProductData({
        name: data.name || '',
        description: data.description || '',
        sale: data.sale || '', 
        main_product_type: 'Watch',
        product_type: data.product_type || '',
        Available: data.Available || '',  
        season: data.season || '', 
        brandID: data.brandID || '',
        WatchTypeID: data.WatchTypeID || '',
        before_price: isWatch ? Number(data.WatchBeforePrice) : 0, 
        after_price: isWatch ? Number(data.WatchAfterPrice) : 0, 
        instock: data.instock === 'yes' ? 'Yes' : 'No', 
        img: data.images || [],
      });

      setProductImages(data.images || []); 
    } catch (error) {
      console.error('Error fetching product data:', error);
      Swal.fire('Error!', 'Could not load product data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrands();
    fetchWatchTypes();
    fetchProductData();
  }, [fetchBrands, fetchWatchTypes, fetchProductData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData(prevData => ({ ...prevData, img: files }));
  };

  const handleImageDelete = async (imageId) => {
    try {
      const response = await fetch(`${API_URL}/product/deleteProductImageById/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: imageId }),  
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          Swal.fire({
            title: 'Successful',
            text: 'The image has been deleted successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.message || 'Failed to delete the image.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } else {
        const data = await response.json();
        Swal.fire({
          title: 'Error!',
          text: data.message || 'Failed to delete the image.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error deleting the image.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData(prevData => ({ ...prevData, img: [...prevData.img, ...files] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await fetch(`${API_URL}/product/update/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      if (!response.ok) throw new Error('Failed to update product');

      Swal.fire({
        title: 'Successfully Updated!',
        text: 'The product has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'There was a problem updating the product. Please try again.', 'error');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4">Update Watch</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Update the details below to modify the product.</Typography>
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
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              ) : key === 'brandID' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Brand</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a brand</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                    ))}
                  </select>
                </div>
              ) : key === 'WatchTypeID' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Watch Type</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a watch type</option>
                    {watchTypes.map(type => (
                      <option key={type.WatchTypeID} value={type.WatchTypeID}>{type.TypeName}</option>
                    ))}
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
                    <option value="FALL/WINTER">FALL / WINTER</option>
                    <option value="SPRING/SUMMER">SPRING / SUMMER</option>
                  </select>
                </div>
              ) : key === 'instock' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Choose Status</Typography>
                  <select 
                    name={key} 
                    value={value} 
                    onChange={handleChange} 
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Yes">In Stock</option>
                    <option value="No">Out of Stock</option>
                  </select>
                </div>
              ) : key === 'before_price' || key === 'after_price' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">{key.replace(/_/g, ' ')}</Typography>
                  <Input
                    name={key}
                    value={value}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </div>
              ) : key !== 'img' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">{key.replace(/_/g, ' ')}</Typography>
                  <Input name={key} value={value} onChange={handleChange} />
                </div>
              ) : (
                <div className="mt-6">
                  <label className="block mb-2">Images</label>
                  <div className="flex flex-wrap gap-4">
                    {productData.img.length > 0 && productData.img.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`${API_URL}/${image.img}`}
                          alt={image.name}
                          className="w-32 h-32 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 text-red-500"
                          onClick={() => handleImageDelete(image.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4"
                  />
                </div>
              )
            ))}
          </div>
          <Button type="submit" className="mt-4" fullWidth>
            Update Watch
          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateWatch;
