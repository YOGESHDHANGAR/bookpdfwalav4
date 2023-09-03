import "./App.css";
import Home from "./Components/Home/Home";
import { Routes, Route } from "react-router-dom";
import Bookpdfdetails from "./Components/Bookpdfdetails/Bookpdfdetails";
import Paymentsuccess from "./Components/Paymentsuccess/Paymentsuccess";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/bookpdfdetails/:bookpdf_id"
          element={<Bookpdfdetails />}
        />
        <Route path="/paymentsuccess" element={<Paymentsuccess />} />
      </Routes>
    </>
  );
}

export default App;
