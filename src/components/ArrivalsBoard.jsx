import React, { useState, useEffect } from 'react';

export function ArrivalsBoard({ arrivals, loading, error, walkingOffset = 0, targetArrivalTime = null }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (loading) return <div className="loading-container"><div className="loading">Checking signals...</div></div>;
    if (error) return <div className="error-container"><div className="error">Signal Failure: {error}</div></div>;

    const offsetSeconds = walkingOffset * 60;

    // Filter and adjust trains based on walking offset
    const reachableTrains = arrivals
        .filter(train => train.timeToStation >= offsetSeconds)
        .map(train => ({
            ...train,
            adjustedTime: train.timeToStation - offsetSeconds
        }));

    if (reachableTrains.length === 0) return (
        <div className="board-outer">
            <div className="board">
                <div className="dot-matrix-overlay"></div>
                <div className="loading">No trains reachable</div>
                <div className="board-info-row" style={{ textAlign: 'center', width: '100%', color: 'var(--led-amber)', opacity: 0.6, marginTop: '20px', fontFamily: "'VT323', monospace" }}>
                    (Next train would have left by time you arrive)
                </div>
            </div>
        </div>
    );

    const nextTrains = reachableTrains.slice(0, 5);

    // DETERMINISTIC CLOCK LOGIC
    // If targetArrivalTime is provided (active journey), use it as a FIXED timestamp.
    // Otherwise, increment the current time by the static offset.
    let clockDisplay;
    if (targetArrivalTime) {
        const fixedTime = new Date(targetArrivalTime);
        clockDisplay = fixedTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } else {
        const adjustedClockTime = new Date(currentTime.getTime() + (walkingOffset * 60000));
        clockDisplay = adjustedClockTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    }

    return (
        <div className="board-outer">
            <div className="board">
                <div className="dot-matrix-overlay"></div>
                {nextTrains.map((train, index) => {
                    let destination = train.towards;
                    if (!destination) {
                        destination = train.destinationName.replace(/ (Underground|DLR)? Station$/i, '');
                    }

                    // Clean up "via" and other strings for consistent look
                    destination = destination.replace(/via CX/i, 'via Charing Cross');

                    const isScheduled = train.isScheduled;
                    const timeDisplay = isScheduled
                        ? train.scheduledTime
                        : formatTime(train.adjustedTime);

                    return (
                        <div key={train.id} className={`arrival-row ${isScheduled ? 'scheduled-row' : ''}`}>
                            <span className="row-number">{index + 1}</span>
                            <span className="destination">
                                {destination}
                                {isScheduled && <span className="sched-marker">🕒</span>}
                            </span>
                            <span className="time-col">
                                {timeDisplay}
                                {isScheduled && <span className="sched-label">SCHED</span>}
                            </span>
                        </div>
                    );
                })}

                <div className="board-footer">
                    <div className="clock-container">
                        <div className="clock-display">{clockDisplay}</div>
                        {walkingOffset > 0 && <div className="clock-offset-label">ARRIVAL TIME (+{Math.round(walkingOffset)}m)</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}


function formatTime(seconds) {
    if (seconds < 60) return 'Due';
    const mins = Math.ceil(seconds / 60);
    return `${mins} min${mins > 1 ? 's' : ''}`;
}
