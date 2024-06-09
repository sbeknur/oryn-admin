import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import axios from "axios";
import { userColumns, restaurantColumns, placeColumns } from "../../datatablesource";
import "./single.scss";

const Single = () => {
    const { id } = useParams();
    const location = useLocation();
    const path = location.pathname.split("/")[1]; // users, restaurants, places
    const [data, setData] = useState(null);
    const [info, setInfo] = useState({});
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/${path}/${id}`);
                setData(res.data);
                setInfo(res.data);
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
            default:
                return [];
        }
    };

    if (!data) return <div>Loading...</div>;

    const columns = getColumnInfo();

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
                                        {columns.map((column) => (
                                            column.field !== "_id" && (
                                                <div className="formInput" key={column.field}>
                                                    <label>{column.headerName}</label>
                                                    <input
                                                        id={column.field}
                                                        value={info[column.field] || ''}
                                                        onChange={handleChange}
                                                        type="text"
                                                    />
                                                </div>
                                            )
                                        ))}
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
                </div>
            </div>
        </div>
    );
};

export default Single;
