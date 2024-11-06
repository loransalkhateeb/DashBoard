import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Input, Typography } from '@material-tailwind/react';
import { API_URL } from '@/App';

const UpdateFragranceVariant = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Size: '',
    Available: 'false',
    before_price: '',
    after_price: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariantData = async () => {
      try {
        const response = await fetch(`${API_URL}/product/getfragrancevariantsbyid/${id}`);
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
 
          const variant = data[0]; 
          setFormData({
            Size: variant.Size || '',
            Available: variant.Available ? variant.Available.toString() : 'false',
            before_price: variant.before_price || '',
            after_price: variant.after_price || '',
          });
        } else {
          throw new Error('Data not found');
        }
      } catch (error) {
        console.error("Error fetching fragrance variant data:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load data.',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVariantData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/product/updateFragranceVariants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Fragrance variant updated successfully.',
          icon: 'success',
        });
        navigate('/dashboard/products');
      } else {
        const errorData = await response.json();
        await Swal.fire({
          title: 'Error!',
          text: errorData.error,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error("Error updating fragrance variant:", error);
      await Swal.fire({
        title: 'Error!',
        text: 'An error occurred while updating.',
        icon: 'error',
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">Update Fragrance Variant</Typography>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Size"
            name="Size"
            value={formData.Size}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Available</label>
          <select
            name="Available"
            value={formData.Available}
            onChange={handleChange}
            className="border rounded px-2 py-1"
            required
          >
            
<option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>
        <div className="mb-4">
          <Input
            type="number"
            label="Before Price"
            name="before_price"
            value={formData.before_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="number"
            label="After Price"
            name="after_price"
            value={formData.after_price}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" color="black">Update Variant</Button>
      </form>
    </div>
  );
};

export default UpdateFragranceVariant;