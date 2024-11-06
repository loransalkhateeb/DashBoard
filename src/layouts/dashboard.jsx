import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";

import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import AddUser from "@/pages/dashboard/Users/AddUser";
import UpdateUser from "@/pages/dashboard/Users/UpdateUser";
import AddBrand from "@/pages/dashboard/Brands/AddBrand";
import UpdateBrand from "@/pages/dashboard/Brands/UpdateBrand";
import AddCode from "@/pages/dashboard/Codes/AddCodes";
import UpdateCode from "@/pages/dashboard/Codes/UpdateCode";
import AddSlide from "@/pages/dashboard/Slider/AddSlide";
import UpdateSlide from "@/pages/dashboard/Slider/UpdateSlide";
import AddWrapGift from "@/pages/dashboard/WrapGift/AddWrapGift";
import UpdateWrapGift from "@/pages/dashboard/WrapGift/UpdateWrapGift";

import { AddWatch } from "@/pages/dashboard/Products/AddProducts/AddWatches";
import AddFragrance from "@/pages/dashboard/Products/AddProducts/AddFragrance";
import  AddBags  from "@/pages/dashboard/Products/AddProducts/AddBags";
// import UpdateProducts from "@/pages/dashboard/Products/UpdateProducts";
import UpdateWatches from "@/pages/dashboard/Products/UpdateProducts/UpdateWatches";
import UpdateFragrances from "@/pages/dashboard/Products/UpdateProducts/UpdateFragrances";
import UpdateBags from "@/pages/dashboard/Products/UpdateProducts/UpdateBags";
import UpdateBagVariant from "@/pages/dashboard/Products/UpdateBagsVariant";
import UpdateFragranceVariant from "@/pages/dashboard/Products/UpdateFragranceVariant";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(({ layout, pages }) =>
            layout === "dashboard" &&
            pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
          )}

           <Route path="/addwatches" element={<AddWatch/>} />
           <Route path="/addfragrance" element={<AddFragrance/>} />
           <Route path="/addbags" element={<AddBags/>} />

            <Route path="adduser" element={<AddUser />} />
            <Route path="updateuser/:id" element={<UpdateUser />} />
            <Route path="addbrand" element={<AddBrand />} />
            <Route path="updatebrand/:id" element={<UpdateBrand />} />
            <Route path="addcode" element={<AddCode />} />
            <Route path="updatecode/:id" element={<UpdateCode />} />
            <Route path="addslide" element={<AddSlide />} />
            <Route path="updateslide/:id" element={<UpdateSlide />} />
            <Route path="addwrapgift" element={<AddWrapGift />} />
            <Route path="updatewrapgift/:id" element={<UpdateWrapGift />} />
            {/* <Route path="updateproduct/:id" element={<UpdateProducts />} />  */}

            
            <Route path="updatewatches/:id" element={<UpdateWatches />} />
            <Route path="updateFragrances/:id/:FragranceID" element={<UpdateFragrances />} />
<Route path="updateBags/:id/:BagID" element={<UpdateBags />} />
          <Route path="updatebagvariants/:id" element={<UpdateBagVariant/>} />
          <Route path="updateFragrancesVariant/:id" element={<UpdateFragranceVariant />} />

        </Routes>   
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
