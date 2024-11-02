import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';

export function Products() {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:1010/product/get/allproducts");
        const data = await response.json();
        setProducts(data); 
        console.log(data)
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProducts(); 
  }, []);

  const handleAddProduct = async () => {
    await Swal.fire({
      title: '<span style="color: black;">Choose the type of the product:</span>', 
      showCloseButton: true,
      background: '#fff',  
      html: `
        <div class="flex justify-around" style="width: 100%; padding: 20px 0;">
          <button id="addWatches" class="bg-black text-white py-2 rounded inline-flex items-center hover:shadow-lg hover:shadow-red-500 transition duration-300" style="margin: 0 15px; min-width: 150px; padding-left: 20px;">
            Add Watches
          </button>
          <button id="addFragrance" class="bg-black text-white py-2 rounded inline-flex items-center hover:shadow-lg hover:shadow-red-500 transition duration-300" style="margin: 0 15px; min-width: 150px; padding-left: 20px;">
            Add Fragrance
          </button>
          <button id="addBag" class="bg-black text-white py-2 rounded inline-flex items-center hover:shadow-lg hover:shadow-red-500 transition duration-300" style="margin: 0 15px; min-width: 150px; padding-left: 20px;">
            Add Bag
          </button>
        </div>
      `,
      focusConfirm: false,
      allowOutsideClick: true,
      showCancelButton: false, 
      showConfirmButton: false, 
      width: '600px', 
      padding: '20px', 
      didOpen: () => {
        document.getElementById('addWatches').addEventListener('click', () => {
          Swal.close();
          navigate('/dashboard/addwatches', { replace: true }); 
        });

        document.getElementById('addFragrance').addEventListener('click', () => {
          Swal.close();
          navigate('/dashboard/addfragrance'); 
        });

        document.getElementById('addBag').addEventListener('click', () => {
          Swal.close();
          navigate('/dashboard/addbags'); 
        });
      },
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this product?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      background: '#000', 
      color: '#fff',
      customClass: {
        confirmButton: 'bg-blue-600 text-white', 
        cancelButton: 'bg-red-600 text-white'
      }
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:1010/product/delete/${id}`, { method: 'DELETE' });
        setProducts(products.filter(product => product.id !== id));
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your product has been deleted.',
          icon: 'success',
          background: '#000',
          color: '#fff',
          customClass: {
            confirmButton: 'bg-blue-600 text-white' 
          }
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error deleting the product.',
          icon: 'error',
          background: '#000',
          color: '#fff', 
        });
      }
    }
  };

  const renderedProducts = useMemo(() => {
    return products.map((product, key) => {
      const { id, name, description, sale, main_product_type, product_type, season, instock, updated_at, after_price, before_price } = product;
      const className = `py-3 px-5 ${key === products.length - 1 ? "" : "border-b border-blue-gray-50"}`;

      return (
        <tr key={id}>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{id}</Typography>
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{name}</Typography>
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{description}</Typography>
          </td>
          <td className={className}>
            <Chip variant="gradient" color={sale === "yes" ? "red" : "green"} value={sale === "yes" ? "On Sale" : "Not on Sale"} className="py-0.5 px-2 text-[11px] font-medium w-fit" />
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{instock === "yes" ? "In Stock" : "Out of Stock"}</Typography>
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{after_price !== null ? `$${after_price}` : "N/A"}</Typography>
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{before_price !== null ? `$${before_price}` : "N/A"}</Typography>
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{main_product_type}</Typography>
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{product_type}</Typography>
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{season}</Typography>
          </td>
          <td className={className}>
            <Typography variant="small" color="blue-gray" className="font-semibold">{updated_at}</Typography>
          </td>
          <td className={className}>
            <div className="flex items-center">
              <Button onClick={() => handleEdit(product)} className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500">
                <PencilIcon className="h-5 w-5 mr-1" /> Edit
              </Button>

              <Button onClick={() => handleDelete(id)} className="text-red-600 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500">
                <TrashIcon className="h-5 w-5 mr-1" /> Delete
              </Button>
            </div>
          </td>
        </tr>
      );
    });
  }, [products]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Products Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <div className="flex justify-start mb-4">
            <Button
              onClick={handleAddProduct} 
              className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
              style={{ marginLeft: '80px' }} 
            >
              <PlusIcon className="h-5 w-5 mr-1" /> Add Product
            </Button>
          </div>
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Name", "Description", "Sale", "In Stock", "After Price", "Before Price", "Main Product Type", "Product Type", "Season", "Updated At"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="text-center py-3">
                    <Typography className="text-gray-500">Loading...</Typography>
                  </td>
                </tr>
              ) : (
                renderedProducts
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Products;
