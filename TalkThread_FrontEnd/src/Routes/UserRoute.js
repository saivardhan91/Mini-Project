    import {Outlet,Navigate} from 'react-router-dom';

    const UserRoutes = () =>{
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if(token && role==="user"){
            return <Outlet/>;
        }
        else{
            return <Navigate to="/" replace={true}/>
        }
    }

    export default UserRoutes;