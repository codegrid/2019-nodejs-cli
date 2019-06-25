const fs = require('fs');
const path = require('path');

const writeFileRecursive = (filePath, fileData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileData, err => {
      if(err && err.code !== 'ENOENT') reject(err);
      if(err && err.code === 'ENOENT') {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFile(filePath, fileData, err => {
          if (err) reject(err);
        });
      }
      resolve();
    });
  });
};

module.exports = writeFileRecursive;
