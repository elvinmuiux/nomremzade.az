"use server";

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { RegisterState } from '@/lib/definitions';

const UserSchema = z.object({
  name: z.string().min(2, { message: "Ad ən azı 2 hərf olmalıdır" }),
  email: z.string().email({ message: "Düzgün email ünvanı daxil edin" }),
  phone: z.string().min(10, { message: "Telefon nömrəsi düzgün deyil" }),
  password: z.string().min(6, { message: "Şifrə ən azı 6 simvol olmalıdır" }),
});

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const validatedFields = UserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation error',
      issues: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { message: 'User exists', error: 'Bu e-poçt artıq istifadə olunur.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        isPremium: true, // All users are premium by default now
      },
    });

    return { message: 'Uğurlu qeydiyyat!', user: newUser };
  } catch {
    // Log the error for debugging purposes, without using the variable
    console.error('An unexpected error occurred during registration.');
    return { message: 'Server xətası: Qeydiyyat uğursuz oldu.', error: 'Qeydiyyat zamanı xəta baş verdi.' };
  }
}
