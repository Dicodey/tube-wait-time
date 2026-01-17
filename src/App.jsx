import React from 'react';
import { useTflArrivals } from './hooks/useTflArrivals';
import { ArrivalsBoard } from './components/ArrivalsBoard';

import { ServiceStatus } from './components/ServiceStatus';

function App() {
  const { arrivals, loading, error } = useTflArrivals();

  return (
    <div className="app-container">
      <h1>Tooting Bec <br /><span style={{ fontSize: '0.5em' }}>Northbound</span></h1>
      <ArrivalsBoard arrivals={arrivals} loading={loading} error={error} />
      <ServiceStatus />
    </div>
  );
}

export default App;
