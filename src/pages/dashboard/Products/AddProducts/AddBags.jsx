import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';

export function AddBags() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: 'Bag',
    product_type: '',
    season: '',
    brandID: '',
    BagTypeID: '',
    img: null,
    BagVariants: [{ size: '', available: '', before_price: '', after_price: '' ,color:''}],
    instock: '',
  });

  const [brands, setBrands] = useState([]);
  const [bagTypes, setBagTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:1010/product/get/brands');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      Swal.fire('Error!', 'Failed to fetch brands. Please try again.', 'error');
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
      Swal.fire('Error!', 'Failed to fetch bag types. Please try again.', 'error');
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

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBagVariants = [...productData.BagVariants];
    updatedBagVariants[index] = { ...updatedBagVariants[index], [name]: value };
    setProductData(prevData => ({ ...prevData, BagVariants: updatedBagVariants }));
  };

  const addVariant = () => {
    setProductData(prevData => ({
      ...prevData,
      BagVariants: [...prevData.BagVariants, { size: '', available: '', before_price: '', after_price: '',color:'' }],
    }));
  };

  const validateData = () => {
    for (const key in productData) {
      if (key !== 'BagVariants' && key !== 'img' && !productData[key]) {
        Swal.fire('Error!', `${key.replace(/_/g, ' ')} is required.`, 'error');
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
      if (key !== 'BagVariants') {
        formDataToSend.append(key, productData[key]);
      }
    }

    productData.BagVariants.forEach((variant, index) => {
      formDataToSend.append(`BagVariants[${index}][size]`, variant.size);
      formDataToSend.append(`BagVariants[${index}][available]`, variant.available);
      formDataToSend.append(`BagVariants[${index}][before_price]`, variant.before_price);
      formDataToSend.append(`BagVariants[${index}][after_price]`, variant.after_price);
      formDataToSend.append(`BagVariants[${index}][color]`, variant.color);
    });

    setLoading(true);
    try {
      const response = await fetch('http://localhost:1010/product/add', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      Swal.fire('Success!', 'The product has been added successfully.', 'success');
      setProductData({
        name: '',
        description: '',
        sale: '',
        main_product_type: 'Bag',
        product_type: '',
        season: '',
        brandID: '',
        BagTypeID: '',
        img: null,
        BagVariants: [{ size: '', available: '', before_price: '', after_price: '',color:'' }],
        instock: '',
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'There was a problem adding the product. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const brandOptions = useMemo(() =>
    brands.map(brand => (
      <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
    )), [brands]
  );

  const bagTypeOptions = useMemo(() =>
    bagTypes.map(type => (
      <option key={type.BagTypeID} value={type.BagTypeID}>{type.TypeName}</option>
    )), [bagTypes]
  );

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Add Bags</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Fill in the details below to add a new product.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(productData).map(([key, value]) => (
              key === 'brandID' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Brand</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                    <option value="">Select a brand</option>
                    {brandOptions}
                  </select>
                </div>
              ) : key === 'BagTypeID' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">Bag Type</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                    <option value="">Select a bag type</option>
                    {bagTypeOptions}
                  </select>
                </div>
              ) : key === 'instock' ? (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">In Stock</Typography>
                  <select name={key} value={value} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                    <option value="">Choose Status</option>
                    <option value="yes">In Stock</option>
                    <option value="no">Out of Stock</option>
                  </select>
                </div>
              ) : key === 'BagVariants' ? (
                <div key={key} className="md:col-span-2">
                  <Typography variant="small" className="block mb-1">Sizes</Typography>
                  {productData.BagVariants.map((variant, index) => (
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

                  <Button 
                    type="button" 
                    onClick={addVariant} 
                    className="mt-2"
                  >
                    Add Variant
                  </Button>
                </div>
              ) : (
                <div key={key}>
                  <Typography variant="small" className="block mb-1">{key.replace(/_/g, ' ').capitalize()}</Typography>
                  <Input 
                    name={key} 
                    value={value} 
                    placeholder={key.replace(/_/g, ' ')} 
                    onChange={handleChange} 
                    required={key !== 'img'} 
                  />
                </div>
              )
            ))}
          </div>

          <div className="mb-4">
            <Typography variant="small" className="block mb-1">Product Image</Typography>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
            )}
          </div>

          <Button 
            type="submit" 
            className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </form>
      </div>
    </section>
  );
}

// Helper function to capitalize the first letter of a string
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
export default AddBags