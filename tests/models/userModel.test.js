// tests/models/userModel.test.js

const User = require("../../src/models/userModel");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../../src/utils/passwordUtils");

describe("User model", () => {
  const testEmail = "test@example.com";
  const testPassword = "testpassword";
  const testUserId = "123";
  const testCompanyId = "456";

  it("should save a new user", async () => {
    const user = new User(testEmail, testPassword, testUserId, testCompanyId);

    await user.save();

    const savedUser = await User.get(testEmail);

    expect(savedUser.email).toBe(testEmail);
    expect(savedUser.userId).toBe(testUserId);
    expect(savedUser.companyId).toBe(testCompanyId);
    expect(await bcrypt.compare(testPassword, savedUser.password)).toBe(true);
  });

  it("should validate the password", async () => {
    const user = new User(testEmail, testPassword, testUserId, testCompanyId);

    await user.save(); // Let the save method handle hashing the password
    const savedUser = await User.get(testEmail);

    const isPasswordValid = await savedUser.validatePassword(testPassword);

    expect(isPasswordValid).toBe(true);
  });

  it("should not validate the incorrect password", async () => {
    const user = new User(testEmail, testPassword, testUserId, testCompanyId);

    const hashedPassword = await hashPassword(testPassword);
    user.password = hashedPassword;

    await user.save();
    const savedUser = await User.get(testEmail, "+password");
    const isPasswordValid = await bcrypt.compare(
      "wrongpassword",
      savedUser.password
    );

    expect(isPasswordValid).toBe(false);
  });
});
