import { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

function Home(props) {
  const [latitudeInput, setLatitudeInput] = useState("-43.5");
  const [longitudeInput, setLongitudeInput] = useState("172.5");
  const [data, setData] = useState([]);

  const handleLatitudeChange = (event) => {
    setLatitudeInput(event.target.value);
  }

  const handleLongitudeChange = (event) => {
    setLongitudeInput(event.target.value);
  }

  const sendApiRequest = () => {
    axios.get(`/v1/srtm90m?locations=${latitudeInput},${longitudeInput}&interpolation=cubic`)
      .then(res => {
        console.log("res", res.data.results);
        setData(res.data.results[0]);
      })
      .catch(err => {
        alert("Please enter valid parameters");
      });
  }

  const centerMoved = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setLatitudeInput(lat);
    setLongitudeInput(lng)
  }

  useEffect(() => {
    sendApiRequest();
  }, [latitudeInput, longitudeInput])

  return (
    <div>
      <h4>Please enter latitude and longitude manually or move the cursor. The result of elevation will be processed:</h4>

      <TextField value={latitudeInput} inputProps={{ type: 'number' }} onChange={handleLatitudeChange} id="latitude" label="Latitude" variant="outlined" />
      <TextField value={longitudeInput} inputProps={{ type: 'number' }} onChange={handleLongitudeChange} id="longitude" label="Longitude" variant="outlined" />
      
      {data?.dataset?.length > 0 && data.elevation && <p>The elevation is: {data.elevation}</p>}

      <Map google={props.google} zoom={14}>
        <Marker
          name={'Current location'}
          draggable={true}
          onDragend={centerMoved}
        />
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDXx9tNFPvHIR9yaMqVwOds4ZHHaFxvioA")
})(Home)