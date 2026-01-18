// Official TfL Hex Colors for Tube Map Lines
export const LINE_COLORS = {
    'bakerloo': '#B36305',
    'central': '#E32017',
    'circle': '#FFD300',
    'district': '#00782A',
    'hammersmith-city': '#F3A9BB',
    'jubilee': '#A0A5A9',
    'metropolitan': '#9B0056',
    'northern': '#000000',
    'piccadilly': '#003688',
    'victoria': '#0098D4',
    'waterloo-city': '#95CDBA',
    'elizabeth': '#6950A1',
    'london-overground': '#EF7B10',
    'dlr': '#00AFAD'
};

// Direction mappings for each tube line
// Based on how TfL typically describes each line's directions
export const LINE_DIRECTIONS = {
    'bakerloo': {
        'outbound': 'Northbound',
        'inbound': 'Southbound'
    },
    'central': {
        'outbound': 'Eastbound',
        'inbound': 'Westbound'
    },
    'circle': {
        'outbound': 'Clockwise',
        'inbound': 'Anti-clockwise'
    },
    'district': {
        'outbound': 'Eastbound',
        'inbound': 'Westbound'
    },
    'hammersmith-city': {
        'outbound': 'Eastbound',
        'inbound': 'Westbound'
    },
    'jubilee': {
        'outbound': 'Eastbound',
        'inbound': 'Westbound'
    },
    'metropolitan': {
        'outbound': 'Northbound',
        'inbound': 'Southbound'
    },
    'northern': {
        'outbound': 'Northbound',
        'inbound': 'Southbound'
    },
    'piccadilly': {
        'outbound': 'Eastbound',
        'inbound': 'Westbound'
    },
    'victoria': {
        'outbound': 'Northbound',
        'inbound': 'Southbound'
    },
    'waterloo-city': {
        'outbound': 'Eastbound',
        'inbound': 'Westbound'
    }
};

// Get color for a specific line
export function getLineColor(lineId) {
    return LINE_COLORS[lineId] || '#333';
}

// Get direction label for a specific line
export function getDirectionLabel(lineId, direction) {
    const lineDirections = LINE_DIRECTIONS[lineId];
    if (!lineDirections) return direction; // fallback
    return lineDirections[direction] || direction;
}

// Get available directions for a line
export function getAvailableDirections(lineId) {
    const lineDirections = LINE_DIRECTIONS[lineId];
    if (!lineDirections) {
        return [
            { value: 'outbound', label: 'Outbound' },
            { value: 'inbound', label: 'Inbound' }
        ];
    }

    return [
        { value: 'outbound', label: lineDirections.outbound || 'Outbound' },
        { value: 'inbound', label: lineDirections.inbound || 'Inbound' }
    ];
}
