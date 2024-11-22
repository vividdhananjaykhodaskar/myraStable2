export function greatestCommonDivisor(num1: any, num2 : any) {
  let number1 = num1;
  let number2 = num2;

  while (number1 !== number2) {
    if (number1 > number2) {
      number1 = number1 - number2;
    } else {
      number2 = number2 - number1;
    }
  }

  return number2;
}

export function leastCommonMultiple(num1 : any, num2 : any) {
  const number1 = num1;
  const number2 = num2;

  const gcd = greatestCommonDivisor(number1, number2);

  return (number1 * number2) / gcd;
}

export function getBaseUrl(w = window) {
  const doc = w.document;
  const base = doc.querySelector("base");

  if (base?.href) {
    return base.href;
  }

  const { protocol, host } = w.location;

  return `${protocol}//${host}`;
}
