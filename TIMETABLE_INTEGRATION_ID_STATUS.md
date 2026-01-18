# Timetable Integration Status

## Current State
The application has been updated to support a "Hybrid" view of train arrivals:
1. **Live Data**: Fetched from the TFL Unified API (`/Arrivals`).
2. **Scheduled Data**: Fetched from the TFL Timetable API (`/Timetable`), used to fill gaps when live trains are scarce (e.g., at terminus stations).

## Resolved Issues
1. **TFL API 404 Errors**: These were resolved by adding the `?direction=inbound/outbound` parameter to the API call. The TFL Timetable API requires a direction for many stations on complex lines like the Northern Line.
2. **Data Parsing**: Fixed a bug where `j.hour` was mistaken for a full time string. It is now correctly parsed as an integer alongside `j.minute`.
3. **Schedule Selection**: Added logic to automatically select the correct schedule (Sunday, Saturday, weekday) based on the current day of the week.
4. **Pool Size**: Increased the internal pool of trains from 5 to 10. This ensures that even when a "Walking Offset" is applied (filtering out the earliest trains), the board still has enough scheduled trains to display.

## Current State
- **Live Data**: Active.
- **Scheduled Data**: Active and filling gaps beyond the live 12-minute window.
- **Hybrid View**: Successfully merging both sources.
