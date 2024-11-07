import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { useParams,useNavigate } from 'react-router-dom';
import { API_URL } from '@/App';

export function UpdateFragrances() {
  const { id, FragranceID } = useParams();
  const navigate = useNavigate();
  console.log(FragranceID);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: 'Fragrance',
    product_type: '',
    season: '',
    brandID: '',
    FragranceTypeID: '',
    FragranceVariants: [{ FragranceID: FragranceID, size: '', available: 'no', before_price: '', after_price: '' }],
    instock: '',
    img: [],
  });

  const [brands, setBrands] = useState([]);
  const [fragranceTypes, setFragranceTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  
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

 
  const fetchFragranceTypes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/fragrancetypeid/getfragrancetypeid`);
      if (!response.ok) throw new Error('Failed to fetch fragrance types');
      const data = await response.json();
      setFragranceTypes(data);
    } catch (error) {
      console.error('Error fetching fragrance types:', error);
    }
  }, []);

  // Fetching product data from the API
  const fetchProductData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/product/getproductbyid/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product data');
      const data = await response.json();
      setProductData(prevData => ({
        ...prevData,
        ...data,
        FragranceVariants: data.FragranceVariants || prevData.FragranceVariants,
        img: data.images || [],
      }));
      console.log("first product",data.instock)
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrands();
    fetchFragranceTypes();
    fetchProductData();
    console.log("first",productData.instock)
  }, [fetchBrands, fetchFragranceTypes, fetchProductData]);

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...productData.FragranceVariants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setProductData(prevData => ({ ...prevData, FragranceVariants: updatedVariants }));
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductData(prevData => ({ ...prevData, img: [...prevData.img, ...files] }));
  };

  const handleImageDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/product/deleteProductImageById/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
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

          setProductData(prevData => ({
            ...prevData,
            img: prevData.img.filter(img => img.id !== id),
          }));
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

 
  const addVariant = () => {
    setProductData(prevData => ({
      ...prevData,
      FragranceVariants: [...prevData.FragranceVariants, { FragranceID: '', size: '', available: 'no', before_price: '', after_price: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredVariants = productData.FragranceVariants.filter(variant =>
      variant.size && variant.available && variant.before_price && variant.after_price
    );

    const formDataToSend = {
      ...productData,
      sale: productData.sale,
      instock: productData.instock,
      variants:filteredVariants.map(variant => ({
        FragranceID: variant.FragranceID,
        size: variant.size,
        available: variant.available,
        before_price: parseFloat(variant.before_price) || 0,
        after_price: parseFloat(variant.after_price) || 0,
      })),
    };

    try {
      const response = await fetch(`${API_URL}/product/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formDataToSend),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Network response was not ok: ${await response.text()}`);

      Swal.fire({
        title: 'Successfully Updated!',
        text: 'The product has been updated successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      navigate('/dashboard/products')
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem updating the product. Please try again.',
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4">Update Fragrance</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Fill in the details below to update the product.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block mb-1">Name</label>
              <Input id="name" name="name" value={productData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">Description</label>
              <Input id="description" name="description" value={productData.description} onChange={handleChange} required />
            </div>
            <div>
              <div>
                <label htmlFor="sale" className="block mb-1">Sale</label>
                <select
                  id="sale"
                  name="sale"
                  value={productData.sale}
                  onChange={handleChange}
                  className="block w-full border p-2 rounded-lg"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="product_type" className="block mb-1">Product Type</label>
              <Input id="product_type" name="product_type" value={productData.product_type} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="season" className="block mb-1">Season</label>
              <select
                id="season"
                name="season"
                value={productData.season}
                onChange={handleChange}
                className="block w-full border p-2 rounded-lg"
              >
                <option value="FALL/WINTER">FALL / WINTER</option>
                <option value="SPRING/SUMMER">SPRING / SUMMER</option>
              </select>
            </div>
            <div>
              <label htmlFor="brandID" className="block mb-1">Brand</label>
              <select id="brandID" name="brandID" value={productData.brandID} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="">Select a brand</option>
                {brandOptions}
              </select>
            </div>
            <div>
              <label htmlFor="FragranceTypeID" className="block mb-1">Fragrance Type</label>
              <select id="FragranceTypeID" name="FragranceTypeID" value={productData.FragranceTypeID} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="">Select a fragrance type</option>
                {fragranceTypeOptions}
              </select>
            </div>
            <div>
              <label htmlFor="instock" className="block mb-1">Choose Status</label>
              <select
                id="instock"
                name="instock"
                value={productData.instock}
                onChange={handleChange}
                className="block w-full border p-2 rounded-lg"
              >
                <option value="Yes">In Stock</option>
                <option value="no">Out of Stock</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Sizes</label>
              {productData.FragranceVariants.map((variant, index) => (
                <div key={index} className="flex flex-col mb-4 border p-4 rounded-lg">
                  <Input name="size" value={variant.size} placeholder="Size" onChange={(e) => handleVariantChange(index, e)} />
                  <div>
                    <label htmlFor={`available-${index}`} className="block mb-1">Available</label>
                    <select id={`available-${index}`} name="available" value={variant.available} onChange={(e) => handleVariantChange(index, e)} className="block w-full border p-2 rounded-lg">
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <Input name="before_price" value={variant.before_price} placeholder="Before Price" type="number" onChange={(e) => handleVariantChange(index, e)} />
                  <Input name="after_price" value={variant.after_price} placeholder="After Price" type="number" onChange={(e) => handleVariantChange(index, e)} />
                </div>
              ))}
              <Button type="button" onClick={addVariant} className="mt-4">Add Variant</Button>
            </div>
          </div>
          <div className="mt-6">
            <label className="block mb-2">Images</label>
            <div className="flex flex-wrap gap-4">
              {productData.img.length > 0 && productData.img.map((image, index) => (
                <div key={image.id} className="relative">
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

          <Button type="submit" className="w-full mt-6" color="blue">Update Fragrance</Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateFragrances;
