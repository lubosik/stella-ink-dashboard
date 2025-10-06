# Stella's Ink Chamber Dashboard - Quick Setup Guide

## 🌐 Production Dashboard (Deployed)

**Dashboard:** https://stella-ink-dashboard-ynns.vercel.app/dashboard  
**Admin Panel:** https://stella-ink-dashboard-ynns.vercel.app/admin  
**API Endpoint:** https://stella-ink-dashboard-ynns.vercel.app/api/bookings

### Production API Key
```
QjLA4c46CL879xQ5WhUrgli3e2ZphQVA
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Start the Dashboard
```bash
# Navigate to your project folder
cd "/Users/ghost/SEO Blog (Stella's Ink Chamber)/Stella's Ink Chamber Research"

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

**Dashboard URL**: http://localhost:3003/dashboard  
**Admin Panel**: http://localhost:3003/admin

### Step 2: Access Admin Panel
1. **Click "Admin Panel" button** on the dashboard
2. **Enter password**: `admin123`
3. **Click Login**

### Step 3: Test the Booking API
1. **In the admin panel**, click **"Test Booking API"**
2. **Watch the dashboard** - metrics should update instantly!
3. **Check the audit log** - see the booking entry

---

## 📡 Booking API Integration

### API Endpoint
```
POST https://yourdomain.com/api/bookings
```

### Authentication
**API Key**: `dashboard-api-key-2024`

**Header Method (Recommended):**
```http
X-API-Key: dashboard-api-key-2024
```

**Query Parameter Method:**
```
?api_key=dashboard-api-key-2024
```

### Required Data Format
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

---

## 🔧 Integration Examples

### 1. cURL (Command Line)
```bash
# Create a booking
curl -X POST http://localhost:3003/api/bookings \
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

# Cancel a booking
curl -X POST http://localhost:3003/api/bookings \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dashboard-api-key-2024" \
  -d '{
    "event": "booking_canceled",
    "bookingId": "BK-2024-001",
    "clientName": "John Doe",
    "clientEmail": "john.doe@example.com",
    "appointmentDate": "2024-12-15",
    "appointmentTime": "10:00"
  }'
```

### 2. JavaScript/Node.js
```javascript
async function createBooking(bookingData) {
  const response = await fetch('http://localhost:3003/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'dashboard-api-key-2024'
    },
    body: JSON.stringify(bookingData)
  });
  
  return await response.json();
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

createBooking(booking).then(result => {
  console.log('Booking created:', result);
});
```

### 3. PHP
```php
<?php
function createBooking($bookingData) {
    $url = 'http://localhost:3003/api/bookings';
    
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
    
    return json_decode($response, true);
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

$result = createBooking($booking);
echo "Booking created: " . $result['bookingId'];
?>
```

### 4. Python
```python
import requests
import json

def create_booking(booking_data):
    url = 'http://localhost:3003/api/bookings'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'dashboard-api-key-2024'
    }
    
    response = requests.post(url, json=booking_data, headers=headers)
    return response.json()

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

result = create_booking(booking)
print(f"Booking created: {result['bookingId']}")
```

---

## 🎯 What Happens When You Send Data

### Dashboard Updates (Real-time)
1. **Booked Appointments**: +1 (for created) or -1 (for canceled)
2. **Revenue Autopilot**: Automatically calculated
3. **Booking Rate**: Recalculated based on website clicks
4. **Live Updates**: Dashboard updates within 1 second

### Audit Logging
- All API calls are logged with timestamps
- Client details are recorded
- Success/failure status tracked

### Analytics Tracking
- Dashboard views tracked
- Admin actions logged
- API usage monitored

---

## 🔧 Configuration

### Environment Variables (.env.local)
```bash
# Admin Access
ADMIN_PASSWORD=admin123

# API Security
DASHBOARD_API_KEY=dashboard-api-key-2024

# Optional Settings
VALUE_PER_BOOKING=100
ALLOWED_IPS=
NODE_ENV=development
PORT=3000
```

### Changing the API Key
1. **Edit `.env.local`**:
   ```bash
   DASHBOARD_API_KEY=your-custom-api-key
   ```
2. **Restart the server**: `Ctrl+C` then `npm run dev`
3. **Update your integrations** to use the new key

---

## 🧪 Testing Your Integration

### Method 1: Admin Panel Test
1. Go to http://localhost:3003/admin
2. Click **"Test Booking API"**
3. Watch dashboard update

### Method 2: API Documentation
Visit: http://localhost:3003/api/bookings?test=true

