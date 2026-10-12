// Safe expression evaluator for the calculator.
// Replaces eval(): the input is split into tokens and evaluated with the
// shunting-yard algorithm, so only numbers and + - x / % ( ) are accepted.
(function (root) {
  const PRECEDENCE = { '+': 1, '-': 1, '*': 2, '/': 2 };

  function tokenize(expression) {
    const text = expression.replace(/\s+/g, '').replace(/[x×]/g, '*').replace(/÷/g, '/');
    const tokens = [];
    let i = 0;

    while (i < text.length) {
      const ch = text[i];
      const prev = tokens[tokens.length - 1];
      const expectsNumber = !prev || (prev.type === 'op') || prev.value === '(';

      if (/[0-9.]/.test(ch) || (ch === '-' && expectsNumber)) {
        let j = i + 1;
        while (j < text.length && /[0-9.]/.test(text[j])) j++;
        const raw = text.slice(i, j);
        if (raw === '-' && text[j] === '(') {
          // "-(...)" becomes "-1 * (...)"
          tokens.push({ type: 'num', value: -1 }, { type: 'op', value: '*' });
          i = j;
          continue;
        }
        if ((raw.match(/\./g) || []).length > 1 || raw === '-' || raw === '.' || raw === '-.') {
          throw new Error('Invalid number');
        }
        let value = parseFloat(raw);
        if (text[j] === '%') { value /= 100; j++; }
        tokens.push({ type: 'num', value });
        i = j;
      } else if (ch in PRECEDENCE) {
        if (expectsNumber) throw new Error('Unexpected operator');
        tokens.push({ type: 'op', value: ch });
        i++;
      } else if (ch === '(' || ch === ')') {
        tokens.push({ type: 'paren', value: ch });
        i++;
      } else {
        throw new Error(`Invalid character: ${ch}`);
      }
    }
    return tokens;
  }

  function toRpn(tokens) {
    const output = [];
    const stack = [];
    tokens.forEach((t) => {
      if (t.type === 'num') output.push(t);
      else if (t.type === 'op') {
        while (stack.length && stack[stack.length - 1].type === 'op' &&
               PRECEDENCE[stack[stack.length - 1].value] >= PRECEDENCE[t.value]) {
          output.push(stack.pop());
        }
        stack.push(t);
      } else if (t.value === '(') stack.push(t);
      else {
        while (stack.length && stack[stack.length - 1].value !== '(') output.push(stack.pop());
        if (!stack.length) throw new Error('Mismatched parentheses');
        stack.pop();
      }
    });
    while (stack.length) {
      const t = stack.pop();
      if (t.type === 'paren') throw new Error('Mismatched parentheses');
      output.push(t);
    }
    return output;
  }

  function evaluate(expression) {
    if (!expression || !expression.trim()) return 0;
    const stack = [];
    toRpn(tokenize(expression)).forEach((t) => {
      if (t.type === 'num') return stack.push(t.value);
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Incomplete expression');
      if (t.value === '/' && b === 0) throw new Error('Cannot divide by zero');
      stack.push({ '+': a + b, '-': a - b, '*': a * b, '/': a / b }[t.value]);
    });
    if (stack.length !== 1) throw new Error('Incomplete expression');
    // Round away floating point noise, e.g. 0.1 + 0.2 = 0.3
    return parseFloat(stack[0].toPrecision(12));
  }

  const api = { tokenize, evaluate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Calculator = api;
})(this);
