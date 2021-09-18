import React from "react";

const style = {
    crimeDiv: {
        display: "flex",
        flexDirection: "column",
        padding: "0.2rem 0.3rem 0.3rem 0.3rem",
        margin: "0.3rem 0.4rem",
        wrap: "wrap"
    },
    crimeDetails: {
        display: "flex",
        justifyContent: "space-between",
        wrap: "wrap",
        fontWeight : "bold"
    },
    crimeDesc: {
        marginTop : "0.3rem"
    }
}

const NearbyCrime = ({ landmark, type, time, severity, description }) => {
    return (
        <div style={style.crimeDiv}>
            <div style={style.crimeDetails}>
                <div>{`Landmarks : ${landmark}`}</div>
                <div>{`${time}`}</div>
            </div>

            <div style={style.crimeDetails}>
                <div>{`Type : ${type}`}</div>
                <div>{`Severity : ${severity}`}</div>
            </div>

            <div style={style.crimeDesc}>
                {`${description}`}
            </div>
            <br />
        </div>
    );
}

export default NearbyCrime;