import React, { useState, useRef } from "react";
import NavBar from "./components/Navbar/Navbar";
import {
  MapContainer,
  Popup,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "./css/App.css";
import useGeoLocation from "./hooks/useGeoLocation";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";

const App = ({ zoom = 13, scrollWheelZoom = true }) => {
  const location = useGeoLocation();
  const ZOOM_LEVEL = 9;

  if (location.loaded && location.error) {
    // TODO: use GeoIp API to get approximate location
  }

  const [cords, setCords] = useState([]);

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        let newCords = [e.latlng.lat, e.latlng.lng];
        
        setCords((prevValue) => {
          return [...prevValue, newCords];
        });
      },
    });

    return (
      <>
        {cords.map((cord) => {
          return <Marker position={cord} >
            <Popup>
               crime happned.
          </Popup>
          </Marker>;
        })}
      </>
    );
  };

  return (
    <>
      <NavBar />

      {location.loaded ? (
        !location.error ? (
          <MapContainer
            style={{
              height: "100vh",
              position: "fixed",
              top: "10vh",
              right: 0,
              left: 0,
              bottom: 0,
            }}
            center={[location.coordinates.lat, location.coordinates.lng]}
            zoom={zoom}
            scrollWheelZoom={scrollWheelZoom}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {location.loaded && !location.error && (
              <Marker
                position={[location.coordinates.lat, location.coordinates.lng]}
                
              >
                <Popup>
               your location.
                </Popup>
              </Marker>
            )}
            <LocationMarker />
          </MapContainer>
        ) : (
          <div>Location Access not given, use GeoIP location here.</div>
        )
      ) : (
        <div
          style={{
            minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="h2">
            Please enable location access in your browser.
          </Typography>
        </div>
      )}
    </>
  );
};

export default App;
