import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { Card } from '../components/Card';
import { Search, Calendar, Ruler } from 'lucide-react';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, [currentUser]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Find all donors
            const q = query(collection(db, "users"), where('role', '==', 'donor'));
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.displayName || user.name || user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-950 p-6 text-gray-100">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Donor Management</h1>
                        <p className="text-gray-400">View and manage the blood donor network</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border-gray-800 text-white placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-red-500 outline-none focus:border-red-500 transition-colors"
                        placeholder="Search donors by name, email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* List */}
                <div className="grid gap-4">
                    {loading ? (
                        <p className="text-center text-gray-500 py-10">Loading donors...</p>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No donors found matching criteria.</p>
                    ) : (
                        filteredUsers.map(user => (
                            <Card key={user.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow bg-gray-900 border-gray-800">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold flex-none bg-red-900/30 text-red-400">
                                        {user.bloodGroup || '?'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-lg">{user.displayName || user.name || "Unknown Name"}</h3>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">{user.email}</p>

                                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                            <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                                                <Calendar className="h-3.5 w-3.5" /> Age: <span className="font-semibold text-gray-300">{user.age || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                                                <Ruler className="h-3.5 w-3.5" /> Weight: <span className="font-semibold text-gray-300">{user.weight || 'N/A'}kg</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                                                <span className="text-xs">💬</span> {user.whatsappNumber || 'No WhatsApp'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block">Lives Saved</span>
                                    <span className="text-lg font-bold text-white">
                                        {user.livesSaved || 0}
                                    </span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
