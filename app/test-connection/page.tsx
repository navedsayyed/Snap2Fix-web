'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';

export default function TestConnectionPage() {
    const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
    const [message, setMessage] = useState('');
    const [tables, setTables] = useState<string[]>([]);

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        setStatus('checking');
        setMessage('Testing Supabase connection...');

        try {
            // Test 1: Check if supabase client is initialized
            if (!supabase) {
                throw new Error('Supabase client not initialized');
            }

            // Test 2: Try to fetch from complaints table
            const { data, error } = await supabase
                .from('complaints')
                .select('id')
                .limit(1);

            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }

            // Test 3: Check auth
            const { data: { session } } = await supabase.auth.getSession();

            setStatus('connected');
            setMessage('✅ Supabase connection successful!');
            setTables(['complaints', 'users']);

        } catch (err: any) {
            setStatus('error');
            setMessage(`❌ Connection failed: ${err.message}`);
            console.error('Connection test error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Supabase Connection Test
                </h1>

                <div className={`p-4 rounded-lg mb-6 ${
                    status === 'checking' ? 'bg-blue-50 border border-blue-200' :
                    status === 'connected' ? 'bg-green-50 border border-green-200' :
                    'bg-red-50 border border-red-200'
                }`}>
                    <div className="flex items-center gap-3">
                        {status === 'checking' && (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        )}
                        <p className={`text-lg font-medium ${
                            status === 'checking' ? 'text-blue-700' :
                            status === 'connected' ? 'text-green-700' :
                            'text-red-700'
                        }`}>
                            {message}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Configuration
                        </h2>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Supabase URL:</span>{' '}
                                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                                <span className="font-medium">API Key:</span>{' '}
                                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                                    '••••••••••••' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(-8) : 
                                    'Not configured'
                                }
                            </p>
                        </div>
                    </div>

                    {status === 'connected' && tables.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Available Tables
                            </h2>
                            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <ul className="space-y-1">
                                    {tables.map((table) => (
                                        <li key={table} className="text-sm text-gray-700">
                                            ✓ {table}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button onClick={testConnection}>
                            Test Again
                        </Button>
                        <a href="/">
                            <Button variant="secondary">
                                Back to Home
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
