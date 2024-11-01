import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Cookies from 'js-cookie';
import   AddWatch  from "./pages/dashboard/Products/AddProducts/AddWatches";
import AddFragrance from "./pages/dashboard/Products/AddProducts/AddFragrance";
import AddBags from "./pages/dashboard/Products/AddProducts/AddBags";
import { useState,useEffect } from "react";



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
// import UpdateProducts from "./pages/dashboard/Products/UpdateProducts";
import { SignIn } from "./pages/auth";
import UpdateWatches from "./pages/dashboard/Products/UpdateProducts/UpdateWatches";
import UpdateFragrances from "./pages/dashboard/Products/UpdateProducts/UpdateFragrances";
import UpdateBags from "./pages/dashboard/Products/UpdateProducts/UpdateBags";
export const API_URL="http://localhost:1010";

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('authtoken'));

  useEffect(() => {
    const token = Cookies.get('authtoken');
    if (token) {
      // setIsAuthenticated(true);
      setIsAuthenticated(!!token);
    }
  }, []);
  // console.log("Cookies:", Cookies.get());
  console.log("auth:",isAuthenticated);
  return (
    <Routes>

      {/* <Route path="/dashboard/*" element={<Dashboard />}> */}
      <Route path="/dashboard/*" element={
        isAuthenticated ? <Dashboard /> : <Navigate to="/auth/sign-in" replace />
      }> 
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
        {/* <Route path="updateproduct/:id" element={<UpdateProducts />} />  */}


        {/* <Route path="updatewatches/:id" element={<UpdateWatches />} /> 
        <Route path="updatefragrances/:id" element={<UpdateFragrances />} /> 
        <Route path="updatebags/:id" element={<UpdateBags />} />  */}


      </Route>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/addwatches" element={<AddWatch/>} />
      <Route path="/addfragrance" element={<AddFragrance/>} />
      <Route path="/addbags" element={<AddBags/>} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />

    </Routes>
  );
}

export default App;
