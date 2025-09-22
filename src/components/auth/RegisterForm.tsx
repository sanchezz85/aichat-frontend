import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { RegisterRequest } from '../../types';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    try {
      setIsLoading(true);
      setError('');
      const { email, username, password } = data;
      await registerUser({ email, username, password });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValue = watch('password');

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Create your account
        </h2>
        <p className="text-text-secondary">
          Join Nova and start chatting with AI personas
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          fullWidth
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Please enter a valid email address'
            }
          })}
        />

        <Input
          label="Username"
          type="text"
          fullWidth
          placeholder="Choose a username"
          error={errors.username?.message}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
            maxLength: { value: 20, message: 'Max 20 characters' }
          })}
        />

        <Input
          label="Password"
          type="password"
          fullWidth
          placeholder="Create a password"
          showPasswordToggle
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          fullWidth
          placeholder="Confirm your password"
          showPasswordToggle
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === passwordValue || 'Passwords do not match'
          })}
        />

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className="mt-6"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-text-secondary">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-brand-400 hover:text-brand-300 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;


