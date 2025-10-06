# Calendly Webhook Setup Guide

## Overview

This guide will walk you through setting up Calendly webhooks to automatically update your Real-Time Consultations Dashboard when appointments are booked or canceled.

## Prerequisites

- Calendly account with admin access
- Dashboard deployed and accessible via HTTPS
- Admin password configured in environment variables

## Step 1: Access Calendly Webhook Settings

1. Log in to your Calendly account
2. Navigate to **Settings** → **Integrations** → **Webhooks**
3. Click **"Create Webhook"**

## Step 2: Configure Webhook URL

**Webhook URL**: `https://yourdomain.com/api/webhooks/calendly`

Replace `yourdomain.com` with your actual domain where the dashboard is deployed.

## Step 3: Select Events

Select the following events to receive notifications for:

- ✅ **invitee.created** - When someone books an appointment
- ✅ **invitee.canceled** - When someone cancels an appointment

## Step 4: Set Webhook Secret

1. Generate a secure random string (32+ characters)
2. Set this as your webhook secret in Calendly
3. Add the same secret to your dashboard's environment variables:

```bash
CALENDLY_WEBHOOK_SECRET=your_secure_webhook_secret_here
```

## Step 5: Test Webhook Connection

### Using the Dashboard Test Feature

1. Log in to your admin panel
2. Click **"Test Webhook"** button
3. Verify the test appears in your audit log

### Manual Testing with cURL

```bash
curl -X POST https://yourdomain.com/api/webhooks/calendly \
  -H "Content-Type: application/json" \
  -H "X-Calendly-Signature: your_signature" \
  -d '{
    "event": "invitee.created",
    "time": "2024-12-01T10:00:00.000000Z",
    "payload": {
      "event_type": {
        "uuid": "AAAAAAAAAAAAAAAA",
        "kind": "One-on-One",
        "slug": "consultation",
        "name": "Consultation",
        "duration": 30,
        "owner": {
          "type": "users",
          "uuid": "AAAAAAAAAAAAAAAA"
        }
      },
      "event": {
        "uuid": "AAAAAAAAAAAAAAAA",
        "assigned_to": ["user@example.com"],
        "extended_assigned_to": [
          {
            "email": "user@example.com",
            "name": "User Name",
            "primary": true
          }
        ],
        "start_time": "2024-12-01T10:00:00.000000Z",
        "start_time_pretty": "10:00am - Saturday, December 1, 2024",
        "end_time": "2024-12-01T10:30:00.000000Z",
        "end_time_pretty": "10:30am - Saturday, December 1, 2024",
        "created_at": "2024-12-01T09:00:00.000000Z",
        "location": null,
        "canceled": false,
        "canceler_name": null,
        "cancel_reason": null,
        "canceled_at": null
      },
      "invitee": {
        "uuid": "AAAAAAAAAAAAAAAA",
        "first_name": "John",
        "last_name": "Doe",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "text_reminder_number": null,
        "timezone": "America/New_York",
        "created_at": "2024-12-01T09:00:00.000000Z",
        "updated_at": "2024-12-01T09:00:00.000000Z",
        "canceled": false,
        "canceler_name": null,
        "cancel_reason": null,
        "canceled_at": null
      }
    }
  }'
```

## Step 6: Verify Dashboard Updates

After setting up the webhook:

1. Book a test appointment in Calendly
2. Check your dashboard - the "Booked Appointments" counter should increment by 1
3. The "Revenue Autopilot" should increase by your configured value per booking
4. The "Consultation Booking Rate" should recalculate automatically
5. Check the audit log in your admin panel for the webhook event

## Security Configuration

### IP Whitelisting (Optional)

If you want to restrict webhook access to Calendly's IP addresses:

```bash
ALLOWED_IPS=52.0.0.0/8,54.0.0.0/8
```

### Rate Limiting

The dashboard includes built-in rate limiting:
- **Default**: 10 requests per minute per IP
- **Burst limit**: 10 requests per second
- **Configurable**: Adjust in webhook route if needed

## Troubleshooting

### Webhook Not Working

1. **Check webhook URL**: Ensure it's accessible via HTTPS
2. **Verify secret**: Make sure the secret matches in both Calendly and your environment
3. **Check logs**: Review your server logs for error messages
4. **Test manually**: Use the test webhook feature in admin panel

### Common Issues

#### 401 Unauthorized
- Check that `CALENDLY_WEBHOOK_SECRET` is set correctly
- Verify the signature in the webhook request

#### 403 Forbidden
- Check IP whitelist if configured
- Ensure webhook is coming from Calendly

#### 429 Too Many Requests
- Rate limit exceeded
- Check for duplicate webhook configurations
- Review webhook retry logic

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
```

This will provide detailed logs of webhook processing.

## Webhook Payload Examples

### invitee.created Event

```json
{
  "event": "invitee.created",
  "time": "2024-12-01T10:00:00.000000Z",
  "payload": {
    "event_type": {
      "uuid": "AAAAAAAAAAAAAAAA",
      "kind": "One-on-One",
      "slug": "consultation",
      "name": "Consultation",
      "duration": 30
    },
    "event": {
      "uuid": "AAAAAAAAAAAAAAAA",
      "start_time": "2024-12-01T10:00:00.000000Z",
      "end_time": "2024-12-01T10:30:00.000000Z",
      "canceled": false
    },
    "invitee": {
      "uuid": "AAAAAAAAAAAAAAAA",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "canceled": false
    }
  }
}
```

### invitee.canceled Event

```json
{
  "event": "invitee.canceled",
  "time": "2024-12-01T10:00:00.000000Z",
  "payload": {
    "event_type": {
      "uuid": "AAAAAAAAAAAAAAAA",
      "kind": "One-on-One",
      "slug": "consultation",
      "name": "Consultation",
      "duration": 30
    },
    "event": {
      "uuid": "AAAAAAAAAAAAAAAA",
      "start_time": "2024-12-01T10:00:00.000000Z",
      "end_time": "2024-12-01T10:30:00.000000Z",
      "canceled": true,
      "cancel_reason": "Client requested cancellation"
    },
    "invitee": {
      "uuid": "AAAAAAAAAAAAAAAA",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "canceled": true
    }
  }
}
```

## Monitoring & Maintenance

### Webhook Health Monitoring

1. **Regular testing**: Use the test webhook feature weekly
2. **Audit log review**: Check for failed webhook deliveries
3. **Dashboard monitoring**: Ensure counters update correctly
4. **Error alerts**: Set up monitoring for webhook failures

### Calendly Webhook Management

1. **Webhook list**: Regularly review active webhooks in Calendly
2. **Event selection**: Ensure only necessary events are selected
3. **Secret rotation**: Rotate webhook secrets periodically
4. **URL updates**: Update webhook URLs when changing domains

## Support

If you encounter issues with webhook setup:

1. Check the [Calendly Webhook Documentation](https://developer.calendly.com/api-docs/CALENDLY_API.yaml)
2. Review your dashboard logs for error messages
3. Test webhook connectivity using the admin panel
4. Contact support with specific error messages and logs

---

**Last Updated**: December 2024  
**Next Review**: March 2025