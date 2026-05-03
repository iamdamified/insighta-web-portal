'use client';

import { useRouter } from 'next/navigation';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();

  const handleGitHubLogin = () => {
    // Redirect to backend OAuth endpoint which handles PKCE and returns redirect to GitHub
    // Browser will automatically follow the redirect
    window.location.href = `${backendUrl}/auth/github`;
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
