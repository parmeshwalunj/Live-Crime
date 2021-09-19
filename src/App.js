import React, { useEffect, useState } from "react";
import NavBar from "./components/Navbar/Navbar";
import {
  MapContainer,
  Popup,
  Marker,
  TileLayer,
  useMapEvents,
  Circle,
} from "react-leaflet";
import "./css/App.css";
import useGeoLocation from "./hooks/useGeoLocation";
import Typography from "@mui/material/Typography";
// firebase
import { getAuth } from "firebase/auth";

// modal components
import CheckCrimeModal from "./components/Modal/CheckCrimeModal";
import AddCrimeModal from "./components/Modal/AddCrimeModal";

import { getNearbyCrimesListener } from "./firebase/crimeApi";
import { crimeData } from "./util/tempCrimeData";
import { CircularProgress } from "@mui/material";

const App = ({ zoom = 13, scrollWheelZoom = true }) => {
  const [newCords, setNewCords] = useState([0, 0]);
  const [loggedIn, setLoggedIn] = useState(null);

  // modal states and functions

  const [show, setShow] = useState(false);
  const [AddCrime, setShowAddCrime] = useState(false);
  const [cords, setCords] = useState([]);
  const location = useGeoLocation();

  useEffect(() => {
    const unsub = getNearbyCrimesListener(
      location.coordinates,
      setCords,
      console.log
    );
    return () => {
      unsub();
    };
  }, [location.coordinates]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (crimeData.length === 0) {
      setShow(false);
      showAddCrime(true);
    } else setShow(true);
  };

  const showAddCrime = () => {
    if (show) setShow(false);
    setShowAddCrime(true);
  };
  const hideAddCrime = () => {
    setShowAddCrime(false);
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        let curCords = [e.latlng.lat, e.latlng.lng];
        setNewCords(curCords);
        let auth = getAuth();
        if (!loggedIn) 
        return alert("Please Login First");
        handleShow();
      },
    });

    return (
      <>
        {cords.map((cord, idx) => {
          return <Circle key={idx} center={cord} radius={200} color="red" />;
        })}
      </>
    );
  };

  return (
    <>
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      {loggedIn === null ? (
        <CircularProgress />
      ) : location.loaded ? (
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
                <Popup>Your location.</Popup>
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