### Method 3: Manual cURL Test
```bash
curl -X POST http://localhost:3003/api/bookings \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dashboard-api-key-2024" \
  -d '{
    "event": "booking_created",
    "bookingId": "test-001",
    "clientName": "Test Client",
    "clientEmail": "test@example.com",
    "appointmentDate": "2024-12-15",
    "appointmentTime": "10:00"
  }'
```

---

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
NODE_ENV=production
ADMIN_PASSWORD=your-secure-password
DASHBOARD_API_KEY=your-production-api-key
```

### 2. Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm start
```

### 3. Update API URLs
Change all `localhost:3003` references to your production domain:
```bash
# From
http://localhost:3003/api/bookings

# To
https://yourdomain.com/api/bookings
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "Invalid password" in Admin Panel
**Solution**: 
- Check `.env.local` has `ADMIN_PASSWORD=admin123`
- Restart server: `Ctrl+C` then `npm run dev`

#### 2. "Unauthorized" API Error
**Solution**:
- Check API key: `dashboard-api-key-2024`
- Verify header: `X-API-Key: dashboard-api-key-2024`

#### 3. Dashboard Not Updating
**Solution**:
- Check browser console for errors
- Verify SSE connection (green dot should be live)
- Check server logs for API errors

#### 4. "Invalid booking data" Error
**Solution**:
- Verify all required fields are present
- Check data types (strings vs numbers)
- Validate date format: `YYYY-MM-DD`
- Validate time format: `HH:MM`

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run dev
```

### Check Logs
- **Server logs**: Terminal output
- **Audit log**: Admin panel → Recent Changes
- **Browser console**: F12 → Console tab

---

## 📊 Dashboard Metrics Explained

### Booked Appointments
- **Source**: API calls with `event: "booking_created"`
- **Updates**: +1 for new bookings, -1 for cancellations
- **Display**: Animated counter with flip effect

### Revenue Autopilot
- **Calculation**: Booked Appointments × Value Per Booking
- **Default Value**: $100 CAD per booking
- **Display**: Smooth money ticker animation

### Consultation Booking Rate
- **Calculation**: (Booked Appointments ÷ Website Clicks) × 100
- **Updates**: Recalculated automatically
- **Display**: Percentage with animated count-up

### Estimated Revenue for Stella
- **Source**: Manual entry in admin panel
- **Purpose**: Track projected revenue
- **Display**: Read-only money format

---

## 🎨 Customization

### Brand Colors
Edit `/tokens/stella-brand.json`:
```json
{
  "color": {
    "primary": "#293919",
    "primaryLight": "#3d5226",
    "accent": "#f59e0b",
    "success": "#10b981"
  }
}
```

### Default Values
Edit `.env.local`:
```bash
VALUE_PER_BOOKING=150  # Change default booking value
```

### Dashboard Layout
- **Mobile**: 1 column
- **Tablet**: 2 columns  
- **Desktop**: 3 columns

---

## 📞 Support & Resources

### Documentation Files
- **API Reference**: `/outputs/dashboard/API-DOCUMENTATION.md`
- **Setup Guide**: `/outputs/dashboard/SETUP-CALENDLY.md`
- **Performance Report**: `/outputs/dashboard/LIGHTHOUSE.md`
- **Brand Compliance**: `/outputs/dashboard/BRAND-GUARD-REPORT.md`

### Quick Commands
```bash
# Start development
npm run dev

# Run tests
npm test

# Check brand compliance
npm run brandguard

# Seed initial data
npm run seed

# Build for production
npm run build
```

### URLs
- **Dashboard**: http://localhost:3003/dashboard
- **Admin Panel**: http://localhost:3003/admin
- **API Endpoint**: http://localhost:3003/api/bookings
- **API Docs**: http://localhost:3003/api/bookings?test=true

---

## ✅ Checklist for New Users

### Initial Setup
- [ ] Clone/download the project
- [ ] Run `npm install`
- [ ] Create `.env.local` with correct password
- [ ] Run `npm run seed`
- [ ] Start server with `npm run dev`

### Testing
- [ ] Access dashboard at http://localhost:3003/dashboard
- [ ] Login to admin panel with password `admin123`
- [ ] Click "Test Booking API" button
- [ ] Verify dashboard updates in real-time

### Integration
- [ ] Choose integration method (cURL, JavaScript, PHP, Python)
- [ ] Test API call with sample data
- [ ] Verify response and dashboard updates
- [ ] Implement in your booking system

### Production
- [ ] Set secure production passwords
- [ ] Generate unique API key
- [ ] Update API URLs to production domain
- [ ] Test end-to-end booking flow

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Support**: Check audit logs and server console for debugging

---

*This guide covers everything you need to get started with Stella's Ink Chamber Dashboard. For advanced configuration and troubleshooting, refer to the full documentation files in the `/outputs/dashboard/` folder.*
