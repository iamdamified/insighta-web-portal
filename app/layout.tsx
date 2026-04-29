'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/token');
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    router.push('/');
  };

  if (loading) {
    return (
      <html>
        <body style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div>Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html>
      <body style={{ padding: '0', margin: '0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <nav style={{
          background: '#1f2937',
          color: '#fff',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>Insighta Labs</a>
          </div>
          {isAuthenticated && (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</a>
              <a href="/profiles" style={{ color: '#fff', textDecoration: 'none' }}>Profiles</a>
              <a href="/search" style={{ color: '#fff', textDecoration: 'none' }}>Search</a>
              <a href="/account" style={{ color: '#fff', textDecoration: 'none' }}>Account</a>
              <button
                onClick={handleLogout}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
