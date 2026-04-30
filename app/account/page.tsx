'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData?.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        // If authentication fails, redirect to login
        if (error.message.includes('401')) {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <div>Loading account information...</div>;

  return (
    <div>
      <h1>Account Settings</h1>

      {user ? (
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxWidth: '500px',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Username
            </label>
            <div style={{
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '4px',
              color: '#374151',
            }}>
              {user.username || 'N/A'}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Email
            </label>
            <div style={{
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '4px',
              color: '#374151',
            }}>
              {user.email || 'N/A'}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Role
            </label>
            <div style={{
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '4px',
              color: '#374151',
              textTransform: 'capitalize',
            }}>
              {user.role || 'N/A'}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Status
            </label>
            <div style={{
              padding: '0.75rem',
              background: user.is_active ? '#dcfce7' : '#fee2e2',
              borderRadius: '4px',
              color: user.is_active ? '#166534' : '#991b1b',
            }}>
              {user.is_active ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Member Since
            </label>
            <div style={{
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '4px',
              color: '#374151',
            }}>
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Last Login
            </label>
            <div style={{
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '4px',
              color: '#374151',
            }}>
              {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#fee2e2',
          padding: '1rem',
          borderRadius: '8px',
          color: '#991b1b',
        }}>
          Failed to load account information.
        </div>
      )}
    </div>
  );
}

async function getToken() {
  try {
    const response = await fetch('/api/auth/token');
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return null;
}
