import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';

export function AddFragrance() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',

    main_product_type: 'Fragrance',

    main_product_type: 'Fragrance', // Set default as Fragrance

    product_type: '',
    season: '',
    brandID: '',
    FragranceTypeID: '',
    FragranceVariants: [{ size: '', available: '', before_price: '', after_price: '' }],
    instock: '',
    img: null,
  });

  const [brands, setBrands] = useState([]);
  const [fragranceTypes, setFragranceTypes] = useState([]);

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

  const fetchFragranceTypes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:1010/fragrancetypeid/getfragrancetypeid');
      if (!response.ok) throw new Error('Failed to fetch fragrance types');
      const data = await response.json();
      setFragranceTypes(data);
    } catch (error) {
      console.error('Error fetching fragrance types:', error);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchFragranceTypes();
  }, [fetchBrands, fetchFragranceTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProductData(prevData => ({ ...prevData, img: e.target.files[0] }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...productData.fragranceVariants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setProductData(prevData => ({ ...prevData, fragranceVariants: updatedVariants }));
  };

  const addVariant = () => {
    setProductData(prevData => ({
      ...prevData,
      FragranceVariants: [...prevData.FragranceVariants, { size: '', available: '', before_price: '', after_price: '' }],
    }));
  };

  const validateData = () => {
    for (const key in productData) {
      if (key !== 'FragranceVariants' && key !== 'img' && !productData[key]) {
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

    Object.entries(productData).forEach(([key, value]) => {
      if (key !== 'FragranceVariants') {
        formDataToSend.append(key, value);
      }
    });

    productData.FragranceVariants.forEach((variant, index) => {
      formDataToSend.append(`FragranceVariants[${index}][size]`, variant.size);
      formDataToSend.append(`FragranceVariants[${index}][available]`, variant.available);
      formDataToSend.append(`FragranceVariants[${index}][before_price]`, variant.before_price);
      formDataToSend.append(`FragranceVariants[${index}][after_price]`, variant.after_price);
    });

    try {
      const response = await fetch('http://localhost:1010/product/add', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error(`Network response was not ok: ${await response.text()}`);

      Swal.fire({
        title: 'Successfully Added!',
        text: 'The product has been added successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
      });

      setProductData({
        name: '',
        description: '',
        sale: '',
        main_product_type: 'Fragrance',
        product_type: '',
        season: '',
        brandID: '',
        FragranceTypeID: '',
        FragranceVariants: [{ size: '', available: '', before_price: '', after_price: '' }],
        instock: '',
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

  const brandOptions = useMemo(() => brands.map(brand => (
    <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
  )), [brands]);

  const fragranceTypeOptions = useMemo(() => fragranceTypes.map(type => (
    <option key={type.FragranceTypeID} value={type.FragranceTypeID}>{type.TypeName}</option>
  )), [fragranceTypes]);

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4">Add Fragrance</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Fill in the details below to add a new product.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(productData).map(([key, value]) => (
              key === 'brandID' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Brand</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a brand</option>
                    {brandOptions}
                  </select>
                </div>
              ) : key === 'FragranceTypeID' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Fragrance Type</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a fragrance type</option>
                    {fragranceTypeOptions}
                  </select>
                </div>
              ) : key === 'instock' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Choose Status</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Choose Status</option>
                    <option value="yes">In Stock</option>
                    <option value="no">Out of Stock</option>
                  </select>
                </div>
              ) : key === 'FragranceVariants' ? (
                <div key={key} className="md:col-span-2">
                  <Typography variant="small" className="block mb-1">Sizes</Typography>
                  {productData.FragranceVariants.map((variant, index) => (
                    <div key={index} className="flex flex-col mb-4 border p-4 rounded-lg">
                      <Input 
                        name="size" 
                        value={variant.size} 
                        placeholder="Size" 
                        onChange={(e) => handleVariantChange(index, e)} 
                        required
                      />
                      <Input 
                        name="available" 
                        value={variant.available} 
                        placeholder="Available (Yes/No)" 
                        onChange={(e) => handleVariantChange(index, e)} 
                        required
                      />
                      <Input 
                        name="before_price" 
                        value={variant.before_price} 
                        placeholder="Before Price" 
                        type="number" 
                        onChange={(e) => handleVariantChange(index, e)} 
                        required
                      />
                      <Input 
                        name="after_price" 
                        value={variant.after_price} 
                        placeholder="After Price" 
                        type="number" 
                        onChange={(e) => handleVariantChange(index, e)} 
                        required
                      />
                    </div>
                  ))}
                  <Button type="button" onClick={addVariant} className="mt-2">
                    Add Size
                  </Button>
                </div>
              ) : key !== 'img' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Input name={key} value={value} onChange={handleChange} required />
                </div>
              ) : (
                <div key={key} className="md:col-span-2">
                  <Typography variant="small" className="block mb-1">Image</Typography>
                  <Input type="file" name={key} onChange={handleFileChange} accept="image/*" required />
                </div>
              )
            ))}
          </div>
          <Button type="submit" className="mt-4" fullWidth>
            Add Fragrance
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddFragrance;
