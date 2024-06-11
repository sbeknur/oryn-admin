import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const Sidebar = () => {
    const { dispatch: darkModeDispatch } = useContext(DarkModeContext);
    const { user, dispatch: authDispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        authDispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    return (
        <div className="sidebar">
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </li>
                    </Link>
                    {user.role === "admin" && (
                        <>
                            <p className="title">LISTS</p>
                            <Link to="/restaurants" style={{ textDecoration: "none" }}>
                                <li>
                                    <StoreIcon className="icon" />
                                    <span>Restaurants</span>
                                </li>
                            </Link>
                            <Link to="/users" style={{ textDecoration: "none" }}>
                                <li>
                                    <PersonOutlineIcon className="icon" />
                                    <span>Users</span>
                                </li>
                            </Link>
                            <Link to="/places" style={{ textDecoration: "none" }}>
                                <li>
                                    <CreditCardIcon className="icon" />
                                    <span>Places</span>
                                </li>
                            </Link>
                            <Link to="/foods" style={{ textDecoration: "none" }}>
                                <li>
                                    <FastfoodIcon className="icon" />
                                    <span>Foods</span>
                                </li>
                            </Link>
                        </>
                    )}
                    {user.role === "restaurant" && (
                        <>
                            <p className="title">MY RESTAURANT</p>
                            <Link to="/myRestaurant" style={{ textDecoration: "none" }}>
                                <li>
                                    <StoreIcon className="icon" />
                                    <span>My Restaurant</span>
                                </li>
                            </Link>
                            <Link to="/places" style={{ textDecoration: "none" }}>
                                <li>
                                    <CreditCardIcon className="icon" />
                                    <span>Places</span>
                                </li>
                            </Link>
                            <Link to="/foods" style={{ textDecoration: "none" }}>
                                <li>
                                    <FastfoodIcon className="icon" />
                                    <span>Foods</span>
                                </li>
                            </Link>
                        </>
                    )}
                    <li onClick={handleLogout}>
                        <ExitToAppIcon className="icon" />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption" onClick={() => darkModeDispatch({ type: "LIGHT" })}></div>
                <div className="colorOption" onClick={() => darkModeDispatch({ type: "DARK" })}></div>
            </div>
        </div>
    );
};

export default Sidebar;
