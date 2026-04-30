'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, profiles as profilesApi, User } from '@/lib/api-client';

interface Stats {
  totalProfiles: number;
  userRole: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user - matches CLI: insighta whoami
        const userResponse = await auth.me();
        if (userResponse.status === 'success') {
          setUser(userResponse.data as User);
        }

        // Fetch profile stats using aligned API client
        const profilesResponse = await profilesApi.list({ page: 1, limit: 1 });

        setStats({
          totalProfiles: profilesResponse.total || 0,
          userRole: userResponse.data?.role || 'analyst',
        });
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard');
        
        // If session expired, redirect to login
        if (err.status === 401 || err.message?.includes('Session expired')) {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div>Loading dashboard...</div>;

  if (error) {
    return (
      <div style={{
        background: '#fee2e2',
        color: '#991b1b',
        padding: '1rem',
        borderRadius: '8px',
      }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      
      {user && (
        <div style={{
          background: '#f3f4f6',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}>
          <p><strong>Welcome, {user.username}!</strong></p>
          <p style={{ color: '#666' }}>Email: {user.email || 'N/A'}</p>
          <p style={{ color: '#666' }}>Role: <span style={{ fontWeight: 'bold', color: user.role === 'admin' ? '#dc2626' : '#059669' }}>{user.role}</span></p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
            {stats?.totalProfiles.toLocaleString() || 0}
          </div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Total Profiles in System</p>
        </div>

        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: user?.role === 'admin' ? '#dc2626' : '#059669' }}>
            {user?.role === 'admin' ? 'Admin' : 'Analyst'}
          </div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Your Role</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Navigation</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/profiles" style={{
            background: '#2563eb',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
          }}>
            📋 List Profiles
          </a>
          <a href="/search" style={{
            background: '#059669',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
          }}>
            🔍 Search Profiles
          </a>
          {user?.role === 'admin' && (
            <a href="/account" style={{
              background: '#dc2626',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
            }}>
              ⚙️ Admin Settings
            </a>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', color: '#0c4a6e' }}>
        <p><strong>ℹ️ Stage 3 API Alignment:</strong></p>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>✅ GitHub OAuth with PKCE authentication</li>
          <li>✅ Role-Based Access Control (RBAC)</li>
          <li>✅ Automatic token refresh on 401</li>
          <li>✅ Consistent API response format with backend</li>
          <li>✅ API version header (X-API-Version: 1)</li>
        </ul>
      </div>
    </div>
  );
}
