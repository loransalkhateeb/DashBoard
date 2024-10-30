import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';

export function AddBags() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: 'Bag', // تعيين القيمة الافتراضية إلى 'Bag'
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
  const [loading, setLoading] = useState(false); // Loading state
  const [imagePreview, setImagePreview] = useState(null); // Image preview

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:1010/product/get/brands');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch brands. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBagTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:1010/bagtypeid/getbagtypeid');
      if (!response.ok) throw new Error('Failed to fetch bag types');
      const data = await response.json();
      setBagTypes(data);
    } catch (error) {
      console.error('Error fetching bag types:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch bag types. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      setLoading(false);
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
    const file = e.target.files[0];
    setProductData(prevData => ({ ...prevData, img: file }));

    // Create a URL for the image preview
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
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

    setLoading(true); // Set loading to true while submitting
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

      // Reset form
      setProductData({
        name: '',
        description: '',
        sale: '',
        main_product_type: 'Bag', // إعادة تعيين القيمة إلى 'Bag'
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
      setImagePreview(null); // Reset image preview
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the product. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      setLoading(false); // Set loading to false after submission
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
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Selected Preview" className="h-32 w-32 object-cover" />
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
          <Button type="submit" className="mt-4" fullWidth disabled={loading}>
            {loading ? 'Adding...' : 'Add Bag'}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddBags;
