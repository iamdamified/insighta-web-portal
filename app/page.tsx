'use client';

import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();

  const handleGitHubLogin = async () => {
    try {
      // Get OAuth URL from backend (handles PKCE automatically)
      const response = await fetch(`${API_URL}/auth/github`, {
        method: 'GET',
        redirect: 'manual', // Don't follow redirect automatically
      });

      // Backend returns 302 redirect to GitHub
      if (response.status === 302 || response.status === 307) {
        const redirectUrl = response.headers.get('location');
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
      }

      alert('Failed to start GitHub login. Please try again.');
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to start GitHub login. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        margin: '0 auto',
      }}>
        <h1 style={{ marginTop: '0' }}>Insighta Labs</h1>
        <p style={{ color: '#666' }}>Profile Intelligence Query Engine</p>
        
        <button
          onClick={handleGitHubLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Continue with GitHub
        </button>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#999' }}>
          Secure login with GitHub OAuth. Your data is protected.
        </p>
      </div>
    </div>
  );
}
