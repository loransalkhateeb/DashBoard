import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { useParams ,useNavigate} from 'react-router-dom';
import { API_URL } from '@/App';

export function UpdateBags() {
  const { id, BagID } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: 'Bag',
    product_type: '',
    season: '', 
    brandID: '',
    BagTypeID: '',
    BagVariants: [{ BagID: BagID || '', size: '', available: '', Color: '', before_price: '', after_price: '' }],
    instock: 'Yes',
    img: [],
  });

  const [brands, setBrands] = useState([]);
  const [bagTypes, setBagTypes] = useState([]);
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

  const fetchBagTypes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/bagtypeid/getbagtypeid`);
      if (!response.ok) throw new Error('Failed to fetch bag types');
      const data = await response.json();
      setBagTypes(data);
    } catch (error) {
      console.error('Error fetching bag types:', error);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/product/getproductbyid/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product data');
      const data = await response.json();
      setProductData(prevData => ({
        ...prevData,
        ...data,
        season: data.season || 'FALL/WINTER', 
        img: data.images || [],
      }));
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrands();
    fetchBagTypes();
    fetchProductData();
  }, [fetchBrands, fetchBagTypes, fetchProductData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...productData.BagVariants];
    updatedVariants[index] = { 
      ...updatedVariants[index], 
      [name]: value, 
      BagID: updatedVariants[index].BagID || BagID 
    };
    setProductData(prevData => ({ ...prevData, BagVariants: updatedVariants }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductData(prevData => ({ ...prevData, img: file }));
  };

  const addVariant = () => {
    setProductData(prevData => ({
      ...prevData,
      BagVariants: [...prevData.BagVariants, { BagID: '', size: '', available: '', Color: '', before_price: '', after_price: '' }],
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredVariants = productData.BagVariants.filter(variant =>
      variant.size && variant.available && variant.Color && variant.before_price && variant.after_price
    );

    const formDataToSend = {
      name: productData.name,
      description: productData.description,
      sale: productData.sale,
      main_product_type: productData.main_product_type,
      product_type: productData.product_type,
      season: productData.season,
      brandID: productData.brandID,
      BagTypeID: productData.BagTypeID,
      instock: productData.instock === 'Yes' ? "Yes" : "No",
      BagVariants: filteredVariants.map(variant => ({
        BagID: variant.BagID,
        size: variant.size,
        available: variant.available,
        Color: variant.Color,
        before_price: parseFloat(variant.before_price),
        after_price: parseFloat(variant.after_price),
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      Swal.fire({
        title: 'Successfully Updated!',
        text: 'The product has been updated successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      navigate('/dashboard/products')
    } catch (error) {
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

  const bagTypeOptions = useMemo(() => bagTypes.map(type => (
    <option key={type.BagTypeID} value={type.BagTypeID}>{type.TypeName}</option>
  )), [bagTypes]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4">Update Bag</Typography>
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
              <label htmlFor="sale" className="block mb-1">Sale</label>
              <select id="sale" name="sale" value={productData.sale} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div>
              <label htmlFor="product_type" className="block mb-1">Product Type</label>
              <Input id="product_type" name="product_type" value={productData.product_type} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="season" className="block mb-1">Season</label>
              <select id="season" name="season" value={productData.season} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="FALL/WINTER">FALL/WINTER</option>
                <option value="SPRING/SUMMER">SPRING/SUMMER</option>
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
              <label htmlFor="BagTypeID" className="block mb-1">Bag Type</label>
              <select id="BagTypeID" name="BagTypeID" value={productData.BagTypeID} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="">Select a bag type</option>
                {bagTypeOptions}
              </select>
            </div>
            <div>
              <label htmlFor="instock" className="block mb-1">Status</label>
              <select id="instock" name="instock" value={productData.instock} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="Yes">In Stock</option>
                <option value="No">Out of Stock</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Variants</label>
              {productData.BagVariants.map((variant, index) => (
                <div key={index} className="flex flex-col mb-4 border p-4 rounded-lg">
                  <Input name="size" value={variant.size} placeholder="Size" onChange={(e) => handleVariantChange(index, e)}  />
                  <Input name="available" value={variant.available} placeholder="Available (Yes/No)" onChange={(e) => handleVariantChange(index, e)}  />
                  <Input name="Color" value={variant.Color} placeholder="Color" onChange={(e) => handleVariantChange(index, e)}  />
                  <Input name="before_price" value={variant.before_price} placeholder="Before Price" type="number" onChange={(e) => handleVariantChange(index, e)}  />
                  <Input name="after_price" value={variant.after_price} placeholder="After Price" type="number" onChange={(e) => handleVariantChange(index, e)}  />
                </div>
              ))}
              <Button type="button" onClick={addVariant} className="mt-4">Add Variant</Button>
            </div>
            <div>
            <div className="flex flex-wrap gap-4">
                {productData.img.length > 0 && productData.img.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image instanceof File ? URL.createObjectURL(image) : image.img}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-32 h-32 object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 text-red-500"
                      onClick={() => handleImageDelete(image.img || image.name)} 
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              <Input id="img" type="file" onChange={handleImageChange} accept="image/*" />
            </div>
          </div>
          <Button type="submit" className="w-full" color="blue">Update Bag</Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateBags;
