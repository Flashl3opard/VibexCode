"use client";

import { useEffect, useState } from "react";

type User = {
  $id: string;
  email: string;
  name: string;
  prefs: { status?: string };
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/dev/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const updateStatus = async (userId: string, newStatus: string) => {
    const res = await fetch(`/api/dev/users/${userId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      fetchUsers(); // Refresh UI
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border border-gray-300 rounded overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.$id} className="border-t border-gray-200">
              <td className="p-2">{user.name || "N/A"}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.prefs?.status === "banned"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.prefs?.status || "active"}
                </span>
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => updateStatus(user.$id, "active")}
                  className="text-green-600 underline"
                >
                  Activate
                </button>
                <button
                  onClick={() => updateStatus(user.$id, "banned")}
                  className="text-red-600 underline"
                >
                  Ban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
