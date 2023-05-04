// src/utils/emailHelper.js
function randomEmail() {
  const randomNumber = Math.floor(Math.random() * 100000);
  return `test${randomNumber}@example.com`;
}

module.exports = {
  randomEmail,
};
