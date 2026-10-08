export function getDimensions(values) {
  if (!values) return null;
  for (const value of Object.values(values)) {
    if (typeof value === 'string') {
      const match = value.match(/^(\d+)x(\d+)$/);
      if (match) {
        return {
          width: parseInt(match[1], 10),
          height: parseInt(match[2], 10),
        };
      }
    }
  }
  return null;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function getRatioLabel(width, height) {
  if (!width || !height) return "";
  const common = gcd(width, height);
  return `${width / common}:${height / common}`;
}
