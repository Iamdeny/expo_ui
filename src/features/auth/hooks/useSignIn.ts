import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../store/AuthContext';

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function useSignIn() {
  const { signIn } = useAuth();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      const { error } = await signIn(data.email, data.password);
      if (error) form.setError('root', { message: error });
    },
    [signIn, form],
  );

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
