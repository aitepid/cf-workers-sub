/**
 * Nodes API endpoint (/api/nodes)
 */
export function handleNodesApi() {
    const nodes = [
        { id: 'nyc', lat: 40.7128, lng: -74.0060, name: 'New York', country: '🇺🇸 USA' },
        { id: 'tokyo', lat: 35.6762, lng: 139.6503, name: 'Tokyo', country: '🇯🇵 Japan' },
        { id: 'london', lat: 51.5074, lng: -0.1278, name: 'London', country: '🇬🇧 UK' },
        { id: 'singapore', lat: 1.3521, lng: 103.8198, name: 'Singapore', country: '🇸🇬 SG' },
        { id: 'sydney', lat: -33.8688, lng: 151.2093, name: 'Sydney', country: '🇦🇺 AU' },
        { id: 'beijing', lat: 39.9042, lng: 116.4074, name: 'Beijing', country: '🇨🇳 CN' },
        { id: 'paris', lat: 48.8566, lng: 2.3522, name: 'Paris', country: '🇫🇷 FR' },
        { id: 'seoul', lat: 37.5665, lng: 126.9780, name: 'Seoul', country: '🇰🇷 KR' }
    ];
    
    return new Response(JSON.stringify(nodes), {
        headers: { 'Content-Type': 'application/json' }
    });
}
