import React,{useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './logincomponents/login.js';
import GenerateChatApp from '../src/chatApplication/GenerateChatApp.js';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import BackgroundComponent from './background/background.js';
import UserRoutes from './Routes/UserRoute.js';
import { AuthProvider } from './Routes/AuthContex.js';
import ForgotPassword from './forgotPassword/forgotpassword.js';
import CreateProfile from './CreateUser/CreateProfile.js';
import Home from './Home/home.js'
import Profile from './Profile/profile.js'
import Createpost from './CreatePost/Createpost.js';
import ProfielSearch from './ProfileSearch/ProfileSearch.js';
import { useAuth } from './Routes/AuthContex.js';
import socket from './socket.js';
import Settings from '../src/settings/setting.js';
function AppContent() {
  const location = useLocation();
  const isBackgroundVisible = location.pathname === '/signin' || location.pathname === '/signup';
  const auth=useAuth();
  console.log(auth);
  useEffect(() => {
    if (auth?.user?._id) {
        console.log('User ID:', auth.user._id); // Debugging log
        socket.emit("addUser", auth.user._id);

        // Set up the listener for getUsers if necessary
        // socket.on("getUsers", (users) => {
        //     console.log("Connected users:", users); // For debugging
        // });
    } else {
        console.log('No user found or user ID is undefined'); // Debugging log
    }
}, [auth?.user?._id]);
  return (
    <AuthProvider>
      <BackgroundComponent isBackgroundVisible={isBackgroundVisible}>
        <div className="App">
          <ToastContainer />
          <Routes>
            {/* Redirect to Sign In by default */}
            <Route path='/' element={<Navigate to="/signin" />} />

            {/* Public Routes */}
            <Route path='/signin' element={<Login action="Sign In" />} />
            <Route path='/signup' element={<Login action="Sign Up" />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Protected Routes */}
            <Route element={<UserRoutes />}>
              <Route path='/chat' element={<GenerateChatApp />} />
              <Route path="/CreateProfile" element ={<CreateProfile />} />
              <Route path="/home" element={<Home/>} />
              <Route path="/Profile" element={<Profile/>} />
              <Route path='/Createpost' element={<Createpost/>} />
              <Route path='/Search' element={<ProfielSearch/>} />
              <Route path="/Profile/:userId" element={<Profile />} />
              <Route path="/settings" element={<Settings/>}/>
            </Route>
          </Routes>
        </div>
      </BackgroundComponent>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
