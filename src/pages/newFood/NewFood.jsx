import "./newFood.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useContext, useEffect } from "react";
import { foodInputs } from "../../formSource";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const NewFood = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [restaurantId, setRestaurantId] = useState(null);
    const [info, setInfo] = useState({});
    const [foods, setFoods] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user.role === "restaurant") {
            setRestaurantId(user.restaurantId);
        } else if (location.state) {
            setRestaurantId(location.state.restaurantId);
        }
    }, [user, location]);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (!restaurantId) {
            setMessage('Restaurant ID is required');
            return;
        }
        
        const foodNumbers = foods.split(",").map((food) => ({ number: food }));
        try {
            await axios.post(`/foods/${restaurantId}`, { ...info, foodNumbers });
            setMessage('Food added successfully');
        } catch (err) {
            console.log(err);
            setMessage('Error adding food');
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add New Food</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form>
                            {foodInputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        id={input.id}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                            <button onClick={handleClick}>Send</button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewFood;
