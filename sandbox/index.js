const { createContext, runInContext } = require('vm');

// Create a new sandbox context
const sandbox = createContext();

// Define the code to be executed within the sandbox
const code = `
  const x = 10;
  const y = 5;
  const sum = x + y;
  sum;
`;

// Run the code within the sandbox context
const result = runInContext(code, sandbox);

console.log(result); // Output: 15
