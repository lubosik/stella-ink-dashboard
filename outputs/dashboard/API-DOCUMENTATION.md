# Dashboard Booking API Documentation

## Overview

The Dashboard Booking API allows external systems to send booking data directly to Stella's Ink Chamber dashboard, updating metrics in real-time.

## Base URL

```
https://yourdomain.com/api/bookings
```

## Authentication

The API uses a simple API key authentication system:

### Method 1: Header Authentication (Recommended)
```http
X-API-Key: dashboard-api-key-2024
```

### Method 2: Query Parameter Authentication
```
https://yourdomain.com/api/bookings?api_key=dashboard-api-key-2024
```

## Endpoints

### POST /api/bookings

Creates or cancels a booking and updates the dashboard metrics.

#### Request Headers
```http
Content-Type: application/json
X-API-Key: dashboard-api-key-2024
```

#### Request Body Schema

```json
{
  "event": "booking_created" | "booking_canceled",
  "bookingId": "string (required)",
  "clientName": "string (required)",
  "clientEmail": "string (required)",
  "appointmentDate": "string (required, YYYY-MM-DD)",
  "appointmentTime": "string (required, HH:MM)",
  "serviceType": "string (optional)",
  "value": "number (optional)",
  "notes": "string (optional)"
}
```

#### Example Request

**Create Booking:**
```json
{
  "event": "booking_created",
  "bookingId": "BK-2024-001",
  "clientName": "John Doe",
  "clientEmail": "john.doe@example.com",
  "appointmentDate": "2024-12-15",
  "appointmentTime": "10:00",
  "serviceType": "Consultation",
  "value": 150,
  "notes": "First-time client"
}
```

**Cancel Booking:**
```json
{
  "event": "booking_canceled",
  "bookingId": "BK-2024-001",
  "clientName": "John Doe",
  "clientEmail": "john.doe@example.com",
  "appointmentDate": "2024-12-15",
  "appointmentTime": "10:00",
  "serviceType": "Consultation",
  "notes": "Client requested cancellation"
}
```

#### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Booking booking_created processed successfully",
  "bookingId": "BK-2024-001",
  "clientName": "John Doe",
  "updatedState": {
    "bookedAppointments": 5,
    "revenueAutopilot": 750,
    "bookingRate": 12.5
  }
}
```

**Error (400):**
```json
{
  "error": "Invalid booking data. Required fields: event, bookingId, clientName, clientEmail, appointmentDate, appointmentTime"
}
```

**Error (401):**
```json
{
  "error": "Unauthorized"
}
```

### GET /api/bookings

Returns API documentation and test data structure.

#### Query Parameters
- `test=true` - Returns example data structure

#### Example Response
```json
{
  "message": "Stella's Ink Chamber Dashboard Booking API",
  "version": "1.0.0",
  "endpoints": {
    "POST /api/bookings": "Create or cancel a booking",
    "GET /api/bookings?test=true": "Get test data structure"
  },
  "authentication": {
    "method": "API Key",
    "header": "X-API-Key",
    "query": "api_key",
    "value": "dashboard-api-key-2024"
  },
  "schema": {
    "event": "booking_created | booking_canceled",
    "bookingId": "string (required)",
    "clientName": "string (required)",
    "clientEmail": "string (required)",
    "appointmentDate": "string (required)",
    "appointmentTime": "string (required)",
    "serviceType": "string (optional)",
    "value": "number (optional)",
    "notes": "string (optional)"
  }
}
```

## Integration Examples

### cURL Examples

**Create a booking:**
```bash
curl -X POST https://yourdomain.com/api/bookings \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dashboard-api-key-2024" \
  -d '{
    "event": "booking_created",
    "bookingId": "BK-2024-001",
    "clientName": "John Doe",
    "clientEmail": "john.doe@example.com",
    "appointmentDate": "2024-12-15",
    "appointmentTime": "10:00",
    "serviceType": "Consultation",
    "value": 150,
    "notes": "First-time client"
  }'
