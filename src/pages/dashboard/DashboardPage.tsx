import { useEffect, useState } from 'react';
import { api, type PublicUser, type PublicPunishment } from '../../lib/api';
import { Card, CardBody, CardHeader, UsernameDisplay, ProfileCard } from '../../components/common';
import { Sidebar } from '../../components/layout';
import './DashboardPage.css';

function PunishmentCountdown({ endsAt, isPermanent }: { endsAt: Date; isPermanent: boolean }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      if (isPermanent) {
        setTimeLeft('Permanent');
        return;
      }

      const now = new Date().getTime();
      const end = endsAt.getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    update();
    const interval = setInterval(update, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endsAt, isPermanent]);

  return <span className="dashboard-page__countdown">{timeLeft}</span>;
}

export const DashboardPage = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [activeSuspension, setActiveSuspension] = useState<PublicPunishment | null>(null);
  const [activePage, setActivePage] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      try {
        const userData = await api.users.me();
        setUser(userData.user);
        setActiveSuspension(userData.activeSuspension);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
        console.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const isSuspended = activeSuspension !== null;

  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar activeTab={activePage} onChange={setActivePage} username={user?.username ?? '...'} />
        <main className="dashboard-main">
          <Card className="dashboard-page__card" elevated>
            <CardBody>
              <p>Loading dashboard...</p>
            </CardBody>
          </Card>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-layout">
        <Sidebar activeTab={activePage} onChange={setActivePage} username={'guest'} />
        <main className="dashboard-main">
          <Card className="dashboard-page__card" elevated>
            <CardBody>
              <p>Could not load user profile.</p>
            </CardBody>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activePage} onChange={setActivePage} username={user.username} role={user.role} country={user.country} />
      <main className="dashboard-main">
        {isSuspended ? (
          // Jail tab for suspended users
          <Card className="dashboard-page__card" elevated>
            <CardHeader>
              <h2>Account Suspended</h2>
              <p>You are currently under a suspension</p>
            </CardHeader>
            <CardBody>
              <div className="dashboard-page__punishment-info">
                <div className="dashboard-page__punishment-field">
                  <span className="dashboard-page__punishment-label">Reason:</span>
                  <span className="dashboard-page__punishment-value">{activeSuspension.reason}</span>
                </div>
                <div className="dashboard-page__punishment-field">
                  <span className="dashboard-page__punishment-label">Issued by:</span>
                  <span className="dashboard-page__punishment-value">{activeSuspension.issuedByUsername}</span>
                </div>
                <div className="dashboard-page__punishment-field">
                  <span className="dashboard-page__punishment-label">Issued at:</span>
                  <span className="dashboard-page__punishment-value">{activeSuspension.issuedAt.toLocaleString()}</span>
                </div>
                <div className="dashboard-page__punishment-field">
                  <span className="dashboard-page__punishment-label">
                    {new Date(activeSuspension.endsAt).getTime() - new Date().getTime() <= 0 ? 'Ended at:' : 'Ends at:'}
                  </span>
                  <span className="dashboard-page__punishment-value">
                    {activeSuspension.endsAt.toLocaleString()}
                  </span>
                </div>
                <div className="dashboard-page__punishment-field">
                  <span className="dashboard-page__punishment-label">Time remaining:</span>
                  <PunishmentCountdown
                    endsAt={activeSuspension.endsAt}
                    isPermanent={new Date(activeSuspension.endsAt).getTime() - new Date('2100-01-01').getTime() > -86400000}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            {activePage === 'overview' && (
              <Card className="dashboard-page__card" elevated>
                <CardHeader>
                  <h2>Dashboard</h2>
                  <p>Profile summary</p>
                </CardHeader>

                <CardBody>
                  <UsernameDisplay
                    username={user.username}
                    role={user.role}
                    country={user.country}
                    className="dashboard-page__user-row"
                  />
                  <p>Welcome to your dashboard!</p>
                </CardBody>
              </Card>
            )}

            {activePage === 'devices' && (
              <Card className="dashboard-page__card" elevated>
                <CardHeader>
                  <h2>Devices</h2>
                  <p>Ombr devices registered to your account</p>
                </CardHeader>
                <CardBody>
                  <p>No devices registered.</p>
                </CardBody>
              </Card>
            )}

            {activePage === 'data' && (
              <Card className="dashboard-page__card" elevated>
                <CardHeader>
                  <h2>Data</h2>
                  <p>Buy data</p>
                </CardHeader>
                <CardBody>
                  <p>No data available.</p>
                </CardBody>
              </Card>
            )}

            {activePage === 'credits' && (
              <Card className="dashboard-page__card" elevated>
                <CardHeader>
                  <h2>Credits</h2>
                  <p>Buy credits</p>
                </CardHeader>
                <CardBody>
                  <p>You cannot buy credits at this time.</p>
                </CardBody>
              </Card>
            )}

            {activePage === 'profile' && (
              <Card className="dashboard-page__card" elevated>
                <CardHeader>
                  <h2>Profile</h2>
                  <p>Your profile information</p>
                </CardHeader>
                <CardBody>
                  <ProfileCard
                    userUuid={user.uuid}
                    viewerUuid={user.uuid}
                    viewerRole={user.role}
                    canEditProfile
                  />
                </CardBody>
              </Card>
            )}

            {activePage === 'settings' && (
              <Card className="dashboard-page__card" elevated>
                <CardHeader>
                  <h2>Settings</h2>
                </CardHeader>
                <CardBody>
                  <p>Application settings go here.</p>
                </CardBody>
              </Card>
            )}

            {activePage === 'account-settings' && (
              <Card className="dashboard-page__card" elevated>
                <CardHeader>
                  <h2>Account Settings</h2>
                </CardHeader>
                <CardBody>
                  <p>Account-specific settings go here.</p>
                </CardBody>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};
