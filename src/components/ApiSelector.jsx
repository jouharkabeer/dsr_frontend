// src/components/ApiSelector.jsx
import React, { useState } from 'react';

const apiOptions = {
  api1: 'https://lumberworld-backend.onrender.com',
  api2: 'https://dsr-backend-rimy.onrender.com',
  api3: 'http://localhost:8000',
};

export default function ApiSelector({ onApiChange }) {
  const [selectedApi, setSelectedApi] = useState('api1');

  const handleChange = (e) => {
    const newApiKey = e.target.value;
    setSelectedApi(newApiKey);
    onApiChange(apiOptions[newApiKey]);
  };

  return (
    <div>
      <label htmlFor="api-select">Select API: </label>
      <select id="api-select" value={selectedApi} onChange={handleChange}>
        {Object.entries(apiOptions).map(([key, url]) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
    </div>
  );
}
