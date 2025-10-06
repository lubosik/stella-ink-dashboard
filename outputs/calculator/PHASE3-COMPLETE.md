# Phase 3 Complete: API Handler + Notifications ✅

**Date**: 2025-10-05
**Status**: Backend infrastructure complete
**Next Phase**: Styling (CSS) - Phase 4

---

## Files Created

### API Route Handler

#### 1. [/app/api/lead/route.ts](../../app/api/lead/route.ts) ✅
**Next.js API route for lead submissions**

**Endpoint**: `POST /api/lead`

**Functionality**:
- ✅ Validates input data using `validateInputs()` from pricing calculator
- ✅ Generates unique lead ID (`LEAD-{timestamp}-{random}`)
- ✅ Saves lead to JSONL file (`data/leads/leads.jsonl`)
- ✅ Sends confirmation email to prospect
- ✅ Sends alert email to Stella
- ✅ Forwards to CRM webhook (optional)
- ✅ Sends SMS notification via Twilio (optional)
- ✅ Captures IP address and user agent
- ✅ Returns success/error response

**Request Body**:
```json
{
  "inputs": {
    "gender": "male",
    "age_band": "35-44",
    "concern": "receding",
    "coverage_area": "full_top",
    "norwood": "IV",
    "finish": "natural",
    "timing": "asap",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "consent": true
  },
  "estimate": {
    "low": 2142,
    "high": 2894,
    "mid": 2518,
    "currency": "CAD",
    "sessions": { "count": 3, "description": "..." },
    "factors": ["..."],
    "disclaimer": "..."
  },
  "timestamp": "2025-10-05T02:00:00.000Z"
}
```

**Response** (Success):
```json
{
  "success": true,
  "leadId": "LEAD-ABC123DEF",
  "message": "Your estimate has been sent to john@example.com"
}
```

**Response** (Error):
```json
{
  "error": "Validation failed",
  "details": ["Missing required contact information"]
}
```

**Error Handling**:
- Validation errors → 400 Bad Request
- Missing contact info → 400 Bad Request
- Server errors → 500 Internal Server Error
- Email failures → Logged but don't fail request
- SMS failures → Logged but don't fail request
- CRM webhook failures → Logged but don't fail request

**CORS Support**: `OPTIONS /api/lead` returns CORS headers

---

### Email Notification System

#### 2. [/lib/notifications/email.ts](../../lib/notifications/email.ts) ✅
**Nodemailer-based email templates**

**Functions**:

##### `sendConfirmationEmail()`
Sends beautiful HTML email to prospect with their estimate.

**Parameters**:
```typescript
{
  to: string;         // prospect@email.com
  name: string;       // "John Smith"
  estimate: PriceEstimate;
  leadId: string;     // "LEAD-ABC123DEF"
  bookingUrl: string; // "https://stellasinkchamber.com/book"
}
```

**Email Features**:
- ✅ Responsive HTML design (works on all devices)
- ✅ Stella's brand colors (#293919 dark green)
- ✅ Personalized greeting with name
- ✅ Price range display (CAD 2,142 - 2,894)
- ✅ Session count breakdown
- ✅ $100 gift card offer banner
- ✅ "Book Free Consultation" CTA button (links to booking page with tracking params)
- ✅ Disclaimer text
- ✅ CASL-compliant unsubscribe link
- ✅ Plain text fallback for email clients that don't support HTML

**Subject Line**:
```
Your SMP Estimate: CAD 2,142-2,894
```

**Preview**:
```
Hi John,

Thank you for using our instant price calculator!
Based on your answers, here's your personalized SMP estimate.

Your Estimate: CAD 2,142 - 2,894
Typical: CAD 2,518
3 sessions recommended (spaced 2-4 weeks apart)

✨ $100 GIFT CARD OFFER
Book your free consultation this month and receive a $100 gift card...

[Book Free Consultation Button]
```

---

##### `sendAlertEmail()`
Sends lead notification to Stella with all prospect details.

**Parameters**:
```typescript
{
  to: string;            // stella@stellasinkchamber.com
  lead: Lead;            // Full lead object
  estimate: PriceEstimate;
}
```

**Email Features**:
- ✅ 🎯 New Calculator Lead header
- ✅ Lead ID for tracking
- ✅ Contact info (email + phone clickable)
- ✅ Estimate range (bolded)
- ✅ Session count
- ✅ All quiz answers formatted in table
- ✅ "ASAP" timing highlighted in green with 🔥 emoji
- ✅ Add-ons listed
- ✅ ⏰ "Follow-up within 1 hour" banner
- ✅ Timestamp of submission

