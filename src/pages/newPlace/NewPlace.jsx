import "./newPlace.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { placeInputs } from "../../formSource";
import { useLocation } from "react-router-dom";
import axios from "axios";

const NewPlace = () => {
    const location = useLocation();
    const { restaurantId } = location.state; // Получаем restaurantId из state
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState({});

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const photos = files.map(file => URL.createObjectURL(file));
        try {
            const newPlace = {
                ...info,
                restaurantId,
                photos,
            };
            await axios.post(`/places/${restaurantId}`, newPlace);
            alert('Place added successfully');
        } catch (err) {
            console.log(err);
            alert('Error adding place');
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
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                    />
                                </div>
                            ))}
                            <button onClick={handleClick}>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPlace;
