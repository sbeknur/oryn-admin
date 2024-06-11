import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";

const cities = ["Almaty", "Astana", "Shymkent", "Karaganda", "Aktobe", "Taraz", "Pavlodar", "Ust-Kamenogorsk", "Semey", "Atyrau", "Kostanay", "Kyzylorda", "Aktau", "Ural", "Petropavlovsk", "Turkistan"];

const New = ({ inputs, title }) => {
    const [file, setFile] = useState("");
    const [info, setInfo] = useState({
        city: "",
        role: "user",
    });
    const [isRestaurant, setIsRestaurant] = useState(false);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsRestaurant(checked);
        setInfo((prev) => ({ ...prev, role: checked ? "restaurant" : "user" })); // Update role based on checkbox
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        try {
            const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/sbeknur/image/upload", data);

            const { url } = uploadRes.data;

            const newUser = {
                ...info,
                img: url,
            };

            await axios.post("/auth/register", newUser);
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
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                file
                                    ? URL.createObjectURL(file)
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
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        id={input.id}
                                    />
                                </div>
                            ))}
                            <div className="formInput">
                                <label htmlFor="isRestaurant">Is Restaurant?</label>
                                <input
                                    type="checkbox"
                                    id="isRestaurant"
                                    checked={isRestaurant}
                                    onChange={handleCheckboxChange}
                                />
                                {isRestaurant && (
                                    <div className="formInput">
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Restaurant ID"
                                            id="restaurantId"
                                        />
                                    </div>
                                )}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;
