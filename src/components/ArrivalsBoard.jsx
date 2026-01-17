import React from 'react';

export function ArrivalsBoard({ arrivals, loading, error }) {
    if (loading) return <div className="loading">Checking signals...</div>;
    if (error) return <div className="error">Signal Failure: {error}</div>;
    if (arrivals.length === 0) return <div className="loading">No trains due</div>;

    const WALK_TIME_SECONDS = 12 * 60;

    // Filter trains that depart before we can get there (12 mins)
    const reachableTrains = arrivals.filter(train => train.timeToStation >= WALK_TIME_SECONDS);
    const nextTrains = reachableTrains.slice(0, 5); // Show next 5 reachable trains

    return (
        <div className="board">
            {nextTrains.map((train) => {
                // Use 'towards' field if available, fallback to destinationName
                // 'towards' usually looks like "High Barnet via Bank"
                // 'destinationName' looks like "High Barnet Underground Station"

                let destination = train.towards;
                if (!destination) {
                    destination = train.destinationName.replace(' Underground Station', '');
                }

                // Apply abbreviations
                // Ensure "Charing Cross" is used instead of "CX"
                destination = destination.replace('via CX', 'via Charing Cross');

                // Adjust time for walking
                const adjustedTime = train.timeToStation - WALK_TIME_SECONDS;

                return (
                    <div key={train.id} className="arrival-row">
                        <span className="destination">{destination}</span>
                        <span className="time">{formatTime(adjustedTime)}</span>
                    </div>
                );
            })}
        </div>
    );
}

function formatTime(seconds) {
    if (seconds < 60) return 'Due';
    const mins = Math.ceil(seconds / 60);
    return `${mins} min`;
}
