import React, { useEffect, useState } from "react";
import NavBar from "./components/Navbar/Navbar";
import {
  MapContainer,
  Popup,
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
import { CircularProgress } from "@mui/material";
import DisplayCrime from "./components/Modal/DisplayCrimeModal";

const App = ({ zoom = 13, scrollWheelZoom = true }) => {
  const [newCords, setNewCords] = useState([0, 0]);
  const [loggedIn, setLoggedIn] = useState(null);
  const [displayCrimeModal, setDisplayCrimeModal] = useState(false);

  // modal states and functions

  const [show, setShow] = useState(false);
  const [AddCrime, setShowAddCrime] = useState(false);
  const [crimes, setCrimes] = useState([]);
  const location = useGeoLocation();

  useEffect(() => {
    const unsubCrimes = getNearbyCrimesListener(
      location.coordinates,
      setCrimes,
      console.log
    );
    return () => {
      unsubCrimes();
    };
  }, [location.coordinates]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (crimes.length === 0) {
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
        return alert("Please Login First!");
        handleShow();
      },
    });

    return (
      <>
        {crimes.map((crime, idx) => {
          return (
            <Circle
              key={idx}
              center={[crime.lat, crime.lng]}
              radius={200}
              color="red"
              eventHandlers={{
                click: () => {
                  // console.log(crime, idx);
                  console.log(crimes[idx]);
                  setDisplayCrimeModal(idx);
                },
              }}
            >
              <Popup />
            </Circle>
          );
        })}
      </>
    );
  };
  // console.log(crimes);
  return (
    <>
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      {loggedIn === null ? (
        <div
          style={{
            minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
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
              <Circle
                center={[location.coordinates.lat, location.coordinates.lng]}
                radius={200}
              >
                <Popup>Your location.</Popup>
              </Circle>
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
        crimeData={crimes}
        addCrime={showAddCrime}
      />
      <AddCrimeModal
        show={AddCrime}
        handleClose={hideAddCrime}
        lat={newCords[0]}
        lng={newCords[1]}
      />
      {crimes.length && displayCrimeModal !== false && (
        <DisplayCrime
          show={displayCrimeModal !== false}
          crimeData={crimes[displayCrimeModal]}
          handleClose={() => setDisplayCrimeModal(false)}
        />
      )}
    </>
  );
};

export default App;
