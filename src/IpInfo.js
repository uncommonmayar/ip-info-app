import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import './IpInfo.css';
import 'leaflet/dist/leaflet.css';

const IpInfo = () => {
    const [ipData, setIpData] = useState(null);
    const [countryData, setCountryData] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const fetchIpData = async () => {
        try {
            const response = await axios.get(`https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_IPIFY_API_KEY}`);
            setIpData(response.data);

            const countryResponse = await axios.get(`https://restcountries.com/v3.1/alpha/${response.data.location.country}`);
            setCountryData(countryResponse.data[0]);
        } catch (error) {
            console.error('Error fetching the IP or country data', error);
        }
    };

    useEffect(() => {
        fetchIpData();
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const refreshData = () => {
        setIpData(null);
        setCountryData(null);
        fetchIpData();
    };

    if (!ipData || !countryData) {
        return <div className="loading">Loading...</div>;
    }

    const { ip, location } = ipData;
    const { city, region, country, lat, lng, timezone } = location;
    const localTime = DateTime.now().setZone(timezone).toLocaleString(DateTime.DATETIME_FULL);

    return (
        <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="header">
                <h1>WBS Coding School Exercise - 1st June 2024</h1>
                <button className="toggle-button" onClick={toggleDarkMode}>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button className="refresh-button" onClick={refreshData}>
                    <FontAwesomeIcon icon={faSyncAlt} />
                </button>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Your IP Information</h5>
                    <p className="card-text">IP Address: {ip}</p>
                    <p className="card-text">Location: {city}, {region}, {country}</p>
                    <p className="card-text">Latitude: {lat}, Longitude: {lng}</p>
                    <p className="card-text">Timezone: {timezone}</p>
                    <p className="card-text">Local Time: {localTime}</p>
                    <img className="country-flag" src={countryData.flags.png} alt={`Flag of ${countryData.name.common}`} />
                </div>
            </div>

            <div className="map-container">
  <MapContainer center={[lat, lng]} zoom={13} style={{ height: "400px" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[lat, lng]}>
      <Popup>
        {city}, {region}, {country}
      </Popup>
    </Marker>
  </MapContainer>
</div>


            <footer className="footer">
                <p>&copy; WBS Coding School - 2024 IP Info App (Mayar)</p>
            </footer>
        </div>
    );
};

export default IpInfo;
