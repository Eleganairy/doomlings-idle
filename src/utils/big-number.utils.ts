/**.
 * How it works:
 * Numbers are stored as (mantissa × 10^exponent), where mantissa is between 1.0 and 9.99...
 * Example: 1,500,000 is stored as { mantissa: 1.5, exponent: 6 } because 1.5 × 10^6 = 1,500,000
 */

// ====================================================================================
// SUFFIXES FOR DISPLAY
// ====================================================================================

const NUMBER_SUFFIXES = [
  "", // 10^0  - 10^2   (1 - 999)
  "k", // 10^3  - 10^5   (Thousand)
  "M", // 10^6  - 10^8   (Million)
  "B", // 10^9  - 10^11  (Billion)
  "T", // 10^12 - 10^14  (Trillion)
  "Qa", // 10^15 - 10^17  (Quadrillion)
  "Qi", // 10^18 - 10^20  (Quintillion)
  "Sx", // 10^21 - 10^23  (Sextillion)
  "Sp", // 10^24 - 10^26  (Septillion)
  "Oc", // 10^27 - 10^29  (Octillion)
  "No", // 10^30 - 10^32  (Nonillion)
  "Dc", // 10^33 - 10^35  (Decillion)
  "Ud", // 10^36 - 10^38  (Undecillion)
  "Dd", // 10^39 - 10^41  (Duodecillion)
  "Td", // 10^42 - 10^44  (Tredecillion)
  "Qad", // 10^45 - 10^47  (Quattuordecillion)
  "Qid", // 10^48 - 10^50  (Quindecillion)
  "Sed", // 10^51 - 10^53  (Sexdecillion)
  "Spd", // 10^54 - 10^56  (Septendecillion)
  "Od", // 10^57 - 10^59  (Octodecillion)
  "Nd", // 10^60 - 10^62  (Novemdecillion)
  "Vg", // 10^63 - 10^65  (Vigintillion)
];

// ====================================================================================
// BIGNUMBER CLASS
// ====================================================================================

export class BigNumber {
  /**
   * The mantissa (coefficient) of the number, always between 1.0 and 9.999...
   * For zero, mantissa is 0.
   * For negative numbers, mantissa is negative.
   */
  private mantissa: number;

  /**
   * The exponent (power of 10).
   * Example: For 1500, mantissa=1.5, exponent=3 (because 1.5 × 10^3 = 1500)
   */
  private exponent: number;

  // ==================================================================================
  // CONSTRUCTOR
  // ==================================================================================

  /**
   * Create a BigNumber from a number, string, or another BigNumber.
   *
   * @example
   * new BigNumber(1000000)     // One million
   * new BigNumber("1e30")      // 1 followed by 30 zeros
   * new BigNumber(otherBigNum) // Copy of another BigNumber
   */
  constructor(value: number | string | BigNumber = 0) {
    if (value instanceof BigNumber) {
      // Copy from another BigNumber
      this.mantissa = value.mantissa;
      this.exponent = value.exponent;
    } else if (typeof value === "string") {
      // Parse from string (e.g., "1.5e30" or "1500000")
      const parsed = this.parseString(value);
      const normalized = this.normalize(parsed.mantissa, parsed.exponent);
      this.mantissa = normalized.mantissa;
      this.exponent = normalized.exponent;
    } else {
      // Convert from regular number
      const normalized = this.normalize(value, 0);
      this.mantissa = normalized.mantissa;
      this.exponent = normalized.exponent;
    }
  }

  // ==================================================================================
  // FACTORY METHODS - Alternative ways to create BigNumbers
  // ==================================================================================

  /**
   * Create a BigNumber directly from mantissa and exponent.
   * The values will be normalized automatically.
   *
   * @example
   * BigNumber.fromMantissaExponent(1.5, 6) // 1,500,000
   * BigNumber.fromMantissaExponent(15, 5)  // Also 1,500,000 (normalized to 1.5e6)
   */
  static fromMantissaExponent(mantissa: number, exponent: number): BigNumber {
    const bigNumber = new BigNumber();
    const normalized = bigNumber.normalize(mantissa, exponent);
    bigNumber.mantissa = normalized.mantissa;
    bigNumber.exponent = normalized.exponent;
    return bigNumber;
  }

