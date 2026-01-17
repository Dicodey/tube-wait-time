# Tube Wait Time Web App

A React web application that displays real-time Northern Line arrival times for **Tooting Bec** station in a dot-matrix style.

## Features
- **Real-time Data**: Connects to the TFL Unified API.
- **Auto-Refresh**: Updates every 15 seconds.
- **Direction Filtering**: Shows Northbound trains (Inbound to Central London).
- **Smart Display**: Shows "via Bank" or "via Charing Cross" distinctions.
- **Visuals**: High-contrast LED aesthetic using `DotGothic16` font.

## How to Run Locally

1.  **Prerequisites**: Ensure you have Node.js installed.
2.  **Navigate to the folder**:
    ```bash
    cd tube-wait-time
    ```
3.  **Install Dependencies** (first time only):
    ```bash
    npm install
    ```
4.  **Start the Server**:
    ```bash
    npm run dev
    ```
5.  **Open in Browser**:
    - The terminal will show a URL, usually `http://localhost:5173/` or `http://localhost:5174/`.
    - Command-click (Mac) or Ctrl-click (Windows) the link to open it.

## How to Test / Verify

To verify the data is accurate:
1.  Open the app in your browser.
2.  Open the [TFL Live Arrivals for Tooting Bec](https://tfl.gov.uk/tube/stop/940GZZLUTBC/tooting-bec-underground-station/) in a separate tab.
3.  Compare the top 3 trains. They should match efficiently (refresh the TFL page if needed as it doesn't auto-update as fast as the app).

## Customization
- **Station**: Modify `STATION_ID` in `src/hooks/useTflArrivals.js`.
- **Styles**: Edit `src/index.css` for colors or font sizing.
