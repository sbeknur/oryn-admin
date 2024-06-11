import "./newRestaurant.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { restaurantInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const restaurantTypes = ["Cafe", "Restaurant", "FastFood", "Bar"];
const cities = ["Almaty", "Astana", "Shymkent", "Karaganda", "Aktobe", "Taraz", "Pavlodar", "Ust-Kamenogorsk", "Semey", "Atyrau", "Kostanay", "Kyzylorda", "Aktau", "Ural", "Petropavlovsk", "Turkistan"];

const NewRestaurant = () => {
    const [files, setFiles] = useState("");
    const [info, setInfo] = useState({
        type: "",
        city: "" 
    });
    const [places, setPlaces] = useState([]);
    const [message, setMessage] = useState("");


    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSelect = (e) => {
        const value = Array.from(e.target.selectedOptions, (option) => option.value);
        setPlaces(value);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const list = await Promise.all(
                Object.values(files).map(async (file) => {
                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", "upload");
                    const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/sbeknur/image/upload", data);

                    const { url } = uploadRes.data;
                    return url;
                })
            );

            const newRestaurant = {
                ...info,
                places,
                photos: list,
            };

            await axios.post("/restaurants", newRestaurant);
            setMessage('Restaurant added successfully');
        } catch (err) {
            console.log(err);
            setMessage('Error adding restaurant');
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add New Restaurant</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                files
                                    ? URL.createObjectURL(files[0])
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {restaurantInputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        id={input.id}
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                    />
                                </div>
                            ))}
                            <div className="formInput">
                                <label>Type</label>
                                <select id="type" value={info.type} onChange={handleChange}>
                                    <option value="">Select Type</option>
                                    {restaurantTypes.map((type) => (
                                        <option key={type} value={type.toLowerCase()}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="formInput">
                                <label>City</label>
                                <select id="city" value={info.city} onChange={handleChange}>
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city.toLowerCase()}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={handleClick}>Send</button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewRestaurant;
