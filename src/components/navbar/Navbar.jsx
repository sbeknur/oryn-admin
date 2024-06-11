import "./navbar.scss";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
    const { user, dispatch: authDispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="wrapper">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo">oryn - {user.role}</span>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
