import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Welcome Back
        </h2>
        <p className="text-text-secondary">
          Sign in to continue your conversations
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
          label="Password"
          type="password"
          fullWidth
          placeholder="Enter your password"
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

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className="mt-6"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text-secondary">
          Demo credentials: demo@example.com / demo123
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-text-secondary">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-brand-400 hover:text-brand-300 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

