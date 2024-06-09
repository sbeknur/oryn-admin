import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./myRestaurant.scss";

const MyRestaurant = () => {
    const { user } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await axios.get(`/restaurants/${user.restaurantId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setRestaurant(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        if (user && user.role === "restaurant") {
            fetchRestaurant();
        }
    }, [user]);

    if (!restaurant) return <div>Loading...</div>;

    return (
        <div className="myRestaurant">
            <Sidebar />
            <div className="myRestaurantContainer">
                <Navbar />
                <h1>{restaurant.name}</h1>
                <p>{restaurant.description}</p>
                <h2>Places</h2>
                <ul>
                    {restaurant.places.map((place) => (
                        <li key={place._id}>{place.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyRestaurant;
