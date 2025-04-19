import { useState, useEffect, useCallback, useMemo } from 'react';
import { Hand, Zap, HeartCrack, MessageSquareWarning, Gift, AlertTriangle, Skull, Annoyed, Waves } from 'lucide-react';

// Particle Component
interface ParticleProps {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    duration: number;
}
const Particle: React.FC<ParticleProps & { onComplete: (id: number) => void }> = ({ id, x, y, color, size, duration, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => onComplete(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, onComplete]);

    return (
        <div
            className={`absolute rounded-full ${color} animate-particle z-0`}
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${duration}ms`,
                pointerEvents: 'none',
            }}
        />
    );
};

// Screen Crack Overlay
const ScreenCrackOverlay: React.FC = () => {
    return (
        <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none">
            {/* Multiple crack lines using pseudo-elements or divs */}
            <div className="absolute w-px h-full bg-white/50 rotate-[25deg] top-[-20%] left-[10%] animate-crack-grow origin-top"></div>
            <div className="absolute w-full h-px bg-white/40 top-[30%] left-[-15%] rotate-[-10deg] animate-crack-grow-h origin-left"></div>
            <div className="absolute w-px h-3/4 bg-white/60 rotate-[-35deg] bottom-[-10%] right-[15%] animate-crack-grow origin-bottom"></div>
             <div className="absolute w-1/2 h-px bg-white/30 bottom-[45%] right-[-10%] rotate-[5deg] animate-crack-grow-h origin-right"></div>
             <div className="absolute w-px h-1/2 bg-white/50 rotate-[50deg] top-[5%] left-[50%] animate-crack-grow origin-top"></div>
             {/* Center impact point */}
             <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <div className='w-3 h-3 rounded-full bg-white/80 animate-ping opacity-50'></div>
                <div className='absolute inset-0 w-3 h-3 rounded-full border border-white/50'></div>
             </div>
        </div>
    );
}

// Pixel Art Component
const PixelArt = ({ gridColors }: { gridColors: string[][] }) => {
    const pixelSize = 'w-1.5 h-1.5 md:w-2 md:h-2';
    return (
        <div className='flex flex-col border-2 border-gray-900 bg-gray-800 p-0.5 rounded-sm shadow-inner'>
            {gridColors.map((row, y) => (
                <div key={y} className='flex'>
                    {row.map((color, x) => (
                        <div key={`${x}-${y}`} className={`${pixelSize} ${color || 'bg-transparent'}`}></div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// Pixel Pal Component
interface PixelPalProps {
  mood: number; // 0-10 scale
  isShaking: boolean;
  isGlitching: boolean;
  onClick: () => void;
  isBroken: boolean;
}

const PixelPal: React.FC<PixelPalProps> = ({ mood, isShaking, isGlitching, onClick, isBroken }) => {
    const moodGrids = useMemo(() => [
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBWSBBSBWSBTT','TTBWSBBSBWSBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBBMSSBSBTT','TTBSSSSSSSSSBTB','TTTBSSSSSSSBBTT','TTTBBMMMBBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBGGGBBGGGBTT','TTBGGGBBGGGBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-gray-900', W:'bg-white', S:'bg-emerald-300', E:'bg-gray-900', M:'bg-red-500', G:'bg-emerald-600'})[c])), // 0 Happy
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBCSBBSBCSBTT','TTBCSBBSBCSBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBMMBSSBSBTT','TTBSSSSSSSSSBTB','TTTBSSSSSSSBBTT','TTTTBBBBBBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBCCBCCCBCCBTT','TTBCCBCCCBCCBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-gray-900', W:'bg-white', S:'bg-cyan-300', E:'bg-gray-900', M:'bg-gray-900', C:'bg-cyan-600'})[c])), // 1 Neutral
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBWSBBSBWSBTT','TTBWSBBSBWSBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBMMBSSBSBTT','TTBSSSSSSSSSBTB','TTTBSSSSSSSBBTT','TTTTTBBBBBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTY YYBB YYYBTT','TTYYYYBBYYYYBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-gray-900', W:'bg-white', S:'bg-yellow-300', E:'bg-gray-900', M:'bg-gray-900', Y:'bg-yellow-600'})[c])), // 2 Waiting
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBWSBBSBWSBTT','TTBWSBBSBWSBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBBBBSSBSBTT','TTBSSMMMMSSSBTT','TTTBSSSSSSSBBTT','TTTTBBBBBBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTOOOOBBOOOOBTT','TTOOOOBBOOOOBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-gray-900', W:'bg-white', S:'bg-orange-400', E:'bg-gray-900', M:'bg-gray-900', O:'bg-orange-700'})[c])), // 3 Annoyed
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBOSBBSBOSBTT','TTBOSBBSBOSBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBBBBSSBSBTT','TTBSSMMMMSSSBTT','TTTBSSSSSSSBBTT','TTTTBBMMBBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTOORRBBOORRBTT','TTOORRBBOORRBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-black', W:'bg-gray-300', S:'bg-orange-500', E:'bg-black', M:'bg-black', O:'bg-orange-800', R:'bg-red-700'})[c])), // 4 Irritated
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBRSBBSBRSBTT','TTBRSBBSBRSBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBBBBSSBSBTT','TTBSSMMMMSSSBTT','TTTBSSSSSSSBBTT','TTTTBBMMBBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTRRRRBBRRRRBTT','TTRRRRBBRRRRBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-black', W:'bg-gray-300', S:'bg-red-500', E:'bg-black', M:'bg-black', R:'bg-red-800'})[c])), // 5 Angry
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBRRBBRBRRBTT','TTBRRBBRBRRBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBBBBSSBSBTT','TTBSSMMMMSSSBTT','TTTBMMMMMMMBBTT','TTTTBMMMMBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTRRRRBBRRRRBTT','TTRRRRBBRRRRBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-black', W:'bg-red-300', S:'bg-red-700', E:'bg-black', M:'bg-black', R:'bg-red-900'})[c])), // 6 Furious
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBPWBBPBWPBTT','TTBPWBBPBWPBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBMMBSSBSBTT','TTBSSMMMMSSSBTT','TTTBSSSSSSSBBTT','TTTTBBBBBBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTPPPPBBP PPPBTT','TTPPPPBBP PPPBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-gray-900', W:'bg-blue-300', S:'bg-purple-400', E:'bg-blue-800', M:'bg-blue-900', P:'bg-purple-700'})[c])), // 7 Desperate
        ['TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTBLWBBLBWLBTT','TTBLWBBLBWLBTT','TTBBBBBBBBBBTT','TTBSBBBBBBBSBTT','TTBSSBMMBSSBSBTT','TTBSSMMMMSSSBTT','TTTBSSSSSSSBBTT','TTTTBBBBBBTTTT','TTTTBBBBBBTTTT','TTTBBBBBBBBTTT','TTLLLLBBLLLLBTT','TTLLLLBBLLLLBTT','TTTBBBBBBBBTTT','TTTTBBBBBBTTTT'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-gray-900', W:'bg-white', S:'bg-sky-200', E:'bg-blue-500', M:'bg-blue-700', L:'bg-sky-500'})[c])), // 8 Pleading
        ['BRBRBBBRBRBBRB','RBRBBBRBRBBBRBR','BRBRBBBRBRBBRBR','RBRBBBRBRBBBRBR','BRBRBBBRBRBBRBR','RBRBBBRBRBBBRBR','BRBRBBBRBRBBRBR','RBRBBBRBRBBBRBR','BRBRBBBRBRBBRBR','RBRBBBRBRBBBRBR','BRBRBBBRBRBBRBR','RBRBBBRBRBBBRBR','BRBRBBBRBRBBRBR','RBRBBBRBRBBBRBR','BRBRBBBRBRBBRBR','RBRBBBRBRBBBRBR'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-black', R:'bg-red-900'})[c])), // 9 Glitching
        ['BDBDBBDBDBBDBD','DBDBBDBDBBBDBDB','BDBDBBDBDBBDBDB','DBDBBDBDBBBDBDB','BDBDBBDBDBBDBDB','DBDBBDBDBBBDBDB','BDBDBBDBDBBDBDB','DBDBBDBDBBBDBDB','BDBDBBDBDBBDBDB','DBDBBDBDBBBDBDB','BDBDBBDBDBBDBDB','DBDBBDBDBBBDBDB','BDBDBBDBDBBDBDB','DBDBBDBDBBBDBDB','BDBDBBDBDBBDBDB','DBDBBDBDBBBDBDB'].map(r => r.split('').map(c => ({T:'bg-transparent', B:'bg-black', D:'bg-red-950'})[c])) // 10 Broken
    ], []);

    const currentGrid = moodGrids[mood] || moodGrids[0];

    return (
        <div 
            className={`relative p-1 md:p-2 rounded-lg shadow-lg transition-all duration-300 flex justify-center items-center bg-gray-700 border-4 border-gray-900 ${!isBroken && 'cursor-pointer hover:scale-105 active:scale-95'} ${isShaking ? 'animate-shake-hyper' : ''} ${isGlitching ? 'animate-glitch-fast' : ''} ${isBroken ? 'opacity-50 filter grayscale' : ''}`}
            onClick={!isBroken ? onClick : undefined}
            style={{ imageRendering: 'pixelated' }}
        >
            <PixelArt gridColors={currentGrid} />
            {(mood === 7 || mood === 8) && !isBroken && (
                <div className='absolute -bottom-10 flex gap-2'>
                    <button className='p-1.5 bg-green-600 rounded-full text-white animate-bounce shadow-lg border border-black'><Gift size={18}/></button>
                    <button className='p-1.5 bg-blue-600 rounded-full text-white animate-pulse shadow-lg border border-black'><MessageSquareWarning size={18}/></button>
                </div>
            )}
            {mood >= 9 && !isBroken && (
                <div className='absolute -bottom-10 flex gap-2'>
                    <div className='p-1.5 bg-red-900 rounded-full text-black animate-ping shadow-lg border border-black'><Skull size={18}/></div>
                </div>
            )}
        </div>
    );
};

// Main Component
export default function ScreenBreakNeedySite() {
    const [mood, setMood] = useState(0);
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    const [isShaking, setIsShaking] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const [showNewFeature, setShowNewFeature] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [particles, setParticles] = useState<ParticleProps[]>([]);
    const [lightning, setLightning] = useState(false);
    const [isScreenBroken, setIsScreenBroken] = useState(false);

    // Increased delays
    const angerThresholds = [5000, 10000, 16000, 22000, 28000, 34000, 40000, 46000, 52000, 58000]; // ~5-6s per mood

    const handleInteraction = useCallback(() => {
        // Cannot interact if screen is broken
        if (isScreenBroken) return;
        
        setMood(0);
        setLastInteraction(Date.now());
        setIsShaking(false);
        setIsGlitching(false);
        setShowNewFeature(false);
        setZoomLevel(1);
        setLightning(false);
        // Keep screen broken state if it was already broken (no reset for that)
    }, [isScreenBroken]);

    // Particle effect logic
    useEffect(() => {
        if (mood < 3 || isScreenBroken) {
            setParticles([]);
            return;
        }
        const intensity = Math.min(mood * 1.5, 12);
        const interval = setInterval(() => {
            if (particles.length < 40) { // Increased max particles
                 setParticles(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    color: ['bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-purple-500'][Math.floor(Math.random()*4)],
                    size: Math.random() * (2 + mood * 0.6) + 2,
                    duration: 1000 + Math.random() * 1500
                }]);
            }
        }, 600 / intensity);

        return () => clearInterval(interval);
    }, [mood, particles.length, isScreenBroken]);

    const removeParticle = (id: number) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    };

    // Mood and effects update logic
    useEffect(() => {
        if (isScreenBroken) return; // Stop updates if screen is broken

        const interval = setInterval(() => {
            const timeSinceInteraction = Date.now() - lastInteraction;
            let newMood = 0;
            for(let i = 0; i < angerThresholds.length; i++) {
                if (timeSinceInteraction > angerThresholds[i]) newMood = i + 1;
            }
            
            setMood(prevMood => {
                if (newMood !== prevMood) {
                    setIsShaking(newMood >= 5 && newMood < 9);
                    setIsGlitching(newMood === 9);
                    setShowNewFeature(newMood === 7 || newMood === 8);
                    if (newMood >= 6 && newMood <= 8) setZoomLevel(1.05 + (newMood - 6) * 0.05);
                    else if (newMood >=9) setZoomLevel(0.95);
                    else setZoomLevel(1);
                    
                    if ((newMood === 6 || newMood === 7) && Math.random() < 0.4) {
                        setLightning(true);
                        setTimeout(() => setLightning(false), 150);
                    }
                    
                    // Trigger screen break
                    if (newMood === 10 && !isScreenBroken) {
                        setIsScreenBroken(true);
                        setIsShaking(false); // Stop other effects
                        setIsGlitching(false);
                        setZoomLevel(1); // Reset zoom on break
                    }
                    return newMood;
                } 
                return prevMood;
            });

        }, 500); // Check every 0.5s

        return () => clearInterval(interval);
    }, [lastInteraction, isScreenBroken]);

    const messages = [
        "Welcome! So glad you could make it!", // 0
        "Everything's calm. Just chilling.", // 1
        "Still here? Nice.", // 2
        "Getting a bit quiet... maybe interact?", // 3
        "Hellooo? Is this thing on?", // 4
        "Don't ignore me! I'm warning you!", // 5
        "THIS ISN'T FUNNY! CLICK SOMETHING!", // 6
        "PLEASE! I'M BEGGING YOU! LOOK, SHINY THINGS!", // 7
        "Why... why won't you just... *sniff*... click?", // 8
        "FINE! YOU WANT TO IGNORE ME? WATCH THIS!", // 9
        "...Oops. Did I do that?", // 10
    ];

    const bgColors = ['bg-gray-900', 'bg-gray-800', 'bg-neutral-800', 'bg-stone-900', 'bg-orange-950', 'bg-red-950', 'bg-red-900', 'bg-purple-950', 'bg-indigo-950', 'bg-black', 'bg-black'];
    const textColors = ['text-emerald-300', 'text-cyan-300', 'text-yellow-300', 'text-orange-400', 'text-red-400', 'text-red-300 animate-pulse', 'text-red-200 animate-bounce', 'text-purple-300 animate-pulse', 'text-sky-300 animate-pulse', 'text-red-500 animate-ping', 'text-gray-500'];

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen p-4 md:p-6 transition-all duration-1000 ${bgColors[mood]} text-gray-100 font-mono relative overflow-hidden`} style={{ transform: `scale(${zoomLevel})` }}>
            <style jsx global>{`
                @keyframes shake-hyper { 0%, 100% { transform: translate(0, 0) rotate(0); } 10%, 90% { transform: translate(-15px, -8px) rotate(-6deg); } 20%, 80% { transform: translate(15px, 8px) rotate(6deg); } 30%, 50%, 70% { transform: translate(-15px, 8px) rotate(5deg); } 40%, 60% { transform: translate(15px, -8px) rotate(-5deg); } }
                .animate-shake-hyper { animation: shake-hyper 0.3s cubic-bezier(.36,.07,.19,.97) infinite; }
                @keyframes glitch-fast { 0% { transform: translate(0,0) skew(0); filter: hue-rotate(0deg); } 10% { transform: translate(-8px, -8px) skew(-5deg); filter: hue-rotate(60deg); } 20% { transform: translate(8px, 8px) skew(5deg); filter: hue-rotate(120deg); } 30% { transform: translate(-8px, 8px) skew(-5deg); filter: hue-rotate(180deg); } 40% { transform: translate(8px, -8px) skew(5deg); filter: hue-rotate(240deg); } 50% { transform: translate(0, 0) skew(0); filter: hue-rotate(300deg); } 60% { transform: translate(-4px, 4px) skew(-3deg); filter: hue-rotate(360deg); } 70% { transform: translate(4px, -4px) skew(3deg); filter: hue-rotate(420deg); } 80% { transform: translate(-4px, -4px) skew(-3deg); filter: hue-rotate(480deg); } 90% { transform: translate(4px, 4px) skew(3deg); filter: hue-rotate(540deg); } 100% { transform: translate(0,0) skew(0); filter: hue-rotate(600deg); } }
                .animate-glitch-fast { animation: glitch-fast 0.15s linear infinite alternate; filter: contrast(1.8) saturate(1.8); }
                @keyframes particle-fade-out { from { opacity: 0.8; transform: translate(0, 0) scale(1); } to { opacity: 0; transform: translate(calc(var(--x-dir, 1) * 30px), calc(var(--y-dir, -1) * 60px)) scale(0.3); } }
                .animate-particle { animation-name: particle-fade-out; animation-timing-function: ease-out; animation-fill-mode: forwards; --x-dir: calc(cos(var(--angle, 0) * 1deg)); --y-dir: calc(sin(var(--angle, 0) * 1deg)); --angle: ${Math.random() * 360}; }
                @keyframes lightning-flash { 0%, 100% { opacity: 0; } 50% { opacity: 0.7; } }
                .animate-lightning { animation: lightning-flash 0.15s linear 1; }
                @keyframes crack-grow { from { transform: scaleY(0) rotate(25deg); } to { transform: scaleY(1) rotate(25deg); } }
                .animate-crack-grow { animation: crack-grow 0.5s 0.1s ease-out forwards; }
                 @keyframes crack-grow-h { from { transform: scaleX(0) rotate(-10deg); } to { transform: scaleX(1) rotate(-10deg); } }
                .animate-crack-grow-h { animation: crack-grow-h 0.6s 0.2s ease-out forwards; }
            `}</style>

            {lightning && !isScreenBroken && <div className='absolute inset-0 bg-white z-50 pointer-events-none animate-lightning'></div>}
            {isScreenBroken && <ScreenCrackOverlay />}

            {/* Particle Container */}
            <div className='absolute inset-0 z-10 pointer-events-none overflow-hidden'>
                 {particles.map(p => <Particle key={p.id} {...p} onComplete={removeParticle} />)}
            </div>

            <div className={`relative z-20 text-center mb-8 md:mb-12 p-5 md:p-8 bg-black bg-opacity-70 rounded-xl shadow-xl max-w-xs md:max-w-2xl border-2 ${mood >= 7 ? 'border-red-700 animate-pulse' : 'border-gray-700'} ${isScreenBroken ? 'border-gray-600 filter grayscale opacity-80' : ''} transition-all duration-500`}>
                <h1 className={`text-3xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-2 md:gap-4 ${textColors[mood]} transition-colors duration-500`}>
                    <Waves size={36} className={`${mood >= 5 ? 'text-red-500' : 'text-cyan-400'}`}/> 
                    Pixel Pal Interface v4
                    <Zap size={36} className={`${mood >= 8 ? 'text-red-600 animate-ping' : 'text-yellow-500'}`}/>
                </h1>
                <p className={`text-base md:text-lg ${isScreenBroken ? 'text-gray-400' : 'text-gray-300'}`}>Status: {messages[mood]}</p>
            </div>

            <div className='relative flex flex-col items-center gap-8 md:gap-10 z-20'>
                <PixelPal 
                    mood={mood} 
                    isShaking={isShaking}
                    isGlitching={isGlitching}
                    onClick={handleInteraction} 
                    isBroken={isScreenBroken}
                />
                {(showNewFeature && !isScreenBroken) && (
                    <div className='mt-4 p-5 bg-green-900 bg-opacity-80 rounded-lg border-2 border-green-500 shadow-lg animate-pulse flex flex-col items-center gap-3 max-w-sm text-center'>
                        <Gift size={28} className='text-yellow-300 mb-2'/>
                        <p className='font-medium text-green-200'>Quick! A gift! Maybe this button helps? Click it fast!</p>
                        <button 
                            onClick={handleInteraction}
                            className='mt-3 px-6 py-2 bg-pink-600 text-white font-bold rounded-full shadow-md hover:bg-pink-500 transition-all active:scale-95 flex items-center gap-2 border border-pink-800'
                        >
                            <HeartCrack size={18}/> Emergency Appease
                        </button>
                    </div>
                )}

                <button 
                    onClick={handleInteraction}
                    className='mt-6 px-8 md:px-10 py-3 md:py-4 bg-sky-700 text-white text-lg font-bold rounded-xl shadow-xl hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-3 border-2 border-sky-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:filter disabled:grayscale'
                    disabled={isScreenBroken}
                >
                    <Hand size={24}/> {isScreenBroken ? 'SYSTEM OFFLINE' : 'Give Attention'}
                </button>
            </div>

            <div className={`fixed bottom-2 right-2 md:bottom-4 md:right-4 p-2 md:p-3 bg-black bg-opacity-80 rounded-lg text-xs md:text-sm ${isScreenBroken ? 'text-gray-600' : 'text-gray-400'} flex items-center gap-2 border border-gray-600 z-30`}>
                <AlertTriangle size={16} className={mood > 4 ? (mood > 8 ? 'text-red-500 animate-ping' : 'text-yellow-500') : 'text-gray-500'}/>
                Mood: <span className={`font-bold ${textColors[mood]}`}>{mood} / 10</span> {isScreenBroken ? '(BROKEN)' : ''}
            </div>
        </div>
    );
}
