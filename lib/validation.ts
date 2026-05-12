import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." })
});

export const signUpSchema = authSchema.extend({
  confirmPassword: z.string().min(8, { message: "Please confirm your password." })
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match."
    });
  }
});

export const consultationSchema = z.object({
  skin_concern: z.string().min(3, { message: "Please describe your skin concern." }),
  description: z.string().min(15, { message: "Please provide more detail about your skin issue." })
});

export const profileSchema = z.object({
  skinType: z.enum(["oily", "dry", "combination", "sensitive", "normal"]),
  concerns: z.array(z.string()).min(1, { message: "Please select at least one skin concern." }),
  allergies: z.array(z.string()).optional().default([])
});

export type AuthSchema = z.infer<typeof authSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type ConsultationSchema = z.infer<typeof consultationSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
