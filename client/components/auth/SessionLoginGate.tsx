import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionAuth } from '../../contexts/SessionAuthContext';

interface SessionLoginGateProps {
  children: React.ReactNode;
}

export function SessionLoginGate({ children }: SessionLoginGateProps) {
  const navigate = useNavigate();
  const { isSessionActive, isLoading } = useSessionAuth();

  React.useEffect(() => {
    if (!isLoading && !isSessionActive) {
      navigate('/admin/login');
    }
  }, [isSessionActive, isLoading, navigate]);

  // While loading, don't render anything
  if (isLoading) {
    return null;
  }

  // If not authenticated, don't render content (redirect happens above)
  if (!isSessionActive) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
