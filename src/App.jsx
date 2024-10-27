import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import AddUser from "./pages/dashboard/Users/AddUser.jsx";
import UpdateUser from "./pages/dashboard/Users/UpdateUser.jsx";
import AddBrand from "./pages/dashboard/Brands/AddBrand.jsx";
import UpdateBrand from "./pages/dashboard/Brands/UpdateBrand.jsx";
import AddCode from "./pages/dashboard/Codes/AddCodes.jsx";
import UpdateCode from "./pages/dashboard/Codes/UpdateCode.jsx";
import AddSlide from "./pages/dashboard/Slider/AddSlide.jsx";
import UpdateSlide from "./pages/dashboard/Slider/UpdateSlide.jsx";
import AddWrapGift from "./pages/dashboard/WrapGift/AddWrapGift.jsx";
import UpdateWrapGift from "./pages/dashboard/WrapGift/UpdateWrapGift.jsx";
export const API_URL="http://localhost:1010";
function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />}>
        <Route path="adduser" element={<AddUser />} />
        <Route path="updateuser/:id" element={<UpdateUser />} />
        <Route path="addbrand" element={<AddBrand />} />
        <Route path="updatebrand" element={<UpdateBrand />} />
        <Route path="addcode" element={<AddCode />} />
        <Route path="updatecode/:id" element={<UpdateCode />} />
        <Route path="addslide" element={<AddSlide />} />
        <Route path="updateslide/:id" element={<UpdateSlide />} />
        <Route path="addwrapgift" element={<AddWrapGift />} />
        <Route path="updatewrapgift/:id" element={<UpdateWrapGift />} />
        {/* Add other dashboard routes here */}
      </Route>
      <Route path="/auth/*" element={<Auth />} />
      {/* <Route path="/AddProduct" element={<AddProduct />} />  */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />

    </Routes>
  );
}

export default App;
