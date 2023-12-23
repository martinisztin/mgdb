// warnings.js
const fs = require('fs');

function initializeWarnings() {
    let warnings = {};
  
    try {
      const data = fs.readFileSync('./warnings.json', 'utf8');
      warnings = JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        fs.writeFileSync('./warnings.json', '{}', 'utf8');
      } else {
        console.error('Error loading warnings:', err);
      }
    }
  
    return warnings;
  }

module.exports = {initializeWarnings};