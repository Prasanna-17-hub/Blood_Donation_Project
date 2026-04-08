import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bell, Heart, MapPin, CheckCircle2, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

const SCENES = ["Request", "Notification", "Response", "Life Saved"];

export default function DemoModal({ isOpen, onClose }) {
    const [scene, setScene] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setScene(0);
            return;
        }

        const sceneTimings = [5000, 10000, 15000];

        const timers = sceneTimings.map((time, index) =>
            setTimeout(() => setScene(index + 1), time)
        );

        return () => timers.forEach(clearTimeout);
    }, [isOpen]);

    if (!isOpen) return null;

    const scenes = [
        <SceneRequest key="s1" />,
        <SceneWhatsApp key="s2" />,
        <SceneResponse key="s3" />,
        <SceneSuccess key="s4" onClose={onClose} />
    ];

    return (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white dark:bg-slate-900 w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] relative flex flex-col border border-gray-200 dark:border-slate-800"
            >
                {/* Header/Control */}
                <div className="absolute top-6 right-6 z-30">
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-gray-500 hover:text-red-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Top Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-slate-800 z-20">
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-400"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 20, ease: "linear" }}
                    />
                </div>

                {/* Creative Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
                    <div className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square rounded-full bg-red-500/20 blur-[100px]" />
                    <div className="absolute -bottom-[10%] -right-[5%] w-[40%] aspect-square rounded-full bg-blue-500/20 blur-[100px]" />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-between py-12 px-6 relative z-10">
                    <div className="flex-1 w-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={scene}
                                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="w-full h-full flex items-center justify-center px-4"
                            >
                                {scenes[scene]}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Stepper Display */}
                    <div className="w-full max-w-2xl px-8 mt-4">
                        <div className="flex justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 dark:bg-slate-800 -z-10" />
                            <motion.div 
                                className="absolute top-4 left-0 h-0.5 bg-red-500 -z-10" 
                                initial={{ width: "0%" }}
                                animate={{ width: `${(scene / (SCENES.length - 1)) * 100}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                            />
                            
                            {SCENES.map((label, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <motion.div 
                                        animate={{ 
                                            scale: i === scene ? 1.2 : 1,
                                            backgroundColor: i <= scene ? '#ef4444' : '#e5e7eb',
                                            boxShadow: i === scene ? '0 0 15px rgba(239, 68, 68, 0.5)' : 'none'
                                        }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${i <= scene ? 'text-white' : 'text-gray-400 dark:bg-slate-800'}`}
                                    >
                                        {i < scene ? <CheckCircle2 size={16} /> : i + 1}
                                    </motion.div>
                                    <span className={`text-[11px] font-semibold tracking-wide uppercase ${i <= scene ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function SceneRequest() {
    return (
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl w-full">
            <div className="relative group">
                {/* Mock Phone Frame */}
                <div className="w-[240px] h-[440px] bg-slate-900 rounded-[3rem] border-4 border-slate-800 shadow-2xl overflow-hidden relative p-1.5 ring-8 ring-slate-900/10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-2xl z-20" />
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden flex flex-col">
                        <div className="h-14 bg-red-600 p-4 flex items-end">
                            <div className="w-full h-1 rounded-full bg-white/20 animate-pulse" />
                        </div>
                        <div className="p-4 flex-1">
                            <div className="animate-bounce mb-4 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <Heart className="text-red-500 fill-red-500" size={24} />
                            </div>
                            <div className="space-y-3">
                                <div className="h-4 w-3/4 bg-gray-100 dark:bg-slate-800 rounded mx-auto" />
                                <div className="p-3 rounded-2xl border-2 border-red-500/20 bg-red-50/50 dark:bg-red-900/10 space-y-2">
                                    <p className="text-[10px] uppercase font-bold text-red-600">Blood Requested</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-black dark:text-white">A+</span>
                                        <div className="px-2 py-0.5 rounded-full bg-red-600 text-[10px] text-white font-bold">EMERGENCY</div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                        <MapPin size={10} className="text-red-500" />
                                        <span>Chennai General Hospital</span>
                                    </div>
                                </div>
                                <div className="h-8 w-full bg-red-600 rounded-xl mt-4 flex items-center justify-center text-white font-bold text-xs">
                                    Broadcasting...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Radiation effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-red-500/20 animate-ping -z-10" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    LIVE DEMO: STEP 1
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                    Smart Demand <br/><span className="text-red-600">Broadcast</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                    Users raise instant requests. Our system captures precise location, blood group, and urgency details automatically.
                </p>
            </div>
        </div>
    );
}

function SceneWhatsApp() {
    return (
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-4xl w-full">
            <div className="relative group">
                <div className="w-[320px] bg-[#075E54] rounded-[2rem] p-4 shadow-2xl relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Phone className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm">LifeLink Alerts</p>
                            <p className="text-white/60 text-[10px]">Active</p>
                        </div>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#DCF8C6] rounded-2xl p-4 shadow-sm relative"
                    >
                        <div className="absolute -left-2 top-4 w-4 h-4 bg-[#DCF8C6] rotate-45 rounded-sm" />
                        <div className="flex items-start gap-2">
                            <div className="p-2 bg-red-500 rounded-lg text-white">
                                <Bell size={16} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-800">🚨 BLOOD EMERGENCY ALERT</p>
                                <p className="text-[11px] text-gray-700 leading-snug">
                                    Patient <span className="font-bold">Rahul (PEC)</span> urgently needs <span className="text-red-600 font-black italic underline">A+ Blood</span>.
                                </p>
                                <p className="text-[10px] text-blue-600 underline font-bold pt-1">
                                    tap: lifelink.app/r/qR2W1
                                </p>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-500 text-right mt-1">11:11 AM</p>
                    </motion.div>
                </div>
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-green-500/20 blur-2xl rounded-full" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    STEP 2: NOTIFICATION
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                    Mass Reach via <br/><span className="text-[#25D366]">WhatsApp</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                    Our platform automatically alerts compatible donors nearby through WhatsApp. No more searching manuals or calling contacts.
                </p>
            </div>
        </div>
    );
}

function SceneResponse() {
    return (
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl w-full">
            <div className="relative">
                <div className="w-[300px] h-[360px] bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col">
                    <div className="p-4 border-b dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-black">DA</div>
                            <span className="text-xs font-bold dark:text-white">Donor Chat</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-slate-700 flex items-center justify-center"><Phone size={12} className="text-gray-400" /></div>
                        </div>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-2xl rounded-tl-sm text-[11px] max-w-[80%] dark:text-gray-200">
                           Need A+ blood urgently at Chennai General Hospital
                        </div>
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-red-600 text-white p-3 rounded-2xl rounded-tr-sm text-[11px] max-w-[80%] ml-auto shadow-md"
                        >
                            I'm nearby. I can reach the hospital in 15 mins!
                        </motion.div>
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="bg-blue-600 text-white p-2 rounded-xl text-[10px] font-bold w-fit mx-auto mt-4"
                        >
                            <ShieldCheck size={14} className="inline mr-1" /> Verified Donor
                        </motion.div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex gap-2">
                        <div className="flex-1 bg-white dark:bg-slate-800 h-8 rounded-full border dark:border-slate-700" />
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg"><Send size={14} /></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    STEP 3: SECURE CHAT
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                    Direct <br/><span className="text-red-500">Communication</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                    Donors and patients connect instantly through our secure platform. Built-in location tracking ensures transparency and trust.
                </p>
            </div>
        </div>
    );
}

function SceneSuccess({ onClose }) {
    return (
        <div className="text-center space-y-8 max-w-2xl px-4">
            <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                className="relative inline-block"
            >
                <div className="absolute inset-0 bg-red-500/20 blur-3xl animate-pulse" />
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] relative">
                    <Heart size={64} className="text-white fill-white animate-pulse" />
                </div>
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 bg-green-500 p-2 rounded-full shadow-lg border-4 border-white dark:border-slate-900"
                >
                    <CheckCircle2 size={24} className="text-white" />
                </motion.div>
            </motion.div>

            <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">
                    Every Drop Counts, <br/>
                    <span className="text-red-600">Every Life Matters!</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    By joining the LifeLink network, you are not just a user—you are a <span className="text-red-600 font-bold">LIFESAVER</span>. Together, we can ensure no request goes unanswered.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button 
                    size="lg" 
                    onClick={onClose}
                    className="h-16 px-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)] transition-all hover:scale-105 active:scale-95"
                >
                    JOIN THE NETWORK
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <ShieldCheck className="text-green-500" size={20} />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">100% SECURE & VERIFIED</span>
                </div>
            </div>
        </div>
    );
}