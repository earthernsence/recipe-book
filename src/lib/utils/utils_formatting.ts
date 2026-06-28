const PLURAL_HELPER = new Map([
  [/y$/u, "ies"],
  [/x$/u, "xes"],
  [/$/u, "s"]
]);

const pluralDatabase: Map<string, string> = new Map([
  ["person", "people"]
]);

function generatePlural(word: string): string {
  for (const [match, replaceWith] of PLURAL_HELPER.entries()) {
    const newWord = word.replace(match, replaceWith);
    if (word !== newWord) return newWord;
  }
  return word;
}

export function pluralise(word: string, amount: number, plural?: string): string {
  if (word === undefined || amount === undefined) throw "Arguments must be defined in function pluralise";

  if (amount === 1) return word;
  const existingPlural = plural ?? pluralDatabase.get(word);
  if (existingPlural) return existingPlural;

  const newWord = generatePlural(word);
  pluralDatabase.set(word, newWord);
  return newWord;
}

export function quantify(name: string, value: number | null): string {
  if (name === undefined || value === undefined) throw "Arguments must be defined in function quantify";
  if (value === null) throw "Null value passed into function quantify";

  const plural = pluralise(name, value);
  return `${value} ${plural}`;
}

const FRACTIONS_MAP = new Map([
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [1 / 2, "½"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"]
]);

export function formatAmount(value: number): string {
  const whole = Math.floor(value);
  const remainder = value - whole;

  if (Math.abs(remainder) < 0.01) return String(whole);

  for (const [fraction, symbol] of FRACTIONS_MAP.entries()) {
    if (Math.abs(remainder - fraction) < 0.02) {
      return whole > 0 ? `${whole} ${symbol}` : symbol;
    }
  }

  return value.toFixed(2);
}
