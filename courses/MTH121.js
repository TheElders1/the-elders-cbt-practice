window.quizData = {
  "title": "MTH 121 - Elementary Mathematics II",
  "questions": [
    {
      "question": "Suppose H(t) = t^2 + 5t + 1. Find the limit lim (t→2) H(t).",
      "options": [
        "15",
        "1",
        "9",
        "6"
      ],
      "answer": "15",
      "explanation": "For a polynomial function, the limit can be found by direct substitution. H(2) = 2^2 + 5(2) + 1 = 4 + 10 + 1 = 15."
    },
    {
      "question": "Find the limit lim (t→2) (t^2 - 4) / (t - 2).",
      "options": [
        "2",
        "4",
        "8",
        "The limit does not exist"
      ],
      "answer": "4",
      "explanation": "This is an indeterminate form 0/0. Factor the numerator: (t-2)(t+2) / (t-2). Cancel the (t-2) terms to get t+2. Now substitute t=2: 2+2 = 4."
    },
    {
      "question": "Find the limit lim (x→5) (x - 5) / (x^2 - 25).",
      "options": [
        "-1/10",
        "1/10",
        "0",
        "1/5"
      ],
      "answer": "1/10",
      "explanation": "Factor the denominator: (x-5) / ((x-5)(x+5)). Cancel the (x-5) terms to get 1/(x+5). Now substitute x=5: 1/(5+5) = 1/10."
    },
    {
      "question": "Compute lim (x→3) (x^2 - 7x + 12) / (x - 3).",
      "options": [
        "0",
        "1",
        "-1",
        "2"
      ],
      "answer": "-1",
      "explanation": "Factor the numerator: (x-3)(x-4) / (x-3). Cancel the (x-3) terms to get x-4. Now substitute x=3: 3-4 = -1."
    },
    {
      "question": "Find lim (r→1) (r^2 - 3r + 2) / (r - 1).",
      "options": [
        "1",
        "0",
        "-1",
        "The limit does not exist"
      ],
      "answer": "-1",
      "explanation": "Factor the numerator: (r-1)(r-2) / (r-1). Cancel the (r-1) terms to get r-2. Now substitute r=1: 1-2 = -1."
    },
    {
      "question": "Find the limit or state that it does not exist: lim (x→4) (x^2 + x - 20) / (x - 4).",
      "options": [
        "8",
        "-20",
        "9",
        "Does Not Exist"
      ],
      "answer": "9",
      "explanation": "Factor the numerator: (x+5)(x-4) / (x-4). Cancel the (x-4) terms to get x+5. Now substitute x=4: 4+5 = 9."
    },
    {
      "question": "Compute lim (x→0) [ (2x^2 - 3x + 4)/x + (5x - 4)/x ].",
      "options": [
        "5",
        "4",
        "2",
        "1"
      ],
      "answer": "2",
      "explanation": "Combine the fractions: (2x^2 - 3x + 4 + 5x - 4)/x = (2x^2 + 2x)/x. Factor out x from the numerator: x(2x + 2)/x. Cancel x to get 2x+2. Substitute x=0: 2(0)+2 = 2."
    },
    {
      "question": "Compute lim (h→0) ((h + 4)^2 - 16) / h.",
      "options": [
        "4",
        "6",
        "7",
        "8"
      ],
      "answer": "8",
      "explanation": "This is the definition of the derivative of f(x)=x^2 at x=4. Expand the numerator: (h^2 + 8h + 16 - 16)/h = (h^2 + 8h)/h. Factor out h: h(h+8)/h. Cancel h to get h+8. Substitute h=0: 0+8 = 8."
    },
    {
      "question": "Find the limit lim (t→0+) (√t^3) / (√t).",
      "options": [
        "0",
        "1",
        "2",
        "The limit does not exist"
      ],
      "answer": "0",
      "explanation": "Using exponent rules, this is t^(3/2) / t^(1/2) = t^(3/2 - 1/2) = t^1 = t. The limit of t as t approaches 0 from the right is 0."
    },
    {
      "question": "Find the limit as x tends to 0 from the left: lim (x→0−) |x| / 2x.",
      "options": [
        "1/2",
        "0",
        "-1/2",
        "-1/3"
      ],
      "answer": "-1/2",
      "explanation": "When x approaches 0 from the left, x is negative. Therefore, |x| = -x. The expression becomes -x / 2x. Cancel x to get -1/2."
    },
    {
      "question": "Find the limit: lim (h→0−) |4h| / h.",
      "options": [
        "2",
        "-2",
        "4",
        "-4"
      ],
      "answer": "-4",
      "explanation": "When h approaches 0 from the left, h is negative. Therefore, 4h is negative, and |4h| = -4h. The expression becomes -4h / h. Cancel h to get -4."
    },
    {
      "question": "Compute lim (x→3−) |4x - 12| / (x - 3).",
      "options": [
        "4",
        "-4",
        "0",
        "Doesn't exist"
      ],
      "answer": "-4",
      "explanation": "Factor the term inside the absolute value: |4(x-3)|. When x approaches 3 from the left, (x-3) is negative. So, |4(x-3)| = -4(x-3). The expression is -4(x-3) / (x-3). Cancel (x-3) to get -4."
    },
    {
      "question": "Find the limit of f(x) as x tends to 2 from the left if f(x) = { 1 + x^2 if x < 2; x^3 if x ≥ 2 }.",
      "options": [
        "5",
        "6",
        "8",
        "9"
      ],
      "answer": "5",
      "explanation": "For the limit from the left (x→2-), we use the piece of the function where x < 2, which is f(x) = 1 + x^2. Substitute x=2: 1 + 2^2 = 1 + 4 = 5."
    },
    {
      "question": "For the function f(x) = { 4x^2 - 1 if x < 1; 3x + 2 if x ≥ 1 }, find lim (x→1+) f(x).",
      "options": [
        "5",
        "3",
        "1",
        "0"
      ],
      "answer": "5",
      "explanation": "For the limit from the right (x→1+), we use the piece of the function where x ≥ 1, which is f(x) = 3x + 2. Substitute x=1: 3(1) + 2 = 5."
    },
    {
      "question": "Let f(x) = { x^2 + 8x + 15 if x ≤ 2; 4x + 7 if x > 2 }. Find lim (x→2+) f(x).",
      "options": [
        "15",
        "20",
        "35",
        "The limit does not exist"
      ],
      "answer": "15",
      "explanation": "For the limit from the right (x→2+), we use the piece where x > 2, which is f(x) = 4x + 7. Substitute x=2: 4(2) + 7 = 8 + 7 = 15."
    },
    {
      "question": "Suppose f(t) = { (-t)^2 if t < 1; t^3 if t ≥ 1 }. Find the limit lim (t→1) f(t).",
      "options": [
        "-1",
        "1",
        "0",
        "The limit does not exist"
      ],
      "answer": "1",
      "explanation": "We must check the left and right-hand limits. Left (t→1-): use (-t)^2. Limit is (-1)^2 = 1. Right (t→1+): use t^3. Limit is 1^3 = 1. Since the left and right limits are equal, the two-sided limit is 1."
    },
    {
      "question": "Find the limit lim (t→∞) 3 / (1 + t^2).",
      "options": [
        "0",
        "1",
        "3",
        "The limit does not exist"
      ],
      "answer": "0",
      "explanation": "As t approaches infinity, t^2 grows infinitely large. The denominator (1 + t^2) also becomes infinitely large. A constant divided by an infinitely large number approaches 0."
    },
    {
      "question": "Find the limit lim (x→∞) (x^2 + x + 1) / (3x + 2)^2.",
      "options": [
        "1/3",
        "1/9",
        "0",
        "1"
      ],
      "answer": "1/9",
      "explanation": "Expand the denominator: (3x+2)^2 = 9x^2 + 12x + 4. For limits at infinity of rational functions, compare the degrees. The degree of the numerator is 2 (from x^2) and the degree of the denominator is 2 (from 9x^2). The limit is the ratio of the leading coefficients: 1/9."
    },
    {
      "question": "Find the limit lim (s→∞) (s^4 + s^2 + 13) / (s^3 + 8s + 9).",
      "options": [
        "0",
        "1",
        "The limit does not exist",
        "3"
      ],
      "answer": "The limit does not exist",
      "explanation": "The degree of the numerator (4) is greater than the degree of the denominator (3). Therefore, the function grows without bound as s approaches infinity, and the limit does not exist (it is ∞)."
    },
    {
      "question": "Suppose f(t) = { Bt if t ≤ 3; 5 if t > 3 }. Find a value of B such that the function f(t) is continuous for all t.",
      "options": [
        "3/5",
        "4/5",
        "5/3",
        "5/2"
      ],
      "answer": "5/3",
      "explanation": "For the function to be continuous at t=3, the left-hand limit must equal the right-hand limit. Left limit (t→3-): B(3) = 3B. Right limit (t→3+): 5. Set them equal: 3B = 5, so B = 5/3."
    },
    {
      "question": "Suppose that f(x) = { A + x if x < 2; 1 + x^2 if x ≥ 2 }. Find a value of A such that f(x) is continuous at the point x = 2.",
      "options": [
        "A = 8",
        "A = 1",
        "A = 3",
        "A = 0"
      ],
      "answer": "A = 3",
      "explanation": "For continuity at x=2, the limit from the left must equal the limit from the right. Left limit: A + 2. Right limit: 1 + 2^2 = 5. Set them equal: A + 2 = 5, so A = 3."
    },
    {
      "question": "Which of the following is true for the function f(x) = |x - 1|?",
      "options": [
        "f is differentiable at x = 1 and x = 2.",
        "f is differentiable at x = 1, but not at x = 2.",
        "f is differentiable at x = 2, but not at x = 1.",
        "f is not differentiable at either x = 1 or x = 2."
      ],
      "answer": "f is differentiable at x = 2, but not at x = 1.",
      "explanation": "The absolute value function has a sharp corner at the point where its argument is zero. Here, x-1=0 at x=1. This sharp corner means the function is not differentiable at x=1. At all other points, like x=2, the function is smooth and differentiable."
    },
    {
      "question": "What is the definition of a mapping?",
      "options": [
        "A rule which assigns every element in a set to a unique element in another set.",
        "A rule which converts a number to another single number.",
        "A rule which converts a number to a number or to numbers.",
        "A rule that can be represented by a straight line on a graph."
      ],
      "answer": "A rule which converts a number to a number or to numbers.",
      "explanation": "A mapping is a general rule where one input can yield one or more outputs. A function is a specific type of mapping where one input yields only one unique output."
    },
    {
      "question": "Which of the following mappings is NOT a function?",
      "options": [
        "x → 1/x",
        "x → x^2",
        "x → √x (for x≥0)",
        "x → ±√x"
      ],
      "answer": "x → ±√x",
      "explanation": "A function must assign each input to a unique output. The mapping x → ±√x assigns two outputs (a positive and a negative root) to a single input x, so it is not a function."
    },
    {
      "question": "What is the domain of the function f(x) = 1 / √(4-x)?",
      "options": [
        "x > 4",
        "x < 4",
        "x ≤ 4",
        "All real numbers"
      ],
      "answer": "x < 4",
      "explanation": "For the function to be defined, two conditions must be met: 1) The term under the square root must be non-negative (4-x ≥ 0), and 2) The denominator cannot be zero (√(4-x) ≠ 0). Combining these, we need 4-x > 0, which means x < 4."
    },
    {
      "question": "If f(x) = x^2 + 3 and g(x) = 2x - 1, find (f ◦ g)(x).",
      "options": [
        "2x^2 + 5",
        "4x^2 - 4x + 4",
        "4x^2 + 2",
        "2x^3 - x^2 + 6x - 3"
      ],
      "answer": "4x^2 - 4x + 4",
      "explanation": "(f ◦ g)(x) means f(g(x)). We substitute the expression for g(x) into f(x): f(2x-1) = (2x-1)^2 + 3 = (4x^2 - 4x + 1) + 3 = 4x^2 - 4x + 4."
    },
    {
      "question": "A function f(x) is considered 'one-to-one' (injective) if:",
      "options": [
        "f(x1) = f(x2) implies x1 = x2",
        "Every element in the domain maps to the same element in the range.",
        "The graph of the function is a straight line.",
        "For every y in the range, there is at least one x in the domain."
      ],
      "answer": "f(x1) = f(x2) implies x1 = x2",
      "explanation": "This is the formal definition of a one-to-one function. It means that no two distinct inputs can produce the same output."
    },
    {
      "question": "Which of the following functions is odd?",
      "options": [
        "f(x) = x^2 - 1",
        "f(x) = x^3 + 2x",
        "f(x) = cos(x)",
        "f(x) = 3x^2 + x"
      ],
      "answer": "f(x) = x^3 + 2x",
      "explanation": "A function is odd if f(-x) = -f(x). For f(x) = x^3 + 2x, f(-x) = (-x)^3 + 2(-x) = -x^3 - 2x = -(x^3 + 2x) = -f(x)."
    },
    {
      "question": "If f(x) = x + 1, what is its inverse function, f⁻¹(x)?",
      "options": [
        "x + 1",
        "1 - x",
        "x - 1",
        "1 / (x+1)"
      ],
      "answer": "x - 1",
      "explanation": "To find the inverse, replace f(x) with y: y = x + 1. Swap x and y: x = y + 1. Solve for y: y = x - 1. So, f⁻¹(x) = x - 1."
    },
    {
      "question": "A function is said to be continuous at a point 'a' if:",
      "options": [
        "The limit as x approaches 'a' exists.",
        "The function is defined at 'a'.",
        "The limit at 'a' equals the function's value at 'a'.",
        "The function's graph has no sharp corners."
      ],
      "answer": "The limit at 'a' equals the function's value at 'a'.",
      "explanation": "The formal definition of continuity at a point 'a' is that lim(x→a) f(x) = f(a). This single condition implies that the limit exists and the function is defined at that point."
    },
    {
      "question": "Find the limit: lim (x→-∞) (5x^3 + 4x + 7) / (25 - 2x^3).",
      "options": [
        "5/2",
        "-5/2",
        "0",
        "The limit does not exist"
      ],
      "answer": "-5/2",
      "explanation": "For limits at infinity of rational functions where the degrees of the numerator and denominator are the same, the limit is the ratio of the leading coefficients. The leading coefficient of the numerator is 5, and for the denominator it is -2. The ratio is 5 / -2 = -5/2."
    },
    {
      "question": "Let f(x) = { -5x + 7 if x < 3; x^2 - 16 if x ≥ 3 }. Find lim (x→3+) f(x).",
      "options": [
        "-8",
        "-7",
        "-6",
        "The limit does not exist"
      ],
      "answer": "-7",
      "explanation": "For the limit from the right (x→3+), we use the piece of the function where x ≥ 3, which is f(x) = x^2 - 16. Substitute x=3: 3^2 - 16 = 9 - 16 = -7."
    },
    {
      "question": "What kind of function has the property that f(-x) = f(x) for all x in its domain?",
      "options": [
        "An odd function",
        "An even function",
        "A one-to-one function",
        "An increasing function"
      ],
      "answer": "An even function",
      "explanation": "This is the definition of an even function. Its graph is symmetric with respect to the y-axis."
    },
    {
      "question": "What is the average cost A(q) if the total cost C(q) is 1000 + 3q?",
      "options": [
        "1000 + 3q",
        "1000/q",
        "1000/q + 3",
        "3"
      ],
      "answer": "1000/q + 3",
      "explanation": "The average cost A(q) is the total cost C(q) divided by the quantity q. So, A(q) = (1000 + 3q) / q = 1000/q + 3q/q = 1000/q + 3."
    },
    {
      "question": "Find the limiting value of the average cost A(q) = 5000/q + 5 as q tends to ∞.",
      "options": [
        "5",
        "5000",
        "5005",
        "The limit does not exist"
      ],
      "answer": "5",
      "explanation": "We need to find lim (q→∞) (5000/q + 5). As q approaches infinity, the term 5000/q approaches 0. So the limit is 0 + 5 = 5."
    },
    {
      "question": "Find all values of 'a' such that the function f(x) = { x^2 + 2x if x < a; -1 if x ≥ a } is continuous everywhere.",
      "options": [
        "a = -1 only",
        "a = -2 only",
        "a = -1 and a = 1",
        "all real numbers"
      ],
      "answer": "a = -1 only",
      "explanation": "For continuity at x=a, the two pieces must be equal. So, a^2 + 2a = -1. This gives the quadratic equation a^2 + 2a + 1 = 0, which factors to (a+1)^2 = 0. The only solution is a = -1."
    },
    {
      "question": "In the epsilon-delta definition of a limit, what does δ (delta) represent?",
      "options": [
        "The value of the limit",
        "A small distance from the function value L",
        "A small distance from the point c",
        "The slope of the function"
      ],
      "answer": "A small distance from the point c",
      "explanation": "The definition states that for any ε > 0, there exists a δ > 0 such that if x is within δ of c (i.e., 0 < |x-c| < δ), then f(x) is within ε of L. So δ defines a neighborhood around c."
    },
    {
      "question": "The Squeeze Theorem is used to find the limit of a function that is:",
      "options": [
        "A rational function",
        "A polynomial function",
        "Trapped between two other functions that have the same limit",
        "An oscillating function"
      ],
      "answer": "Trapped between two other functions that have the same limit",
      "explanation": "If f(x) ≤ g(x) ≤ h(x) and lim f(x) = lim h(x) = L, then the Squeeze Theorem concludes that lim g(x) = L."
    },
    {
      "question": "L'Hôpital's Rule can be applied to limits that result in which indeterminate forms?",
      "options": [
        "0 * ∞",
        "1^∞",
        "∞ - ∞",
        "0/0 or ∞/∞"
      ],
      "answer": "0/0 or ∞/∞",
      "explanation": "L'Hôpital's Rule directly applies to the indeterminate forms 0/0 and ∞/∞. Other forms must be algebraically manipulated into one of these two forms before the rule can be used."
    },
    {
      "question": "What is the derivative of y = ln(sin(x))?",
      "options": [
        "cos(x)",
        "cot(x)",
        "1/sin(x)",
        "ln(cos(x))"
      ],
      "answer": "cot(x)",
      "explanation": "Using the chain rule, the derivative of ln(u) is u'/u. Here u = sin(x) and u' = cos(x). So the derivative is cos(x)/sin(x), which is cot(x)."
    },
    {
      "question": "A stationary point of a function f(x) occurs where:",
      "options": [
        "f(x) = 0",
        "f'(x) = 0 or is undefined",
        "f''(x) = 0",
        "The function is at its absolute maximum"
      ],
      "answer": "f'(x) = 0 or is undefined",
      "explanation": "A stationary point (or critical point) is a point in the domain of a function where the first derivative is either zero or undefined."
    },
    {
      "question": "If f'(a) = 0 and f''(a) > 0, what can be concluded about the point x=a?",
      "options": [
        "It is a local maximum.",
        "It is a local minimum.",
        "It is a point of inflection.",
        "The test is inconclusive."
      ],
      "answer": "It is a local minimum.",
      "explanation": "This is the Second Derivative Test. If the first derivative is zero (a stationary point) and the second derivative is positive (concave up), the point is a local minimum."
    },
    {
      "question": "What is the relationship between the tangent line and the normal line to a curve at a given point?",
      "options": [
        "They are parallel.",
        "They are the same line.",
        "They are perpendicular.",
        "They intersect at a 45-degree angle."
      ],
      "answer": "They are perpendicular.",
      "explanation": "The normal line is defined as the line that is perpendicular to the tangent line at the point of tangency. Their slopes are negative reciprocals of each other."
    },
    {
      "question": "If the slope of the tangent line to y=f(x) at x=a is m, what is the slope of the normal line?",
      "options": [
        "m",
        "-m",
        "1/m",
        "-1/m"
      ],
      "answer": "-1/m",
      "explanation": "The slopes of perpendicular lines are negative reciprocals. If the tangent slope is m, the normal slope is -1/m."
    },
    {
      "question": "The instantaneous rate of change of a function f(x) at a point x=a is given by:",
      "options": [
        "f(a)",
        "The average rate of change over a small interval",
        "f'(a)",
        "The area under the curve"
      ],
      "answer": "f'(a)",
      "explanation": "The instantaneous rate of change is the physical interpretation of the derivative of the function at that point."
    },
    {
      "question": "If f(x) = x^2, what is the average rate of change over the interval [1, 3]?",
      "options": [
        "2",
        "4",
        "8",
        "9"
      ],
      "answer": "4",
      "explanation": "The average rate of change is (f(b) - f(a)) / (b - a). Here, (f(3) - f(1)) / (3 - 1) = (3^2 - 1^2) / 2 = (9 - 1) / 2 = 8 / 2 = 4."
    },
    {
      "question": "A function is considered 'onto' (surjective) if:",
      "options": [
        "Its graph passes the horizontal line test.",
        "Every element in the domain maps to a unique element in the range.",
        "Its range is equal to its codomain (every possible output is achieved).",
        "It is both increasing and continuous."
      ],
      "answer": "Its range is equal to its codomain (every possible output is achieved).",
      "explanation": "An onto function is one where every element of the target set (codomain) is mapped to by at least one element of the source set (domain)."
    },
    {
      "question": "A function that is both one-to-one and onto is called:",
      "options": [
        "Injective",
        "Surjective",
        "Bijective",
        "Monotonic"
      ],
      "answer": "Bijective",
      "explanation": "A bijective function is a function that is both a one-to-one correspondence (injective) and covers the entire codomain (surjective)."
    },
    {
      "question": "If dom(f) is the domain of a function f and ran(f⁻¹) is the range of its inverse, which statement is true?",
      "options": [
        "dom(f) = ran(f)",
        "dom(f) = ran(f⁻¹)",
        "dom(f) is a subset of ran(f⁻¹)",
        "They are unrelated"
      ],
      "answer": "dom(f) = ran(f⁻¹)",
      "explanation": "The domain of a function is the range of its inverse, and the range of a function is the domain of its inverse."
    },
    {
      "question": "The limit lim (x→0) sin(x)/x is a special trigonometric limit equal to:",
      "options": [
        "0",
        "1",
        "∞",
        "Does not exist"
      ],
      "answer": "1",
      "explanation": "This is a fundamental limit in calculus, often proven using the Squeeze Theorem or L'Hôpital's Rule. Applying L'Hôpital's Rule gives lim (x→0) cos(x)/1 = cos(0) = 1."
    },
    {
      "question": "Find the limit lim (x→∞) 2x^2 / (x+2)^3",
      "options": [
        "2",
        "1",
        "0",
        "Does not exist"
      ],
      "answer": "0",
      "explanation": "The degree of the numerator is 2. The degree of the denominator is 3. Since the degree of the denominator is greater than the degree of the numerator, the limit as x approaches infinity is 0."
    },
    {
      "question": "If a function is strictly increasing, what can be said about its derivative f'(x)?",
      "options": [
        "f'(x) < 0",
        "f'(x) > 0",
        "f'(x) = 0",
        "f'(x) is constant"
      ],
      "answer": "f'(x) > 0",
      "explanation": "A positive first derivative indicates that the function's slope is positive, meaning the function is increasing."
    },
    {
      "question": "Find the derivative of y = arcsin(x).",
      "options": [
        "1 / (1+x^2)",
        "-1 / √(1-x^2)",
        "1 / √(1-x^2)",
        "cos(x)"
      ],
      "answer": "1 / √(1-x^2)",
      "explanation": "This is a standard derivative for inverse trigonometric functions. The derivative of arcsin(x) is 1/√(1-x^2)."
    },
    {
      "question": "The limit lim (x→c) f(x) is said to be 'local'. What does this mean?",
      "options": [
        "The limit only exists for certain values of x.",
        "The limit only depends on the values of f(x) in the immediate vicinity of c.",
        "The limit is the same as the function's local maximum.",
        "The limit is only valid within a certain domain."
      ],
      "answer": "The limit only depends on the values of f(x) in the immediate vicinity of c.",
      "explanation": "The value of a limit at a point c does not depend on the value of the function at c, or on values far away from c, but only on the behavior of the function as it gets arbitrarily close to c."
    },
    {
      "question": "If lim (x→a-) f(x) ≠ lim (x→a+) f(x), then...",
      "options": [
        "The function is continuous at x=a",
        "The two-sided limit lim (x→a) f(x) exists",
        "The two-sided limit lim (x→a) f(x) does not exist",
        "The function must be undefined at x=a"
      ],
      "answer": "The two-sided limit lim (x→a) f(x) does not exist",
      "explanation": "A condition for the existence of a two-sided limit is that the left-hand limit and the right-hand limit must exist and be equal. If they are not equal, the two-sided limit does not exist."
    },
    {
      "question": "A hole in the graph of a function at x=a corresponds to what kind of discontinuity?",
      "options": [
        "Jump discontinuity",
        "Infinite discontinuity",
        "Removable discontinuity",
        "Essential discontinuity"
      ],
      "answer": "Removable discontinuity",
      "explanation": "A removable discontinuity occurs when the limit of the function exists at that point, but it is not equal to the function's value (either because the function is defined differently there, or not defined at all). This appears as a hole in the graph."
    },
    {
      "question": "Compute lim (x→-3) (x+3)^3 / (x^2+9).",
      "options": [
        "0",
        "1/18",
        "-1/6",
        "Does not exist"
      ],
      "answer": "0",
      "explanation": "This is not an indeterminate form. We can use direct substitution. The numerator is (-3+3)^3 = 0^3 = 0. The denominator is (-3)^2 + 9 = 9 + 9 = 18. The result is 0/18 = 0."
    },
    {
      "question": "If g(x) = f(x) for all x in an interval except at point c, what does the Neighborhood Theorem state about their limits at c?",
      "options": [
        "Their limits are different.",
        "The limit of g(x) is f(c).",
        "Their limits are either both defined and equal, or both are undefined.",
        "The limit of f(x) is g(c)."
      ],
      "answer": "Their limits are either both defined and equal, or both are undefined.",
      "explanation": "The Neighborhood Theorem states that if two functions are equal in a neighborhood of c (except possibly at c itself), then they have the same limit behavior at c."
    },
    {
      "question": "What is the derivative of y = x log₁₀(x)?",
      "options": [
        "1 / (x ln(10))",
        "log₁₀(x) + 1/ln(10)",
        "1 + log₁₀(x)",
        "ln(10) * log₁₀(x) + 1"
      ],
      "answer": "log₁₀(x) + 1/ln(10)",
      "explanation": "Use the product rule: (u'v + uv'). Let u=x, v=log₁₀(x). Then u'=1, v'=1/(x ln(10)). The derivative is 1*log₁₀(x) + x*(1/(x ln(10))) = log₁₀(x) + 1/ln(10)."
    },
    {
      "question": "Find the range of the function f(x) = x^2 + 3.",
      "options": [
        "y ≥ 0",
        "y > 3",
        "y ≥ 3",
        "All real numbers"
      ],
      "answer": "y ≥ 3",
      "explanation": "The term x^2 is always greater than or equal to 0. Therefore, the minimum value of x^2 + 3 occurs when x^2=0, giving a minimum value of 3. The function can take any value greater than or equal to 3."
    },
    {
      "question": "Find the limit: lim (x→0) (√(x^2+49) - 7) / x^2.",
      "options": [
        "1/7",
        "1/14",
        "49",
        "0"
      ],
      "answer": "1/14",
      "explanation": "This is a 0/0 form. Multiply the numerator and denominator by the conjugate, √(x^2+49) + 7. The numerator becomes (x^2+49) - 49 = x^2. The expression is x^2 / (x^2 * (√(x^2+49) + 7)). Cancel x^2. Now substitute x=0 into 1 / (√(x^2+49) + 7) to get 1 / (√49 + 7) = 1 / (7+7) = 1/14."
    },
    {
      "question": "In parametric differentiation, if x = f(t) and y = g(t), then dy/dx is equal to:",
      "options": [
        "(dy/dt) * (dx/dt)",
        "(dx/dt) / (dy/dt)",
        "(dy/dt) / (dx/dt)",
        "g'(f(t))"
      ],
      "answer": "(dy/dt) / (dx/dt)",
      "explanation": "This is the formula for the derivative of a parametrically defined curve, derived from the chain rule: dy/dx = (dy/dt) * (dt/dx)."
    },
    {
      "question": "Which theorem states that 'the limit of a sum is the sum of the limits'?",
      "options": [
        "Squeeze Theorem",
        "Intermediate Value Theorem",
        "Limit Sum Rule",
        "Neighborhood Theorem"
      ],
      "answer": "Limit Sum Rule",
      "explanation": "The Limit Sum Rule, a fundamental limit law, states that lim [f(x) + g(x)] = lim f(x) + lim g(x), provided both limits on the right side exist."
    },
    {
      "question": "Which of the following functions is neither even nor odd?",
      "options": [
        "f(x) = x^2",
        "f(x) = x^3",
        "f(x) = x + 1",
        "f(x) = sin(x)"
      ],
      "answer": "f(x) = x + 1",
      "explanation": "f(-x) = -x + 1. This is not equal to f(x) = x+1 (so not even), and it is not equal to -f(x) = -x-1 (so not odd)."
    },
    {
      "question": "To find the absolute maximum of a continuous function on a closed interval [a, b], you must check:",
      "options": [
        "Only the critical points.",
        "Only the endpoints a and b.",
        "The critical points and the endpoints a and b.",
        "Only the points where f'(x) > 0."
      ],
      "answer": "The critical points and the endpoints a and b.",
      "explanation": "This is the Extreme Value Theorem. The absolute maximum and minimum values of a continuous function on a closed interval must occur at either a critical point within the interval or at one of the endpoints."
    },
    {
      "question": "Find the limit lim (x→∞) √(4x^4 + 24x - 7) / (x^2 - 25).",
      "options": [
        "4",
        "2",
        "1",
        "∞"
      ],
      "answer": "2",
      "explanation": "For large x, the dominant term in the numerator is √(4x^4) = 2x^2. The dominant term in the denominator is x^2. The limit is equivalent to the limit of 2x^2 / x^2, which is 2."
    },
    {
      "question": "What is the primary method for finding the derivative of an equation where y is not explicitly solved for x, such as x² + y² = 4?",
      "options": [
        "Parametric Differentiation",
        "Implicit Differentiation",
        "Logarithmic Differentiation",
        "The Product Rule"
      ],
      "answer": "Implicit Differentiation",
      "explanation": "Implicit differentiation is used when a function is not given in the form y = f(x). You differentiate both sides of the equation with respect to x, treating y as a function of x and using the chain rule."
    },
    {
      "question": "If f(x) = x^3 and g(x) = x+1, find (g ◦ f)(x).",
      "options": [
        "(x+1)^3",
        "x^3 + 1",
        "x^4 + x^3",
        "x^3 + x"
      ],
      "answer": "x^3 + 1",
      "explanation": "(g ◦ f)(x) means g(f(x)). We substitute the expression for f(x) into g(x): g(x^3) = (x^3) + 1 = x^3 + 1."
    },
    {
      "question": "The limit lim (h→0) [f(c+h) - f(c)] / h is the definition of:",
      "options": [
        "Continuity at c",
        "The integral of f(x) at c",
        "The derivative of f(x) at c, f'(c)",
        "The value of the function at c, f(c)"
      ],
      "answer": "The derivative of f(x) at c, f'(c)",
      "explanation": "This is the formal limit definition of the derivative of a function f at a point c."
    },
    {
      "question": "If lim (x→2) f(x) = 5 and lim (x→2) g(x) = -1, what is lim (x→2) [f(x) * g(x)]?",
      "options": [
        "4",
        "5",
        "-5",
        "Cannot be determined"
      ],
      "answer": "-5",
      "explanation": "According to the Limit Product Rule, the limit of a product is the product of the limits. Therefore, the limit is 5 * (-1) = -5."
    },
    {
      "question": "Find the stationary points of f(x) = x³ - 12x + 9.",
      "options": [
        "x = 1, x = 3",
        "x = 2, x = -2",
        "x = 0, x = 4",
        "x = 6, x = -6"
      ],
      "answer": "x = 2, x = -2",
      "explanation": "Find the first derivative: f'(x) = 3x² - 12. Set it to zero: 3x² - 12 = 0 => 3x² = 12 => x² = 4. The solutions are x = 2 and x = -2."
    },
    {
      "question": "What is the derivative of y = e^(x²)?",
      "options": [
        "e^(x²)",
        "2e^(x²)",
        "2x * e^(x²)",
        "x² * e^(x²-1)"
      ],
      "answer": "2x * e^(x²)",
      "explanation": "Using the chain rule, where the outer function is e^u and the inner function is u = x². The derivative is e^u * u' = e^(x²) * 2x."
    },
    {
      "question": "What is the domain of f(x) = ln(x-3)?",
      "options": [
        "x ≥ 3",
        "x > 3",
        "x < 3",
        "All real numbers except 3"
      ],
      "answer": "x > 3",
      "explanation": "The natural logarithm function ln(u) is only defined for u > 0. Therefore, we must have x - 3 > 0, which means x > 3."
    },
    {
      "question": "If a function is defined as f(x) = { -t if t < 1; t² if t ≥ 1 }, does the limit at t=1 exist?",
      "options": [
        "Yes, the limit is 1",
        "Yes, the limit is -1",
        "No, the limit does not exist",
        "Yes, the limit is 0"
      ],
      "answer": "No, the limit does not exist",
      "explanation": "Check the left and right-hand limits. Left limit (t→1-): use -t. The limit is -1. Right limit (t→1+): use t². The limit is 1²=1. Since the left limit (-1) does not equal the right limit (1), the two-sided limit does not exist."
    },
    {
      "question": "A vertical asymptote for the graph of a function f(x) typically occurs where:",
      "options": [
        "The numerator of the function is zero.",
        "The limit of the function as x approaches a point is ±∞.",
        "The derivative of the function is zero.",
        "The limit of the function as x approaches ±∞ is a constant."
      ],
      "answer": "The limit of the function as x approaches a point is ±∞.",
      "explanation": "A vertical line x=c is a vertical asymptote if the function value f(x) grows or decreases without bound (approaches ∞ or -∞) as x approaches c from either the left or the right."
    },
    {
      "question": "Find lim (x→3) 5.",
      "options": [
        "3",
        "5",
        "0",
        "Does not exist"
      ],
      "answer": "5",
      "explanation": "The limit of a constant is the constant itself, regardless of the point being approached."
    },
    {
      "question": "What is the slope of the tangent line to the curve y = x³ at the point x = 2?",
      "options": [
        "8",
        "6",
        "12",
        "3"
      ],
      "answer": "12",
      "explanation": "The slope of the tangent line is given by the derivative. The derivative of y = x³ is y' = 3x². At x = 2, the slope is 3(2)² = 3 * 4 = 12."
    },
    {
      "question": "Which of the following describes a monotonically decreasing function?",
      "options": [
        "For x₁ < x₂, we have f(x₁) < f(x₂)",
        "For x₁ < x₂, we have f(x₁) ≤ f(x₂)",
        "For x₁ < x₂, we have f(x₁) > f(x₂)",
        "For x₁ < x₂, we have f(x₁) ≥ f(x₂)"
      ],
      "answer": "For x₁ < x₂, we have f(x₁) ≥ f(x₂)",
      "explanation": "A monotonically decreasing function is one where the function values never increase as the input increases. The option with > describes a strictly decreasing function."
    },
    {
      "question": "If g(x) = x - 2, what is (g ◦ g)(x)?",
      "options": [
        "x",
        "x - 4",
        "x² - 4",
        "2x - 4"
      ],
      "answer": "x - 4",
      "explanation": "(g ◦ g)(x) means g(g(x)). Substitute g(x) into g: g(x-2) = (x-2) - 2 = x - 4."
    },
    {
      "question": "What is the limit lim (x→∞) e^(-x)?",
      "options": [
        "∞",
        "-∞",
        "1",
        "0"
      ],
      "answer": "0",
      "explanation": "As x becomes very large, -x becomes a large negative number. e raised to a large negative power approaches 0."
    },
    {
      "question": "If f(x) = 2x and g(x) = sin(x), find the limit of f(g(x)) as x approaches π/2.",
      "options": [
        "0",
        "1",
        "2",
        "π"
      ],
      "answer": "2",
      "explanation": "First find lim (x→π/2) g(x) = sin(π/2) = 1. Since f(x) is continuous, the limit of the composite function is f(lim g(x)) = f(1) = 2(1) = 2."
    },
    {
      "question": "What is the range of f(x) = 2 + sin(x)?",
      "options": [
        "[-1, 1]",
        "[1, 3]",
        "[2, 3]",
        "(-∞, ∞)"
      ],
      "answer": "[1, 3]",
      "explanation": "The range of sin(x) is [-1, 1]. Adding 2 to these values shifts the range up by 2. So the new range is [-1+2, 1+2] = [1, 3]."
    },
    {
      "question": "If the position of a particle is given by s(t) = t², what is its instantaneous velocity at t=5?",
      "options": [
        "5",
        "10",
        "25",
        "2"
      ],
      "answer": "10",
      "explanation": "Instantaneous velocity is the derivative of the position function. s'(t) = 2t. At t=5, the velocity is s'(5) = 2(5) = 10."
    },
    {
      "question": "Find the limit: lim(x→4) (x-4)/(√x - 2)",
      "options": [
        "2",
        "4",
        "0",
        "Does not exist"
      ],
      "answer": "4",
      "explanation": "This is a 0/0 form. Factor the numerator as a difference of squares: (√x - 2)(√x + 2). The expression becomes [(√x - 2)(√x + 2)] / (√x - 2). Cancel the (√x - 2) term. Now substitute x=4 into (√x + 2) to get √4 + 2 = 2 + 2 = 4."
    },
    {
      "question": "The function f(x) = (x²-1)/(x-1) is undefined at x=1. What value should be assigned to f(1) to make the function continuous at x=1?",
      "options": [
        "0",
        "1",
        "2",
        "-1"
      ],
      "answer": "2",
      "explanation": "To make the function continuous, f(1) must equal the limit as x approaches 1. The limit is found by factoring: lim (x-1)(x+1)/(x-1) = lim (x+1) = 1+1 = 2. Therefore, f(1) should be 2."
    },
    {
      "question": "What is the derivative of y = tan(x)?",
      "options": [
        "cot(x)",
        "sec²(x)",
        "csc²(x)",
        "-sin(x)"
      ],
      "answer": "sec²(x)",
      "explanation": "This is a standard derivative of a trigonometric function. d/dx(tan(x)) = sec²(x)."
    },
    {
      "question": "If lim (x→0+) f(x) = ∞, what does this imply about the line x=0?",
      "options": [
        "It is a horizontal asymptote.",
        "It is a removable discontinuity.",
        "It is a tangent line.",
        "It is a vertical asymptote."
      ],
      "answer": "It is a vertical asymptote.",
      "explanation": "A vertical asymptote at x=c occurs when the function approaches ∞ or -∞ as x approaches c from the left or right."
    },
    {
      "question": "The limit of a constant times a function is equal to:",
      "options": [
        "The constant.",
        "The limit of the function.",
        "The constant times the limit of the function.",
        "Zero."
      ],
      "answer": "The constant times the limit of the function.",
      "explanation": "This is the Constant Multiple Rule for limits: lim [c * f(x)] = c * lim f(x)."
    },
    {
      "question": "Find the limit: lim (x→2) (x³ - 8) / (x - 2)",
      "options": [
        "4",
        "8",
        "12",
        "Does not exist"
      ],
      "answer": "12",
      "explanation": "This is the definition of the derivative of f(x)=x³ at x=2. The derivative is f'(x)=3x², so f'(2)=3(2)²=12. Alternatively, factor the numerator as a difference of cubes: (x-2)(x²+2x+4). Cancel (x-2) and substitute x=2 into x²+2x+4 to get 4+4+4=12."
    },
    {
      "question": "If f(x) = -x² + 3 for x≥0, what is the range?",
      "options": [
        "y ≥ 3",
        "y ≤ 3",
        "y ≥ 0",
        "y ≤ 0"
      ],
      "answer": "y ≤ 3",
      "explanation": "For x≥0, x² is always non-negative. Therefore, -x² is always non-positive (≤0). The maximum value of -x² is 0 (when x=0). So the maximum value of f(x) is -0+3=3. The range is all values less than or equal to 3."
    },
    {
      "question": "What is the derivative of f(x) = 5^x?",
      "options": [
        "x * 5^(x-1)",
        "5^x",
        "ln(5) * 5^x",
        "5^x / ln(5)"
      ],
      "answer": "ln(5) * 5^x",
      "explanation": "The derivative of an exponential function a^x is given by ln(a) * a^x."
    },
    {
      "question": "A point of inflection on a curve is where:",
      "options": [
        "The first derivative is zero.",
        "The second derivative is zero or undefined, and the concavity changes.",
        "The curve reaches a maximum or minimum.",
        "The tangent line is horizontal."
      ],
      "answer": "The second derivative is zero or undefined, and the concavity changes.",
      "explanation": "A point of inflection marks the point on a curve where the direction of concavity (from concave up to down, or vice versa) changes. This is typically found where the second derivative is zero or undefined."
    },
    {
      "question": "If x = 2t and y = t², find dy/dx.",
      "options": [
        "t",
        "2t",
        "1/t",
        "t/2"
      ],
      "answer": "t",
      "explanation": "Use parametric differentiation. dy/dt = 2t and dx/dt = 2. Then dy/dx = (dy/dt) / (dx/dt) = 2t / 2 = t."
    },
    {
      "question": "The limit lim (x→∞) sin(x)",
      "options": [
        "0",
        "1",
        "-1",
        "Does not exist"
      ],
      "answer": "Does not exist",
      "explanation": "As x approaches infinity, the sine function continues to oscillate between -1 and 1. It does not approach a single, specific value, so the limit does not exist."
    },
    {
      "question": "If f(x) = √(x-3), what is the domain of f(x)?",
      "options": [
        "x > 3",
        "x ≥ 3",
        "x < 3",
        "All real numbers"
      ],
      "answer": "x ≥ 3",
      "explanation": "The expression under a square root must be non-negative. Therefore, x - 3 ≥ 0, which implies x ≥ 3."
    },
    {
      "question": "What is the value of lim (x→∞) (1 + 1/x)^x?",
      "options": [
        "1",
        "e",
        "∞",
        "0"
      ],
      "answer": "e",
      "explanation": "This is the definition of the mathematical constant e."
    },
    {
      "question": "Find the limit lim (x→1) |x-1| / (x-1)",
      "options": [
        "1",
        "-1",
        "0",
        "Does not exist"
      ],
      "answer": "Does not exist",
      "explanation": "We need to check the one-sided limits. From the right (x→1+), x-1 is positive, so the expression is (x-1)/(x-1) = 1. From the left (x→1-), x-1 is negative, so |x-1|=-(x-1), and the expression is -(x-1)/(x-1) = -1. Since the left and right limits are not equal, the limit does not exist."
    },
    {
      "question": "If a function is differentiable at a point, it must also be:",
      "options": [
        "Monotonic at that point",
        "Concave up at that point",
        "Continuous at that point",
        "A polynomial"
      ],
      "answer": "Continuous at that point",
      "explanation": "Differentiability implies continuity. A function cannot have a derivative at a point where it is not continuous (i.e., where there is a hole, jump, or asymptote)."
    },
    {
      "question": "If a balloon's radius is increasing at a rate of 2 cm/s, how fast is the volume (V = 4/3 πr³) increasing when the radius is 10 cm?",
      "options": [
        "80π cm³/s",
        "400π cm³/s",
        "800π cm³/s",
        "4000/3 π cm³/s"
      ],
      "answer": "800π cm³/s",
      "explanation": "This is a related rates problem. Differentiate the volume equation with respect to time: dV/dt = 4πr² (dr/dt). Plug in the given values: r=10 and dr/dt=2. dV/dt = 4π(10)²(2) = 4π(100)(2) = 800π cm³/s."
    },
    {
      "question": "Find the derivative of y = arccos(x).",
      "options": [
        "1 / √(1-x²)",
        "-1 / √(1-x²)",
        "1 / (1+x²)",
        "-1 / (1+x²)"
      ],
      "answer": "-1 / √(1-x²)",
      "explanation": "This is a standard derivative of an inverse trigonometric function."
    },
    {
      "question": "The limit lim (x→0) (cos(x) - 1)/x is a special trigonometric limit equal to:",
      "options": [
        "0",
        "1",
        "-1",
        "Does not exist"
      ],
      "answer": "0",
      "explanation": "This is another fundamental limit. Using L'Hôpital's Rule on the 0/0 form: lim (-sin(x))/1 = -sin(0) = 0."
    },
    {
      "question": "If f(x) = 3x² + 2, what is the equation of the tangent line at x=1?",
      "options": [
        "y = 6x - 1",
        "y = 6x + 5",
        "y = 3x + 2",
        "y = 5x"
      ],
      "answer": "y = 6x - 1",
      "explanation": "First, find the point: f(1) = 3(1)²+2 = 5. The point is (1,5). Next, find the slope: f'(x)=6x, so f'(1)=6. Use point-slope form: y - 5 = 6(x - 1) => y - 5 = 6x - 6 => y = 6x - 1."
    },
    {
      "question": "The limit of a quotient, lim [f(x)/g(x)], is the quotient of the limits, provided that:",
      "options": [
        "The functions are continuous.",
        "The limit of the denominator is not zero.",
        "The limit of the numerator is not zero.",
        "The functions are polynomials."
      ],
      "answer": "The limit of the denominator is not zero.",
      "explanation": "The Limit Quotient Rule states lim [f(x)/g(x)] = [lim f(x)] / [lim g(x)], but this is only valid if both individual limits exist and the limit of the denominator, lim g(x), is not equal to zero."
    },
    {
      "question": "Find the critical points of f(x) = x * e^x.",
      "options": [
        "x = 0",
        "x = 1",
        "x = -1",
        "x = e"
      ],
      "answer": "x = -1",
      "explanation": "Use the product rule to find the derivative: f'(x) = 1*e^x + x*e^x = e^x(1+x). Set f'(x) = 0. Since e^x is never zero, we must have 1+x = 0, which gives x = -1."
    },
    {
      "question": "What does a negative second derivative, f''(x) < 0, over an interval indicate about the function's graph?",
      "options": [
        "The function is increasing.",
        "The function is decreasing.",
        "The function is concave up.",
        "The function is concave down."
      ],
      "answer": "The function is concave down.",
      "explanation": "A negative second derivative means the slope of the function (the first derivative) is decreasing. This corresponds to a shape that is concave down (like an upside-down U)."
    },
    {
      "question": "If a function is defined by h(x) = p*x + k where p < 0, the function is:",
      "options": [
        "Strictly increasing",
        "Strictly decreasing",
        "Constant",
        "Non-monotonic"
      ],
      "answer": "Strictly decreasing",
      "explanation": "The function describes a straight line. Its derivative (slope) is h'(x) = p. Since p < 0, the slope is always negative, meaning the function is strictly decreasing."
    },
    {
      "question": "If f(x) = 2x+7 and g(x) = (x-7)/2, what is the relationship between f and g?",
      "options": [
        "They are parallel.",
        "g is the derivative of f.",
        "They are inverse functions.",
        "They are unrelated."
      ],
      "answer": "They are inverse functions.",
      "explanation": "We can check by composition. f(g(x)) = 2((x-7)/2) + 7 = (x-7) + 7 = x. Since f(g(x)) = x, they are inverses."
    },
    {
      "question": "Find the limit: lim (x→-2) (x² + 5x + 6) / (x + 2).",
      "options": [
        "1",
        "-1",
        "5",
        "Does not exist"
      ],
      "answer": "1",
      "explanation": "This is a 0/0 form. Factor the numerator: (x+2)(x+3). The expression becomes (x+2)(x+3)/(x+2). Cancel (x+2) and substitute x=-2 into (x+3) to get -2+3=1."
    },
    {
      "question": "The horizontal line test is used to determine if a function is:",
      "options": [
        "Continuous",
        "Differentiable",
        "One-to-one (injective)",
        "Onto (surjective)"
      ],
      "answer": "One-to-one (injective)",
      "explanation": "If any horizontal line intersects the graph of a function more than once, it means that at least two different inputs produce the same output, so the function is not one-to-one."
    },
    {
      "question": "Find the derivative of y = (x² + 1)³.",
      "options": [
        "3(x² + 1)²",
        "6x(x² + 1)²",
        "3(2x)²",
        "2x * 3(x² + 1)²"
      ],
      "answer": "6x(x² + 1)²",
      "explanation": "Use the chain rule (or generalized power rule). Let u = x²+1. The function is u³. The derivative is 3u² * u' = 3(x²+1)² * (2x) = 6x(x²+1)²."
    },
    {
      "question": "If lim (x→c) f(x) = L, what is lim (x→c) [f(x)]^n according to the Power Rule for limits?",
      "options": [
        "n*L",
        "L^n",
        "L/n",
        "n + L"
      ],
      "answer": "L^n",
      "explanation": "The limit of a function raised to a power is the limit of the function raised to that power, provided the limit exists. lim [f(x)]^n = [lim f(x)]^n = L^n."
    },
    {
      "question": "For f(x)=1/x, what is the limit as x approaches 0 from the left (x→0-)?",
      "options": [
        "0",
        "∞",
        "-∞",
        "Does not exist"
      ],
      "answer": "-∞",
      "explanation": "As x approaches 0 from the left side, x is a very small negative number. Dividing 1 by a very small negative number results in a very large negative number. Hence, the limit is -∞."
    },
    {
      "question": "If f(x) has a local maximum at x=c, which of the following must be true?",
      "options": [
        "f'(c)=0 or is undefined",
        "f''(c)<0",
        "f(c) is the largest value of the function",
        "The function is increasing to the left of c"
      ],
      "answer": "f'(c)=0 or is undefined",
      "explanation": "A local maximum must occur at a critical point. While f''(c)<0 is a sufficient condition (Second Derivative Test), it's not a necessary one (the test can be inconclusive). f'(c)=0 or being undefined is the necessary condition for a critical point."
    },
    {
      "question": "What is the derivative of y = arctan(x)?",
      "options": [
        "1 / (1+x²)",
        "1 / √(1-x²)",
        "-1 / (1+x²)",
        "sec²(x)"
      ],
      "answer": "1 / (1+x²)",
      "explanation": "This is a standard derivative of an inverse trigonometric function."
    },
    {
      "question": "Find the limit: lim(x→∞) (3x - 2) / (√(x² + 1)).",
      "options": [
        "3",
        "-3",
        "0",
        "∞"
      ],
      "answer": "3",
      "explanation": "For large x, the dominant term in the numerator is 3x. The dominant term in the denominator is √(x²) = x. The limit is equivalent to the limit of 3x/x, which is 3."
    },
    {
      "question": "The 'input' values for a function are represented by the:",
      "options": [
        "Range",
        "Domain",
        "Dependent variable",
        "Codomain"
      ],
      "answer": "Domain",
      "explanation": "The domain of a function is the set of all possible input values for which the function is defined."
    },
    {
      "question": "If f(x) = x², g(x) = x+1, h(x) = 2x, what is (f ◦ g ◦ h)(x)?",
      "options": [
        "(2x+1)²",
        "2(x+1)²",
        "2x² + 1",
        "(2x)² + 1"
      ],
      "answer": "(2x+1)²",
      "explanation": "Work from the inside out. g(h(x)) = g(2x) = 2x+1. Then f(g(h(x))) = f(2x+1) = (2x+1)²."
    },
    {
      "question": "The limit lim (x→9) (x-9) / (√x - 3) can be solved by multiplying by the conjugate. What is the conjugate of the denominator?",
      "options": [
        "√x + 3",
        "√x - 3",
        "x + 9",
        "3 - √x"
      ],
      "answer": "√x + 3",
      "explanation": "The conjugate of a binomial expression (a - b) is (a + b). Here, the conjugate of (√x - 3) is (√x + 3)."
    },
    {
      "question": "If the second derivative test results in f''(c) = 0, what does this mean for the critical point at x=c?",
      "options": [
        "It is a local maximum.",
        "It is a local minimum.",
        "The test is inconclusive.",
        "It is a point of inflection."
      ],
      "answer": "The test is inconclusive.",
      "explanation": "When f''(c) = 0, the second derivative test fails to determine whether the point is a maximum, minimum, or neither. The First Derivative Test must be used instead to check for a change in sign of f'(x)."
    },
    {
      "question": "Find the derivative of y = sin(x)cos(x).",
      "options": [
        "cos²(x) - sin²(x)",
        "1",
        "sin(2x)",
        "-sin(x)cos(x)"
      ],
      "answer": "cos²(x) - sin²(x)",
      "explanation": "Use the product rule: u'v + uv'. Let u=sin(x) and v=cos(x). Then u'=cos(x) and v'=-sin(x). The derivative is cos(x)cos(x) + sin(x)(-sin(x)) = cos²(x) - sin²(x). Note that this is also equal to cos(2x)."
    },
    {
      "question": "Find the equation of the normal line to y = x² at x=1.",
      "options": [
        "y = -1/2 x + 3/2",
        "y = 2x - 1",
        "y = -2x + 3",
        "y = 1/2 x + 1/2"
      ],
      "answer": "y = -1/2 x + 3/2",
      "explanation": "The point is (1, 1²)=(1,1). The tangent slope is y'=2x, so at x=1, m_tan=2. The normal slope is the negative reciprocal, m_norm=-1/2. Use point-slope form: y - 1 = -1/2 (x - 1) => y - 1 = -1/2 x + 1/2 => y = -1/2 x + 3/2."
    },
    {
      "question": "The function f(x) = 1/x² has what kind of symmetry?",
      "options": [
        "Odd symmetry (origin)",
        "Even symmetry (y-axis)",
        "Symmetry about x-axis",
        "No symmetry"
      ],
      "answer": "Even symmetry (y-axis)",
      "explanation": "The function is even because f(-x) = 1/(-x)² = 1/x² = f(x)."
    },
    {
      "question": "What is the limit of the sequence a_n = 2 + 1/n as n approaches infinity?",
      "options": [
        "0",
        "1",
        "2",
        "3"
      ],
      "answer": "2",
      "explanation": "As n becomes infinitely large, the term 1/n approaches 0. Therefore, the limit is 2 + 0 = 2."
    },
    {
      "question": "Find the limit: lim (x→0) (e^x - 1) / x.",
      "options": [
        "0",
        "1",
        "e",
        "Does not exist"
      ],
      "answer": "1",
      "explanation": "This is a 0/0 form. Applying L'Hôpital's Rule, we differentiate the top and bottom: lim (x→0) (e^x) / 1 = e^0 = 1."
    },
    {
      "question": "A function that is continuous on a closed interval [a, b] is guaranteed to have what?",
      "options": [
        "A derivative at every point.",
        "An absolute maximum and an absolute minimum.",
        "A root (a point where f(x)=0).",
        "A horizontal tangent."
      ],
      "answer": "An absolute maximum and an absolute minimum.",
      "explanation": "This is the statement of the Extreme Value Theorem."
    },
    {
      "question": "Find the derivative of y = ln(x²) using the chain rule.",
      "options": [
        "1/x²",
        "2/x",
        "2x/x²",
        "2 ln(x)"
      ],
      "answer": "2/x",
      "explanation": "The derivative of ln(u) is u'/u. Here, u=x², so u'=2x. The derivative is 2x / x² = 2/x. Alternatively, you can use log properties first: y=2ln(x), so y'=2(1/x) = 2/x."
    },
    {
      "question": "The Intermediate Value Theorem requires that a function be:",
      "options": [
        "Differentiable on a closed interval",
        "Continuous on a closed interval",
        "Monotonic on an open interval",
        "A polynomial function"
      ],
      "answer": "Continuous on a closed interval",
      "explanation": "The IVT states that for a continuous function on [a, b], the function must take on every value between f(a) and f(b) at some point within the interval."
    },
    {
      "question": "Find the limit lim (x→-∞) x / √(x² + 1).",
      "options": [
        "1",
        "-1",
        "0",
        "Does not exist"
      ],
      "answer": "-1",
      "explanation": "For x approaching -∞, x is negative. The dominant term in the denominator is √(x²) = |x| = -x (since x is negative). The limit is equivalent to the limit of x / (-x), which is -1."
    },
    {
      "question": "The 'output' values of a function are represented by the:",
      "options": [
        "Domain",
        "Range",
        "Independent variable",
        "Mapping"
      ],
      "answer": "Range",
      "explanation": "The range is the set of all actual output values produced by the function."
    },
    {
      "question": "If a rectangle's length is increasing at 3 cm/s and its width is increasing at 2 cm/s, how fast is the area increasing when the length is 10 cm and the width is 5 cm?",
      "options": [
        "6 cm²/s",
        "35 cm²/s",
        "40 cm²/s",
        "25 cm²/s"
      ],
      "answer": "35 cm²/s",
      "explanation": "Area A = L*W. Differentiate using the product rule with respect to time: dA/dt = (dL/dt)W + L(dW/dt). Plug in the values: dA/dt = (3)(5) + (10)(2) = 15 + 20 = 35 cm²/s."
    },
    {
      "question": "Find the limit: lim (x→-1) (x³ + 1) / (x + 1).",
      "options": [
        "-2",
        "0",
        "3",
        "Does not exist"
      ],
      "answer": "3",
      "explanation": "Factor the numerator as a sum of cubes: (x+1)(x²-x+1). The expression is (x+1)(x²-x+1)/(x+1). Cancel (x+1) and substitute x=-1 into x²-x+1 to get (-1)² - (-1) + 1 = 1 + 1 + 1 = 3."
    },
    {
      "question": "What is the slope of the line normal to y = 1/x at x=2?",
      "options": [
        "-1/4",
        "4",
        "-4",
        "1/4"
      ],
      "answer": "4",
      "explanation": "The derivative is y' = -1/x². At x=2, the tangent slope is -1/2² = -1/4. The normal slope is the negative reciprocal, which is -1/(-1/4) = 4."
    },
    {
      "question": "For the limit lim (x→c) f(x) to exist, what must be true?",
      "options": [
        "The left-hand limit and right-hand limit must exist and be equal.",
        "The function must be defined at x=c.",
        "The function must be continuous at x=c.",
        "The function must be a rational function."
      ],
      "answer": "The left-hand limit and right-hand limit must exist and be equal.",
      "explanation": "This is the fundamental condition for the existence of a two-sided limit."
    },
    {
      "question": "If f(x) = sin(2x), find f'(π/4).",
      "options": [
        "0",
        "1",
        "2",
        "-2"
      ],
      "answer": "0",
      "explanation": "Using the chain rule, f'(x) = cos(2x) * 2. Then f'(π/4) = 2 * cos(2 * π/4) = 2 * cos(π/2) = 2 * 0 = 0."
    },
    {
      "question": "If a function is strictly monotonic, it is guaranteed to be:",
      "options": [
        "Continuous",
        "Differentiable",
        "One-to-one",
        "Even or odd"
      ],
      "answer": "One-to-one",
      "explanation": "A strictly monotonic function (either always increasing or always decreasing) will always pass the horizontal line test, meaning it is one-to-one."
    },
    {
      "question": "What is the limit lim (x→∞) arctan(x)?",
      "options": [
        "0",
        "π/2",
        "π",
        "∞"
      ],
      "answer": "π/2",
      "explanation": "The graph of arctan(x) has a horizontal asymptote at y = π/2 as x approaches positive infinity."
    },
    {
      "question": "What is the first step in finding the inverse of the function f(x) = 2x - 5?",
      "options": [
        "Replace x with y",
        "Solve for x",
        "Replace f(x) with y",
        "Differentiate the function"
      ],
      "answer": "Replace f(x) with y",
      "explanation": "The standard procedure begins by writing the function as an equation y = 2x - 5. The next steps are to swap x and y, and then solve for the new y."
    },
    {
      "question": "A 'dependent variable' represents the:",
      "options": [
        "Input value of a function",
        "Domain of a function",
        "Output value of a function",
        "Rate of change"
      ],
      "answer": "Output value of a function",
      "explanation": "The dependent variable (often y) is the output whose value depends on the chosen input, the independent variable (often x)."
    },
    {
      "question": "Find the limit: lim (x→0) x / sin(3x).",
      "options": [
        "3",
        "1/3",
        "0",
        "Does not exist"
      ],
      "answer": "1/3",
      "explanation": "This is a 0/0 form. Using L'Hôpital's Rule: lim (1) / (cos(3x)*3) = 1 / (3*cos(0)) = 1 / (3*1) = 1/3."
    },
    {
      "question": "If x = cos(t) and y = sin(t), find dy/dx.",
      "options": [
        "tan(t)",
        "-tan(t)",
        "cot(t)",
        "-cot(t)"
      ],
      "answer": "-cot(t)",
      "explanation": "dy/dt = cos(t) and dx/dt = -sin(t). Then dy/dx = (dy/dt)/(dx/dt) = cos(t) / -sin(t) = -cot(t)."
    },
    {
      "question": "Which theorem connects the concepts of derivatives and average rates of change?",
      "options": [
        "Squeeze Theorem",
        "Intermediate Value Theorem",
        "Extreme Value Theorem",
        "Mean Value Theorem"
      ],
      "answer": "Mean Value Theorem",
      "explanation": "The Mean Value Theorem states that for a differentiable function on an interval, there is at least one point where the instantaneous rate of change (derivative) is equal to the average rate of change over that interval."
    },
    {
      "question": "Find the limit: lim(x→∞) (x² + 5) / (e^x).",
      "options": [
        "∞",
        "1",
        "0",
        "5"
      ],
      "answer": "0",
      "explanation": "The exponential function e^x grows much faster than any polynomial function, including x². Therefore, as x approaches infinity, the denominator becomes infinitely larger than the numerator, and the limit is 0. This can be confirmed by applying L'Hôpital's Rule twice."
    },
    {
      "question": "If f(x) is a rational function and c is in its domain, then lim (x→c) f(x) is:",
      "options": [
        "f(c)",
        "0",
        "f'(c)",
        "Always non-existent"
      ],
      "answer": "f(c)",
      "explanation": "Rational functions are continuous everywhere in their domain. Therefore, the limit can be found by direct substitution."
    },
    {
      "question": "Find the equation of the tangent to the circle x² + y² = 25 at the point (3, 4).",
      "options": [
        "y = -3/4 x + 25/4",
        "y = 3/4 x + 7/4",
        "y = -4/3 x + 8",
        "y = 4/3 x"
      ],
      "answer": "y = -3/4 x + 25/4",
      "explanation": "Use implicit differentiation: 2x + 2y(dy/dx) = 0, so dy/dx = -x/y. At (3,4), the slope is -3/4. Use point-slope form: y - 4 = -3/4(x - 3) => y - 4 = -3/4 x + 9/4 => y = -3/4 x + 25/4."
    },
    {
      "question": "What is the relationship between the domain of f(x) and the range of f⁻¹(x)?",
      "options": [
        "They are equal",
        "The domain is a subset of the range",
        "The range is a subset of the domain",
        "They are unrelated sets"
      ],
      "answer": "They are equal",
      "explanation": "The domain of a function is precisely the range of its inverse function (dom(f) = ran(f⁻¹))."
    },
    {
      "question": "Find the limit: lim (x→1) ln(x) / (x-1).",
      "options": [
        "0",
        "1",
        "e",
        "Does not exist"
      ],
      "answer": "1",
      "explanation": "This is a 0/0 indeterminate form. Using L'Hôpital's Rule: differentiate the numerator (1/x) and the denominator (1). The limit becomes lim (x→1) (1/x) / 1 = 1/1 = 1."
    },
    {
      "question": "If f(x) = x³ - 6x² + 9x + 2, find the coordinates of the local maximum.",
      "options": [
        "(1, 6)",
        "(3, 2)",
        "(-1, -14)",
        "(-3, -88)"
      ],
      "answer": "(1, 6)",
      "explanation": "f'(x) = 3x² - 12x + 9 = 3(x²-4x+3) = 3(x-1)(x-3). Critical points are x=1, x=3. f''(x) = 6x - 12. f''(1) = 6-12 = -6 (negative, so local max). f''(3) = 18-12 = 6 (positive, so local min). The local maximum is at x=1. f(1) = 1-6+9+2 = 6. The point is (1,6)."
    },
    {
      "question": "If f is an invertible function and f(2)=5, what is f⁻¹(5)?",
      "options": [
        "2",
        "5",
        "1/2",
        "1/5"
      ],
      "answer": "2",
      "explanation": "If the function f maps an input of 2 to an output of 5, then its inverse function f⁻¹ must map an input of 5 back to the original output of 2."
    },
    {
      "question": "The limit lim (x→0) (1-cos(x))/x² equals:",
      "options": [
        "0",
        "1",
        "1/2",
        "2"
      ],
      "answer": "1/2",
      "explanation": "Apply L'Hôpital's Rule (0/0 form): lim (sin(x))/(2x). This is still 0/0. Apply it again: lim (cos(x))/2 = cos(0)/2 = 1/2."
    },
    {
      "question": "The vertical line test is used to determine if a graph represents a:",
      "options": [
        "Function",
        "One-to-one function",
        "Continuous function",
        "Differentiable function"
      ],
      "answer": "Function",
      "explanation": "If any vertical line intersects a graph at more than one point, it means there is an input value (x) that corresponds to more than one output value (y), so the graph does not represent a function."
    },
    {
      "question": "Find the limit: lim (x→∞) (5 - 3/x + 4/x²).",
      "options": [
        "0",
        "5",
        "6",
        "∞"
      ],
      "answer": "5",
      "explanation": "As x approaches infinity, the terms 3/x and 4/x² both approach 0. The limit is 5 - 0 + 0 = 5."
    },
    {
      "question": "Which function grows the fastest as x → ∞?",
      "options": [
        "y = x¹⁰⁰",
        "y = ln(x)",
        "y = e^x",
        "y = 1.01^x"
      ],
      "answer": "y = e^x",
      "explanation": "Exponential functions (like e^x) grow faster than any polynomial function (like x¹⁰⁰), and polynomial functions grow faster than logarithmic functions (like ln(x)). Since e (~2.718) is greater than 1.01, e^x grows faster than 1.01^x."
    },
    {
      "question": "If f'(x) changes from positive to negative at a critical point c, then c is a:",
      "options": [
        "Local minimum",
        "Local maximum",
        "Point of inflection",
        "Discontinuity"
      ],
      "answer": "Local maximum",
      "explanation": "This is the First Derivative Test. If the slope changes from positive (increasing) to negative (decreasing), the function has reached a local maximum at that point."
    },
    {
      "question": "What is the derivative of y = csc(x)?",
      "options": [
        "sec(x)",
        "cot(x)",
        "-csc(x)cot(x)",
        "csc(x)tan(x)"
      ],
      "answer": "-csc(x)cot(x)",
      "explanation": "This is a standard derivative of a trigonometric function."
    },
    {
      "question": "Find the limit: lim (t→16) (t-16)/(√t - 4).",
      "options": [
        "4",
        "8",
        "16",
        "32"
      ],
      "answer": "8",
      "explanation": "Factor the numerator as a difference of squares: (√t-4)(√t+4). Cancel the (√t-4) term and substitute t=16 into (√t+4) to get √16+4 = 4+4 = 8."
    },
    {
      "question": "If a function is defined as f(x) = { x+2 if x ≤ 0; 2-x if x > 0 }, is it continuous at x=0?",
      "options": [
        "Yes, the limit is 2",
        "Yes, the limit is 0",
        "No, the limits are not equal",
        "No, the function is undefined"
      ],
      "answer": "Yes, the limit is 2",
      "explanation": "Left limit (x→0-): x+2 → 2. Right limit (x→0+): 2-x → 2. Value at x=0: f(0)=0+2=2. Since the left limit, right limit, and function value are all equal to 2, the function is continuous at x=0."
    },
    {
      "question": "What is the domain of f(x) = (x+5)/(x²-9)?",
      "options": [
        "All real numbers",
        "x ≠ -5",
        "x ≠ 9",
        "x ≠ 3 and x ≠ -3"
      ],
      "answer": "x ≠ 3 and x ≠ -3",
      "explanation": "The domain of a rational function excludes any values that make the denominator zero. We set x²-9 = 0, which gives (x-3)(x+3)=0. The solutions are x=3 and x=-3."
    },
    {
      "question": "Find the limit: lim (h→0) (sin(x+h) - sin(x)) / h.",
      "options": [
        "sin(x)",
        "cos(x)",
        "0",
        "1"
      ],
      "answer": "cos(x)",
      "explanation": "This is the limit definition of the derivative of f(x) = sin(x). The derivative of sin(x) is cos(x)."
    },
    {
      "question": "The absolute value function f(x) = |x| is not differentiable at x=0 because:",
      "options": [
        "It is not continuous at x=0.",
        "The limit does not exist at x=0.",
        "There is a sharp corner in the graph at x=0.",
        "The function value is zero at x=0."
      ],
      "answer": "There is a sharp corner in the graph at x=0.",
      "explanation": "Differentiability requires the graph to be 'smooth' locally. The sharp point at the vertex of the absolute value function means the left-hand derivative (-1) and the right-hand derivative (1) are not equal, so the derivative does not exist at that point."
    },
    {
      "question": "Find the limit: lim(x→∞) (√x² + 4x - x).",
      "options": [
        "0",
        "1",
        "2",
        "4"
      ],
      "answer": "2",
      "explanation": "This is an ∞-∞ form. Multiply by the conjugate (√(x²+4x)+x) / (√(x²+4x)+x). The numerator becomes (x²+4x) - x² = 4x. The expression is 4x / (√(x²+4x)+x). Divide top and bottom by x: 4 / (√(1+4/x)+1). As x→∞, 4/x→0. The limit is 4/(√(1)+1) = 4/2 = 2."
    },
    {
      "question": "Find all horizontal asymptotes of f(x) = (3x²+2)/(x²-1).",
      "options": [
        "y=0",
        "y=3",
        "y=3 and y=-3",
        "There are no horizontal asymptotes."
      ],
      "answer": "y=3",
      "explanation": "To find horizontal asymptotes, we evaluate the limit as x→∞ and x→-∞. Since the degrees of the numerator and denominator are the same, the limit is the ratio of the leading coefficients, which is 3/1 = 3. So, y=3 is the horizontal asymptote in both directions."
    },
    {
      "question": "What is the derivative of y = x/ln(x)?",
      "options": [
        "1/ln(x) - 1/ln(x)²",
        "(ln(x) - 1) / (ln(x))²",
        "1 / (1/x)",
        "(1 - ln(x)) / (ln(x))²"
      ],
      "answer": "(ln(x) - 1) / (ln(x))²",
      "explanation": "Use the quotient rule: (u'v - uv')/v². Let u=x, v=ln(x). u'=1, v'=1/x. The derivative is (1*ln(x) - x*(1/x)) / (ln(x))² = (ln(x) - 1) / (ln(x))²."
    },
    {
      "question": "If f(x) = 2x-1 and g(x)=x², find (g ◦ f)(3).",
      "options": [
        "17",
        "25",
        "18",
        "5"
      ],
      "answer": "25",
      "explanation": "First, find f(3) = 2(3)-1 = 5. Then, find g(f(3)) = g(5) = 5² = 25."
    },
    {
      "question": "A limit that approaches infinity (or negative infinity) is technically a limit that...",
      "options": [
        "Exists and is very large.",
        "Exists and is a real number.",
        "Does not exist.",
        "Is undefined."
      ],
      "answer": "Does not exist.",
      "explanation": "A limit must approach a specific, finite real number to exist. Stating that a limit is ∞ or -∞ is a way of describing *why* the limit does not exist (because the function grows or decreases without bound)."
    },
    {
      "question": "Find the limit: lim (x→-∞) (3x+1)/(√4x²+x).",
      "options": [
        "3/2",
        "3/4",
        "-3/2",
        "Does not exist"
      ],
      "answer": "-3/2",
      "explanation": "For x→-∞, x is negative. Dominant term on top is 3x. Dominant term on bottom is √4x² = |2x| = -2x (since x is negative). The limit of 3x/(-2x) is -3/2."
    },
    {
      "question": "If f is an odd function and g is an even function, what is the composite function f(g(x))?",
      "options": [
        "Odd",
        "Even",
        "Neither",
        "Cannot be determined"
      ],
      "answer": "Even",
      "explanation": "Let h(x) = f(g(x)). Then h(-x) = f(g(-x)). Since g is even, g(-x)=g(x). So h(-x) = f(g(x)) = h(x). Since h(-x)=h(x), the composite function is even."
    },
    {
      "question": "The process of finding the function when its derivative is known is called:",
      "options": [
        "Differentiation",
        "Integration (or antidifferentiation)",
        "Limit evaluation",
        "Optimization"
      ],
      "answer": "Integration (or antidifferentiation)",
      "explanation": "Integration is the inverse process of differentiation. It involves finding the antiderivative of a function."
    },
    {
      "question": "What is the value of lim (x→-∞) arctan(x)?",
      "options": [
        "0",
        "-π/2",
        "-π",
        "-∞"
      ],
      "answer": "-π/2",
      "explanation": "The graph of arctan(x) has a horizontal asymptote at y = -π/2 as x approaches negative infinity."
    },
    {
      "question": "Find the limit: lim (x→π) sin(x)/(x-π).",
      "options": [
        "1",
        "-1",
        "0",
        "π"
      ],
      "answer": "-1",
      "explanation": "This is a 0/0 form. Apply L'Hôpital's Rule: lim (cos(x))/1 = cos(π) = -1."
    },
    {
      "question": "Rolle's Theorem is a special case of which other theorem?",
      "options": [
        "Intermediate Value Theorem",
        "Extreme Value Theorem",
        "Mean Value Theorem",
        "Squeeze Theorem"
      ],
      "answer": "Mean Value Theorem",
      "explanation": "Rolle's Theorem states that if a differentiable function has equal values at two points (f(a)=f(b)), then there must be a point between them where the derivative is zero. This is the Mean Value Theorem where the average rate of change is zero."
    },
    {
      "question": "Find all vertical asymptotes of f(x) = (x+2)/(x²-4).",
      "options": [
        "x=2",
        "x=-2",
        "x=2 and x=-2",
        "There are no vertical asymptotes"
      ],
      "answer": "x=2",
      "explanation": "First, simplify the function: f(x) = (x+2)/((x-2)(x+2)) = 1/(x-2) for x≠-2. The factor (x+2) cancels, creating a hole at x=-2. The factor (x-2) remains in the denominator, creating a vertical asymptote at x=2."
    },
    {
      "question": "The derivative of a function at a point gives the:",
      "options": [
        "Area under the curve at that point.",
        "Value of the function at that point.",
        "Slope of the tangent line at that point.",
        "Location of a discontinuity."
      ],
      "answer": "Slope of the tangent line at that point.",
      "explanation": "The geometric interpretation of the derivative f'(c) is the slope of the line tangent to the graph of y=f(x) at the point (c, f(c))."
    },
    {
      "question": "If f(x) = |x-3|, f'(2) is equal to:",
      "options": [
        "1",
        "-1",
        "0",
        "Does not exist"
      ],
      "answer": "-1",
      "explanation": "For x<3, the function |x-3| is equivalent to -(x-3) or 3-x. The derivative of 3-x is -1. Since x=2 is in this interval, the derivative is -1."
    },
    {
      "question": "If a car's velocity is v(t) = 3t² + 2t, what is its acceleration at t=1?",
      "options": [
        "5",
        "6",
        "8",
        "3"
      ],
      "answer": "8",
      "explanation": "Acceleration is the derivative of velocity. a(t) = v'(t) = 6t + 2. At t=1, the acceleration is a(1) = 6(1) + 2 = 8."
    },
    {
      "question": "The graph of an even function is symmetric with respect to:",
      "options": [
        "The origin",
        "The x-axis",
        "The y-axis",
        "The line y=x"
      ],
      "answer": "The y-axis",
      "explanation": "The condition for an even function, f(-x)=f(x), means that for every point (x,y) on the graph, the point (-x,y) is also on the graph, which defines y-axis symmetry."
    },
    {
      "question": "The graph of an odd function is symmetric with respect to:",
      "options": [
        "The origin",
        "The x-axis",
        "The y-axis",
        "The line y=x"
      ],
      "answer": "The origin",
      "explanation": "The condition for an odd function, f(-x)=-f(x), means that for every point (x,y) on the graph, the point (-x,-y) is also on the graph, which defines rotational symmetry about the origin."
    },
    {
      "question": "Find the limit: lim (x→∞) (sin(x))/x.",
      "options": [
        "1",
        "-1",
        "0",
        "Does not exist"
      ],
      "answer": "0",
      "explanation": "This can be solved using the Squeeze Theorem. We know -1 ≤ sin(x) ≤ 1. For x>0, we can divide by x: -1/x ≤ sin(x)/x ≤ 1/x. As x→∞, both -1/x and 1/x approach 0. Therefore, by the Squeeze Theorem, the limit of sin(x)/x must also be 0."
    },
    {
      "question": "If f(x) = 1/(x-1) and g(x) = x+1, what is the domain of (f ◦ g)(x)?",
      "options": [
        "All real numbers",
        "x ≠ 1",
        "x ≠ -1",
        "x ≠ 0"
      ],
      "answer": "x ≠ 0",
      "explanation": "(f ◦ g)(x) = f(g(x)) = f(x+1) = 1/((x+1)-1) = 1/x. The domain of this composite function is all real numbers except where the denominator is zero, which is x=0."
    },
    {
      "question": "Find the maximum value of f(x) = 1 - (x-2)² on the interval [0, 5].",
      "options": [
        "1",
        "-3",
        "-8",
        "2"
      ],
      "answer": "1",
      "explanation": "Find critical points: f'(x) = -2(x-2) = 0 => x=2. Now check the critical point and endpoints. f(0)=1-4=-3. f(2)=1-0=1. f(5)=1-9=-8. The largest value is 1."
    }
  ]
};