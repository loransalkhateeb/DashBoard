import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx"; 
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
    brandID: '', // Added brandID
    BagTypeID: '', // Changed from null to empty string
    WatchTypeID: null,
    FragranceTypeID: '', // Added FragranceTypeID
    instock: '',
    before_price: '', // Top-level before_price
    after_price: '',  // Top-level after_price
    img: [], // For new images to upload
    variants: [{ size: '', before_price: '', after_price: '', Available: false }], // Initialize variants with 'Available'
  });

  const [existingImages, setExistingImages] = useState([]); // For existing images
  const [watchTypes, setWatchTypes] = useState([]);
  const [brands, setBrands] = useState([]); // For available brands
  const [bagTypes, setBagTypes] = useState([]); // For available bag types
  const [fragranceTypes, setFragranceTypes] = useState([]); // For available fragrance types

  // Fetch Product Data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API_URL}/product/${id}`);
        const { product, images, variants } = response.data;

        setProductData({
          name: product.name || '',
          description: product.description || '',
          sale: product.sale || '',
          main_product_type: product.main_product_type || '',
          product_type: product.product_type || '',
          season: product.season || '',
          brandID: product.brandID || '', // Ensure brandID is set
          BagTypeID: product.BagTypeID || '', // Changed from null to empty string
          WatchTypeID: product.WatchTypeID || null,
          FragranceTypeID: product.FragranceTypeID || '', // Set FragranceTypeID
          instock: product.instock || '',
          before_price: product.before_price || '', // Set top-level before_price
          after_price: product.after_price || '',   // Set top-level after_price
          img: [], // Reset to empty array for new images
          variants: variants.map(variant => ({
            size: variant.size || '',
            before_price: variant.prices[0]?.before_price || '',
            after_price: variant.prices[0]?.after_price || '',
            Available: variant.prices[0]?.available || false, // Changed 'available' to 'Available'
          })) || [],
        });
        setExistingImages(images || []);
      } catch (error) {
        console.error("Error fetching product data:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch product data.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    };

    fetchProductData();
  }, [id]);

  // Fetch Watch Types
  useEffect(() => {
    const fetchWatchTypes = async () => {
      try {
        const response = await axios.get('http://localhost:1010/producttypeid/getwatchtypeid');
        setWatchTypes(response.data); 
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching watch types:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch watch types.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    };

    fetchWatchTypes();
  }, []);

  // Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:1010/product/get/brands');
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch brands.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    };

    fetchBrands();
  }, []);

  // Fetch Bag Types
  useEffect(() => {
    const fetchBagTypes = async () => {
      try {
        const response = await axios.get('http://localhost:1010/bagtypeid/getbagtypeid'); // Replace with your actual endpoint
        setBagTypes(response.data);
      } catch (error) {
        console.error("Error fetching bag types:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch bag types.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    };

    fetchBagTypes();
  }, []);

  // Fetch Fragrance Types
  useEffect(() => {
    const fetchFragranceTypes = async () => {
      try {
        const response = await axios.get('http://localhost:1010/fragrancetypeid/getfragrancetypeid'); // Replace with your actual endpoint
        setFragranceTypes(response.data);
      } catch (error) {
        console.error("Error fetching fragrance types:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch fragrance types.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    };

    fetchFragranceTypes();
  }, []);

  // Handle Change for Non-Variant Fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle File Change for New Images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData((prevData) => ({ ...prevData, img: files }));
  };

  // Handle Removing Existing Images
  const handleRemoveImage = (index) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle Variant Changes
  const handleVariantChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedVariants = [...productData.variants];
    
    if (name === 'variant_before_price') {
      updatedVariants[index].before_price = value;
    } else if (name === 'variant_after_price') {
      updatedVariants[index].after_price = value;
    } else {
      updatedVariants[index] = {
        ...updatedVariants[index],
        [name]: type === 'checkbox' ? checked : value,
      };
    }
    
    setProductData(prevData => ({ ...prevData, variants: updatedVariants }));
  };

  // Add a New Variant
  const addVariant = () => {
    setProductData(prevData => ({
      ...prevData,
      variants: [...prevData.variants, { size: '', before_price: '', after_price: '', Available: false }], // Changed 'available' to 'Available'
    }));
  };

  // Remove a Variant
  const removeVariant = (index) => {
    setProductData(prevData => ({
      ...prevData,
      variants: prevData.variants.filter((_, i) => i !== index),
    }));
  };

  // Validate Data Before Submission
  const validateData = () => {
    // Validate top-level fields
    for (const key in productData) {
      if (key === 'variants' || key === 'img') continue; // Skip variants and img
      if (!productData[key] && productData[key] !== 0) { // Allow 0 if needed
        Swal.fire({
          title: 'Error!',
          text: `${key.replace(/_/g, ' ')} is required.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return false;
      }
    }

    // If main_product_type is 'Fragrance', ensure FragranceTypeID is provided
    if (productData.main_product_type.toLowerCase() === 'fragrance' && !productData.FragranceTypeID) {
      Swal.fire({
        title: 'Error!',
        text: `Fragrance Type is required.`,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return false;
    }

    // Validate variants
    for (let i = 0; i < productData.variants.length; i++) {
      const variant = productData.variants[i];
      if (!variant.size) {
        Swal.fire({
          title: 'Error!',
          text: `Size is required for variant ${i + 1}.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return false;
      }
      if (!variant.before_price) {
        Swal.fire({
          title: 'Error!',
          text: `Before Price is required for variant ${i + 1}.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return false;
      }
      if (!variant.after_price) {
        Swal.fire({
          title: 'Error!',
          text: `After Price is required for variant ${i + 1}.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return false;
      }
    }

    return true;
  };

  // Handle Form Submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateData()) return;

    const formDataToSend = new FormData();

    // Append top-level non-variant fields
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'variants' || key === 'img') return; // Skip variants and img for now
      if (key === 'instock') {
        formDataToSend.append('Available', value.toLowerCase() === 'yes' ? 'Yes' : 'No'); // Map 'instock' to 'Available'
      } else {
        formDataToSend.append(key, value);
      }
    });

    // Append new images
    if (Array.isArray(productData.img)) {
      productData.img.forEach((file) => {
        formDataToSend.append('img', file);
      });
    }

    // Append variants
    if (Array.isArray(productData.variants)) {
      productData.variants.forEach((variant, index) => {
        formDataToSend.append(`variants[${index}][size]`, variant.size);
        formDataToSend.append(`variants[${index}][before_price]`, variant.before_price);
        formDataToSend.append(`variants[${index}][after_price]`, variant.after_price);
        formDataToSend.append(`variants[${index}][Available]`, variant.Available); // Changed 'available' to 'Available'
      });
    }

    // Optionally, append existingImages if backend needs them
    // formDataToSend.append('existingImages', JSON.stringify(existingImages));

    // For debugging: Log the FormData entries
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await axios.put(`${API_URL}/product/update/${id}`, formDataToSend, {
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
        text: error.response?.data?.error || "Failed to update the product. Please try again.",
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

            {/* Product Name */}
            <div>
              <Typography variant="small" className="block mb-1">Product Name</Typography>
              <Input 
                name="name" 
                value={productData.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Description */}
            <div>
              <Typography variant="small" className="block mb-1">Description</Typography>
              <Input 
                name="description" 
                value={productData.description} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Sale */}
            <div>
              <Typography variant="small" className="block mb-1">Sale</Typography>
              <Input 
                name="sale" 
                value={productData.sale} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Main Product Type */}
            <div>
              <Typography variant="small" className="block mb-1">Main Product Type</Typography>
              <Input 
                name="main_product_type" 
                value={productData.main_product_type} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Product Type */}
            <div>
              <Typography variant="small" className="block mb-1">Product Type</Typography>
              <Input 
                name="product_type" 
                value={productData.product_type} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Season */}
            <div>
              <Typography variant="small" className="block mb-1">Season</Typography>
              <Input 
                name="season" 
                value={productData.season} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Brand Selection */}
            <div>
              <Typography variant="small" className="block mb-1">Brand</Typography>
              <select 
                name="brandID" 
                value={productData.brandID || ''} 
                onChange={handleChange} 
                className="block w-full border p-2 rounded-lg"
                required
              >
                <option value="">Select a Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                ))}
              </select>
            </div>

            {/* Bag Type Selection */}
            <div>
              <Typography variant="small" className="block mb-1">Bag Type</Typography>
              <select 
                name="BagTypeID" 
                value={productData.BagTypeID || ''} 
                onChange={handleChange} 
                className="block w-full border p-2 rounded-lg"
                required
              >
                <option value="">Select a Bag Type</option>
                {bagTypes.map((bagType) => (
                  <option key={bagType.id} value={bagType.BagTypeID}>{bagType.TypeName}</option> // Adjust based on your data structure
                ))}
              </select>
            </div>

            {/* Fragrance Type Selection */}
            {productData.main_product_type.toLowerCase() === 'fragrance' && (
              <div>
                <Typography variant="small" className="block mb-1">Fragrance Type</Typography>
                <select 
                  name="FragranceTypeID" 
                  value={productData.FragranceTypeID || ''} 
                  onChange={handleChange} 
                  className="block w-full border p-2 rounded-lg"
                  required
                >
                  <option value="">Select a Fragrance Type</option>
                  {fragranceTypes.map((fragranceType) => (
                    <option key={fragranceType.id} value={fragranceType.FragranceTypeID}>{fragranceType.TypeName}</option> // Adjust based on your data structure
                  ))}
                </select>
              </div>
            )}

            {/* Top-Level Before Price */}
            <div>
              <Typography variant="small" className="block mb-1">Before Price</Typography>
              <Input 
                type="number" 
                name="before_price" 
                value={productData.before_price} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Top-Level After Price */}
            <div>
              <Typography variant="small" className="block mb-1">After Price</Typography>
              <Input 
                type="number" 
                name="after_price" 
                value={productData.after_price} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Stock Status */}
            <div>
              <Typography variant="small" className="block mb-1">Stock Status</Typography>
              <select 
                name="instock" 
                value={productData.instock.toLowerCase() === 'yes' ? 'Yes' : 'No'} 
                onChange={handleChange} 
                className="block w-full border p-2 rounded-lg"
                required
              >
                <option value="">Choose Status</option>
                <option value="Yes">In Stock</option>
                <option value="No">Out of Stock</option>
              </select>
            </div>

            {/* Watch Type */}
            <div>
              <Typography variant="small" className="block mb-1">Watch Type</Typography>
              <select 
                name="WatchTypeID" 
                value={productData.WatchTypeID || ''} 
                onChange={handleChange} 
                className="block w-full border p-2 rounded-lg"
              >
                <option value="">Select a Watch Type</option>
                {watchTypes.map((type) => (
                  <option key={type.WatchTypeID} value={type.WatchTypeID}>{type.TypeName}</option>
                ))}
              </select>
            </div>

            {/* Variants Section */}
            <div className="md:col-span-2">
              <Typography variant="small" className="block mb-1">Variants</Typography>
              {productData.variants.map((variant, index) => (
                <div key={index} className="flex flex-col mb-4 border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="mb-1">Variant {index + 1}</Typography>
                    {productData.variants.length > 1 && (
                      <Button type="button" color="red" onClick={() => removeVariant(index)}>Remove</Button>
                    )}
                  </div>
                  <Input 
                    name="size" 
                    value={variant.size} 
                    placeholder="Size" 
                    onChange={(e) => handleVariantChange(index, e)} 
                    required 
                  />
                  <Input 
                    name="variant_before_price" // Renamed to avoid confusion
                    value={variant.before_price} 
                    placeholder="Variant Before Price" 
                    type="number" 
                    onChange={(e) => handleVariantChange(index, e)} 
                    required 
                  />
                  <Input 
                    name="variant_after_price" // Renamed to avoid confusion
                    value={variant.after_price} 
                    placeholder="Variant After Price" 
                    type="number" 
                    onChange={(e) => handleVariantChange(index, e)} 
                    required 
                  />
                  <div className="flex items-center mt-2">
                    <input 
                      type="checkbox" 
                      name="Available" // Changed from 'available' to 'Available'
                      checked={variant.Available} 
                      onChange={(e) => handleVariantChange(index, e)} 
                      className="mr-2"
                    />
                    <Typography variant="small">Available</Typography>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addVariant} className="mt-2">
                Add Variant
              </Button>
            </div>

            {/* Images Section */}
            <div className="md:col-span-2">
              <Typography variant="small" className="block mb-1">Images</Typography>
              <div className="flex flex-col">
                {existingImages.map((image, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <img src={`${API_URL}/${image}`} alt={`Existing product ${index + 1}`} className="mr-2 w-32 h-32 object-cover" />
                    <Button onClick={() => handleRemoveImage(index)} color="red">Remove</Button>
                  </div>
                ))}
                <Input 
                  type="file" 
                  name="img" 
                  onChange={handleFileChange} 
                  multiple 
                  accept="image/*" 
                />
              </div>
            </div>

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
