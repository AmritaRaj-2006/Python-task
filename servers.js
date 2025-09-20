const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/debug', (req, res) => {
  const { code, errorMessage } = req.body;

  // Simple checks for common Python errors:
  let responseMessage = '';

  if (errorMessage) {
    responseMessage += `Original error message:\n${errorMessage}\n\n`;

    if (/SyntaxError.*missing ':'/.test(errorMessage) || /SyntaxError.*invalid syntax/.test(errorMessage)) {
      responseMessage += "Hint: Check if you missed a colon (:) after function definitions or control statements, or if indentation is correct.\n";
    }
    if (/TypeError.*unsupported operand type\(s\)/.test(errorMessage)) {
      responseMessage += "Hint: You may be trying to perform operations on incompatible types (e.g., adding an integer and a string). Try converting types appropriately.\n";
    }
  } else {
    responseMessage = "No error message provided.";
  }

  // Optionally, you could run the code safely here and add more feedback.

  res.json({
    response: responseMessage.trim()
  });
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
