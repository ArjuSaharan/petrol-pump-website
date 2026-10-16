import { createContext, useState } from "react";
import axios from 'axios';
import { useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendURL = 'http://localhost:3000';
    const [isLoggedin, setisLoggedin] = useState(false);
    const [userData, setuserData] = useState(false);

    const getuserdata = async () => {
        try {
            const { data } = await axios.get(backendURL + '/data/userdata', {
                withCredentials: true,
            })
             
            if (data.success) {
                setuserData(data.userData);
                setisLoggedin(true);
            } else {
                setuserData(null);
                setisLoggedin(false);
            }
        }
        catch (error) {
            setuserData(null);
            setisLoggedin(false);
        }
    }
useEffect(()=>{
    getuserdata();
},[]);
    const value = {
        backendURL,
        getuserdata,
        isLoggedin,
        setisLoggedin,
        userData,
        setuserData

    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
