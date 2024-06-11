import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Datatable = ({ columns }) => {
    const location = useLocation();
    const path = location.pathname.split("/")[1];
    const [list, setList] = useState([]);
    const { data, loading, error } = useFetch(`/${path}`);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user.role === "restaurant" && (path === "foods" || path === "places")) {
            setList(data.filter(item => item.restaurantId === user.restaurantId));
        } else {
            setList(data);
        }
    }, [data, path, user]);

    const handleDelete = async (id) => {
        try {
            if (user.role === "restaurant" && (path === "foods" || path === "places")) {
                await axios.delete(`/${path}/${id}/${user.restaurantId}`);
            } else {
                await axios.delete(`/${path}/${id}`);
            }
            setList(list.filter((item) => item._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/${path}/${params.row._id}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div className="deleteButton" onClick={() => handleDelete(params.row._id)}>
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="datatable">
            <div className="datatableTitle">
                {path}
                <Link to={`/${path}/new`} className="link">
                    Add New
                </Link>
            </div>
            <DataGrid
                className="datagrid"
                rows={list}
                columns={columns.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                getRowId={(row) => row._id}
            />
        </div>
    );
};

export default Datatable;
