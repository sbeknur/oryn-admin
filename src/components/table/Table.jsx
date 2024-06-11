import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const List = ({ rows, columns }) => {
    const location = useLocation();
    const path = location.pathname.split("/")[1];
    const restaurantId = location.pathname.split("/")[2]; // Предполагается, что restaurantId находится в URL

    const [list, setList] = useState(rows);

    useEffect(() => {
        setList(rows);
    }, [rows]);

    const handleDelete = async (id, rowType) => {
        try {
            await axios.delete(`/${rowType}/${id}/${restaurantId}`);
            setList(list.filter((item) => item._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getEditLink = (row, rowType) => {
        return `/${rowType}/${row._id}/${restaurantId}`;
    };

    const actionColumn = {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
            const row = params.row;
            const rowType = path === "places" ? "places" : "foods"; // Определяем rowType в зависимости от пути

            return (
                <div className="cellAction">
                    <Link to={getEditLink(row, rowType)} style={{ textDecoration: "none" }}>
                        <div className="viewButton">View</div>
                    </Link>
                    <div className="deleteButton" onClick={() => handleDelete(row._id, rowType)}>
                        Delete
                    </div>
                </div>
            );
        },
    };

    return (
        <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.field} className="tableCell">
                                {column.headerName}
                            </TableCell>
                        ))}
                        <TableCell className="tableCell">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((row) => (
                        <TableRow key={row._id}>
                            {columns.map((column) => (
                                <TableCell key={column.field} className="tableCell">
                                    {column.renderCell ? column.renderCell({ row }) : row[column.field]}
                                </TableCell>
                            ))}
                            <TableCell className="tableCell">{actionColumn.renderCell({ row })}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default List;
