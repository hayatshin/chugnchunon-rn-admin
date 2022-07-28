import AsyncStorage from "@react-native-async-storage/async-storage";
import { Navigate } from "react-router-dom";



export default  function Protected({ isLoggedIn, children}) {
    return (
        !isLoggedIn ?  <Navigate to="/" replace /> :  children
    )
}