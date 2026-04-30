'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, getCurrentUser } from '@/lib/api';

interface Stats {
  totalProfiles: number;
  recentProfiles: number;
  userRole: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info via our API route
        const userData = await getCurrentUser();
        setUser(userData?.data);

        // Fetch profile stats via proxy route (no need for manual token handling)
        const profilesData = await apiRequest('GET', '/api/profiles?page=1&limit=1');

        setStats({
          totalProfiles: profilesData.total || 0,
          recentProfiles: profilesData.data?.length || 0,
          userRole: userData?.data?.role || 'analyst',
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // If authentication fails, redirect to login
        if (error.message.includes('401')) {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div>Loading dashboard...</div>;

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
          <p style={{ color: '#666' }}>Role: {user.role}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
            {stats?.totalProfiles.toLocaleString() || 0}
          </div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Total Profiles</p>
        </div>

        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
            {stats?.recentProfiles || 0}
          </div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>On this page</p>
        </div>

        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
            {stats?.userRole === 'admin' ? 'Admin' : 'Analyst'}
          </div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Your Role</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Links</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/profiles" style={{
            background: '#2563eb',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
          }}>
            View Profiles
          </a>
          <a href="/search" style={{
            background: '#059669',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
          }}>
            Search
          </a>
        </div>
      </div>
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
