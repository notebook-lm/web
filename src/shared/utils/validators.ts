import { z } from "zod";

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, "Display name must contain at least 2 characters.")
  .max(100, "Display name must contain at most 100 characters.");

export const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(72, "Password must contain at most 72 characters.");

export const requiredPasswordSchema = z.string().min(1, "Password is required.");

export const signInSchema = z.object({
  email: emailSchema,
  password: requiredPasswordSchema,
});

export const signUpSchema = z
  .object({
    displayName: displayNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const projectTitleSchema = z
  .string()
  .trim()
  .min(1, "Project title is required.")
  .max(150, "Project title must contain at most 150 characters.");

export const projectSchema = z.object({
  title: projectTitleSchema,
  description: z
    .string()
    .trim()
    .max(2000, "Description must contain at most 2,000 characters."),
});

export const updateProfileSchema = z.object({ displayName: displayNameSchema });

export const changeEmailSchema = z.object({
  email: emailSchema,
  currentPassword: requiredPasswordSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: requiredPasswordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      path: ["confirmPassword"],
      message: "New passwords do not match.",
    },
  );

export const deleteAccountSchema = z.object({
  currentPassword: requiredPasswordSchema,
});

export type SignInValues = z.infer<typeof signInSchema>;

export type SignUpValues = z.infer<typeof signUpSchema>;

export type ProjectValues = z.infer<typeof projectSchema>;

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>;

export const documentTitleSchema = z
  .string()
  .trim()
  .min(1, "Document title is required.")
  .max(255, "Document title must contain at most 255 characters.");

export type DocumentTitleValues = z.infer<typeof documentTitleSchema>;
