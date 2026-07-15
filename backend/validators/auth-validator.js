import { z } from "zod";

// Reusable fields
const emailField = z
  .string({ required_error: "Email is required" })
  .trim()
  .email({ message: "Invalid email address" })
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(50, { message: "Email must be at most 50 characters long" });

const passwordField = z
  .string({ required_error: "Password is required" })
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(20, { message: "Password must be at most 20 characters long" });

const usernameField = z
  .string({ required_error: "Username is required" })
  .trim()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(30, { message: "Username must be at most 30 characters long" });

const phoneField = z
  .string({ required_error: "Phone number is required" })
  .trim()
  .min(10, { message: "Phone number must be at least 10 characters long" })
  .max(11, { message: "Phone number must be at most 11 characters long" });

// Reusable objects
const emailSchema = {
  email: emailField,
};

const userSchema = {
  username: usernameField,
  phone: phoneField,
};

// Login Schema
export const loginSchema = z.object({
  ...emailSchema,
  password: passwordField,
});

// Signup Schema
export const signupSchema = z.object({
  ...emailSchema,
  ...userSchema,
  password: passwordField,
});

// Contact Schema
export const contactSchema = z.object({
  ...userSchema,
  ...emailSchema,

  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(4, { message: "Message must be at least 10 characters long" })
    .max(1000, { message: "Message must be less than 1000 characters long" }),

  company: z
    .string()
    .trim()
    .max(255, {
      message: "Company name must be less than 255 characters long",
    })
    .refine((value) => value === "" || value.length >= 2, {
      message: "Company name must be at least 2 characters long",
    })
    .optional(),
});