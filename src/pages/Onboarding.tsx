import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const ROLES = ['Frontend Wizard', 'Backend Architect', 'UI/UX Visionary', 'Fullstack Engineer'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (('key' in e && e.key === 'Enter' || e.type === 'click') && currentSkill.trim() !== '') {
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleRegister = () => {
    if (name && role && skills.length > 0) {
      register(name, role, skills);
      setStep(2); // Go to recommended teams screen
    }
  };

  const { teams, joinTeam } = useApp();
  const recommendedTeams = teams.filter(t => t.missingRole === role);

  const handleInstantJoin = (teamId: string) => {
    joinTeam(teamId);
    navigate(`/team/${teamId}`); // Jump straight to their new dashboard
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
      
      {/* Quick Marketing / Branding */}
      {step === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center max-w-2xl mx-auto z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium tracking-wide">VoidMatch Alpha</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight text-white shadow-sm">
            Find your place by filling the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan text-glow-purple">void.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light mb-12">
            Showcase your skills, explore existing teams, and identify missing roles instantly through intelligent data visualization.
          </p>
          <button 
            onClick={() => setStep(1)}
            className="px-8 py-4 bg-white text-background hover:bg-neon-cyan font-bold text-lg rounded-full flex items-center justify-center gap-3 transition-all duration-300 mx-auto shadow-[0_0_20px_rgba(0,245,255,0.2)] hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] hover:-translate-y-1"
          >
            Initialize Persona <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Onboarding Flow Main Card */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
          className="glass-panel p-10 rounded-[2rem] w-full max-w-xl z-10 border border-white/10 relative"
        >
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold font-mono tracking-tight mb-2">Identify Yourself</h2>
            <p className="text-gray-400 text-sm">Configure your nexus access parameters.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest pl-1">Designation (Name)</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex K."
                className="w-full glass-input px-6 py-4 rounded-xl text-white placeholder-gray-600 focus:bg-background/80"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest pl-1">Primary Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      role === r 
                      ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(157,0,255,0.2)]' 
                      : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest pl-1">Capabilities (Tech Stack)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="e.g. React, Docker, Figma..."
                  className="w-full glass-input px-6 py-4 rounded-xl text-white placeholder-gray-600 focus:bg-background/80 pr-12"
                />
                <button 
                  onClick={handleAddSkill}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/5"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
                {skills.map(skill => (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={skill} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan rounded-lg text-sm font-medium"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button 
              disabled={!name || !role || skills.length === 0}
              onClick={handleRegister}
              className="px-8 py-3 bg-white text-background disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed hover:bg-neon-purple font-bold text-md rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(157,0,255,0.4)]"
            >
              Analyze Matches <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Recommended Matches Screen */}
      {step === 2 && (
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-3xl z-10"
        >
           <div className="text-center mb-10">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 mb-4 shadow-[0_0_15px_rgba(157,0,255,0.2)]">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span className="text-xs font-bold font-mono tracking-widest text-neon-purple uppercase">Match Analysis Complete</span>
             </div>
             <h2 className="text-4xl font-bold font-mono tracking-tight mb-4">Recommended Collectives</h2>
             <p className="text-gray-400">Based on your capabilities as a <span className="text-neon-cyan font-bold">{role}</span>, these squads critically require your expertise.</p>
           </div>

           <div className="grid gap-4 mb-8">
             {recommendedTeams.length > 0 ? recommendedTeams.map(team => (
                <div key={team.id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-cyan/50 transition-all flex flex-col md:flex-row justify-between items-center gap-4 group">
                   <div>
                     <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
                     <span className="text-xs font-mono font-medium text-void uppercase border border-void/20 bg-void/10 px-2 py-0.5 rounded">Critical Void: {team.missingRole}</span>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="text-center">
                        <span className="block text-2xl font-bold text-neon-cyan shadow-sm">{team.match}%</span>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Match Synergy</span>
                     </div>
                     <button
                       onClick={() => handleInstantJoin(team.id)} 
                       className="px-6 py-3 bg-neon-cyan text-background font-bold uppercase tracking-widest font-mono text-sm rounded-xl shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] transition-all flex items-center gap-2"
                     >
                        Join Network
                     </button>
                   </div>
                </div>
             )) : (
                <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center">
                   <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">No critical voids detected for your specific persona at this time.</p>
                </div>
             )}
           </div>

           <div className="flex justify-center">
              <button 
                onClick={() => navigate('/discover')}
                className="text-gray-400 hover:text-white font-mono text-xs uppercase tracking-widest border-b border-transparent hover:border-white pb-1 transition-all"
              >
                 Skip & Explore Global Feed
              </button>
           </div>
        </motion.div>
      )}
    </div>
  );
}
