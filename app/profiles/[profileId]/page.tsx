'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';

interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

export default function ProfileDetailPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const profileId = params?.profileId as string;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;

      try {
        const token = await getToken();
        if (!token) {
          router.push('/');
          return;
        }

        const data = await apiRequest('GET', `/api/profiles/${profileId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        setProfile(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, router]);

  if (loading) return <div>Loading profile...</div>;

  if (!profile) {
    return (
      <div>
        <h1>Profile Not Found</h1>
        <a href="/profiles" style={{ color: '#2563eb', textDecoration: 'none' }}>
          Back to profiles
        </a>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <a href="/profiles" style={{ color: '#2563eb', textDecoration: 'none' }}>
          ← Back to profiles
        </a>
      </div>

      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ marginTop: '0', textTransform: 'capitalize' }}>{profile.name}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Gender
            </label>
            <div style={{ color: '#374151' }}>
              {profile.gender} ({(profile.gender_probability * 100).toFixed(1)}% confident)
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Age
            </label>
            <div style={{ color: '#374151' }}>
              {profile.age} years old ({profile.age_group})
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Country
            </label>
            <div style={{ color: '#374151' }}>
              {profile.country_name} {profile.country_id} ({(profile.country_probability * 100).toFixed(1)}% confident)
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              ID
            </label>
            <div style={{ color: '#374151', fontSize: '0.875rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {profile.id}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Created
            </label>
            <div style={{ color: '#374151' }}>
              {new Date(profile.created_at).toLocaleString()}
            </div>
          </div>
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
