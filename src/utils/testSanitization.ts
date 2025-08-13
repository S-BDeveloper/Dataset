import {
  sanitizeInput,
  sanitizeHtmlContent,
  isValidIslamicText,
} from "./sanitize";

/**
 * Comprehensive test suite for sanitization functions
 * This ensures all protocol checks are working correctly
 */
export function runSanitizationTests(): {
  passed: number;
  failed: number;
  results: Array<{
    test: string;
    passed: boolean;
    input: string;
    output: string;
    expected: string;
  }>;
} {
  const results: Array<{
    test: string;
    passed: boolean;
    input: string;
    output: string;
    expected: string;
  }> = [];
  let passed = 0;
  let failed = 0;

  // Test 1: JavaScript protocol
  const jsInput = 'javascript:alert("XSS")';
  const jsOutput = sanitizeInput(jsInput);
  const jsExpected = 'alert("XSS")';
  const jsPassed = jsOutput === jsExpected;
  results.push({
    test: "JavaScript Protocol Removal",
    passed: jsPassed,
    input: jsInput,
    output: jsOutput,
    expected: jsExpected,
  });
  jsPassed ? passed++ : failed++;

  // Test 2: VBScript protocol
  const vbInput = 'vbscript:msgbox("XSS")';
  const vbOutput = sanitizeInput(vbInput);
  const vbExpected = 'msgbox("XSS")';
  const vbPassed = vbOutput === vbExpected;
  results.push({
    test: "VBScript Protocol Removal",
    passed: vbPassed,
    input: vbInput,
    output: vbOutput,
    expected: vbExpected,
  });
  vbPassed ? passed++ : failed++;

  // Test 3: Data protocol
  const dataInput = 'data:text/html,<script>alert("XSS")</script>';
  const dataOutput = sanitizeInput(dataInput);
  const dataExpected = 'text/html,<script>alert("XSS")</script>';
  const dataPassed = dataOutput === dataExpected;
  results.push({
    test: "Data Protocol Removal",
    passed: dataPassed,
    input: dataInput,
    output: dataOutput,
    expected: dataExpected,
  });
  dataPassed ? passed++ : failed++;

  // Test 4: Mixed protocols
  const mixedInput =
    'javascript:alert("XSS") vbscript:msgbox("XSS") data:text/html,<script>alert("XSS")</script>';
  const mixedOutput = sanitizeInput(mixedInput);
  const mixedExpected =
    'alert("XSS") msgbox("XSS") text/html,<script>alert("XSS")</script>';
  const mixedPassed = mixedOutput === mixedExpected;
  results.push({
    test: "Mixed Protocol Removal",
    passed: mixedPassed,
    input: mixedInput,
    output: mixedOutput,
    expected: mixedExpected,
  });
  mixedPassed ? passed++ : failed++;

  // Test 5: HTML Content sanitization with protocols
  const htmlInput =
    '<p>Hello</p><script>alert("XSS")</script>javascript:alert("XSS")';
  const htmlOutput = sanitizeHtmlContent(htmlInput);
  const htmlExpected = '<p>Hello</p>alert("XSS")';
  const htmlPassed = htmlOutput === htmlExpected;
  results.push({
    test: "HTML Content Protocol Removal",
    passed: htmlPassed,
    input: htmlInput,
    output: htmlOutput,
    expected: htmlExpected,
  });
  htmlPassed ? passed++ : failed++;

  // Test 9: Script tags with whitespace in closing tags
  const whitespaceInput = '<script>alert("XSS")</script ><p>Hello</p>';
  const whitespaceOutput = sanitizeInput(whitespaceInput);
  const whitespaceExpected = "<p>Hello</p>";
  const whitespacePassed = whitespaceOutput === whitespaceExpected;
  results.push({
    test: "Script Tags with Whitespace in Closing Tags",
    passed: whitespacePassed,
    input: whitespaceInput,
    output: whitespaceOutput,
    expected: whitespaceExpected,
  });
  whitespacePassed ? passed++ : failed++;

  // Test 10: Multiple script tags with various whitespace patterns
  const multipleWhitespaceInput =
    '<script>alert("XSS1")</script><script>alert("XSS2")</script ><script>alert("XSS3")</script  >';
  const multipleWhitespaceOutput = sanitizeInput(multipleWhitespaceInput);
  const multipleWhitespaceExpected = "";
  const multipleWhitespacePassed =
    multipleWhitespaceOutput === multipleWhitespaceExpected;
  results.push({
    test: "Multiple Script Tags with Various Whitespace Patterns",
    passed: multipleWhitespacePassed,
    input: multipleWhitespaceInput,
    output: multipleWhitespaceOutput,
    expected: multipleWhitespaceExpected,
  });
  multipleWhitespacePassed ? passed++ : failed++;

  // Test 6: Islamic text validation
  const islamicInput = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
  const islamicOutput = isValidIslamicText(islamicInput);
  const islamicExpected = true;
  const islamicPassed = islamicOutput === islamicExpected;
  results.push({
    test: "Islamic Text Validation",
    passed: islamicPassed,
    input: islamicInput,
    output: islamicOutput.toString(),
    expected: islamicExpected.toString(),
  });
  islamicPassed ? passed++ : failed++;

  // Test 7: Islamic text with dangerous protocols
  const islamicDangerousInput =
    'بِسْمِ اللَّهِ javascript:alert("XSS") الرَّحِيمِ';
  const islamicDangerousOutput = sanitizeInput(islamicDangerousInput);
  const islamicDangerousExpected = 'بِسْمِ اللَّهِ alert("XSS") الرَّحِيمِ';
  const islamicDangerousPassed =
    islamicDangerousOutput === islamicDangerousExpected;
  results.push({
    test: "Islamic Text with Protocol Removal",
    passed: islamicDangerousPassed,
    input: islamicDangerousInput,
    output: islamicDangerousOutput,
    expected: islamicDangerousExpected,
  });
  islamicDangerousPassed ? passed++ : failed++;

  // Test 8: Case insensitive protocol removal
  const caseInput =
    'JavaScript:alert("XSS") VBScript:msgbox("XSS") Data:text/html,<script>alert("XSS")</script>';
  const caseOutput = sanitizeInput(caseInput);
  const caseExpected =
    'alert("XSS") msgbox("XSS") text/html,<script>alert("XSS")</script>';
  const casePassed = caseOutput === caseExpected;
  results.push({
    test: "Case Insensitive Protocol Removal",
    passed: casePassed,
    input: caseInput,
    output: caseOutput,
    expected: caseExpected,
  });
  casePassed ? passed++ : failed++;

  return { passed, failed, results };
}

/**
 * Log test results to console
 */
export function logSanitizationTestResults(): void {
  const { passed, failed, results } = runSanitizationTests();

  console.log("🔒 Sanitization Test Results");
  console.log("============================");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  console.log("");

  results.forEach((result, index) => {
    const status = result.passed ? "✅" : "❌";
    console.log(`${status} Test ${index + 1}: ${result.test}`);
    if (!result.passed) {
      console.log(`   Input: "${result.input}"`);
      console.log(`   Output: "${result.output}"`);
      console.log(`   Expected: "${result.expected}"`);
    }
    console.log("");
  });

  if (failed === 0) {
    console.log(
      "🎉 All sanitization tests passed! Your app is protected against protocol-based XSS attacks."
    );
  } else {
    console.log(
      "⚠️ Some tests failed. Please review the sanitization functions."
    );
  }
}

// Run tests if this file is executed directly
if (typeof window !== "undefined") {
  // Browser environment
  window.runSanitizationTests = runSanitizationTests;
  window.logSanitizationTestResults = logSanitizationTestResults;
}