```

**Cancel a booking:**
```bash
curl -X POST https://yourdomain.com/api/bookings \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dashboard-api-key-2024" \
  -d '{
    "event": "booking_canceled",
    "bookingId": "BK-2024-001",
    "clientName": "John Doe",
    "clientEmail": "john.doe@example.com",
    "appointmentDate": "2024-12-15",
    "appointmentTime": "10:00",
    "serviceType": "Consultation",
    "notes": "Client requested cancellation"
  }'
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

async function createBooking(bookingData) {
  try {
    const response = await axios.post('https://yourdomain.com/api/bookings', bookingData, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'dashboard-api-key-2024'
      }
    });
    
    console.log('Booking created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
const booking = {
  event: 'booking_created',
  bookingId: 'BK-2024-001',
  clientName: 'John Doe',
  clientEmail: 'john.doe@example.com',
  appointmentDate: '2024-12-15',
  appointmentTime: '10:00',
  serviceType: 'Consultation',
  value: 150,
  notes: 'First-time client'
};

createBooking(booking);
```

### PHP Example

```php
<?php
function createBooking($bookingData) {
    $url = 'https://yourdomain.com/api/bookings';
    
    $headers = [
        'Content-Type: application/json',
        'X-API-Key: dashboard-api-key-2024'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($bookingData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        return json_decode($response, true);
    } else {
        throw new Exception('API Error: ' . $response);
    }
}

// Usage
$booking = [
    'event' => 'booking_created',
    'bookingId' => 'BK-2024-001',
    'clientName' => 'John Doe',
    'clientEmail' => 'john.doe@example.com',
    'appointmentDate' => '2024-12-15',
    'appointmentTime' => '10:00',
    'serviceType' => 'Consultation',
    'value' => 150,
    'notes' => 'First-time client'
];

try {
    $result = createBooking($booking);
    echo "Booking created: " . $result['bookingId'];
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
```

### Python Example

```python
import requests
import json

def create_booking(booking_data):
    url = 'https://yourdomain.com/api/bookings'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'dashboard-api-key-2024'
    }
    
    try:
        response = requests.post(url, json=booking_data, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating booking: {e}")
        raise

# Usage
booking = {
    'event': 'booking_created',
    'bookingId': 'BK-2024-001',
    'clientName': 'John Doe',
    'clientEmail': 'john.doe@example.com',
    'appointmentDate': '2024-12-15',
    'appointmentTime': '10:00',
    'serviceType': 'Consultation',
    'value': 150,
    'notes': 'First-time client'
}

try:
    result = create_booking(booking)
    print(f"Booking created: {result['bookingId']}")
except Exception as e:
    print(f"Error: {e}")
```

## Dashboard Impact

When a booking is created or canceled, the following dashboard metrics are automatically updated:

### For `booking_created`:
- **Booked Appointments**: +1
- **Revenue Autopilot**: +valuePerBooking (default: $100 CAD)
- **Booking Rate**: Recalculated based on website clicks

### For `booking_canceled`:
- **Booked Appointments**: -1 (minimum 0)
- **Revenue Autopilot**: Recalculated
- **Booking Rate**: Recalculated

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (invalid data)
- **401**: Unauthorized (invalid API key)
- **500**: Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended to:
- Batch multiple bookings when possible
- Implement client-side rate limiting
- Monitor API usage

## Security Considerations

1. **API Key**: Keep your API key secure and rotate it regularly
2. **HTTPS**: Always use HTTPS in production
3. **Validation**: All input data is validated and sanitized
4. **Audit Logging**: All API calls are logged for security monitoring

## Testing

You can test the API using:

1. **Admin Panel**: Use the "Test Booking API" button
2. **cURL**: Use the examples above
3. **API Documentation**: Visit `GET /api/bookings?test=true`

## Support

For API support or questions:
- Check the audit log in the admin panel
- Review server logs for detailed error messages
- Test with the provided examples

---

**API Version**: 1.0.0  
**Last Updated**: December 2024  
**Next Review**: March 2025
