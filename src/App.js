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
import Typography from "@mui/material/Typography";
// firebase
import { getAuth } from 'firebase/auth';

// modal components
import CheckCrimeModal from "./components/Modal/CheckCrimeModal";
import AddCrimeModal from "./components/Modal/AddCrimeModal";

import { crimeData } from './util/tempCrimeData'

const App = ({ zoom = 13, scrollWheelZoom = true }) => {

  const [newCords, setNewCords] = useState([0, 0])

  // modal states and functions

  const [show, setShow] = useState(false);
  const [AddCrime, setShowAddCrime] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (crimeData.length == 0) {
      setShow(false);
      showAddCrime(true);
    }
    else setShow(true);
  }

  const showAddCrime = () => {
    if (show) setShow(false);
    setShowAddCrime(true)
  };
  const hideAddCrime = () => {
    setShowAddCrime(false)
  };

  // geolocation 
  const location = useGeoLocation();
  const ZOOM_LEVEL = 9;

  if (location.loaded && location.error) {
    // TODO: use GeoIp API to get approximate location
  }

  const [cords, setCords] = useState([]);

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        let curCords = [e.latlng.lat, e.latlng.lng];
        setNewCords(curCords)
        let auth = getAuth();
        if (auth.currentUser == null) return;

        handleShow();

        setCords((prevValue) => {
          return [...prevValue, curCords];
        });
      },
    });

    return (
      <>
        {cords.map((cord, idx) => {
          return <Marker key={idx} position={cord} >
            <Popup>
              crime happened.
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
              bottom: 0
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
      <CheckCrimeModal
        show={show}
        handleClose={handleClose}
        crimeData={crimeData}
        addCrime={showAddCrime}
      />
      <AddCrimeModal
        show={AddCrime}
        handleClose={hideAddCrime}
        lat={newCords[0]}
        lng={newCords[1]}
      />
    </>
  );
};

export default App;
