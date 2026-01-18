import React, { useState, useEffect, useRef } from 'react';
import { getAvailableDirections } from '../utils/lineDirections';

// Custom ordering and default rules per line
const LINE_CONFIG = {
    'victoria': { defaultId: '940GZZLUBXN', reverse: false }, // Brixton at top (South->North)
    'northern': { defaultId: '940GZZLUTBC', reverse: true },  // Tooting Bec
    'jubilee': { reverse: true },
    'central': { reverse: true },
    'piccadilly': { reverse: true },
    'bakerloo': { reverse: true },
    'district': { reverse: true },
    'metropolitan': { reverse: true },
    'circle': { reverse: false },
    'hammersmith-city': { reverse: true }
};

export function Settings({ onSettingsChange, currentSettings, isOpenExternal, onCloseExternal, viewMode = 'all' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [lines, setLines] = useState([]);
    const [stations, setStations] = useState([]);
    const [selectedLine, setSelectedLine] = useState(currentSettings.lineId);
    const [selectedStation, setSelectedStation] = useState(currentSettings.stopPointId);
    const [selectedDirection, setSelectedDirection] = useState(currentSettings.direction);
    const [selectedOffset, setSelectedOffset] = useState(currentSettings.walkingOffset || 0);
    const [loading, setLoading] = useState(false);

    // Track previous line to trigger "hard" defaults on line switch
    const prevLineRef = useRef(currentSettings.lineId);

    // Sync with external open state
    useEffect(() => {
        if (isOpenExternal !== undefined) {
            setIsOpen(isOpenExternal);
        }
    }, [isOpenExternal]);

    // Fetch tube lines on mount
    useEffect(() => {
        fetch('https://api.tfl.gov.uk/Line/Mode/tube')
            .then(r => r.json())
            .then(data => {
                setLines(data.map(l => ({ id: l.id, name: l.name })));
            })
            .catch(err => console.error('Failed to fetch lines:', err));
    }, []);

    // Fetch stations when line changes
    useEffect(() => {
        let ignore = false;

        if (selectedLine) {
            setLoading(true);
            fetch(`https://api.tfl.gov.uk/Line/${selectedLine}/Route/Sequence/outbound`)
                .then(r => r.json())
                .then(data => {
                    if (ignore) return;

                    // Extract stations from stopPointSequences to get them in order
                    const sequences = data.stopPointSequences || [];
                    const orderedStations = [];
                    const seenIds = new Set();

                    sequences.forEach(seq => {
                        seq.stopPoint.forEach(stop => {
                            if (!seenIds.has(stop.id)) {
                                seenIds.add(stop.id);
                                orderedStations.push({ id: stop.id, name: stop.name });
                            }
                        });
                    });

                    const config = LINE_CONFIG[selectedLine] || { reverse: true };

                    if (orderedStations.length > 0) {
                        const finalStations = config.reverse ? orderedStations.reverse() : orderedStations;
                        setStations(finalStations);
                        setLoading(false);
                    } else {
                        throw new Error('No sequence data found');
                    }
                })
                .catch(err => {
                    if (ignore) return;
                    console.warn('Failed to fetch sequence, falling back to simple list:', err);
                    fetch(`https://api.tfl.gov.uk/Line/${selectedLine}/StopPoints`)
                        .then(r => r.json())
                        .then(data => {
                            if (ignore) return;
                            setStations(data.map(s => ({ id: s.id, name: s.commonName })).sort((a, b) => a.name.localeCompare(b.name)));
                            setLoading(false);
                        })
                        .catch(e => {
                            if (ignore) return;
                            setLoading(false);
                            setStations([]);
                        });
                });
        }

        return () => {
            ignore = true;
        };
    }, [selectedLine]);

    // Auto-select valid station when station list changes
    useEffect(() => {
        if (stations.length > 0) {
            const lineConfig = LINE_CONFIG[selectedLine];
            const isLineSwitch = prevLineRef.current !== selectedLine;
            const isStillValid = stations.some(s => s.id === selectedStation);

            if (isLineSwitch && lineConfig?.defaultId) {
                // Hard default for specific lines when switching
                setSelectedStation(lineConfig.defaultId);
            } else if (!isStillValid) {
                // Fallback to first in list if current station is invalid
                setSelectedStation(stations[0].id);
            }
            prevLineRef.current = selectedLine;
        }
    }, [stations, selectedLine, selectedStation]);

    const handleSave = () => {
        const newSettings = {
            lineId: selectedLine,
            stopPointId: selectedStation,
            direction: selectedDirection,
            walkingOffset: parseInt(selectedOffset, 10) || 0,
            lineName: lines.find(l => l.id === selectedLine)?.name || '',
            stationName: stations.find(s => s.id === selectedStation)?.name || ''
        };
        onSettingsChange(newSettings);
        setIsOpen(false);
        if (onCloseExternal) onCloseExternal();
    };

    const handleClose = () => {
        setIsOpen(false);
        if (onCloseExternal) onCloseExternal();
    };

    const handleReset = () => {
        setSelectedLine('northern');
        setSelectedStation('940GZZLUTBC');
        setSelectedDirection('outbound');
        setSelectedOffset(0);
    };

    const directionOptions = getAvailableDirections(selectedLine);

    const getTitle = () => {
        if (viewMode === 'station') return 'Select Station';
        if (viewMode === 'line') return 'Select Line';
        return 'Settings';
    };

    return (
        <>
            {viewMode === 'all' && (
                <button className="settings-button" onClick={() => setIsOpen(true)}>
                    <span>⚙️</span> Settings
                </button>
            )}

            {isOpen && (
                <div className="settings-modal" onClick={handleClose}>
                    <div className="settings-content" onClick={e => e.stopPropagation()}>
                        <h2>{getTitle()}</h2>

                        {(viewMode === 'all' || viewMode === 'line') && (
                            <div className="setting-group">
                                <label>Tube Line:</label>
                                <select
                                    value={selectedLine}
                                    onChange={(e) => setSelectedLine(e.target.value)}
                                >
                                    {lines.map(line => (
                                        <option key={line.id} value={line.id}>{line.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {(viewMode === 'all' || viewMode === 'station') && (
                            <div className="setting-group">
                                <label>Station:</label>
                                <select
                                    value={selectedStation}
                                    onChange={(e) => setSelectedStation(e.target.value)}
                                    disabled={loading || !selectedLine}
                                >
                                    {loading ? (
                                        <option>Loading...</option>
                                    ) : (
                                        stations.map(station => (
                                            <option key={station.id} value={station.id}>
                                                {station.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        )}

                        {viewMode === 'all' && (
                            <>
                                <div className="setting-group">
                                    <label>Direction:</label>
                                    <select
                                        value={selectedDirection}
                                        onChange={(e) => setSelectedDirection(e.target.value)}
                                    >
                                        {directionOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="setting-group">
                                    <label>Walking Offset (mins):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="60"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={selectedOffset}
                                        onChange={(e) => setSelectedOffset(e.target.value)}
                                        onFocus={(e) => {
                                            if (selectedOffset === 0 || selectedOffset === '0') {
                                                setSelectedOffset('');
                                            }
                                        }}
                                        onBlur={() => {
                                            if (selectedOffset === '') {
                                                setSelectedOffset(0);
                                            }
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        <div className="settings-actions">
                            <button className="save-btn" onClick={handleSave}>
                                {viewMode === 'all' ? 'Save' : 'Confirm'}
                            </button>
                            {viewMode === 'all' && (
                                <button className="reset-btn" onClick={handleReset}>Reset Defaults</button>
                            )}
                            <button className="cancel-btn" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
