import React, { useEffect, useState, useContext } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { fetchFeaturedData } from "./FeaturedDataProcessor";
import "./featured.scss";

const Featured = () => {
    const [data, setData] = useState({ total: 0, lastWeek: 0, lastMonth: 0, monthlyAverage: 0 });

    useEffect(() => {
        const loadData = async () => {
            const fetchedData = await fetchFeaturedData();
            setData(fetchedData);
        };
        loadData();
    }, []);

    return (
        <div className="featured">
            <div className="top">
                <h1 className="title">Total Revenue</h1>
                <MoreVertIcon fontSize="small" />
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar value={(data.total / data.monthlyAverage) * 100} text={`${Math.round((data.total / data.monthlyAverage) * 100)}%`} strokeWidth={5} />
                </div>
                <p className="title">Total sales</p>
                <p className="amount">${data.total}</p>
                <p className="desc">Previous transactions processing. Last payments may not be included.</p>
                <div className="summary">
                    <div className="item">
                        <div className="itemTitle">Last Week</div>
                        <div className={`itemResult ${data.lastWeek < data.monthlyAverage / 4 ? "negative" : "positive"}`}>
                            {data.lastWeek < data.monthlyAverage / 4 ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpOutlinedIcon fontSize="small" />}
                            <div className="resultAmount">${data.lastWeek}</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Last Month</div>
                        <div className={`itemResult ${data.lastMonth < data.monthlyAverage ? "negative" : "positive"}`}>
                            {data.lastMonth < data.monthlyAverage ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpOutlinedIcon fontSize="small" />}
                            <div className="resultAmount">${data.lastMonth}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Featured;
