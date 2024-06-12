import "./newPlace.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useContext, useEffect } from "react";
import { placeInputs } from "../../formSource";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const NewPlace = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [restaurantId, setRestaurantId] = useState(null);
    const [info, setInfo] = useState({});
    const [files, setFiles] = useState([]);
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

        const data = new FormData();
        files.forEach((file) => {
            data.append("files", file);
        });
        data.append("info", JSON.stringify(info));

        try {
            await axios.post(`https://oryn.onrender.com/api/places/${restaurantId}`, data);
            setMessage('Place added successfully');
        } catch (err) {
            console.log(err);
            setMessage('Error adding place');
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add New Place</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={files.length > 0 ? URL.createObjectURL(files[0]) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
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
                                    onChange={(e) => setFiles(Array.from(e.target.files))}
                                    style={{ display: "none" }}
                                />
                            </div>

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
                            <button onClick={handleClick}>Send</button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPlace;
