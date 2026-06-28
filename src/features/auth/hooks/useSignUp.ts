import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../store/AuthContext';

const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function useSignUp() {
  const { signUp } = useAuth();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      const { error } = await signUp(data.email, data.password);
      if (error) form.setError('root', { message: error });
    },
    [signUp, form],
  );

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
