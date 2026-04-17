export type Category = "length" | "temperature" | "weight" | "currency";

export interface UnitOption {
  label: string;
  value: string;
  symbol: string;
}

export const UNITS: Record<Category, UnitOption[]> = {
  length: [
    { label: "Meter", value: "m", symbol: "m" },
    { label: "Kilometer", value: "km", symbol: "km" },
    { label: "Centimeter", value: "cm", symbol: "cm" },
    { label: "Millimeter", value: "mm", symbol: "mm" },
    { label: "Mile", value: "mi", symbol: "mi" },
    { label: "Yard", value: "yd", symbol: "yd" },
    { label: "Foot", value: "ft", symbol: "ft" },
    { label: "Inch", value: "in", symbol: "in" },
  ],
  temperature: [
    { label: "Celsius", value: "c", symbol: "°C" },
    { label: "Fahrenheit", value: "f", symbol: "°F" },
    { label: "Kelvin", value: "k", symbol: "K" },
  ],
  weight: [
    { label: "Kilogram", value: "kg", symbol: "kg" },
    { label: "Gram", value: "g", symbol: "g" },
    { label: "Pound", value: "lb", symbol: "lb" },
    { label: "Ounce", value: "oz", symbol: "oz" },
    { label: "Metric Ton", value: "t", symbol: "t" },
  ],
  currency: [
    { label: "US Dollar", value: "USD", symbol: "$" },
    { label: "Euro", value: "EUR", symbol: "€" },
    { label: "British Pound", value: "GBP", symbol: "£" },
    { label: "Japanese Yen", value: "JPY", symbol: "¥" },
    { label: "Canadian Dollar", value: "CAD", symbol: "CA$" },
    { label: "Nigerian Naira", value: "NGN", symbol: "₦" },
    { label: "Indian Rupee", value: "INR", symbol: "₹" },
    { label: "Australian Dollar", value: "AUD", symbol: "A$" },
  ],
};
// Conversion to base unit (SI)
const TO_BASE: Record<string, number> = {
  // Length → meters
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
  // Weight → kilograms
  kg: 1,
  g: 0.001,
  lb: 0.453592,
  oz: 0.0283495,
  t: 1000,
  // Currency → USD (approximate static rates)
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  JPY: 0.0067,
  CAD: 0.74,
  NGN: 0.00065,
  INR: 0.012,
  AUD: 0.65,
};

export function convert(value: number, from: string, to: string, category: Category): number {
  if (from === to) return value;

  if (category === "temperature") {
    return convertTemperature(value, from, to);
  }

  const fromRate = TO_BASE[from];
  const toRate = TO_BASE[to];
  if (!fromRate || !toRate) return 0;

  return (value * fromRate) / toRate;
}

function convertTemperature(value: number, from: string, to: string): number {
  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case "c": celsius = value; break;
    case "f": celsius = (value - 32) * (5 / 9); break;
    case "k": celsius = value - 273.15; break;
    default: celsius = value;
  }

  // Convert from Celsius to target
  switch (to) {
    case "c": return celsius;
    case "f": return celsius * (9 / 5) + 32;
    case "k": return celsius + 273.15;
    default: return celsius;
  }
}

export function formatResult(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "—";
  if (Math.abs(value) >= 1e6 || (Math.abs(value) < 0.001 && value !== 0)) {
    return value.toExponential(4);
  }
  const str = value.toPrecision(8);
  const num = parseFloat(str);
  return num.toString();
}