  /**
   * Create a copy of this BigNumber.
   * Useful since BigNumbers are immutable - operations return new instances.
   */
  clone(): BigNumber {
    return new BigNumber(this);
  }

  // ==================================================================================
  // ARITHMETIC OPERATIONS
  // All operations return a NEW BigNumber - the original is never modified.
  // ==================================================================================

  /**
   * Add another value to this BigNumber.
   * Returns a new BigNumber with the result.
   *
   * @example
   * new BigNumber(1000).add(500)           // 1500
   * new BigNumber(1000000).add(new BigNumber(500000)) // 1,500,000
   */
  add(other: BigNumber | number): BigNumber {
    const otherBigNumber =
      other instanceof BigNumber ? other : new BigNumber(other);

    // Handle zero cases - adding zero returns the other number
    if (this.mantissa === 0) {
      return otherBigNumber.clone();
    }
    if (otherBigNumber.mantissa === 0) {
      return this.clone();
    }

    // Calculate the difference in exponents
    const exponentDifference = this.exponent - otherBigNumber.exponent;

    // If the exponents differ by more than 10, the smaller number is so small that it does not matter
    if (exponentDifference > 10 || exponentDifference < -10) {
      return this.clone();
    }

    // Align the numbers to the same exponent and add the mantissas
    if (exponentDifference >= 0) {
      // This number has the larger exponent - scale the other number down
      const scaledOtherMantissa =
        otherBigNumber.mantissa * 10 ** -exponentDifference;
      const newMantissa = this.mantissa + scaledOtherMantissa;
      return BigNumber.fromMantissaExponent(newMantissa, this.exponent);
    } else {
      // Other number has the larger exponent - scale this number down
      const scaledThisMantissa = this.mantissa * 10 ** -exponentDifference;
      const newMantissa = scaledThisMantissa + otherBigNumber.mantissa;
      return BigNumber.fromMantissaExponent(
        newMantissa,
        otherBigNumber.exponent
      );
    }
  }

  /**
   * Subtract another value from this BigNumber.
   * Returns a new BigNumber with the result.
   *
   * @example
   * new BigNumber(1000).subtract(300)  // 700
   * new BigNumber(100).subtract(150)   // -50
   */
  subtract(other: BigNumber | number): BigNumber {
    const otherBigNumber =
      other instanceof BigNumber ? other : new BigNumber(other);

    // Subtracting is the same as adding the negation
    const negatedOther = BigNumber.fromMantissaExponent(
      -otherBigNumber.mantissa,
      otherBigNumber.exponent
    );

    return this.add(negatedOther);
  }

  /**
   * Multiply this BigNumber by another value.
   * Returns a new BigNumber with the result.
   *
   * @example
   * new BigNumber(1000).multiply(3)    // 3000
   * new BigNumber(1000).multiply(0.5)  // 500
   */
  multiply(other: BigNumber | number): BigNumber {
    const otherBigNumber =
      other instanceof BigNumber ? other : new BigNumber(other);

    // Multiply mantissas, add exponents
    // (a × 10^x) × (b × 10^y) = (a × b) × 10^(x + y)
    const newMantissa = this.mantissa * otherBigNumber.mantissa;
    const newExponent = this.exponent + otherBigNumber.exponent;

    return BigNumber.fromMantissaExponent(newMantissa, newExponent);
  }

  /**
   * Divide this BigNumber by another value.
   * Returns a new BigNumber with the result.
   * Division by zero returns BigNumber(0) with a console warning.
   *
   * @example
   * new BigNumber(1000).divide(4)  // 250
   * new BigNumber(1000).divide(3)  // 333.33...
   */
  divide(other: BigNumber | number): BigNumber {
    const otherBigNumber =
      other instanceof BigNumber ? other : new BigNumber(other);

    // Handle division by zero
    if (otherBigNumber.mantissa === 0) {
      console.warn("BigNumber: Division by zero, returning 0");
      return new BigNumber(0);
    }

    // Divide mantissas, subtract exponents
    // (a × 10^x) ÷ (b × 10^y) = (a ÷ b) × 10^(x - y)
    const newMantissa = this.mantissa / otherBigNumber.mantissa;
    const newExponent = this.exponent - otherBigNumber.exponent;

    return BigNumber.fromMantissaExponent(newMantissa, newExponent);
  }

