"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Trophy,
  Star,
  Target,
  Award,
  Calendar,
  Clock,
  Pencil,
  LucideIcon,
} from "lucide-react";
import authservice from "../appwrite/auth";
import EditProfileModal from "./EditProfileModal";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  location: string;
  phone: string;
  website: string;
  bio: string;
  profileImage?: string;
  stats: {
    rank: number;
    rating: number;
    streak: number;
    badges: number;
    level: string;
    completed: number;
    total: number;
    status: "online" | "offline";
    joinedDate: string;
  };
}

const ProfileSection = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    username: "Loading...",
    email: "Loading...",
    location: "New York, USA",
    phone: "+1 (555) 123-4567",
    website: "https://example.dev",
    bio: "Loading bio...",
    profileImage: "",
    stats: {
      rank: 42,
      rating: 1547,
      streak: 15,
      badges: 8,
      level: "Intermediate",
      completed: 7,
      total: 10,
      status: "online",
      joinedDate: "Jan 2024",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user from Appwrite
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const user = await authservice.checkUser();

        if (!user || !user.email || !user.name) throw new Error("Invalid user");

        const userData: UserProfile = {
          id: user.$id,
          username: user.name,
          email: user.email,
          location: "San Francisco, CA",
          phone: "+1 (555) 987-6543",
          website: "https://example.dev",
          bio: "Full-stack developer passionate about creating amazing user experiences",
          profileImage: "",
          stats: {
            rank: 42,
            rating: 1547,
            streak: 15,
            badges: 8,
            level: "Intermediate",
            completed: 7,
            total: 10,
            status: "online",
            joinedDate: "Jan 2024",
          },
        };

        setProfile(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setProfile((prev) => ({
          ...prev,
          username: "Guest",
          email: "guest@example.com",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async (updatedData: Partial<UserProfile>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update the profile with the new data
    const updatedProfile = { ...profile, ...updatedData };
    setProfile(updatedProfile);

    console.log("Profile updated:", updatedProfile);

    // Here you would typically make an API call to save to your backend
    // await authservice.updateProfile(updatedProfile);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const percent = (profile.stats.completed / profile.stats.total) * 100;

  return (
    <>
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6 space-y-6 flex flex-col">
        {/* Show loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center mb-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl overflow-hidden">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(profile.username)
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-zinc-800" />
              </div>
              <h4 className="text-lg font-semibold">{profile.username}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.email}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 text-center mt-1">
                {profile.bio}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 flex items-center gap-2 text-blue-600 hover:underline transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Trophy}
                label="Rank"
                value={`#${profile.stats.rank}`}
              />
              <StatCard
                icon={Star}
                label="Rating"
                value={profile.stats.rating}
              />
              <StatCard
                icon={Target}
                label="Streak"
                value={profile.stats.streak}
              />
              <StatCard
                icon={Award}
                label="Badges"
                value={profile.stats.badges}
              />
            </div>

            {/* Profile Info */}
            <div className="bg-gray-100 dark:bg-zinc-700 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Profile Info
              </h4>
              <div className="space-y-2 text-sm">
                <InfoRow label="Level" value={profile.stats.level} />
                <InfoRow
                  label="Completed"
                  value={`${profile.stats.completed}/${profile.stats.total} Questions`}
                />
                <InfoRow
                  label="Status"
                  value={
                    <span className="flex items-center gap-1 text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Online
                    </span>
                  }
                />
                <InfoRow label="Joined" value={profile.stats.joinedDate} />
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Progress
              </h4>
              <div className="w-full h-4 bg-gray-300 dark:bg-zinc-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                <span>{percent.toFixed(0)}% Completed</span>
                <span>
                  {profile.stats.total - profile.stats.completed} Remaining
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditing}
        profile={profile}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveProfile}
      />
    </>
  );
};

// Small component to render a stat card
const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) => (
  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3 text-white text-center">
    <Icon className="w-5 h-5 mx-auto mb-1" />
    <p className="text-xs font-medium">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

// InfoRow for profile stats
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between">
    <span className="text-gray-600 dark:text-gray-300">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default ProfileSection;
