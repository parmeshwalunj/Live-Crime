import React from "react";
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



const App = ({ zoom = 12, scrollWheelZoom = true }) => {
  const location = useGeoLocation();

  
  return (
    <>
    <NavBar />
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
        <Marker position={[location.coordinates.lat,location.coordinates.lng]}></Marker>
      )}
      {/* <LocationMarker /> */}
    </MapContainer>
    
    </>
  );
};

// function App() {
//   return (
//    <>
//      <NavBar />
//    </>
//   );
// }

export default App;
