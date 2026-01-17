import React from 'react';

export function ArrivalsBoard({ arrivals, loading, error }) {
    if (loading) return <div className="loading">Checking signals...</div>;
    if (error) return <div className="error">Signal Failure: {error}</div>;
    if (arrivals.length === 0) return <div className="loading">No trains due</div>;

    const nextTrains = arrivals.slice(0, 5);

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

                return (
                    <div key={train.id} className="arrival-row">
                        <span className="destination">{destination}</span>
                        <span className="time">{formatTime(train.timeToStation)}</span>
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
