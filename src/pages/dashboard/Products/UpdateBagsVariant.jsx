import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Input, Typography } from '@material-tailwind/react';
import { API_URL } from '@/App';

const UpdateBagVariant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Size: '',
    Available: 'No',
    before_price: '',
    after_price: '',
    color: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariantData = async () => {
      try {
        const response = await fetch(`${API_URL}/product/getbagsvariansbyid/${id}`);
        const data = await response.json();

        console.log(data); 

        if (data && data[0]) {
          console.log("Fetched color:", data[0].Color); 
          setFormData({
            Size: data[0].Size || '',
            Available: data[0].Available || 'No',
            before_price: data[0].before_price || '',
            after_price: data[0].after_price || '',
            color: data[0].Color || '', 
          });
        } else {
          throw new Error('Data not found');
        }
      } catch (error) {
        console.error("Error fetching bag variant data:", error);
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
      const response = await fetch(`${API_URL}/product/updatebagsvariants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Bag variant updated successfully.',
          icon: 'success',
        });
        navigate('/dashboard/products');
      } else {
        const errorData = await response.json();
        await Swal.fire({
          title: 'Error!',
          text: errorData.error || 'Failed to update variant.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error("Error updating bag variant:", error);
      await Swal.fire({
        title: 'Error!',
        text: 'An error occurred while updating.',
        icon: 'error',
      });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">Update Bag Variant</Typography>
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
            aria-label="Available"
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
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
        <div className="mb-4">
          <Input
            label="Color"
            name="color" 
            value={formData.color} 
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" color="black">Update Variant</Button>
      </form>
    </div>
  );
};

export default UpdateBagVariant;