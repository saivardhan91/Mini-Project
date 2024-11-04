import {Outlet,Navigate} from 'react-router-dom';

const AdminRoutes = () =>{
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if(token && role==="admin"){
        return <Outlet/>;
    }
    else{
        return <Navigate to="/" replace={true}/>
    }
}

export default AdminRoutes;