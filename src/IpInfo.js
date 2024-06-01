import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DateTime } from 'luxon';
import 'leaflet/dist/leaflet.css';

const IpInfo = () => {
    const [ipData, setIpData] = useState(null);
    const [countryData, setCountryData] = useState(null);

    useEffect(() => {
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

        fetchIpData();
    }, []);

    if (!ipData || !countryData) {
        return <div>Loading...</div>;
    }

    const { ip, location } = ipData;
    const { city, region, country, lat, lng, timezone } = location;
    const localTime = DateTime.now().setZone(timezone).toLocaleString(DateTime.DATETIME_FULL);

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Your IP Information</h5>
                    <p className="card-text">IP Address: {ip}</p>
                    <p className="card-text">Location: {city}, {region}, {country}</p>
                    <p className="card-text">Latitude: {lat}, Longitude: {lng}</p>
                    <p className="card-text">Timezone: {timezone}</p>
                    <p className="card-text">Local Time: {localTime}</p>
                    <img src={countryData.flags.png} alt={`Flag of ${countryData.name.common}`} />
                </div>
            </div>

            <MapContainer center={[lat, lng]} zoom={13} style={{ height: '400px', marginTop: '20px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        {city}, {region}, {country}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default IpInfo;
