import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import CategoryHome from "./pages/category/Home";
import CategoryCreate from "./pages/category/CategoryCreate";
import ViewCategory from "./pages/category/ViewCategory";
import MembersHome from "./pages/members/Home";
import MembersCreate from "./pages/members/MembersCreate";
import MembersView from "./pages/members/MembersView";
import PaymentReportHome from "./pages/payment/Home";
import PaymentView from "./pages/payment/PaymentView";
import Footer from "./components/Footer";
import MembersInCategory from "./pages/members/MembersCategory";
import PaymentReportCreate from "./pages/payment/PaymentCreate";

function App() {
  return (
    <>
      <div className="w-full min-h-screen flex flex-col justify-between">
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />
          {/* category parent route */}
          <Route path="/category">
            <Route
              path="/category"
              element={
                <ProtectedRoutes>
                  <CategoryHome />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/category/create"
              element={
                <ProtectedRoutes>
                  <CategoryCreate />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/category/view"
              element={
                <ProtectedRoutes>
                  <ViewCategory />
                </ProtectedRoutes>
              }
            />
          </Route>
          {/* members parent route */}
          <Route path="/members">
            <Route
              path="/members"
              element={
                <ProtectedRoutes>
                  <MembersHome />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/members/create"
              element={
                <ProtectedRoutes>
                  <MembersCreate />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/members/view"
              element={
                <ProtectedRoutes>
                  <MembersView />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/members/category/:categoryId"
              element={
                <ProtectedRoutes>
                  <MembersInCategory />
                </ProtectedRoutes>
              }
            />
          </Route>
          {/* payment report parent route */}
          <Route path="/payment-report">
            <Route
              path="/payment-report"
              element={
                <ProtectedRoutes>
                  <PaymentReportHome />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/payment-report/create"
              element={
                <ProtectedRoutes>
                  <PaymentReportCreate />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/payment-report/view"
              element={
                <ProtectedRoutes>
                  <PaymentView />
                </ProtectedRoutes>
              }
            />
          </Route>
          {/* Add more protected routes as needed */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
        <Footer />
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;
