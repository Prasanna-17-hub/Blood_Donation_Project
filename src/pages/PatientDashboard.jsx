import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMCP } from '../contexts/MCPContext';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Sparkles, MapPin, AlertCircle, Activity, CheckCircle } from 'lucide-react';

export default function PatientDashboard() {
    const { availableDonors, requestGeminiAnalysis, geminiAnalysis, broadcastRequest, myRequests, completeRequest } = useMCP();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        bloodGroup: '',
        urgency: 'Emergency'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await broadcastRequest(formData);
            alert("Request broadcasted successfully!");
            setShowForm(false);
        } catch (err) {
            alert("Failed to broadcast request: " + err.message);
        }
    };

    const handleContact = (requestId) => {
        navigate(`/chat/${requestId}`);
    };

    const handleComplete = async (requestId) => {
        if (window.confirm("Confirm that you received the blood donation? This will update the donor's impact score.")) {
            try {
                await completeRequest(requestId);
            } catch (err) {
                alert("Error: " + err);
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Hero Banner Section */}
            <div className="relative overflow-hidden rounded-[2rem] bg-navy-800 border border-navy-700 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/60 to-transparent z-10"></div>
                <img 
                    src="/blood.png" 
                    alt="Hero" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
                />
                
                <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-6 max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e60026]/10 border border-[#e60026]/20 text-[#e60026] text-[10px] font-black uppercase tracking-widest">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#e60026] animate-pulse"></span>
                            Emergency Terminal
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                            FIND <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e60026] to-red-500">LIFE-SAVING POWER</span>
                        </h1>
                        <p className="text-gray-400 font-medium">
                            Alert our elite network of active donors. Every second counts in our mission to sustain life.
                        </p>
                        <div className="pt-2">
                            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-red-600/20" onClick={() => setShowForm(!showForm)}>
                                {showForm ? 'Cancel Operation' : 'Initialize Request'}
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="p-4 bg-navy-900/50 backdrop-blur-xl border border-navy-700 rounded-3xl rotate-3 hover:rotate-0 transition-transform duration-500">
                             <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-[#e60026] to-red-600 flex items-center justify-center shadow-2xl">
                                <Activity className="h-24 w-24 text-white animate-pulse" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Form */}
            {showForm && (
                <Card className="bg-navy-800/50 backdrop-blur-xl border-[#e60026]/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#e60026]/5 blur-3xl rounded-full"></div>
                    <CardHeader className="border-b border-navy-700/50">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-[#e60026]" />
                            Operation Parameters
                        </h3>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Blood Group Target</label>
                                    <select
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        className="w-full bg-navy-900 border-navy-700 rounded-2xl p-4 text-white focus:border-[#e60026] transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Target Group...</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Urgency Level</label>
                                    <select
                                        value={formData.urgency}
                                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                        className="w-full bg-navy-900 border-navy-700 rounded-2xl p-4 text-white focus:border-[#e60026] transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="Emergency">EMERGENCY (IMMEDIATE)</option>
                                        <option value="Scheduled">SCHEDULED (UPCOMING)</option>
                                    </select>
                                </div>
                            </div>
                            <Button type="button" onClick={handleSubmit} className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-[#e60026]/20">
                                BROADCAST EMERGENCY SIGNAL
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* My Active Requests (Acknowledgement Loop) */}
            {myRequests && myRequests.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Activity className="h-6 w-6 text-[#e60026]" />
                        Active Requests
                    </h3>
                    {myRequests.map(req => (
                        <Card key={req.id} className={`border-l-4 ${req.status === 'accepted' ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10 dark:border-green-900/50' : 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/10 dark:border-l-amber-500/50'}`}>
                            <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
                                <div className="w-full sm:w-auto">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-gray-900 dark:text-white">{req.bloodGroup} Blood Needed</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${req.status === 'completed' ? 'bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' :
                                            req.status === 'ready_for_pickup' ? 'bg-purple-200 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300' :
                                                req.status === 'accepted' ? 'bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300' :
                                                    'bg-amber-200 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                                            }`}>
                                            {req.status === 'completed' && req.fulfillmentType === 'stock_supply' ? 'SUPPLIED BY BANK' :
                                                req.status === 'ready_for_pickup' ? 'READY FOR PICKUP' :
                                                    req.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {req.status === 'accepted' ? `Accepted by: ${req.donorName || 'Unknown Donor'}` :
                                            req.status === 'ready_for_pickup' ? 'Blood Reserved. Please visit bank with pickup code.' :
                                                req.status === 'completed' ? (req.fulfillmentType === 'stock_supply' ? 'Fulfilled directly by Blood Bank Stock.' : 'Donation cycle completed successfully.') :
                                                    'Waiting for donors...'}
                                    </p>

                                    {/* Pickup Code Display */}
                                    {req.status === 'ready_for_pickup' && req.pickupCode && (
                                        <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded border-2 border-dashed border-purple-300 text-center">
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Pickup Verification Code</p>
                                            <p className="text-4xl font-mono font-bold text-purple-600 tracking-widest">{req.pickupCode}</p>
                                            <p className="text-xs text-gray-400 mt-1">Show this code at the blood bank counter.</p>
                                        </div>
                                    )}

                                </div>
                                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                                    {(req.status === 'accepted' || req.status === 'ready_for_pickup') && (
                                        <>
                                            {req.status === 'accepted' && (
                                                <Button
                                                    size="sm"
                                                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleContact(req.id)}
                                                >
                                                    Contact
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 font-bold"
                                                onClick={() => handleComplete(req.id)}
                                            >
                                                {req.status === 'ready_for_pickup' ? 'Confirm Pickup' : 'Received'}
                                            </Button>
                                        </>
                                    )}
                                    {(req.status === 'completed' || req.status === 'ready_for_pickup') && (
                                        <div className="text-right w-full">
                                            <span className={`font-bold text-sm px-3 py-1 rounded-full flex items-center justify-center sm:justify-end gap-1 ${req.status === 'ready_for_pickup' ? 'text-purple-600 bg-purple-100' : 'text-green-600 bg-green-100'
                                                }`}>
                                                <CheckCircle className="h-3 w-3" />
                                                {req.status === 'ready_for_pickup' ? 'Reserved' : req.fulfillmentType === 'stock_supply' ? 'Stock Supplied' : 'Completed'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            {req.status === 'completed' && <div className="h-1 bg-green-500 w-full" />}
                        </Card>
                    ))}
                </div>
            )}

            {/* Gemini Analysis Context */}
            {geminiAnalysis && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm">Gemini Analysis</h4>
                        <p className="text-blue-800 dark:text-blue-300 text-sm">{geminiAnalysis}</p>
                    </div>
                </div>
            )}

            {/* Donors List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Matched Donors</h3>
                    <Button variant="ghost" size="sm" onClick={() => requestGeminiAnalysis({ donors: availableDonors })}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Best Match
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableDonors.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No active matched donors found nearby at the moment.</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try broadcasting a request to alert offline donors.</p>
                        </div>
                    ) : (
                        availableDonors.map(donor => (
                            <DonorCard key={donor.id} donor={donor} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function DonorCard({ donor }) {
    const { broadcastRequest } = useMCP();
    const donorName = donor.name || "Unknown Donor";
    const initial = donorName.charAt(0).toUpperCase();
    const distance = donor.distance ? `${donor.distance}` : "Unknown distance";
    const lastDonated = donor.lastDonated ? new Date(donor.lastDonated).toLocaleDateString() : "Never";

    const handleRequest = async () => {
        if (!window.confirm(`Send immediate request to ${donorName} for ${donor.bloodGroup} blood?`)) return;

        try {
            await broadcastRequest({
                bloodGroup: donor.bloodGroup,
                urgency: 'Emergency',
                specificDonorId: donor.id // Optional: could be used for highlighting
            });
            alert(`Request sent! ${donorName} has been notified.`);
        } catch (err) {
            alert("Failed to send request: " + err.message);
        }
    };

    return (
        <Card className="hover:border-red-200 dark:hover:border-red-900 transition-colors bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
            <div className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-500 dark:text-gray-300">
                    {initial}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">{donorName}</h4>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {distance} • Last: {lastDonated}
                    </div>
                </div>
                <div className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded">
                    {donor.bloodGroup || "??"}
                </div>
            </div>
            <div className="px-4 pb-4">
                <Button variant="secondary" size="sm" className="w-full text-xs" onClick={handleRequest}>Request</Button>
            </div>
        </Card>
    );
}
