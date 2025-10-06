/**
 * PDF Export Script for SMP Canada Guide
 *
 * This script uses Puppeteer to convert the HTML guide to PDF
 * Run: node pdf-export.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  console.log('🚀 Starting PDF generation...');

  try {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Load the guide HTML
    const guidePath = path.join(__dirname, 'guides/smp-canada/index.html');
    const guideURL = `file://${guidePath}`;

    console.log(`📄 Loading guide from: ${guideURL}`);
    await page.goto(guideURL, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Hide elements that shouldn't appear in PDF
    await page.addStyleTag({
      content: `
        .sticky-cta,
        .toc-mobile-toggle,
        .toc,
        .lead-magnet-banner,
        .page-sidebar {
          display: none !important;
        }

        body {
          padding: 2rem;
        }

        .page-layout {
          display: block;
        }

        .page-content {
          max-width: 100%;
        }

        @page {
          margin: 2cm;
        }
      `
    });

    // Generate PDF
    const outputPath = path.join(__dirname, 'public/downloads/smp-canada-guide.pdf');

    // Ensure downloads directory exists
    const downloadsDir = path.dirname(outputPath);
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    console.log(`✅ PDF generated successfully: ${outputPath}`);

    await browser.close();
    return outputPath;

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  generatePDF()
    .then(path => {
      console.log(`\n🎉 Done! PDF available at: ${path}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Failed to generate PDF:', error);
      process.exit(1);
    });
}

module.exports = { generatePDF };