  /**
   * Raise this BigNumber to a power.
   * Returns a new BigNumber with the result.
   *
   * @example
   * new BigNumber(10).power(3)   // 1000
   * new BigNumber(100).power(0.5) // 10 (square root)
   */
  power(exponent: number): BigNumber {
    if (exponent === 0) {
      return new BigNumber(1);
    }
    if (exponent === 1) {
      return this.clone();
    }
    if (this.mantissa === 0) {
      return new BigNumber(0);
    }

    // (m × 10^e)^p = m^p × 10^(e × p)
    const newMantissa = Math.pow(this.mantissa, exponent);
    const newExponent = this.exponent * exponent;

    return BigNumber.fromMantissaExponent(newMantissa, newExponent);
  }

  /**
   * Get the absolute value of this BigNumber.
   * Returns a new BigNumber that is always positive.
   */
  absoluteValue(): BigNumber {
    return BigNumber.fromMantissaExponent(
      Math.abs(this.mantissa),
      this.exponent
    );
  }

  /**
   * Get the negation of this BigNumber.
   * Returns a new BigNumber with the opposite sign.
   */
  negate(): BigNumber {
    return BigNumber.fromMantissaExponent(-this.mantissa, this.exponent);
  }

  // ==================================================================================
  // COMPARISON OPERATIONS
  // ==================================================================================

  /**
   * Compare this BigNumber to another value.
   *
   * @returns -1 if this < other, 0 if equal, 1 if this > other
   */
  compare(other: BigNumber | number): -1 | 0 | 1 {
    const otherBigNumber =
      other instanceof BigNumber ? other : new BigNumber(other);

    // Handle zero cases
    if (this.mantissa === 0 && otherBigNumber.mantissa === 0) {
      return 0;
    }
    if (this.mantissa === 0) {
      return otherBigNumber.mantissa > 0 ? -1 : 1;
    }
    if (otherBigNumber.mantissa === 0) {
      return this.mantissa > 0 ? 1 : -1;
    }

    // Handle different signs
    if (this.mantissa > 0 && otherBigNumber.mantissa < 0) {
      return 1;
    }
    if (this.mantissa < 0 && otherBigNumber.mantissa > 0) {
      return -1;
    }

    // Same sign - compare by exponent first (most significant)
    const sign = this.mantissa > 0 ? 1 : -1;

    if (this.exponent > otherBigNumber.exponent) {
      return sign as 1 | -1;
    }
    if (this.exponent < otherBigNumber.exponent) {
      return -sign as 1 | -1;
    }

    // Same exponent - compare mantissas
    if (this.mantissa > otherBigNumber.mantissa) {
      return 1;
    }
    if (this.mantissa < otherBigNumber.mantissa) {
      return -1;
    }

    return 0;
  }

  /** Returns true if this BigNumber is less than the other value */
  lessThan(other: BigNumber | number): boolean {
    return this.compare(other) < 0;
  }

  /** Returns true if this BigNumber is less than or equal to the other value */
  lessThanOrEqual(other: BigNumber | number): boolean {
    return this.compare(other) <= 0;
  }

  /** Returns true if this BigNumber is greater than the other value */
  greaterThan(other: BigNumber | number): boolean {
    return this.compare(other) > 0;
  }

  /** Returns true if this BigNumber is greater than or equal to the other value */
  greaterThanOrEqual(other: BigNumber | number): boolean {
    return this.compare(other) >= 0;
  }

  /** Returns true if this BigNumber equals the other value */
  equals(other: BigNumber | number): boolean {
    return this.compare(other) === 0;
  }

