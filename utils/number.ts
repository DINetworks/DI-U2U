// Number formatting utilities

// Format small numbers with compact notation
export const formatSmallNumber = (num: string): string => {
  const value = parseFloat(num);
  if (value === 0) return "0";

  if (value < 0.0001) {
    // For very small numbers, show in compact format with zero count as subscript
    // Example: 0.000000160 becomes "0.0160" where "6" is subscript (meaning 6 zeros)
    let str = value.toString();

    // If in scientific notation, convert to decimal
    if (str.includes('e-')) {
      const fixedDecimal = value.toFixed(20).replace(/\.?0+$/, '');
      str = fixedDecimal;
    }

    const parts = str.split('.');
    if (parts.length === 2) {
      const decimalPart = parts[1];
      // Find first non-zero digit
      const firstNonZeroIndex = decimalPart.search(/[1-9]/);
      if (firstNonZeroIndex !== -1 && firstNonZeroIndex >= 4) {
        // Count the zeros and show format: 0.0<sub>count</sub>significant_digits
        const zeroCount = firstNonZeroIndex;
        const significantDigits = decimalPart.substring(firstNonZeroIndex, firstNonZeroIndex + 3);
        return `0.0<sub>${zeroCount}</sub>${significantDigits}`;
      }
    }
    // Fallback: show with 8 decimal places
    return value.toFixed(8).replace(/\.?0+$/, '');
  } else if (value < 1) {
    // Show up to 6 decimal places for small numbers
    return value.toFixed(6).replace(/\.?0+$/, '');
  } else {
    // Show up to 4 decimal places for normal numbers
    return value.toFixed(4).replace(/\.?0+$/, '');
  }
};