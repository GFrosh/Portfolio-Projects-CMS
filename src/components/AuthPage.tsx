import { useNavigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import type { AuthCredentials, AuthSignUpData } from '../types/auth';

interface AuthPageProps {
  mode: 'signin' | 'signup';
  isSubmitting: boolean;
  error: string | null;
  onSignIn: (credentials: AuthCredentials) => Promise<boolean>;
  onSignUp: (data: AuthSignUpData) => Promise<boolean>;
}

export default function AuthPage({ mode, isSubmitting, error, onSignIn, onSignUp }: AuthPageProps) {
  const navigate = useNavigate();

  return (
    <LoginScreen
      initialMode={mode}
      isSubmitting={isSubmitting}
      error={error}
      onSignIn={async (credentials) => {
        const ok = await onSignIn(credentials);
        if (ok) navigate('/dashboard', { replace: true });
      }}
      onSignUp={async (data) => {
        const ok = await onSignUp(data);
        if (ok) navigate('/dashboard', { replace: true });
      }}
    />
  );
}
