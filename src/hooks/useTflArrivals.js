import { useState, useEffect } from 'react';

const STATION_ID = '940GZZLUTBC'; // Tooting Bec
const LINE_ID = 'northern';

export function useTflArrivals() {
    const [arrivals, setArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArrivals = async () => {
            try {
                const response = await fetch(
                    `https://api.tfl.gov.uk/Line/${LINE_ID}/Arrivals/${STATION_ID}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch arrivals');
                }
                const data = await response.json();

                // Filter for Northbound trains (towards Balham)
                // "Outbound" from Tooting Bec is Northbound (away from Morden).
                const northbound = data
                    .filter(train => {
                        const isOutbound = train.direction === 'outbound' || train.platformName.includes('Northbound');
                        const isNotMorden = !train.destinationName.includes('Morden');
                        return isOutbound && isNotMorden;
                    })
                    .sort((a, b) => a.timeToStation - b.timeToStation);

                setArrivals(northbound);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchArrivals();
        // Refresh every 15 seconds
        const interval = setInterval(fetchArrivals, 15000);
        return () => clearInterval(interval);
    }, []);

    return { arrivals, loading, error };
}
