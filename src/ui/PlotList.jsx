import React, { useState } from "react";
import PlotMap from "./PlotMap";

const PlotList = ({ address }) => {
    const [selectedAddress, setSelectedAddress] = useState(null);

    return (
        <div>
            <h3>Plot List</h3>
            <ul>
                <li
                    onClick={() => setSelectedAddress(address)}
                    style={{ cursor: "pointer", color: "blue" }}
                >
                    {address}
                </li>
            </ul>

            {selectedAddress && (
                <div>
                    <h4>Map for: {selectedAddress}</h4>
                    <PlotMap address={selectedAddress} />
                </div>
            )}
        </div>
    );
};

export default PlotList;
