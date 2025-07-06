'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    if (status === "loading") return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (status === "unauthenticated") return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <p className="text-slate-600">Redirecting to login...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 py-10">
                        <div className="text-center">
                            <div className="relative inline-block">
                                <img 
                                    src={session.user.image} 
                                    alt="Profile" 
                                    className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg"
                                />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <h1 className="mt-6 text-2xl font-bold text-slate-800">
                                Welcome back, {session.user.name}
                            </h1>
                            <p className="mt-2 text-slate-600">{session.user.email}</p>
                        </div>
                        
                        <div className="mt-8 space-y-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-slate-700 mb-2">Account Status</h3>
                                <div className="flex items-center text-sm text-green-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Active
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleSignOut}
                            className="mt-8 w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
