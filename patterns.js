// Pattern 1: Three consecutive same colors, bet on the other color
function applyPattern1(results) {
  if (results.length < 3) return null;

  const [r1, r2, r3] = results.slice(-3);

  // Prevent the pattern from being applied if all three results are 'tie'
  if (r1 === 'tie' && r2 === 'tie' && r3 === 'tie') {
    return null;  // Do not apply the pattern if all three results are ties
  }

  // If the last three results are the same and not ties, bet on the opposite color
  if (r1 === r2 && r2 === r3) {
    return r1 === 'blue' ? 'red' : 'blue';  // Bet on the opposite color
  }

  return null;
}

// Pattern 2: Alternating results, bet on the last result
function applyPattern2(results) {
  // Filter out results after a tie occurs, restarting the sequence from there
  let filteredResults = [];

  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i] === 'tie') {
      break;  // Stop when a tie is encountered and start a new sequence
    }
    filteredResults.unshift(results[i]);  // Add results to the filtered sequence
  }

  // Ensure we have at least 3 results after filtering
  if (filteredResults.length < 3) return null;

  const [r1, r2, r3] = filteredResults.slice(-3);  // Get the last 3 valid results

  // Check if the first and third results are the same, and the second is different
  if (r1 !== r2 && r2 !== r3 && r1 === r3) {
    return r3;  // Bet on the last result
  }

  return null;
}

module.exports = {
  applyPattern1,
  applyPattern2,
};
