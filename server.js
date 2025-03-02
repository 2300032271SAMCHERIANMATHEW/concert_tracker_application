const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 5000;
const API_KEY = "BSjZObgMbdvxRCyMNY51gYxWXurKKQ3O"; // Replace with your Ticketmaster API Key

app.use(cors());

// Hardcoded concert data for Mumbai
const hardcodedConcerts = [
    {
        name: "Concert 1",
        date: "2025-03-10",
        venue: "Venue 1, Mumbai",
        lat: 19.0760,
        lon: 72.8777
    },
    {
        name: "Concert 2",
        date: "2025-03-15",
        venue: "Venue 2, Mumbai",
        lat: 19.0760,
        lon: 72.8777
    },
    {
        name: "Concert 3",
        date: "2025-04-01",
        venue: "Venue 3, Mumbai",
        lat: 19.0760,
        lon: 72.8777
    }
];

// Hardcoded concert data for Mumbai
const hardcodedConcertd = [
    {
        name: "Concert 1",
        date: "2025-03-10",
        venue: "Venue 1, delhi",
        lat: 19.0760,
        lon: 72.8777
    },
    {
        name: "Concert 2",
        date: "2025-03-15",
        venue: "Venue 2, delhi",
        lat: 19.0760,
        lon: 72.8777
    },
    {
        name: "Concert 3",
        date: "2025-04-01",
        venue: "Venue 3, delhi",
        lat: 19.0760,
        lon: 72.8777
    }
];

app.get("/concerts", async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    // Debug log to check the city query
    console.log("City requested:", city);

    // If the city is Mumbai, return the hardcoded concerts
    if (city.toLowerCase() === "mumbai") {
        console.log("Returning hardcoded concerts for Mumbai");
        return res.json(hardcodedConcerts);
    }
    if (city.toLowerCase() === "delhi") {
        console.log("Returning hardcoded concerts for delhi");
        return res.json(hardcodedConcertd);
    }

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${encodeURIComponent(city)}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if events exist and are an array
        if (!data._embedded || !Array.isArray(data._embedded.events)) {
            return res.json({ message: "No concerts found" });
        }

        const concerts = data._embedded.events.map(event => ({
            name: event.name,
            date: event.dates.start.localDate,
            venue: event._embedded.venues[0].name,
            lat: event._embedded.venues[0].location.latitude,
            lon: event._embedded.venues[0].location.longitude
        }));

        res.json(concerts);
    } catch (error) {
        console.error("Error fetching concerts:", error);
        res.status(500).json({ error: "Failed to fetch concerts" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
