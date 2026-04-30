'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { profiles as profilesApi, PaginatedResponse, Profile } from '@/lib/api-client';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      setError(null);
      setPage(1);

      // Use aligned API client - matches CLI: insighta profiles search "query"
      const response = await profilesApi.search(query, { page: 1, limit: 10 });

      if (response.status === 'success') {
        setResults(response.data || []);
        setTotalPages(response.total_pages || 0);
      } else {
        setError(response.message || 'Search failed');
      }
    } catch (err: any) {
      console.error('Error searching:', err);
      setError(err.message || 'Search failed');
      
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
      <h1>Search Profiles</h1>
      <p style={{ color: '#666' }}>
        Use natural language to search profiles (e.g., "male adults from Nigeria", "young females from Egypt")
      </p>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Enter natural language query..."
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
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading ? '#9ca3af' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

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

      {searched && (
        <>
          <div style={{ marginBottom: '1rem', color: '#666' }}>
            Found {results.length} results for "{query}"
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
          ) : (
            <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
              No profiles matched your search query.
            </div>
          )}
        </>
      )}
    </div>
  );
}
