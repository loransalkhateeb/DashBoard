import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';

export function AddFragrance() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: 'Fragrance',
    product_type: '',
    season: '',
    brandID: '',
    FragranceTypeID: 1,
    instock: '',
    images: [],
    fragranceVariants: [{ size: '', available: '', before_price: '', after_price: '' }],
  });

  const [brands, setBrands] = useState([]);
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

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData(prevData => ({ ...prevData, images: files }));

    if (files.length > 0) {
      const previewUrl = URL.createObjectURL(files[0]);
      setImagePreview(previewUrl);
    }
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
      fragranceVariants: [...prevData.fragranceVariants, { size: '', available: '', before_price: '', after_price: '' }],
    }));
  };

  const validateData = () => {
    for (const key in productData) {
      if (key !== 'fragranceVariants' && key !== 'images' && !productData[key]) {
        Swal.fire('Error!', `${key.replace(/_/g, ' ')} is required.`, 'error');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    const formDataToSend = {
      name: productData.name,
      description: productData.description,
      sale: productData.sale,
      main_product_type: productData.main_product_type,
      product_type: productData.product_type,
      season: productData.season,
      brandID: productData.brandID,
      FragranceTypeID: productData.FragranceTypeID,
      instock: productData.instock,
      images: productData.images,
      FragranceVariants: productData.fragranceVariants.map(variant => ({
        size: parseInt(variant.size),
        available: variant.available,
        before_price: variant.before_price,
        after_price: variant.after_price,
      })),
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:1010/product/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
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
        main_product_type: 'Fragrance',
        product_type: '',
        season: '',
        brandID: '',
        FragranceTypeID: 1,
        instock: '',
        images: [],
        fragranceVariants: [{ size: '', available: '', before_price: '', after_price: '' }],
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

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Add Fragrance</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Fill in the details below to add a new product.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Input
                name="name"
                value={productData.name}
                onChange={handleChange}
                placeholder="Fragrance Name"
                required
              />
            </div>
            <div>
              <Input
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
            </div>
            <div>
              <Input
                name="sale"
                value={productData.sale}
                onChange={handleChange}
                placeholder="Sale (if any)"
              />
            </div>
            <div>
              <select
                name="brandID"
                value={productData.brandID}
                onChange={handleChange}
                className="block w-full border p-2 rounded-lg"
                required
              >
                <option value="">Select a brand</option>
                {brandOptions}
              </select>
            </div>
            <div>
              <Input
                name="product_type"
                value={productData.product_type}
                onChange={handleChange}
                placeholder="Product Type"
                required
              />
            </div>
            <div>
              <Input
                name="season"
                value={productData.season}
                onChange={handleChange}
                placeholder="Season"
                required
              />
            </div>
            <div>
              <select
                name="instock"
                value={productData.instock}
                onChange={handleChange}
                className="block w-full border p-2 rounded-lg"
                required
              >
                <option value="">Choose Status</option>
                <option value="yes">In Stock</option>
                <option value="no">Out of Stock</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Typography variant="small" className="block mb-1">Fragrance Variants</Typography>
              {productData.fragranceVariants.map((variant, index) => (
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
              <Button type="button" onClick={addVariant} className="mt-2">Add Variant</Button>
            </div>
            <div className="md:col-span-2">
              <input type="file" onChange={handleFileChange} accept="image/*" multiple />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2" />}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-4">Add Fragrance</Button>
        </form>
      </div>
    </section>
  );
}

export default AddFragrance;
