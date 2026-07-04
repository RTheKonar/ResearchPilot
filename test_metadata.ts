import { normalizeMetadataText, normalizePaperMetadata } from './src/utils/metadata';

interface TestSuite {
  name: string;
  input: string;
  expected: string;
  multiline?: boolean;
}

const testCases: TestSuite[] = [
  {
    name: "Apostrophe decoding (Grover's)",
    input: "Grover&#039;s Algorithm",
    expected: "Grover's Algorithm"
  },
  {
    name: "Ampersand decoding (Tom & Jerry)",
    input: "Tom &amp; Jerry",
    expected: "Tom & Jerry"
  },
  {
    name: "Quotes decoding (\"Transformer\")",
    input: "&quot;Transformer&quot;",
    expected: '"Transformer"'
  },
  {
    name: "Ampersand in abbreviation (AT&T)",
    input: "AT&amp;T",
    expected: "AT&T"
  },
  {
    name: "Unicode single quote / apostrophe (&#8217;)",
    input: "Attention is all you&#8217;re saying",
    expected: "Attention is all you’re saying"
  },
  {
    name: "Multiple consecutive spaces removal",
    input: "Deep  Learning   Systems",
    expected: "Deep Learning Systems"
  },
  {
    name: "Whitespace trimming",
    input: "  \t  Clean Me  \n  ",
    expected: "Clean Me"
  },
  {
    name: "Multiline paragraph preservation",
    input: "Line 1\n\n\nLine 2    with spaces",
    expected: "Line 1\n\nLine 2 with spaces",
    multiline: true
  }
];

let failed = 0;

console.log("🚀 Running Academic Metadata Normalization Test Suite...");
console.log("=========================================================");

for (const tc of testCases) {
  const result = normalizeMetadataText(tc.input, tc.multiline);
  if (result === tc.expected) {
    console.log(`✅ PASSED: ${tc.name}`);
  } else {
    console.log(`❌ FAILED: ${tc.name}`);
    console.log(`   Input:    [${tc.input}]`);
    console.log(`   Expected: [${tc.expected}]`);
    console.log(`   Got:      [${result}]`);
    failed++;
  }
}

// Test Paper Metadata wrapper
const rawPaper = {
  title: "A Survey of &quot;Large Language Models&quot;",
  authors: ["John&#039;s Doe", { name: "Jane &amp; Smith" }],
  abstract: "This abstract has  too   many spaces and &amp; entities.\n\n\nAnd multiple newlines.",
  venue: "IEEE Trans. on &lt;Intelligence&gt;",
  url: "https://arxiv.org/abs/1234.5678", // Should remain untouched
  id: "paper_12345" // Should remain untouched
};

const cleanedPaper = normalizePaperMetadata(rawPaper);

if (
  cleanedPaper.title === 'A Survey of "Large Language Models"' &&
  cleanedPaper.authors[0] === "John's Doe" &&
  cleanedPaper.authors[1] === "Jane & Smith" &&
  cleanedPaper.abstract === "This abstract has too many spaces and & entities.\n\nAnd multiple newlines." &&
  cleanedPaper.venue === "IEEE Trans. on <Intelligence>" &&
  cleanedPaper.url === "https://arxiv.org/abs/1234.5678" &&
  cleanedPaper.id === "paper_12345"
) {
  console.log("✅ PASSED: normalizePaperMetadata wrapper integrity");
} else {
  console.log("❌ FAILED: normalizePaperMetadata wrapper integrity");
  console.log(JSON.stringify(cleanedPaper, null, 2));
  failed++;
}

console.log("=========================================================");
if (failed === 0) {
  console.log("🎉 All tests passed successfully!");
  process.exit(0);
} else {
  console.log(`🚨 Test suite failed with ${failed} failure(s).`);
  process.exit(1);
}
