import "./newPlace.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { placeInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewPlace = () => {
    const [info, setInfo] = useState({});
    const [restaurantId, setRestaurantId] = useState(undefined);
    const [places, setPlaces] = useState([]);

    const { data, loading, error } = useFetch("/restaurants");

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const placeNumbers = places.split(",").map((place) => ({ number: place }));
        try {
            await axios.post(`/places/${restaurantId}`, { ...info, placeNumbers });
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
                    <h1>Add New Place</h1>
                </div>
                <div className="bottom">
                    <div className="right">
                        <form>
                            {placeInputs.map((input) => (
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
                            <div className="formInput">
                                <label>Places</label>
                                <textarea
                                    onChange={(e) => setPlaces(e.target.value)}
                                    placeholder="give comma between place numbers."
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

export default NewPlace;
