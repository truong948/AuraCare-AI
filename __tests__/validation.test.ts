import { authSchema, signUpSchema, consultationSchema } from "../lib/validation";

describe("Validation Schemas", () => {
  describe("authSchema", () => {
    it("should pass valid email and password", () => {
      const result = authSchema.safeParse({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail invalid email format", () => {
      const result = authSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Enter a valid email address.");
      }
    });

    it("should fail password less than 8 characters", () => {
      const result = authSchema.safeParse({
        email: "test@example.com",
        password: "short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password must be at least 8 characters.");
      }
    });
  });

  describe("signUpSchema", () => {
    it("should pass matching passwords and name", () => {
      const result = signUpSchema.safeParse({
        fullName: "Nguyen Van A",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail if passwords do not match", () => {
      const result = signUpSchema.safeParse({
        fullName: "Nguyen Van A",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "differentpassword",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match.");
      }
    });

    it("should fail if name is too short", () => {
      const result = signUpSchema.safeParse({
        fullName: "A",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Tên hiển thị phải có ít nhất 2 ký tự.");
      }
    });
  });

  describe("consultationSchema", () => {
    it("should pass valid consultation data", () => {
      const result = consultationSchema.safeParse({
        skin_concern: "Acne and redness",
        description: "I have been experiencing breakouts for the past month on my cheeks.",
      });
      expect(result.success).toBe(true);
    });

    it("should fail if skin concern is too short", () => {
      const result = consultationSchema.safeParse({
        skin_concern: "Ac",
        description: "I have been experiencing breakouts for the past month on my cheeks.",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if description is too short", () => {
      const result = consultationSchema.safeParse({
        skin_concern: "Acne and redness",
        description: "Too short",
      });
      expect(result.success).toBe(false);
    });
  });
});
