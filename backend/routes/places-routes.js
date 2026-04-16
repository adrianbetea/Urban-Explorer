const express = require('express');

const router = express.Router();
const GOOGLE_AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const GOOGLE_PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

function getApiKey(res) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        res.status(500).json({
            error: 'Missing GOOGLE_PLACES_API_KEY in backend .env.',
        });
        return '';
    }

    return apiKey;
}

// GET /api/places/autocomplete?input=bucharest
router.get('/autocomplete', async (req, res) => {
    try {
        const input = (req.query.input || '').trim();

        if (!input) {
            return res.status(400).json({ error: 'Missing required query parameter: input.' });
        }

        const apiKey = getApiKey(res);
        if (!apiKey) {
            return;
        }

        const country = (req.query.country || '').trim();
        const types = (req.query.types || '(cities)').trim();

        const params = new URLSearchParams({
            input,
            key: apiKey,
            types,
        });

        if (country) {
            params.append('components', `country:${country}`);
        }

        const response = await fetch(`${GOOGLE_AUTOCOMPLETE_URL}?${params.toString()}`);
        const payload = await response.json();

        if (!response.ok || payload.status === 'REQUEST_DENIED' || payload.status === 'INVALID_REQUEST') {
            return res.status(502).json({
                error: payload.error_message || 'Google Places request failed.',
                details: payload.status || 'UNKNOWN_ERROR',
            });
        }

        const suggestions = (payload.predictions || []).map((item) => ({
            description: item.description,
            mainText: item.structured_formatting?.main_text || '',
            secondaryText: item.structured_formatting?.secondary_text || '',
            placeId: item.place_id,
            types: item.types || [],
        }));

        return res.status(200).json({
            count: suggestions.length,
            data: suggestions,
            status: payload.status,
        });
    } catch (error) {
        console.error('Places autocomplete error:', error);
        return res.status(500).json({ error: 'Failed to fetch places suggestions. ' + error.message });
    }
});

// GET /api/places/details?placeId=abc123
router.get('/details', async (req, res) => {
    try {
        const placeId = (req.query.placeId || '').trim();

        if (!placeId) {
            return res.status(400).json({ error: 'Missing required query parameter: placeId.' });
        }

        const apiKey = getApiKey(res);
        if (!apiKey) {
            return;
        }

        const params = new URLSearchParams({
            key: apiKey,
            place_id: placeId,
            fields: 'name,formatted_address,geometry',
        });

        const response = await fetch(`${GOOGLE_PLACE_DETAILS_URL}?${params.toString()}`);
        const payload = await response.json();

        if (!response.ok || payload.status === 'REQUEST_DENIED' || payload.status === 'INVALID_REQUEST' || payload.status === 'NOT_FOUND') {
            return res.status(502).json({
                error: payload.error_message || 'Google Place Details request failed.',
                details: payload.status || 'UNKNOWN_ERROR',
            });
        }

        const location = payload.result?.geometry?.location;

        return res.status(200).json({
            data: {
                formattedAddress: payload.result?.formatted_address || '',
                location: location
                    ? {
                        latitude: location.lat,
                        longitude: location.lng,
                    }
                    : null,
                name: payload.result?.name || '',
                placeId,
            },
            status: payload.status,
        });
    } catch (error) {
        console.error('Place details error:', error);
        return res.status(500).json({ error: 'Failed to fetch place details. ' + error.message });
    }
});

module.exports = router;
