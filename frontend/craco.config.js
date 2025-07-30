const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@common': path.resolve(__dirname, 'src/common'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    }
  }
};
