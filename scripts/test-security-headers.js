/**
 * Copyright (c) 2024 Reflect & Implement
 *
 * Security Headers Test Script
 * Tests security headers implementation for A+ rating
 */

import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🛡️  Reflect & Implement - Security Headers Test");
console.log("===============================================\n");

// Security headers to test
const REQUIRED_HEADERS = {
  "Content-Security-Policy": "CSP",
  "X-Frame-Options": "X-Frame-Options",
  "X-Content-Type-Options": "X-Content-Type-Options",
  "Referrer-Policy": "Referrer-Policy",
  "Permissions-Policy": "Permissions-Policy",
  "Strict-Transport-Security": "HSTS",
  "X-XSS-Protection": "X-XSS-Protection",
  "X-Download-Options": "X-Download-Options",
  "X-Permitted-Cross-Domain-Policies": "X-Permitted-Cross-Domain-Policies",
  "Cross-Origin-Embedder-Policy": "COEP",
  "Cross-Origin-Opener-Policy": "COOP",
  "Cross-Origin-Resource-Policy": "CORP",
};

// Test URLs (replace with your actual URLs)
const TEST_URLS = [
  "http://localhost:5173", // Development
  "https://reflectandimplement.com", // Production (when available)
];

function testHeaders(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    client
      .get(url, { timeout: 10000 }, (res) => {
        const headers = res.headers;
        const results = {
          url,
          headers: {},
          score: 0,
          total: Object.keys(REQUIRED_HEADERS).length,
        };

        console.log(`\n🔍 Testing: ${url}`);
        console.log("─".repeat(50));

        Object.entries(REQUIRED_HEADERS).forEach(([header, name]) => {
          const value = headers[header];
          const hasHeader = !!value;

          results.headers[header] = {
            present: hasHeader,
            value: value || "MISSING",
            score: hasHeader ? 1 : 0,
          };

          const status = hasHeader ? "✅" : "❌";
          console.log(`${status} ${name}: ${value || "MISSING"}`);

          if (hasHeader) results.score++;
        });

        results.percentage = Math.round((results.score / results.total) * 100);
        results.grade = getGrade(results.percentage);

        console.log(
          `\n📊 Score: ${results.score}/${results.total} (${results.percentage}%)`
        );
        console.log(`🏆 Grade: ${results.grade}`);

        resolve(results);
      })
      .on("error", (error) => {
        console.log(`❌ Error testing ${url}: ${error.message}`);
        reject(error);
      });
  });
}

function getGrade(percentage) {
  if (percentage >= 95) return "A+";
  if (percentage >= 90) return "A";
  if (percentage >= 85) return "A-";
  if (percentage >= 80) return "B+";
  if (percentage >= 75) return "B";
  if (percentage >= 70) return "B-";
  if (percentage >= 65) return "C+";
  if (percentage >= 60) return "C";
  if (percentage >= 55) return "C-";
  if (percentage >= 50) return "D+";
  if (percentage >= 45) return "D";
  if (percentage >= 40) return "D-";
  return "F";
}

function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.length,
      averageScore: Math.round(
        results.reduce((sum, r) => sum + r.percentage, 0) / results.length
      ),
      bestGrade: results.reduce(
        (best, r) => (r.percentage > best.percentage ? r : best),
        results[0]
      ),
    },
    results,
  };

  const reportPath = path.join(__dirname, "../security-headers-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📄 Report saved to: ${reportPath}`);
  return report;
}

function checkFiles() {
  console.log("\n📁 Checking security files...");

  const files = [
    "public/_headers",
    "vite.config.ts",
    "src/utils/security.ts",
    "SECURITY.md",
  ];

  files.forEach((file) => {
    const exists = fs.existsSync(path.join(__dirname, "..", file));
    const status = exists ? "✅" : "❌";
    console.log(`${status} ${file}`);
  });
}

async function runTests() {
  try {
    // Check security files
    checkFiles();

    // Test headers for each URL
    const results = [];
    for (const url of TEST_URLS) {
      try {
        const result = await testHeaders(url);
        results.push(result);
      } catch (error) {
        console.log(`⚠️  Skipping ${url} - not accessible`);
      }
    }

    if (results.length === 0) {
      console.log("\n⚠️  No URLs were accessible for testing");
      console.log("💡 Start your development server with: npm run dev");
      return;
    }

    // Generate report
    const report = generateReport(results);

    // Summary
    console.log("\n🎯 Security Headers Summary");
    console.log("─".repeat(50));
    console.log(`📊 Average Score: ${report.summary.averageScore}%`);
    console.log(
      `🏆 Best Grade: ${report.summary.bestGrade.grade} (${report.summary.bestGrade.percentage}%)`
    );

    if (report.summary.averageScore >= 95) {
      console.log("🎉 A+ Security Rating Achieved!");
    } else {
      console.log("📈 Areas for improvement identified");
    }

    console.log("\n📋 Recommendations:");
    if (report.summary.averageScore < 95) {
      console.log("• Ensure all security headers are properly configured");
      console.log("• Check your hosting provider supports custom headers");
      console.log("• Verify HTTPS is enabled in production");
      console.log("• Review SECURITY.md for implementation details");
    } else {
      console.log("• Excellent security implementation!");
      console.log("• Continue monitoring for new vulnerabilities");
      console.log("• Keep dependencies updated");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run tests
runTests();
