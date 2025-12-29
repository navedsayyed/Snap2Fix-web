'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, signOut } from '@/lib/auth';
import { getUserComplaints } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ComplaintStatus } from '@/lib/types';

interface Complaint {
    id: string;
    issue_type: string;
    priority: string;
    status: ComplaintStatus;
    floor: string;
    room_number: string;
    description: string;
    created_at: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const currentUser = await getCurrentUser();
            
            if (!currentUser) {
                router.push('/login');
                return;
            }

            setUser(currentUser);

            // Load user's complaints
            const { data, error } = await getUserComplaints(currentUser.id);
            
            if (error) throw error;
            setComplaints(data || []);
        } catch (err: any) {
            console.error('Error loading user data:', err);
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign out');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
                        <p className="text-red-600 mb-6">{error}</p>
                        <Link href="/login">
                            <Button>Go to Login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-600 mt-1">Manage your complaints and account</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/">
                                <Button variant="secondary">Home</Button>
                            </Link>
                            <Button onClick={handleSignOut} variant="secondary">
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="text-lg font-medium text-gray-900">
                                {user?.user_metadata?.name || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="text-lg font-medium text-gray-900">
                                {new Date(user?.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Complaints</p>
                            <p className="text-lg font-medium text-gray-900">{complaints.length}</p>
                        </div>
                    </div>
                </div>

                {/* Complaints List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">My Complaints</h2>
                        <Link href="/submit">
                            <Button>Submit New Complaint</Button>
                        </Link>
                    </div>

                    {complaints.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">No complaints submitted yet</p>
                            <Link href="/submit">
                                <Button>Submit Your First Complaint</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {complaints.map((complaint) => (
                                <Link
                                    key={complaint.id}
                                    href={`/track/${complaint.id}`}
                                    className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {complaint.issue_type}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {complaint.floor} - Room {complaint.room_number}
                                            </p>
                                        </div>
                                        <StatusBadge status={complaint.status} />
                                    </div>
                                    <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                                        {complaint.description}
                                    </p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">
                                            {new Date(complaint.created_at).toLocaleDateString()}
                                        </span>
                                        <span className={`font-medium ${
                                            complaint.priority === 'High' ? 'text-red-600' :
                                            complaint.priority === 'Medium' ? 'text-orange-600' :
                                            'text-green-600'
                                        }`}>
                                            {complaint.priority} Priority
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
