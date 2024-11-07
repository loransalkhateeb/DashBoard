import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';
import { API_URL } from '@/App';

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product/variants/getAllProductsWithVariantsCMS`);
        const rawData = await response.json();
       
        const formattedProducts = rawData.map(item => {
          const product = item.product;
          const variants = item.variants || [];
          let variantDisplay = "";

          if (product.main_product_type === "Watch") {
            variantDisplay = "No variants available"; // لا نعرض أي حجم للساعات
          } else if (product.main_product_type === "Fragrance") {
            variantDisplay = variants.map(v => `Size: ${v.Size} (Available: ${v.Available}, Before Price: ${v.before_price}, After Price: ${v.after_price})`).join(', ') || "N/A";
          } else if (product.main_product_type === "Bag") {
            variantDisplay = variants.map(v => `Size: ${v.Size}, Color: ${v.Color} (Before Price: ${v.before_price}, After Price: ${v.after_price})`).join(', ') || "N/A";
          }

          const variantDetails = variants.map(variant => ({
            VariantID: variant.VariantID,
            Size: variant.Size,
            Color: variant.Color,
            Available: variant.Available,
            before_price: variant.before_price,
            after_price: variant.after_price,
          }));
   
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            sale: product.sale,
            FragranceID: product.FragranceID,
            BagID: product.BagID,
            main_product_type: product.main_product_type,
            product_type: product.product_type,
            season: product.season,
            instock: product.instock,
            brand: product.brand,
            updated_at: product.updated_at,
            after_price: product.after_price || variantDetails[0]?.after_price || "N/A",
            before_price: product.before_price || variantDetails[0]?.before_price || "N/A",
            variants: variantDisplay,
            variantDetails,
          };
        });

        setProducts(formattedProducts);
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
        await fetch(`${API_URL}/product/delete/${id}`, { method: 'DELETE' });
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

  const handleEdit = (product) => {
    const { main_product_type, id } = product;

    switch (main_product_type) {
      case "Watch":
        navigate(`/dashboard/updatewatches/${id}`);
        break;
      case "Fragrance":
        navigate(`/dashboard/updateFragrances/${id}/${product.FragranceID}`);
        break;
      case "Bag":
        navigate(`/dashboard/updateBags/${id}/${product.BagID}`);
        break;
      default:
        Swal.fire({
          title: 'Error!',
          text: 'Unknown product type.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
    }
  };

  const handleEditVariant = (variant, product) => {
    const { main_product_type } = product;
    const { VariantID } = variant;
 
    switch (main_product_type) {
      case "Fragrance":
        navigate(`/dashboard/updateFragrancesVariant/${VariantID}`);
        break;
      case "Bag":
        navigate(`/dashboard/updatebagvariants/${VariantID}`);
        break;
      default:
        Swal.fire({
          title: 'Error!',
          text: 'Unknown variant type.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
    }
  };

  const handleDeleteVariant = async (variant) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this variant?',
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
        await fetch(`${API_URL}/product/deletefragrancevariant/${variant.VariantID}`, {
          method: 'DELETE'
        });
 
        setProducts(prevProducts =>
          prevProducts.map(product => ({
            ...product,
            variantDetails: product.variantDetails.filter(v => v.VariantID !== variant.VariantID)
          }))
        );
 
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your variant has been deleted.',
          icon: 'success',
          background: '#000',
          color: '#fff',
          customClass: {
            confirmButton: 'bg-blue-600 text-white'
          }
        });
      } catch (error) {
        console.error("Error deleting variant:", error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error deleting the variant.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
      }
    }
  };
  const handleDeleteBagVariant = async (variant) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this bag variant?',
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
        await fetch(`${API_URL}/product/deletebagvariant/${variant.VariantID}`, {
          method: 'DELETE'
        });
  
        setProducts(prevProducts =>
          prevProducts.map(product => ({
            ...product,
            variantDetails: product.variantDetails.filter(v => v.VariantID !== variant.VariantID)
          }))
        );
  
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your bag variant has been deleted.',
          icon: 'success',
          background: '#000',
          color: '#fff',
          customClass: {
            confirmButton: 'bg-blue-600 text-white'
          }
        });
      } catch (error) {
        console.error("Error deleting bag variant:", error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error deleting the bag variant.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
      }
    }
  };
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12"> 
    <Card >
      <CardHeader variant="gradient" color="gray" className="mb-3 p-6">
        <Typography variant="h6" color="white">
          Manage Products
        </Typography>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between mb-4">
          {/* <Button className="bg-blue-600 text-white" >
            <PlusIcon className="h-5 w-5 mr-2" /> Add Product
          </Button> */}
          <Button onClick={handleAddProduct}
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '50px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> Add Product
</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto text-blue-gray-700">
            <thead>
              <tr>
                {[
                  "ID", "Name", "Description", "Sale",
                  "Before Price", "After Price", "Main Product Type",
                  "Product Type", "Season","Instock","Brand", "Updated At", "Variants",
                  "Variants Action", "Actions"
                ].map((header) => (
                  <th key={header} className="border-b py-3 px-5 text-left">
                    <Typography variant="small" className="font-semibold text-xs text-blue-gray-500">
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="py-3 text-center">
                    <Typography className="text-gray-500">Loading...</Typography>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border-b py-3 px-5">{product.id}</td>
                    <td className="border-b py-3 px-5">{product.name}</td>
                    <td className="border-b py-3 px-5"><Typography className="text-xs font-semibold text-blue-gray-500 "style={{width:"300px"}}>
                    {product.description}</Typography></td>
                    <td className="border-b py-3 px-5">
                     <Chip
                      variant="gradient"
                      color={product.sale === "yes" ? "green" :"red"}
                     value={product.sale}
                    className="py-0.5 px-5 text-[11px] font-medium text-center"
                    />
                   </td>
                    <td className="border-b py-3 px-5 text-right">{product.before_price} JD</td>
                    <td className="border-b py-3 px-5 text-right">{product.after_price} JD</td>
                    <td className="border-b py-3 px-5">{product.main_product_type}</td>
                    <td className="border-b py-3 px-5">{product.product_type}</td>
                    <td className="border-b py-3 px-5">{product.season}</td>
                    <td className="border-b py-3 px-5">{product.instock}</td>
                    <td className="border-b py-3 px-5">{product.brand}</td>
                    <td className="border-b py-3 px-5">{product.updated_at}</td>
                    <td className="border-b py-3 px-5">
                      <ul className="list-disc pl-5 space-y-2">
                        {product.variantDetails.map((variant) => (
                          <li key={variant.VariantID} className="text-sm text-gray-700"style={{width:"300px"}}>
                            Size :  {variant.Size ? variant.Size : "No Size"} ,Color: {variant.Color ? variant.Color : "No Color"}, Before Price: {variant.before_price} JD, After Price: {variant.after_price}JD,Available:{variant.Available}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border-b py-3 px-5">
                      <div className="flex flex-col gap-2">
                        {product.variantDetails.map((variant) => (
                          <div key={variant.VariantID} className="flex gap-2">
                            <Button className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                             color="blue-gray" variant="text" size="sm" onClick={() => handleEditVariant(variant, product)}>
                              <PencilIcon className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button className="text-red-600 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                             color="red-500" variant="text" size="sm" onClick={() => {
                              if (product.main_product_type === "Bag") {
                                handleDeleteBagVariant(variant);
                              } else if (product.main_product_type === "Fragrance") {
                                handleDeleteVariant(variant);
                              }
                            }}>
                              <TrashIcon className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    </td>
                   <td className="border-b py-3 px-5">
  <div className="flex justify-center gap-2">
    <Button
  
      onClick={() => handleEdit(product)}
      className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
      >
      <PencilIcon className="h-4 w-4 mr-1" /> Edit
    </Button>
    <Button
      onClick={() => handleDelete(product.id)}
      className="text-red-600 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
      >
      <TrashIcon className="h-5 w-5 mr-1" /> Delete
    </Button>
  </div>
</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
    </div>
  );
}

export default Products