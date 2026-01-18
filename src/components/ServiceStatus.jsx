import React, { useRef, useEffect, useState } from 'react';
import { useTflStatus } from '../hooks/useTflStatus';

export function ServiceStatus({ lineId = 'northern' }) {
    const { status, reason, loading } = useTflStatus(lineId);
    const contentRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        if (contentRef.current) {
            const isOverflowing = contentRef.current.scrollWidth > contentRef.current.clientWidth;
            setShouldScroll(isOverflowing);
        }
    }, [status, reason, loading]);

    if (loading) return null;

    const isGoodService = status === 'Good Service';
    const displayText = reason || status;

    return (
        <div className="service-status">
            <div className="status-label">SERVICE:</div>
            <div className={`status-content ${!isGoodService ? 'disrupted' : ''}`} ref={contentRef}>
                <div className={shouldScroll ? 'scroll-content' : ''}>
                    {displayText}
                    {shouldScroll && <span className="scroll-spacer">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{displayText}</span>}
                </div>
            </div>
        </div>
    );
}