  /** Returns true if this BigNumber is exactly zero */
  isZero(): boolean {
    return this.mantissa === 0;
  }

  /** Returns true if this BigNumber is positive (greater than zero) */
  isPositive(): boolean {
    return this.mantissa > 0;
  }

  /** Returns true if this BigNumber is negative (less than zero) */
  isNegative(): boolean {
    return this.mantissa < 0;
  }

  // ==================================================================================
  // STATIC HELPER METHODS
  // ==================================================================================

  /** Returns the larger of two BigNumbers */
  static max(a: BigNumber, b: BigNumber): BigNumber {
    return a.greaterThanOrEqual(b) ? a.clone() : b.clone();
  }

  /** Returns the smaller of two BigNumbers */
  static min(a: BigNumber, b: BigNumber): BigNumber {
    return a.lessThanOrEqual(b) ? a.clone() : b.clone();
  }

  // ==================================================================================
  // CONVERSION METHODS
  // ==================================================================================

  /**
   * Convert to a regular JavaScript number.
   * WARNING: May lose precision or return Infinity for very large numbers.
   * Use this only when you need to interface with code that requires regular numbers.
   */
  toNumber(): number {
    if (this.exponent > 308) {
      return this.mantissa > 0 ? Infinity : -Infinity;
    }
    if (this.exponent < -324) {
      return 0;
    }
    return this.mantissa * Math.pow(10, this.exponent);
  }

  /** Get the mantissa value (for debugging or special calculations) */
  getMantissa(): number {
    return this.mantissa;
  }

  /** Get the exponent value (for debugging or special calculations) */
  getExponent(): number {
    return this.exponent;
  }

  /**
   * Convert to a JSON-serializable object for saving to localStorage or a database.
   *
   * @example
   * const saveData = { health: player.health.toJSON() };
   * localStorage.setItem('save', JSON.stringify(saveData));
   */
  toJSON(): { mantissa: number; exponent: number } {
    return {
      mantissa: this.mantissa,
      exponent: this.exponent,
    };
  }

  /**
   * Create a BigNumber from a JSON object (for loading saved data).
   *
   * @example
   * const loaded = JSON.parse(localStorage.getItem('save'));
   * const health = BigNumber.fromJSON(loaded.health);
   */
  static fromJSON(json: { mantissa: number; exponent: number }): BigNumber {
    return BigNumber.fromMantissaExponent(json.mantissa, json.exponent);
  }

  // ==================================================================================
  // FORMATTING METHODS
  // ==================================================================================

  /**
   * Format the number for display in the game.
   * Always shows 3 significant digits with appropriate suffix.
   *
   * @example
   * new BigNumber(1).format()           // "1.00"
   * new BigNumber(10).format()          // "10.0"
   * new BigNumber(100).format()         // "100"
   * new BigNumber(1000).format()        // "1000"
   * new BigNumber(10000).format()       // "10.0k"
   * new BigNumber(1500000).format()     // "1.50M"
   * new BigNumber("1e30").format()      // "1.00No"
   */
  format(): string {
    if (this.mantissa === 0) {
      return "0";
    }

    const isNegative = this.mantissa < 0;
    const absoluteMantissa = Math.abs(this.mantissa);

    // Determine which suffix to use (every 3 exponents = 1 suffix)
    const suffixIndex = Math.min(
      Math.floor(this.exponent / 3),
      NUMBER_SUFFIXES.length - 1
    );
    const suffix = NUMBER_SUFFIXES[Math.max(0, suffixIndex)];

    // If exponent is beyond our suffix table, fall back to scientific notation
    if (this.exponent >= NUMBER_SUFFIXES.length * 3) {
      const scientificNotation =
        absoluteMantissa.toFixed(2) + "e" + this.exponent;
      return (isNegative ? "-" : "") + scientificNotation;
    }

    // Calculate the display value by adjusting for the suffix's exponent
    const suffixExponent = suffixIndex * 3;
    const exponentOffset = this.exponent - suffixExponent;
    const displayValue = absoluteMantissa * Math.pow(10, exponentOffset);

    // Format with appropriate decimal places to show 3 significant digits
    let formattedValue: string;

    if (displayValue < 10) {
      // 1.00 - 9.99 → 2 decimal places
      formattedValue = displayValue.toFixed(2);
    } else if (displayValue < 100) {
      // 10.0 - 99.9 → 1 decimal place
      formattedValue = displayValue.toFixed(1);
    } else {
      // 100 - 999 → 0 decimal places
      formattedValue = Math.floor(displayValue).toString();
    }

    return (isNegative ? "-" : "") + formattedValue + suffix;
  }

