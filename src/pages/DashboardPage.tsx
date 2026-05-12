import { useEffect, useMemo, useState } from 'react';
import { IconCrown, IconTools } from '@tabler/icons-react';
import { api, type PublicUser, type ProfileCountriesResponse } from '../lib/api';
import { Button, Card, CardBody, CardHeader } from '../components/common';
import './DashboardPage.css';

function countryCodeToFlag(code?: string) {
  if (!code || code.length !== 2) return null;

  const upper = code.toUpperCase();
  const points = [...upper].map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...points);
}

function RoleIcon({ role }: { role: PublicUser['role'] }) {
  if (role === 'owner') {
    return <IconCrown size={18} stroke={2} aria-label="Owner" />;
  }

  if (role === 'staff') {
    return <IconTools size={18} stroke={2} aria-label="Staff" />;
  }

  return null;
}

export const DashboardPage = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [countries, setCountries] = useState<ProfileCountriesResponse['countries']>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [profile, countryData] = await Promise.all([
          api.profile.me(),
          api.profile.getCountries(),
        ]);

        setUser(profile.user);
        setSelectedCountry(profile.user.country ?? '');
        setCountries(countryData.countries);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const currentCountryName = useMemo(() => {
    if (!selectedCountry) return 'No country selected';
    const found = countries.find((country) => country.code === selectedCountry);
    return found?.name ?? selectedCountry;
  }, [countries, selectedCountry]);

  const isCountryChanged = user?.country !== selectedCountry;

  const handleSaveCountry = async () => {
    if (!selectedCountry) return;

    setIsSaving(true);
    setError(null);

    try {
      const updated = await api.profile.updateCountry({ country: selectedCountry });
      setUser(updated);
      setSelectedCountry(updated.country ?? selectedCountry);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update country';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <Card className="dashboard-page__card" elevated>
          <CardBody>
            <p>Loading dashboard...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-page">
        <Card className="dashboard-page__card" elevated>
          <CardBody>
            <p>Could not load user profile.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Card className="dashboard-page__card" elevated>
        <CardHeader>
          <h2>Dashboard</h2>
          <p>Profile summary</p>
        </CardHeader>

        <CardBody>
          <div className="dashboard-page__user-row">
            <span className="dashboard-page__role-icon">
              <RoleIcon role={user.role} />
            </span>
            <span className="dashboard-page__username">{user.username}</span>
            {countryCodeToFlag(user.country) && (
              <span className="dashboard-page__flag">{countryCodeToFlag(user.country)}</span>
            )}
          </div>

          <div className="dashboard-page__field">
            <label htmlFor="country-select">Country</label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
              disabled={isSaving}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <p className="dashboard-page__country-hint">
              {countryCodeToFlag(selectedCountry)
                ? `${countryCodeToFlag(selectedCountry)} ${currentCountryName}`
                : currentCountryName}
            </p>
          </div>

          {error && <p className="dashboard-page__error">{error}</p>}

          <Button
            onClick={handleSaveCountry}
            isLoading={isSaving}
            disabled={!selectedCountry || !isCountryChanged || isSaving}
          >
            Save Country
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
