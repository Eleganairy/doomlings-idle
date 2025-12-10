/**.
 * How it works:
 * Numbers are stored as (mantissa × 10^exponent), where mantissa is between 1.0 and 9.99...
 * Example: 1,500,000 is stored as { mantissa: 1.5, exponent: 6 } because 1.5 × 10^6 = 1,500,000
 */

/**
 * Full number table for reference:
 * The scientific notation column is used within this file for calculations and storage, where mantissa = 10 and exponent = ^x
 * The in game numbers are used for the UI
 * There are helper function to be able to also show the full namer with toNumber() and the full name with format(true = useFullName)
 *
 * | Full number       | Full name          | In game number | Scientific notation |
 * |-------------------|--------------------|----------------|---------------------|
 * | 1                 | One                | 1.00           | 10^0                |
 * | 10                | Ten                | 10.0           | 10^1                |
 * | 100               | Hundred            | 100            | 10^2                |
 * | 1,000             | Thousand           | 1000           | 10^3                |
 * | 10,000            | Ten thousand       | 10.0k          | 10^4                |
 * | 100,000           | Hundred thousand   | 100k           | 10^5                |
 * | 1,000,000         | Million            | 1.00M          | 10^6                |
 * | 10,000,000        | Ten million        | 10.0M          | 10^7                |
 * | 100,000,000       | Hundred million    | 100M           | 10^8                |
 * | 1,000,000,000     | Billion            | 1.00B          | 10^9                |
 * | 10,000,000,000    | Ten Billion        | 10.0B          | 10^10               |
 * | 100,000,000,000   | Hundred Billion    | 100B           | 10^11               |
 * | 1,000,000,000,000 | Trillion           | 1.00T          | 10^12               |
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

const NUMBER_FULL_NAMES = [
  "", // 10^0  - 10^2   (1 - 999)
  "thousand", // 10^3  - 10^5
  "million", // 10^6  - 10^8
  "billion", // 10^9  - 10^11
  "trillion", // 10^12 - 10^14
  "Quadrillion", // 10^15 - 10^17
  "Quintillion", // 10^18 - 10^20
  "Sextillion", // 10^21 - 10^23
  "Septillion", // 10^24 - 10^26
  "Octillion", // 10^27 - 10^29
  "Nonillion", // 10^30 - 10^32
  "Decillion", // 10^33 - 10^35
  "Undecillion", // 10^36 - 10^38
  "Duodecillion", // 10^39 - 10^41
  "Tredecillion", // 10^42 - 10^44
  "Quattuordecillion", // 10^45 - 10^47
  "Quindecillion", // 10^48 - 10^50
  "Sexdecillion", // 10^51 - 10^53
  "Septendecillion", // 10^54 - 10^56
  "Octodecillion", // 10^57 - 10^59
  "Novemdecillion", // 10^60 - 10^62
  "Vigintillion", // 10^63 - 10^65
];

// ====================================================================================
// BIGNUMBER CLASS
// ====================================================================================

// For more insight in the mantissa and exponent check the table at the top of the file
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
      const parsedNumber = this.parseString(value);
      const normalized = this.normalize(
        parsedNumber.mantissa,
        parsedNumber.exponent
      );
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
  // FACTORY METHODS - More ways to create BigNumber instances
  // ==================================================================================

  /**
   * Returns a BigNumber from a mantissa and exponent directly
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

  /** Returns a new instance of a BigNumber since BigNumbers can't be changed */
  clone(): BigNumber {
    return new BigNumber(this);
  }

  // ==================================================================================
  // ARITHMETIC OPERATIONS
  // ==================================================================================

  /**
   * Add another value to this BigNumber.
   * Returns a new BigNumber with the result.
   *
   * @example
   * new BigNumber(1000).add(500)           // 1500
   * new BigNumber(1000000).add(new BigNumber(500000)) // 1,500,000
   */
  add(addByNumber: BigNumber | number): BigNumber {
    const addByBigNumber = this.fromNumber(addByNumber);

    // Handle zero cases - adding zero returns the other number
    if (this.mantissa === 0) {
      return addByBigNumber.clone();
    }
    if (addByBigNumber.mantissa === 0) {
      return this.clone();
    }

    // Calculate the difference in exponents
    const exponentDifference = this.exponent - addByBigNumber.exponent;

    // If the exponents differ by more than 10, the smaller number is so small that it does not matter
    if (exponentDifference > 10 || exponentDifference < -10) {
      return this.clone();
    }

    // Align the numbers to the same exponent and add the mantissas
    if (exponentDifference >= 0) {
      // This number has the larger exponent - scale the other number down
      const scaledOtherMantissa =
        addByBigNumber.mantissa * 10 ** -exponentDifference;
      const newMantissa = this.mantissa + scaledOtherMantissa;
      return BigNumber.fromMantissaExponent(newMantissa, this.exponent);
    } else {
      // Other number has the larger exponent - scale this number down
      const scaledThisMantissa = this.mantissa * 10 ** -exponentDifference;
      const newMantissa = scaledThisMantissa + addByBigNumber.mantissa;
      return BigNumber.fromMantissaExponent(
        newMantissa,
        addByBigNumber.exponent
      );
    }
  }

  /**
   * Return a BigNumber subtracted by a number or BigNumber
   *
   * @param subtractByNumber Number can be a BigNumber or a regular JavaScript number
   *
   * @example
   * new BigNumber(1000).subtract(300)  // 700
   * new BigNumber(100).subtract(150)   // -50
   */
  subtract(subtractByNumber: BigNumber | number): BigNumber {
    const subtractByBigNumber = this.fromNumber(subtractByNumber);

    // Subtracting is the same as adding the negation
    const negatedOther = BigNumber.fromMantissaExponent(
      -subtractByBigNumber.mantissa,
      subtractByBigNumber.exponent
    );

    return this.add(negatedOther);
  }

  /**
   * Return a BigNumber multiplied by a number or BigNumber
   *
   * @param multiplyByNumber Number can be a BigNumber or a regular JavaScript number
   *
   * @example
   * new BigNumber(1000).multiply(3)    // 3000
   * new BigNumber(1000).multiply(0.5)  // 500
   */
  multiply(multiplyByNumber: BigNumber | number): BigNumber {
    const multiplyByBigNumber = this.fromNumber(multiplyByNumber);

    // Multiply mantissas, add exponents
    // (a × 10^x) × (b × 10^y) = (a × b) × 10^(x + y)
    const newMantissa = this.mantissa * multiplyByBigNumber.mantissa;
    const newExponent = this.exponent + multiplyByBigNumber.exponent;

    return BigNumber.fromMantissaExponent(newMantissa, newExponent);
  }

  /**
   * return a BigNumber divided by a number or BigNumber
   *
   * @param divideByNumber Number can be a BigNumber or a regular JavaScript number
   *
   * @example
   * new BigNumber(1000).divide(4)  // 250
   * new BigNumber(1000).divide(3)  // 333.33...
   * new BigNumber(1000).divide(new BigNumber(2)) // 500
   */
  divide(divideByNumber: BigNumber | number): BigNumber {
    const divideByBigNumber = this.fromNumber(divideByNumber);

    // Handle division by zero
    if (divideByBigNumber.mantissa === 0) {
      console.warn("BigNumber: Division by zero, returning 0");
      return new BigNumber(0);
    }

    // Divide mantissas, subtract exponents
    // (a × 10^x) ÷ (b × 10^y) = (a ÷ b) × 10^(x - y)
    let newMantissa = this.mantissa / divideByBigNumber.mantissa;
    const newExponent = this.exponent - divideByBigNumber.exponent;

    // Round the mantissa to a maximum of 2 decimal places
    newMantissa = Math.round(newMantissa * 100) / 100;

    return BigNumber.fromMantissaExponent(newMantissa, newExponent);
  }

  /**
   * Return a BigNumber raised to a power
   *
   * @param powerByNumber Exponent can only be a regular JavaScript number
   *
   * @example
   * new BigNumber(10).power(3)   // 1000
   * new BigNumber(100).power(0.5) // 10 (square root)
   */
  power(powerByNumber: number): BigNumber {
    if (powerByNumber === 0) {
      return new BigNumber(1);
    }
    if (powerByNumber === 1) {
      return this.clone();
    }
    if (this.mantissa === 0) {
      return new BigNumber(0);
    }

    // (m × 10^e)^p = m^p × 10^(e × p)
    const newMantissa = this.mantissa ** powerByNumber;
    const newExponent = this.exponent * powerByNumber;

    return BigNumber.fromMantissaExponent(newMantissa, newExponent);
  }

  /**
   * @returns A new BigNumber that is always positive (absolute value)
   *
   * @example
   * new BigNumber(-1500).absoluteValue()  // 1500
   * new BigNumber(2500).absoluteValue()   // 2500
   */
  absoluteValue(): BigNumber {
    return BigNumber.fromMantissaExponent(
      Math.abs(this.mantissa),
      this.exponent
    );
  }

  // ==================================================================================
  // COMPARISON OPERATIONS
  // ==================================================================================

  /**
   * Compare this BigNumber to another value.
   *
   * @returns -1 if this < other, 0 if equal, 1 if this > other
   *
   * @example
   * new BigNumber(1000).compare(500)           → 1
   * new BigNumber("1.5e20").compare(1.5e20)   → 0
   * new BigNumber(150000).compare(15000000)    → -1
   *
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
  // MIN/MAX METHODS
  // ==================================================================================

  // Above functions are for giving back boolean values that can be used for operations
  // Below static helper methods actually return the larger or smaller number which can be shown in the UI

  /** Returns the largest value of two BigNumbers */
  static max(a: BigNumber, b: BigNumber): BigNumber {
    return a.greaterThanOrEqual(b) ? a.clone() : b.clone();
  }

  /** Returns the smallest value of two BigNumbers */
  static min(a: BigNumber, b: BigNumber): BigNumber {
    return a.lessThanOrEqual(b) ? a.clone() : b.clone();
  }

  // ==================================================================================
  // CONVERT BigNumber TO OTHER TYPES
  // ==================================================================================

  /**
   *
   * Converts BigNumber back to normal JavaScript number, might be fun to show a really large number somewhere
   *
   * @returns !Javascript return infinity error for really large errors!
   *
   */
  toNumber(): number {
    // More than 100 zeros are not needed for the game and I don't support them
    if (this.exponent > 100) {
      return this.mantissa > 0 ? Infinity : -Infinity;
    }
    if (this.exponent < -100) {
      return 0;
    }
    return this.mantissa * 10 ** this.exponent;
  }

  /** Function to just get the mantissa, might need later for comparing or something */
  getMantissa(): number {
    return this.mantissa;
  }

  /** Function to just get the exponent, might need later for comparing or something */
  getExponent(): number {
    return this.exponent;
  }

  /**
   * Method for future to store the big numbers in the backend or local storage, idk yet
   *
   * @return An object with mantissa and exponent for JSON serialization.
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
   * Convert the saved data back into a BigNumber
   *
   * @param json The JSON object with mantissa and exponent.
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
   * Format the number for display in the game UI
   *
   * @param useFullname Whether to use full names (e.g., "million") instead of suffixes (e.g., "M")
   *
   * @example
   * new BigNumber(1).format()            // "1.00"
   * new BigNumber(10).format()           // "10.0"
   * new BigNumber(100).format()          // "100"
   * new BigNumber(1000).format()         // "1000"
   * new BigNumber(10000).format()        // "10.0k"
   * new BigNumber(4682318741).format()   // "4.68B"
   * new BigNumber("1e30").format()       // "1.00No"
   * new BigNumber("1e66").format()       // "1.00e66"  (beyond suffix table)
   * new BigNumber(-1500000).format()     // "-1.50M"
   * new BigNumber(1500000).format(true)  // "1.50 million"
   * new BigNumber("1e30").format(true)   // "1.00 nonillion"
   */
  format(useFullname?: false): string {
    if (this.mantissa === 0) {
      return "0";
    }

    const isNegative = this.mantissa < 0;
    const absoluteMantissa = Math.abs(this.mantissa);

    // Set to either shorthand suffix or full name, trillion or T
    const suffixIndex = Math.min(
      Math.floor(this.exponent / 3),
      NUMBER_FULL_NAMES.length - 1
    );
    const suffix = useFullname
      ? NUMBER_FULL_NAMES[Math.max(0, suffixIndex)]
      : NUMBER_SUFFIXES[Math.max(0, suffixIndex)];

    // If exponent is beyond our suffix table, fall back to scientific notation
    if (this.exponent >= NUMBER_SUFFIXES.length * 3) {
      const scientificNotation = `${absoluteMantissa.toFixed(2)}e${
        this.exponent
      }`;
      return (isNegative ? "-" : "") + scientificNotation;
    }

    // Calculate the display value by adjusting for the suffix's exponent
    const suffixExponent = suffixIndex * 3;
    const exponentOffset = this.exponent - suffixExponent;
    const displayValue = absoluteMantissa * 10 ** exponentOffset;

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
   * Format to a string with an Arithmetic sign prefix (+, -, x, /)
   *
   * @param operation The arithmetic operation: "add", "multiply", or "divide"
   *
   * @example
   * new BigNumber(50).formatWithArithmeticSign("add")   → "+50.0"
   * new BigNumber(-10).formatWithArithmeticSign("add")  → "-10.0"
   * new BigNumber("1e30").formatWithArithmeticSign("multiply")  → x"1.00No"
   * new BigNumber(1500000).formatWithArithmeticSign("divide")   → 1.50M%
   */
  formatWithArithmeticSign(operation: "add" | "multiply" | "divide"): string {
    if (operation === "add") {
      const prefix = this.mantissa >= 0 ? "+" : "";
      return prefix + this.format();
    }
    if (operation === "multiply") {
      return `x${this.format()}`;
    }
    if (operation === "divide") {
      return `${this.format()}%`;
    }
    return this.format();
  }

  // Returns string format of a BigNumber
  toString(): string {
    return this.format();
  }

  // ==================================================================================
  // HELPER METHODS FOR THE BIG NUMBER UTILS FILE
  // ==================================================================================

  /**
   * Return a BigNumber from a number or BigNumber
   *
   * @param value Number can be a BigNumber or a regular JavaScript number
   *
   * @returns A BigNumber instance
   *
   * @example
   * fromNumber(1000000)           → BigNumber representing one million
   * fromNumber(existingBigNumber) → Clone of the existing BigNumber
   *
   */
  private fromNumber(value: number | BigNumber): BigNumber {
    return value instanceof BigNumber ? value.clone() : new BigNumber(value);
  }
  /**
   * Normalize the mantissa size to be between 1.0 and 10.0
   *
   * @example
   * normalize(157000, 0)   → { mantissa: 1.57, exponent: 5 }
   * normalize(0.0157, 0) → { mantissa: 1.57, exponent: -2 }
   * normalize(157, 5)     → { mantissa: 1.57, exponent: 7 }
   */
  private normalize(
    mantissa: number,
    exponent: number
  ): { mantissa: number; exponent: number } {
    // Handle zero and invalid values
    if (mantissa === 0 || !Number.isFinite(mantissa)) {
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
   * Parse a string representation of a number to a mantissa and exponent to make it a number
   *
   * @example
   * parseString("150,000") → { mantissa: 1.5, exponent: 5 }
   * parseString("1e30") → { mantissa: 1, exponent: 30 }
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
 * Shorter way of creating a BigNumber
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
 * Format BigNumber or number to show in the UI
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
