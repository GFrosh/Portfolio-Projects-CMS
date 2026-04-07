import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, isReady, isAuthenticating, error: authError, signIn, signUp, signOut } = useAuth();

  if (!isReady) {
    return (
      <main className="min-h-screen flex items-center justify-center text-slate-300 bg-slate-950">
        Loading authentication...
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage
              mode="signin"
              isSubmitting={isAuthenticating}
              error={authError}
              onSignIn={signIn}
              onSignUp={signUp}
            />
          )
        }
      />

      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage
              mode="signup"
              isSubmitting={isAuthenticating}
              error={authError}
              onSignIn={signIn}
              onSignUp={signUp}
            />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          user ? <DashboardPage user={user} signOut={signOut} /> : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
