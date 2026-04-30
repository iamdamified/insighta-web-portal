'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profiles as profilesApi, PaginatedResponse, Profile } from '@/lib/api-client';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ 
    gender: '', 
    country_id: '', 
    age_group: '' 
  });
  const router = useRouter();

  useEffect(() => {
    fetchProfiles();
  }, [page, filters]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use aligned API client with filters matching CLI/backend
      const response = await profilesApi.list({
        page,
        limit: 10,
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.country_id && { country: filters.country_id }),
        ...(filters.age_group && { age_group: filters.age_group }),
      });

      if (response.status === 'success') {
        setProfiles(response.data || []);
        setTotal(response.total || 0);
        setTotalPages(response.total_pages || 0);
      } else {
        setError(response.message || 'Failed to load profiles');
      }
    } catch (err: any) {
      console.error('Error fetching profiles:', err);
      setError(err.message || 'Failed to load profiles');
      
      // If session expired, redirect to login
      if (err.status === 401 || err.message?.includes('Session expired')) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Profiles</h1>

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      <div style={{
        background: '#f9fafb',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
      }}>
        <input
          type="text"
          placeholder="Filter by gender (male/female)"
          value={filters.gender}
          onChange={(e) => { setFilters({ ...filters, gender: e.target.value }); setPage(1); }}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          placeholder="Filter by country code (e.g., NG)"
          value={filters.country_id}
          onChange={(e) => { setFilters({ ...filters, country_id: e.target.value }); setPage(1); }}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          placeholder="Filter by age group"
          value={filters.age_group}
          onChange={(e) => { setFilters({ ...filters, age_group: e.target.value }); setPage(1); }}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>

      {loading ? (
        <div>Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div style={{ color: '#666' }}>No profiles found. Try adjusting your filters.</div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: '#666' }}>
            Showing {profiles.length} of {total} profiles (Page {page}/{totalPages})
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f3f4f6' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Gender</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Age</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Country</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>
                      <a href={`/profiles/${profile.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                        {profile.name}
                      </a>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {profile.gender} ({(profile.gender_probability * 100).toFixed(0)}%)
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {profile.age} ({profile.age_group})
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {profile.country_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                background: page === 1 ? '#f3f4f6' : '#fff',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={{ alignSelf: 'center', color: '#666' }}>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                background: page === totalPages ? '#f3f4f6' : '#fff',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </>
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
