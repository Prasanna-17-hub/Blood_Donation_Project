import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMCP } from '../contexts/MCPContext';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Switch } from '@headlessui/react';
import { MapPin, Bell, Clock, CheckCircle, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateDonationEligibility, canDonate } from '../lib/utils';
import CountdownTimer from '../components/CountdownTimer';
import { DonorDeclarationModal } from '../components/DonorDeclarationModal';

export default function DonorDashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { activeRequests, toggleDonorAvailability } = useMCP();
    const [isAvailable, setIsAvailable] = useState(currentUser?.isAvailable || false);
    const [showDeclaration, setShowDeclaration] = useState(false);
    const [pendingAvailability, setPendingAvailability] = useState(null); // specific target state

    const { eligible, message, percentage, daysRemaining, nextDate } = calculateDonationEligibility(currentUser?.lastDonated, currentUser?.gender);

    // Auto-activate availability if eligible (Logic kept, but requires manual re-verification effectively if session resets)
    useEffect(() => {
        const autoActivate = async () => {
            if (eligible && !isAvailable && currentUser?.isAvailable) {
                // If DB says available, sync local state
                setIsAvailable(true);
            }
        };
        autoActivate();
    }, [eligible, currentUser]);


    const handleToggle = async (val) => {
        if (!eligible && val) {
            alert(message);
            return;
        }


        if (val === true) {
            // Turning ON: Require Declaration
            setPendingAvailability(true);
            setShowDeclaration(true);
        } else {
            // Turning OFF: No declaration needed
            setIsAvailable(false);
            try {
                await toggleDonorAvailability(false);
            } catch (error) {
                console.error("Failed to update availability", error);
                setIsAvailable(true);
            }
        }
    };

    const handleDeclarationConfirm = async () => {
        setShowDeclaration(false);
        if (pendingAvailability) {
            setIsAvailable(true);
            try {
                await toggleDonorAvailability(true);
                // setPendingAvailability(null); // Cleanup
            } catch (error) {
                console.error("Failed to update availability", error);
                setIsAvailable(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <DonorDeclarationModal
                isOpen={showDeclaration}
                onClose={() => { setShowDeclaration(false); setPendingAvailability(null); }}
                onConfirm={handleDeclarationConfirm}
            />

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
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e60026]/10 border border-[#e60026]/20 text-[#e60026] text-[10px] font-black uppercase tracking-widest"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#e60026] animate-pulse"></span>
                            Live Terminal
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                            DONATE <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e60026] to-red-500">YOUR BLOOD</span>
                        </h1>
                        <p className="text-gray-400 font-medium">
                            Join the elite network of donors saving lives across the region. Your contribution is our core strength.
                        </p>
                        <div className="pt-2">
                            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-red-600/20" onClick={() => navigate('/profile')}>
                                View Your Impact
                            </Button>
                        </div>
                    </div>

                    <div className="relative w-full max-w-sm">
                        <Card className="p-6 bg-navy-900/80 backdrop-blur-xl border-navy-700 shadow-2xl relative z-10 transition-transform hover:-translate-y-2 duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Status</h2>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${!eligible ? 'text-amber-500' : 'text-gray-500'}`}>
                                        {!eligible ? "Recovery Active" : "Operational"}
                                    </p>
                                </div>
                                <div className="p-3 bg-[#e60026]/10 rounded-2xl border border-[#e60026]/20">
                                    <HeartPulse className="h-6 w-6 text-[#e60026]" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-navy-800 rounded-2xl border border-navy-700">
                                <span className={`text-sm font-black uppercase tracking-tighter ${!eligible ? 'text-amber-500' : (isAvailable ? 'text-[#e60026]' : 'text-gray-500')}`}>
                                    {!eligible ? <CountdownTimer targetDate={nextDate} /> : (isAvailable ? 'Broadcasting' : 'Standby')}
                                </span>

                                <div className={!eligible ? "opacity-50 cursor-not-allowed" : ""}>
                                    <Switch
                                        checked={isAvailable && eligible}
                                        onChange={handleToggle}
                                        className={`${isAvailable && eligible ? 'bg-[#e60026]' : 'bg-navy-700'
                                            } relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shadow-inner`}
                                    >
                                        <span
                                            className={`${isAvailable && eligible ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg`}
                                        />
                                    </Switch>
                                </div>
                            </div>

                            {!eligible && (
                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                        <span>Bio-Replenishment</span>
                                        <span>{Math.round(percentage)}%</span>
                                    </div>
                                    <div className="w-full bg-navy-800 rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            className="bg-amber-500 h-full rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Feed */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Bell className="h-6 w-6 text-[#e60026]" />
                        Active Requests
                    </h3>

                    <div className="space-y-4">
                        {activeRequests.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 italic">No active requests in your area.</p>
                        ) : (
                            activeRequests.map(req => (
                                <RequestCard key={req.id} request={req} eligible={eligible} recoveryMessage={message} />
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="font-bold border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">Your Impact</CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Last Donation</span>
                                <span className="font-medium text-gray-900 dark:text-gray-200">
                                    {currentUser.lastDonated
                                        ? new Date(currentUser.lastDonated?.seconds ? currentUser.lastDonated.seconds * 1000 : currentUser.lastDonated).toLocaleDateString()
                                        : "Never"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Lives Saved</span>
                                <span className="font-medium text-red-600 dark:text-red-500">{currentUser.livesSaved || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function RequestCard({ request, eligible, recoveryMessage }) {
    const { acceptRequest } = useMCP();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [showConsent, setShowConsent] = useState(false);
    const [accepting, setAccepting] = useState(false);

    const isAcceptedByMe = request.status === 'accepted' && request.donorId === currentUser?.uid;

    const handleAcceptClick = () => {
        if (eligible === false) { // Explicit check as it might be undefined if not passed correctly, though we passed it.
            // eligible is boolean from calculateDonationEligibility.
            alert(`Cannot accept: Recovery Period Active.\n${recoveryMessage || 'Please wait until your recovery period is over.'}`);
            return;
        }

        setShowConsent(true);
    };

    const confirmAccept = async () => {
        setAccepting(true);
        try {
            await acceptRequest(request.id);
            setShowConsent(false);
        } catch (err) {
            console.error(err);
            alert("Failed to accept request");
        } finally {
            setAccepting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 border shadow-sm hover:shadow-md transition-all ${isAcceptedByMe ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/10' : 'border-red-100 dark:border-red-900/30'}`}
        >
            <DonorDeclarationModal
                isOpen={showConsent}
                onClose={() => setShowConsent(false)}
                onConfirm={confirmAccept}
            />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded mb-2 ${isAcceptedByMe ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'}`}>
                        {isAcceptedByMe ? 'ACCEPTED' : request.urgency}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white break-words pr-2">{request.patientName}</h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        {request.distance || "Unknown distance"} away
                    </div>
                </div>
                <div className="h-12 w-12 bg-red-600 dark:bg-red-500 rounded-lg flex flex-shrink-0 items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-200 dark:shadow-none">
                    {request.bloodGroup}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                {isAcceptedByMe ? (
                    <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 w-full"
                        size="sm"
                        onClick={() => navigate(`/chat/${request.id}`)}
                    >
                        Chat with Patient
                    </Button>
                ) : (
                    <div className="flex-1 w-full space-y-2">
                        {canDonate(currentUser?.bloodGroup, request.bloodGroup) ? (
                            <Button className="w-full" size="sm" onClick={handleAcceptClick}>Accept Request</Button>
                        ) : (
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-3 rounded-lg text-center">
                                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium mb-2">
                                    You cannot donate for this request (Incompatible Blood Type). But you can share this with a friend.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                                    onClick={() => {
                                        const shareTitle = `Urgent: ${request.bloodGroup} Blood Needed!`;
                                        const shareText = `URGENT: ${request.patientName} needs ${request.bloodGroup} blood at ${request.hospitalName || 'a nearby hospital'}.\n\nInstructions for Friend:\n1. Check if you are blood group ${request.bloodGroup} (or compatible).\n2. If you are willing to donate, please contact the requester immediately.\n\nContact Email: ${request.patientEmail || 'Not available via detailed share'}\n\n(Shared via LifeLink)`;

                                        if (navigator.share) {
                                            navigator.share({
                                                title: shareTitle,
                                                text: shareText
                                            }).catch(console.error);
                                        } else {
                                            // Fallback for desktop/non-supported
                                            alert("Copy this message to share:\n\n" + shareText);
                                        }
                                    }}
                                >
                                    Share Request
                                </Button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </motion.div>
    );
}
