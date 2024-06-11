import "./newFood.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { foodInputs } from "../../formSource";
import { useLocation } from "react-router-dom";
import axios from "axios";

const NewFood = () => {
    const location = useLocation();
    const { restaurantId } = location.state; // Получаем restaurantId из state
    const [info, setInfo] = useState({});
    const [foods, setFoods] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
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
