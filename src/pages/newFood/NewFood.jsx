import "./newFood.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { foodInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewFood = () => {
    const [info, setInfo] = useState({});
    const [restaurantId, setRestaurantId] = useState(undefined);
    const [foods, setFoods] = useState([]);

    const { data, loading, error } = useFetch("/restaurants");

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const foodNumbers = foods.split(",").map((food) => ({ number: food }));
        try {
            await axios.post(`/foods/${restaurantId}`, { ...info, foodNumbers });
        } catch (err) {
            console.log(err);
        }
    };

    console.log(info);
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
                                        foodholder={input.foodholder}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                            <div className="formInput">
                                <label>Foods</label>
                                <textarea
                                    onChange={(e) => setFoods(e.target.value)}
                                    foodholder="give comma between food numbers."
                                />
                            </div>
                            <div className="formInput">
                                <label>Choose a restaurant</label>
                                <select id="restaurantId" onChange={(e) => setRestaurantId(e.target.value)}>
                                    {loading
                                        ? "loading"
                                        : data &&
                                          data.map((restaurant) => (
                                              <option key={restaurant._id} value={restaurant._id}>
                                                  {restaurant.name}
                                              </option>
                                          ))}
                                </select>
                            </div>
                            <button onClick={handleClick}>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewFood;
