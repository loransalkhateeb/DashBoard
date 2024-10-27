import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import   AddWatch  from "./pages/dashboard/Products/AddProducts/AddWatches";
import AddFragrance from "./pages/dashboard/Products/AddProducts/AddFragrance";
import AddBags from "./pages/dashboard/Products/AddProducts/AddBags";



function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/addwatches" element={<AddWatch/>} />
      <Route path="/addfragrance" element={<AddFragrance/>} />
      <Route path="/addbags" element={<AddBags/>} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
