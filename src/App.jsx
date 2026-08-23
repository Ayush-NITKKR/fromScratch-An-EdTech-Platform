import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Catalog from "./pages/Catlog";
import ForgotPassword from "./pages/ForgotPassword";
import ContactUs from "./pages/ContactUs";
import UpdatePassword from "./pages/UpdatePassword";
import CourseDetails from "./pages/CourseDetails";
import About from "./pages/About";

import MyProfile from "./components/dashboard/Myprofile";
import PrivateRoute from "./components/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import Setting from "./components/dashboard/Setting";
import EnrolledCourses from "./components/dashboard/EnrolledCourses";
import AddCourse from "./components/dashboard/AddCourse";
import MyCourses from "./components/dashboard/MyCourses";
import CartPage from "./pages/Cart";
import ViewCourse from "./pages/ViewCourse";
import PaymentHistory from "./components/dashboard/PaymentHistory";
import Instructor from "./components/dashboard/Instructor";
import AddCategory from "./components/dashboard/AddCategory";

function App() {
  return (
    <div className="w-screen min-h-screen bg-[#0A0B10] flex flex-col font-poppins px-4 sm:px-8 md:px-12 lg:px-20">

      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />

        <Route
          path="/catalog/:catalogName"
          element={<Catalog />}
        />

        <Route
          path="/courses/:courseId"
          element={<CourseDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/update-password/:token"
          element={<UpdatePassword />}
        />


        {/* PRIVATE ROUTES */}

        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >

          <Route
            path="instructor"
            element={<Instructor />}
          />
          <Route
            path="add-category"
            element={<AddCategory />}
          />
          <Route
            path="my-profile"
            element={<MyProfile />}
          />
          <Route
            path="settings"
            element={<Setting />}
          />
          <Route
            path="enrolled-courses"
            element={<EnrolledCourses />}
          />
          <Route
            path="cart"
            element={<CartPage />}
          />
          <Route
            path="purchase-history"
            element={<PaymentHistory />}
          />
          <Route
            path="add-course"
            element={<AddCourse />}
          />
          <Route
            path="my-courses"
            element={<MyCourses />}
          />
          <Route
            path="view-course/:courseId"
            element={<ViewCourse />}
          />
          <Route path="*" element={<Error/>} />

        </Route>


        {/* ERROR ROUTE */}

        <Route path="*" element={<Error/>} />

      </Routes>

    </div>
  );
}

export default App;
