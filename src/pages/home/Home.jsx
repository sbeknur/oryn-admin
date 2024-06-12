import React, { useContext } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext"; // Импорт контекста аутентификации
import "./home.scss";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />

                <div className="homeBody">
                    <div className="welcome">
                        <h1>Welcome to the {user.role === "restaurant" ? "Restaurant" : "Admin"} Dashboard</h1>
                        <p>Here you can manage {user.role === "restaurant" ? "your restaurant's information" : "users, restaurants, and view important information"}.</p>
                    </div>
                    <div className="quickActions">
                        <h2>Quick Actions</h2>
                        <div className="actions">
                            {user.role === "admin" && (
                                <>
                                    <button className="actionButton" onClick={() => (window.location.href = "/users/new")}>
                                        Add New User
                                    </button>
                                    <button className="actionButton" onClick={() => (window.location.href = "/restaurants/new")}>
                                        Add New Restaurant
                                    </button>
                                </>
                            )}
                            {user.role === "restaurant" && (
                                <>
                                    <button className="actionButton" onClick={() => (window.location.href = "/foods/new")}>
                                        Add New Food
                                    </button>
                                    <button className="actionButton" onClick={() => (window.location.href = "/places/new")}>
                                        Add New Place
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
