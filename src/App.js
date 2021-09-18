import {useRef} from "react";
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

import Button from '@mui/material/Button';


const App = ({ zoom = 13, scrollWheelZoom = true }) => {
  const location = useGeoLocation();
  const mapRef = useRef();
  const ZOOM_LEVEL = 9;
  const showMyLocation = () => {
    
    if ( location.loaded && !location.error) {
      mapRef.current.leafletElement.flyTo(
    
        [location.coordinates.lat, location.coordinates.lng],
        ZOOM_LEVEL,
        { animate: true }
      );
    } else {
      alert(location.error.message);
    }
  };
  
  return (
    <>
    <NavBar />
    
    <MapContainer
      
      style={{
        height: "100vh",
        position: "fixed",
        top: "12vh",
        right: 0,
        left: 0,
        bottom: 0,
      }}
      center={[location.coordinates.lat, location.coordinates.lng]}
      zoom={zoom}
      ref={mapRef} 
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
    <div>
        <Button color="inherit" onClick={showMyLocation}>Locate me</Button>
        </div>
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
