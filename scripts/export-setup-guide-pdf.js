/**
 * PDF Export Script for Dashboard Setup Guide
 *
 * This script uses Puppeteer to convert the Markdown guide to PDF
 * Run: node scripts/export-setup-guide-pdf.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateSetupGuidePDF() {
  console.log('🚀 Starting Dashboard Setup Guide PDF generation...');

  try {
    // Read the markdown content
    const guidePath = path.join(__dirname, '../outputs/dashboard/QUICK-SETUP-GUIDE.md');
    const markdownContent = fs.readFileSync(guidePath, 'utf8');

    // Convert markdown to HTML (simple conversion)
    const htmlContent = convertMarkdownToHTML(markdownContent);

    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Add custom styling for PDF
    await page.addStyleTag({
      content: `
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        h1 {
          color: #293919;
          border-bottom: 3px solid #293919;
          padding-bottom: 0.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        h2 {
          color: #3d5226;
          border-bottom: 2px solid #3d5226;
          padding-bottom: 0.3rem;
          margin-top: 1.5rem;
          margin-bottom: 0.8rem;
        }

        h3 {
          color: #293919;
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
        }

        code {
          background-color: #f4f4f4;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
        }

        pre {
          background-color: #f8f8f8;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        pre code {
          background: none;
          padding: 0;
        }

        blockquote {
          border-left: 4px solid #293919;
          margin: 1rem 0;
          padding-left: 1rem;
          color: #666;
          font-style: italic;
        }

        ul, ol {
          margin: 0.5rem 0;
          padding-left: 2rem;
        }

        li {
          margin: 0.3rem 0;
        }

        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 0.5rem;
          text-align: left;
        }

        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }

        .emoji {
          font-size: 1.2em;
        }

        .highlight {
          background-color: #fff3cd;
          padding: 0.5rem;
          border-radius: 3px;
          border-left: 4px solid #f59e0b;
        }

        @page {
          margin: 2cm;
          size: A4;
        }

        @media print {
          body {
            padding: 1rem;
          }
          
          h1 {
            page-break-before: always;
          }
          
          h1:first-child {
            page-break-before: avoid;
          }
        }
      `
    });

    // Generate PDF
    const outputPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads', 'Stella-Dashboard-Setup-Guide.pdf');

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">Stella\'s Ink Chamber Dashboard - Setup Guide</div>',
      footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    });

    console.log(`✅ PDF generated successfully: ${outputPath}`);

    await browser.close();
    return outputPath;

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
}

function convertMarkdownToHTML(markdown) {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    
    // Wrap in paragraphs
    .replace(/^(?!<[h1-6]|<li|<pre|<code)(.*)$/gim, '<p>$1</p>')
    
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p><br><\/p>/g, '')
    
    // Wrap lists
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    
    // Clean up duplicate list wrappers
    .replace(/<ul><ul>/g, '<ul>')
    .replace(/<\/ul><\/ul>/g, '</ul>');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Stella's Ink Chamber Dashboard - Setup Guide</title>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;
}

// Run if executed directly
if (require.main === module) {
  generateSetupGuidePDF()
    .then(path => {
      console.log(`\n🎉 Done! PDF saved to Downloads: ${path}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Failed to generate PDF:', error);
      process.exit(1);
    });
}

module.exports = { generateSetupGuidePDF };