**Subject Line**:
```
🔔 New SMP Lead: John Smith (CAD 2,518)
```

**Data Included**:
- Name, email, phone (clickable links)
- Estimate range + typical price
- Session count
- Gender / Age band
- Primary concern
- Coverage area + Norwood scale (if applicable)
- Finish preference
- Timing (highlighted if ASAP)
- Add-ons (scar camouflage, women's density)
- Submission timestamp

**Urgency Indicator**:
If `timing === 'asap'`, the row is styled with:
- Bold font weight
- Green color (#10b981)
- 🔥 fire emoji

---

### SMS Notification System

#### 3. [/lib/notifications/sms.ts](../../lib/notifications/sms.ts) ✅
**Twilio SMS sending (optional)**

**Function**: `sendSMS()`

**Parameters**:
```typescript
{
  to: string;          // "+15551234567"
  name: string;        // "John"
  estimateRange: string; // "CAD 2,142-2,894"
  bookingUrl: string;  // "https://stellasinkchamber.com/book"
}
```

**Message Format**:
```
Hi John! Your SMP estimate from Stella's Ink Chamber: CAD 2,142-2,894. Book your free consultation: https://stellasinkchamber.com/book
```

**Length**: ~125 characters (well under 160-char SMS limit)

**Error Handling**:
- If Twilio credentials missing → Log warning, skip SMS (doesn't fail request)
- If Twilio API error → Logged and thrown

**When It Sends**:
- Only if `TWILIO_ACCOUNT_SID` is configured
- Only if prospect provided phone number
- Sent AFTER email confirmation

---

### Configuration Files

#### 4. [.env.local.example](../../.env.local.example) ✅
**Environment variable template**

**Required Variables**:
```bash
# SMTP (Required)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key_here
EMAIL_SENDER=Stella's Ink Chamber <hello@stellasinkchamber.com>
ALERT_EMAIL=stella@stellasinkchamber.com

# Booking URL (Required)
NEXT_PUBLIC_BOOKING_URL=https://stellasinkchamber.com/book
```

**Optional Variables**:
```bash
# Twilio SMS (Optional)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+15551234567

# CRM Webhook (Optional)
CRM_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/123456/abcdef
```

**Includes Examples For**:
- SendGrid SMTP
- Mailgun SMTP (alternative)
- Mailtrap (testing)
- Twilio setup
- CRM webhook (Zapier, Make.com)

---

#### 5. [.gitignore](../../.gitignore) ✅
**Git exclusions**

**Protects**:
- `.env.local` (secrets)
- `node_modules/` (dependencies)
- `data/leads/leads.jsonl` (production lead data)
- `.next/` (build artifacts)
- Debug logs
- OS files (.DS_Store)
- IDE configs

---

## Data Storage

### JSONL Lead File

**Location**: `/data/leads/leads.jsonl`

**Format**: One JSON object per line (newline-delimited JSON)

**Example Entry**:
```json
{"id":"LEAD-ABC123DEF","inputs":{"gender":"male","age_band":"35-44","concern":"receding","coverage_area":"full_top","norwood":"IV","finish":"natural","timing":"asap","scar_addon":false,"womens_density_addon":false,"name":"John Smith","email":"john@example.com","phone":"(555) 123-4567","consent":true},"estimate":{"low":2142,"high":2894,"mid":2518,"currency":"CAD","sessions":{"count":3,"description":"3 sessions recommended (spaced 2-4 weeks apart)"},"factors":["Norwood stage IV (15% adjustment)"],"disclaimer":"This is an estimate only..."},"timestamp":"2025-10-05T02:00:00.000Z","ip":"192.168.1.1","userAgent":"Mozilla/5.0..."}
```

**Why JSONL?**:
- Simple append-only file (no database needed for MVP)
- Each line is a valid JSON object
- Easy to parse: `fs.readFileSync().split('\n').map(JSON.parse)`
- Can be imported into Google Sheets, Excel, or any database later
- Automatically created on first lead submission

**Reading Leads** (example script):
```typescript
import { promises as fs } from 'fs';

const data = await fs.readFile('data/leads/leads.jsonl', 'utf-8');
const leads = data.trim().split('\n').map(line => JSON.parse(line));

// Filter leads from today
const today = leads.filter(lead =>
  new Date(lead.timestamp).toDateString() === new Date().toDateString()
);

console.log(`${today.length} leads today`);
```

---

## Email Service Setup

### SendGrid (Recommended)

**Why SendGrid?**
- Free tier: 100 emails/day (sufficient for MVP)
- Easy SMTP integration
- Good deliverability
- Detailed analytics

**Setup Steps**:

1. **Sign up** at sendgrid.com
2. **Verify sender domain**:
   - Go to Settings → Sender Authentication
   - Add DNS records (SPF, DKIM)
   - Wait for verification (can take 24-48 hours)
3. **Create API key**:
   - Settings → API Keys → Create API Key
   - Full Access or Mail Send only
   - Copy key (starts with `SG.`)
4. **Add to `.env.local`**:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.your_actual_api_key_here
   EMAIL_SENDER=Stella's Ink Chamber <hello@stellasinkchamber.com>
   ```

### Alternative: Mailgun

**Free tier**: 5,000 emails/month for 3 months

**Setup**:
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASS=your_mailgun_password
```

### Testing: Mailtrap

**For development only** (doesn't send real emails):

```bash
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
```

All emails go to Mailtrap inbox for preview.

---

## CRM Integration Options

### Option 1: Zapier Webhook

**Cost**: Free tier (100 tasks/month)

**Setup**:
1. Create new Zap
2. Trigger: Webhooks by Zapier → Catch Hook
3. Copy webhook URL
4. Add to `.env.local`: `CRM_WEBHOOK_URL=https://hooks.zapier.com/...`
5. Action: Choose your CRM (Salesforce, HubSpot, Google Sheets, etc.)

### Option 2: Make.com (formerly Integromat)

**Cost**: Free tier (1,000 operations/month)

**Setup**:
1. Create new scenario
2. Webhook module → Custom Webhook
3. Copy URL
4. Add to `.env.local`
5. Add CRM module (Salesforce, Pipedrive, Airtable, etc.)

### Option 3: Direct CRM API

**For custom integration**, modify `/app/api/lead/route.ts`:

```typescript
// Example: Salesforce
if (process.env.SALESFORCE_ACCESS_TOKEN) {
  await fetch('https://your-instance.salesforce.com/services/data/v58.0/sobjects/Lead/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      FirstName: inputs.name?.split(' ')[0],
      LastName: inputs.name?.split(' ').slice(1).join(' ') || inputs.name,
      Email: inputs.email,
      Phone: inputs.phone,
      LeadSource: 'Instant Quote Calculator',
      Description: `Estimate: ${estimate.currency} ${estimate.low}-${estimate.high}`
    })
  });
}
```

---

## SMS Setup (Optional)

### Twilio

**Cost**:
- $1/month per phone number
- $0.0079/SMS (USA/Canada)

**Setup**:

1. **Sign up** at twilio.com
2. **Buy phone number**:
   - Phone Numbers → Buy a Number
   - Select country (Canada)
   - Choose number with SMS capability
3. **Get credentials**:
   - Dashboard → Account SID (starts with `AC`)
   - Auth Token (click to reveal)
4. **Add to `.env.local`**:
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+15551234567
   ```

**Testing**:
Use Twilio's test credentials for development:
- Account SID: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (fake)
- Messages won't actually send but API calls will succeed

---

## Testing the API

### Manual Test with cURL

```bash
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {
      "gender": "male",
      "age_band": "35-44",
      "concern": "receding",
      "coverage_area": "full_top",
      "norwood": "IV",
      "finish": "natural",
      "timing": "asap",
      "name": "Test User",
      "email": "test@example.com",
      "phone": "(555) 123-4567",
      "consent": true
    },
    "estimate": {
      "low": 2142,
      "high": 2894,
      "mid": 2518,
      "currency": "CAD",
      "sessions": {
        "count": 3,
        "description": "3 sessions recommended"
      },
      "factors": ["Norwood stage IV (15% adjustment)"],
      "disclaimer": "This is an estimate only..."
    },
    "timestamp": "2025-10-05T02:00:00.000Z"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "leadId": "LEAD-M2N3O4P5Q",
  "message": "Your estimate has been sent to test@example.com"
}
```

### Check Email Delivery

1. Open Mailtrap inbox (if using for testing)
2. Verify:
   - ✅ Confirmation email sent to prospect
   - ✅ Alert email sent to Stella
   - ✅ HTML renders correctly
   - ✅ CTA button links work
   - ✅ Plain text version exists

### Check Lead Storage

```bash
cat data/leads/leads.jsonl
```

Should show one JSON object per line.

---

## Error Scenarios

### What Happens If...

**Email fails to send?**
- API still returns success (lead is saved)
- Error logged to console
- Stella gets no alert (manually check JSONL file)
- **Fix**: Check SMTP credentials in `.env.local`

**SMS fails to send?**
- API still returns success (lead is saved)
- Error logged to console
- No SMS sent to prospect
- **Fix**: Check Twilio credentials

**CRM webhook fails?**
- API still returns success (lead is saved)
- Error logged to console
- Lead NOT in CRM (only in JSONL)
- **Fix**: Check webhook URL, verify endpoint is accessible

**Validation fails?**
- API returns 400 error
- No lead saved
- No emails sent
- User sees error message in calculator UI

**Server crashes mid-request?**
- Lead might be saved to JSONL (append happens first)
- Emails might not send
- User sees error message
- **Recovery**: Check JSONL for lead ID, manually follow up

---

## Performance & Scalability

### Current Implementation
- **Throughput**: ~100-500 leads/day (JSONL file append is fast)
- **Email delivery**: 2-5 seconds per request
- **JSONL file size**: ~1KB per lead = 1MB per 1,000 leads

### Bottlenecks
- Email sending blocks API response (use queue for high volume)
- JSONL file grows unbounded (rotate monthly)
- No lead deduplication (same email can submit multiple times)

### Scaling Options (Future)

**Option 1: Database Migration**
Replace JSONL with PostgreSQL/MySQL:
```typescript
await db.leads.create({
  data: {
    id: leadId,
    name: inputs.name,
    email: inputs.email,
    // ... etc
  }
});
```

**Option 2: Background Jobs**
Move email/SMS to queue (BullMQ, Inngest):
```typescript
await emailQueue.add('send-confirmation', { to, name, estimate });
return NextResponse.json({ success: true }); // immediate response
```

**Option 3: Lead Deduplication**
Check if email exists before saving:
```typescript
const existingLead = await db.leads.findFirst({
  where: { email: inputs.email },
  orderBy: { timestamp: 'desc' }
});

if (existingLead && withinLast24Hours(existingLead.timestamp)) {
  return NextResponse.json({ error: 'Duplicate submission' }, { status: 429 });
}
```

---

## Security Considerations

### Data Protection
- ✅ Email/phone stored in JSONL (ensure proper file permissions)
- ✅ `.env.local` in .gitignore (secrets not committed)
- ✅ API validates all inputs before saving
- ✅ No SQL injection risk (JSONL is append-only file)
- ❌ No encryption at rest (consider encrypting JSONL for production)

### Rate Limiting
**Not implemented yet**. Add to `/app/api/lead/route.ts`:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 submissions per IP per 15 min
});
```

### CASL Compliance
- ✅ Consent checkbox required (not pre-checked)
- ✅ Unsubscribe link in all emails
- ✅ Sender identification in emails
- ✅ Privacy policy link in Step 7

---

## Next Steps

### Required Before Launch

1. **Configure SMTP**:
   - Sign up for SendGrid
   - Verify sender domain
   - Add credentials to `.env.local`
   - Test email delivery

2. **Set Booking URL**:
   - Update `NEXT_PUBLIC_BOOKING_URL` in `.env.local`
   - Ensure booking page exists

3. **Set Alert Email**:
   - Update `ALERT_EMAIL` to Stella's real email
   - Test alert notifications

4. **Test End-to-End**:
   - Submit test lead through calculator
   - Verify confirmation email received
   - Verify alert email received
   - Check `data/leads/leads.jsonl` for entry

### Optional Enhancements

5. **Add Twilio SMS**:
   - Sign up for Twilio
   - Buy phone number
   - Add credentials to `.env.local`

6. **Connect CRM**:
   - Set up Zapier/Make.com webhook
   - Add `CRM_WEBHOOK_URL` to `.env.local`
   - Test webhook delivery

7. **Add Rate Limiting**:
   - Install `express-rate-limit`
   - Configure in API route

8. **Add Lead Dashboard**:
   - Create `/admin/leads` page
   - Read JSONL file and display in table
   - Add export to CSV button

---

## File Manifest

```
app/
└── api/
    └── lead/
        └── route.ts               ✅ API handler (POST /api/lead)

lib/
└── notifications/
    ├── email.ts                   ✅ Confirmation + alert emails
    └── sms.ts                     ✅ Twilio SMS sending

data/
└── leads/
    └── leads.jsonl               (Auto-created on first submission)

.env.local.example                 ✅ Environment config template
.gitignore                         ✅ Git exclusions
```

---

**Phase 3 Status**: ✅ Complete
**API Routes**: 1/1 created
**Notification Systems**: 2/2 created (email + SMS)
**Configuration**: Complete
**Ready for Phase 4**: Yes (Styling + CSS)

