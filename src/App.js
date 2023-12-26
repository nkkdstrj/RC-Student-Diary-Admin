import "./App.css";

import { Outlet, Route, Routes } from "react-router-dom";
import Content from "./Components/ContentPage/Content";
import File from "./Components/FilePage/FIles";
import Login from "./Components/LoginPage/login";
import Sidebar from "./Components/SideBar/sidebar";

import Home from "./Components/HomePage/home";
import ReminderPage from "./Components/ReminderPage/ReminderPage";
import StudentManager from "./Components/StudentPage/StudentManager";

const SidebarLayout = () => (
  <>
    <div className="container-scroller">
      
      {/* <Navbar /> */}
      <Sidebar />
      <Outlet />
    </div>
  </>
);
// const shet = () => (
//   <>
//     <div className="main-panel"></div>
//   </>
// );
function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<SidebarLayout />}>
            <Route path="/dashboard" index element={<Home />}></Route>
            <Route path="/content" element={<Content/>}></Route>
            <Route path="/student/manager" element={<StudentManager/>}></Route>
            <Route path="/reminder" element={<ReminderPage/>}></Route>
         
            <Route path="/file" element={<File />}></Route>
         
          </Route>         
       
      
        </Routes>
      </div>
    </>
  );
}

export default App;