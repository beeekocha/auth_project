import { useEffect, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { api } from "@/lib/axios";
import { User } from "@/features/auth/types";

const WelcomePage: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const response = await api.get<User>("/user/profile");
        setProfile(response.data);
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center my-5 space-y-4">
          {error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <Alert variant="info">
              This is a protected page, you can only see this when you're logged
              in.
            </Alert>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Welcome to the application.
          </h1>
        </div>

        <div className="mt-12 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="border-b border-gray-200 pb-5">
              <h2 className="text-lg font-medium text-gray-900">
                Account Information
              </h2>
            </div>

            {profile ? (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                No profile data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
