export function evaluateExpression(expression: string): string {
  try {
    // Clean the expression
    let expr = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/[^0-9+\-*/.()%]/g, "");

    if (!expr || expr === "") return "0";

    // Use Function constructor for safe eval
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${expr})`)();

    if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
      return "Error";
    }

    // Format the result
    if (Number.isInteger(result) || Math.abs(result) >= 1e10) {
      return result.toString();
    }
    return parseFloat(result.toPrecision(10)).toString();
  } catch {
    return "Error";
  }
}

export type CalcButton = {
  label: string;
  value: string;
  type: "number" | "operator" | "action" | "equals" | "special";
  wide?: boolean;
};

export const CALC_BUTTONS: CalcButton[][] = [
  [
    { label: "AC", value: "AC", type: "action" },
    { label: "+/-", value: "+/-", type: "action" },
    { label: "%", value: "%", type: "special" },
    { label: "÷", value: "÷", type: "operator" },
  ],
  [
    { label: "7", value: "7", type: "number" },
    { label: "8", value: "8", type: "number" },
    { label: "9", value: "9", type: "number" },
    { label: "×", value: "×", type: "operator" },
  ],
  [
    { label: "4", value: "4", type: "number" },
    { label: "5", value: "5", type: "number" },
    { label: "6", value: "6", type: "number" },
    { label: "−", value: "−", type: "operator" },
  ],
  [
    { label: "1", value: "1", type: "number" },
    { label: "2", value: "2", type: "number" },
    { label: "3", value: "3", type: "number" },
    { label: "+", value: "+", type: "operator" },
  ],
  [
    { label: "0", value: "0", type: "number", wide: true },
    { label: ".", value: ".", type: "number" },
    { label: "=", value: "=", type: "equals" },
  ],
];
