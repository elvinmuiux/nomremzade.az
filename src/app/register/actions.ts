"use server";

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { RegisterState } from '@/lib/definitions';
import path from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';

// Define the User structure
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isPremium: boolean;
  createdAt: string;
}

const usersFilePath = path.join(process.cwd(), 'public', 'data', 'users.json');

// Helper to read users from the JSON file
async function getUsers(): Promise<User[]> {
  try {
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Helper to write users to the JSON file
async function saveUsers(users: User[]): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

const registerSchema = z.object({
  name: z.string().min(2, 'Ad ən azı 2 hərfdən ibarət olmalıdır.'),
  email: z.string().email('Düzgün e-poçt ünvanı daxil edin.'),
  phone: z.string().min(9, 'Telefon nömrəsi düzgün deyil.'),
  password: z.string().min(6, 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.'),
});

export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const validatedFields = registerSchema.safeParse({
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
    const users = await getUsers();
    
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return { message: 'User exists', error: 'Bu e-poçt artıq istifadə olunur.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      password: hashedPassword,
      isPremium: true, // All users are premium by default now
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await saveUsers(users);

    // Don't return the full user object to the client, especially not the password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userToReturn } = newUser;

    return { message: 'Uğurlu qeydiyyat!', user: userToReturn };
  } catch (error) {
    console.error('An unexpected error occurred during registration:', error);
    return { message: 'Server xətası: Qeydiyyat uğursuz oldu.', error: 'Qeydiyyat zamanı xəta baş verdi.' };
  }
}
