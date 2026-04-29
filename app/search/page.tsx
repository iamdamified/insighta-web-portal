'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setSearched(true);

      const token = await getToken();
      if (!token) {
        router.push('/');
        return;
      }

      const data = await apiRequest('GET', `/api/profiles/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setResults(data.data || []);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Profiles</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Enter natural language query (e.g., 'male adults from Nigeria')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Search
          </button>
        </div>
      </form>

      {loading && <div>Searching...</div>}

      {searched && (
        <>
          <div style={{ marginBottom: '1rem', color: '#666' }}>
            Found {results.length} results
          </div>

          {results.length > 0 ? (
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
                  {results.map((profile) => (
                    <tr key={profile.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>
                        <a href={`/profiles/${profile.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                          {profile.name}
                        </a>
                      </td>
                      <td style={{ padding: '1rem' }}>{profile.gender} ({(profile.gender_probability * 100).toFixed(0)}%)</td>
                      <td style={{ padding: '1rem' }}>{profile.age} ({profile.age_group})</td>
                      <td style={{ padding: '1rem' }}>{profile.country_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              background: '#f9fafb',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#666',
            }}>
              No profiles found. Try a different search query.
            </div>
          )}
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
