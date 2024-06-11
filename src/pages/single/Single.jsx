import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import axios from "axios";
import { userColumns, restaurantColumns, placeColumns, foodColumns } from "../../datatablesource";
import "./single.scss";

const Single = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname.split("/")[1]; // users, restaurants, places
    const [data, setData] = useState(null);
    const [info, setInfo] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [relatedData, setRelatedData] = useState({ places: [], foods: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/${path}/${id}`);
                setData(res.data);
                setInfo(res.data);

                if (path === "restaurants") {
                    const placesRes = await axios.get(`/places/byrestaurant/${id}`);
                    const foodsRes = await axios.get(`/foods/byrestaurant/${id}`);
                    setRelatedData({ places: placesRes.data, foods: foodsRes.data });
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id, path]);

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`/${path}/${id}`, info);
            setEditMode(false);
            alert("Update successful");
        } catch (err) {
            console.log(err);
        }
    };

    const getColumnInfo = () => {
        switch (path) {
            case "users":
                return userColumns;
            case "restaurants":
                return restaurantColumns;
            case "places":
                return placeColumns;
            case "foods":
                return foodColumns;
            default:
                return [];
        }
    };

    if (!data) return <div>Loading...</div>;

    const columns = getColumnInfo();

    const handleAddNewPlace = () => {
        navigate(`/places/new`, { state: { restaurantId: id } });
    };

    const handleAddNewFood = () => {
        navigate(`/foods/new`, { state: { restaurantId: id } });
    };

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <div className="editButton" onClick={() => setEditMode(!editMode)}>
                            {editMode ? "Cancel" : "Edit"}
                        </div>
                        <h1 className="title">Information</h1>
                        <div className="item">
                            <img
                                src={data.img || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                alt=""
                                className="itemImg"
                            />
                            <div className="details">
                                {editMode ? (
                                    <>
                                        {columns.map(
                                            (column) =>
                                                column.field !== "_id" && (
                                                    <div className="formInput" key={column.field}>
                                                        <label>{column.headerName}</label>
                                                        <input
                                                            id={column.field}
                                                            value={info[column.field] || ""}
                                                            onChange={handleChange}
                                                            type="text"
                                                        />
                                                    </div>
                                                )
                                        )}
                                        <button onClick={handleSave}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <h1 className="itemTitle">{data.name || data.username}</h1>
                                        {columns.map((column) => (
                                            <div className="detailItem" key={column.field}>
                                                <span className="itemKey">{column.headerName}:</span>
                                                <span className="itemValue">{data[column.field]}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {path === "restaurants" && (
                        <div className="right">
                            <Chart aspect={3 / 1} title="Restaurant Analytics" />
                        </div>
                    )}
                </div>
                {path === "restaurants" && (
                    <div className="bottom">
                        <div className="tableHeader">
                            <h1 className="title">Places</h1>
                            <button onClick={handleAddNewPlace} className="link">
                                Add New
                            </button>
                        </div>
                        <List rows={relatedData.places} columns={placeColumns} rowType="places" restaurantId={id} />
                        <div className="tableHeader">
                            <h1 className="title">Foods</h1>
                            <button onClick={handleAddNewFood} className="link">
                                Add New
                            </button>
                        </div>
                        <List rows={relatedData.foods} columns={foodColumns} rowType="foods" restaurantId={id} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Single;
