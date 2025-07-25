import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export const AppContent = createContext();

export const AppContextProvider = (props) => {

  axios.defaults.withCredentials=true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // changed default to null for better clarity


const getUserData = async () => {
  try {
    console.log("the data with in the getUserData11111");
    const { data } = await axios.get(backendUrl + '/api/user/data');
    console.log("the data with in the getUserData", data);

    data.success
      ? setUserData(data.userData)
      : toast.error(data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch user data");
  }
};


const getAuthState = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/auth/isauth');
    if (data.success) {
      setIsLoggedin(true);
      getUserData();
    }
  } catch (error) {
    toast.error(error.message);
  }
};




useEffect(()=>{
getAuthState();
},[])


  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData, // added this assuming you want to update user data later
    getUserData
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
