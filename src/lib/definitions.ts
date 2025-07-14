export interface RegisterState {
  message: string | null;
  issues?: { [key: string]: string[] | undefined };
  user?: { id: string; name: string; email: string; };
  error?: string;
}
