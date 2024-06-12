import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { restaurantInputs } from "../../formSource";
import { placeColumns, foodColumns } from "../../datatablesource";
import useFetch from "../../hooks/useFetch";
import List from "../../components/table/Table";
import "./myRestaurant.scss";

const MyRestaurant = () => {
    const { user } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState({});
    const [files, setFiles] = useState([]);
    const [info, setInfo] = useState({});
    const [places, setPlaces] = useState([]);
    const [success, setSuccess] = useState(false); // Добавленное состояние для успешного сообщения
    const { data: placesData, loading: placesLoading } = useFetch("/places");
    const { data: foodsData, loading: foodsLoading } = useFetch(`/foods/byrestaurant/${user.restaurantId}`); // Добавленный fetch для foods

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await axios.get(`/restaurants/${user.restaurantId}`);
                setRestaurant(res.data);
                setInfo(res.data);
                setPlaces(res.data.places.map((place) => place._id));
            } catch (err) {
                console.error(err);
            }
        };

        fetchRestaurant();
    }, [user.restaurantId]);

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

            const updatedRestaurant = {
                ...info,
                places,
                photos: list.length > 0 ? list : restaurant.photos,
            };

            await axios.put(`/restaurants/${user.restaurantId}`, updatedRestaurant);
            setRestaurant(updatedRestaurant);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            console.log(err);
        }
    };

    if (!restaurant) return <div>Loading...</div>;

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Edit My Restaurant</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                files.length > 0
                                    ? URL.createObjectURL(files[0])
                                    : restaurant.photos && restaurant.photos[0]
                                    ? restaurant.photos[0]
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
                                        value={info[input.id] || ""}
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                    />
                                </div>
                            ))}
                            <div className="selectPlaces">
                                <label>Places</label>
                                <select id="places" multiple onChange={handleSelect} value={places}>
                                    {placesLoading
                                        ? "loading"
                                        : placesData &&
                                          placesData.map((place) => (
                                              <option key={place._id} value={place._id}>
                                                  {place.title}
                                              </option>
                                          ))}
                                </select>
                            </div>
                            <button onClick={handleClick}>Update</button>
                        </form>
                        {success && <div className="successMessage">Update successful!</div>}
                    </div>
                </div>
                <div className="tablesContainer">
                    <div className="tableHeader">
                        <h1 className="title">Places</h1>
                        <List rows={placesData || []} columns={placeColumns} rowType="places" restaurantId={user.restaurantId} />
                    </div>
                    <div className="tableHeader">
                        <h1 className="title">Foods</h1>
                        <List rows={foodsData || []} columns={foodColumns} rowType="foods" restaurantId={user.restaurantId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRestaurant;