  /**
   * Format with a sign prefix (+ or -).
   * Useful for showing stat changes or bonuses.
   *
   * @example
   * new BigNumber(50).formatWithSign()   // "+50.0"
   * new BigNumber(-10).formatWithSign()  // "-10.0"
   */
  formatWithSign(): string {
    const prefix = this.mantissa >= 0 ? "+" : "";
    return prefix + this.format();
  }

  /**
   * Returns the formatted string representation of this BigNumber.
   * This is called automatically when you use the BigNumber in a string context.
   */
  toString(): string {
    return this.format();
  }

  // ==================================================================================
  // INTERNAL HELPER METHODS
  // ==================================================================================

  /**
   * Normalize mantissa to be between 1.0 and 10.0 (or 0 for zero values).
   * This ensures consistent representation of numbers.
   *
   * @example
   * normalize(150, 0)   → { mantissa: 1.5, exponent: 2 }
   * normalize(0.015, 0) → { mantissa: 1.5, exponent: -2 }
   */
  private normalize(
    mantissa: number,
    exponent: number
  ): { mantissa: number; exponent: number } {
    // Handle zero and invalid values
    if (mantissa === 0 || !isFinite(mantissa)) {
      return { mantissa: 0, exponent: 0 };
    }

    // Preserve the sign and work with absolute value
    const sign = mantissa < 0 ? -1 : 1;
    let absoluteMantissa = Math.abs(mantissa);
    let adjustedExponent = exponent;

    // Scale mantissa down if it's >= 10
    while (absoluteMantissa >= 10) {
      absoluteMantissa /= 10;
      adjustedExponent++;
    }

    // Scale mantissa up if it's < 1
    while (absoluteMantissa < 1 && absoluteMantissa > 0) {
      absoluteMantissa *= 10;
      adjustedExponent--;
    }

    return {
      mantissa: sign * absoluteMantissa,
      exponent: adjustedExponent,
    };
  }

  /**
   * Parse a string representation of a number.
   * Handles both scientific notation ("1.5e30") and regular numbers ("1500000").
   */
  private parseString(str: string): { mantissa: number; exponent: number } {
    const cleanedString = str.toLowerCase().replace(/,/g, "").trim();

    // Check for scientific notation (e.g., "1.5e30")
    if (cleanedString.includes("e")) {
      const [mantissaPart, exponentPart] = cleanedString.split("e");
      return {
        mantissa: parseFloat(mantissaPart),
        exponent: parseInt(exponentPart, 10),
      };
    }

    // Regular number - parse and let normalize handle it
    return {
      mantissa: parseFloat(cleanedString),
      exponent: 0,
    };
  }
}

// ====================================================================================
// CONVENIENCE FUNCTIONS
// ====================================================================================

/**
 * Shorthand function to create a BigNumber.
 * This is the easiest way to create BigNumbers in your code.
 *
 * @example
 * bn(1000000)   // One million
 * bn("1e30")    // 1 followed by 30 zeros
 * bn(existing)  // Copy of another BigNumber
 */
export function bn(value: number | string | BigNumber): BigNumber {
  return new BigNumber(value);
}

/**
 * Format any number or BigNumber for display.
 * Works with both regular numbers and BigNumber instances.
 *
 * @example
 * formatBigNumber(1500000)              // "1.50M"
 * formatBigNumber(new BigNumber(1e12))  // "1.00T"
 */
export function formatBigNumber(value: BigNumber | number): string {
  if (value instanceof BigNumber) {
    return value.format();
  }
  return new BigNumber(value).format();
}
