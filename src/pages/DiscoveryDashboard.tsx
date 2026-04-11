import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, CheckCircle2, ChevronRight, Hash, Network, Send } from 'lucide-react';
import D3SkillRadar from '../components/Visualizations/D3SkillRadar';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

type Tab = 'solo' | 'squads';

export default function DiscoveryDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('squads');
  const { users, teams, currentUser, sendInvite, invites, joinTeam } = useApp();

  const handleInvite = (userId: string) => {
    if (!currentUser || !currentUser.teamId) {
      alert("You need to be in a team to send invites!");
      return;
    }
    // Prevent double inviting
    if (invites.find(i => i.toUserId === userId && i.fromTeamId === currentUser.teamId)) {
      alert("Invite already pending!");
      return;
    }
    sendInvite(currentUser.teamId, userId);
  };

  const hasPendingInvite = (userId: string) => {
    return invites.some(i => i.toUserId === userId && i.fromTeamId === currentUser?.teamId && i.status === 'Pending');
  };

  const soloDevs = users.filter(u => u.status !== 'In Team');

  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 max-w-7xl relative z-10">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-purple/5 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 mb-4">
            <Network className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs font-mono font-medium tracking-wider uppercase">Global Network Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            Discovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Dashboard</span>
          </h1>
          <p className="text-gray-400 font-light">Find missing links and perfectly balanced squads based on dynamic matching.</p>
        </div>

        <div className="flex p-1.5 rounded-[1.25rem] glass-panel border border-white/10 w-full md:w-auto relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => setActiveTab('squads')}
            className={cn(
              "relative px-8 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors w-1/2 md:w-auto z-10",
              activeTab === 'squads' ? "text-background" : "text-gray-400 hover:text-white"
            )}
          >
            {activeTab === 'squads' && (
              <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            )}
            <span className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> ACTIVE SQUADS
            </span>
          </button>
          <button
            onClick={() => setActiveTab('solo')}
            className={cn(
              "relative px-8 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors w-1/2 md:w-auto z-10",
              activeTab === 'solo' ? "text-background" : "text-gray-400 hover:text-white"
            )}
          >
            {activeTab === 'solo' && (
              <motion.div layoutId="tab-indicator" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            )}
            <span className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" /> SOLO PROTOCOL
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'squads' ? (
          <motion.div
            key="squads"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10"
          >
            {teams.map((squad) => {
              const isHighPriority = squad.status === 'High Priority';
              return (
              <div key={squad.id} className="glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 z-10">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-white/90 group-hover:text-white tracking-tight">{squad.name}</h3>
                    <p className="text-sm font-mono text-gray-500 flex items-center gap-2">
                      <Users className="w-4 h-4" /> {squad.members.length}/4 CAPACITY
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-bold font-mono shadow-[0_0_10px_rgba(0,245,255,0.1)]">
                      {squad.match}% MATCH
                    </div>
                    {isHighPriority && (
                      <span className="text-[10px] uppercase font-mono text-void px-2 py-0.5 rounded bg-void/10 border border-void/20">Critical Void</span>
                    )}
                  </div>
                </div>

                {/* D3 Radar Chart Container */}
                <div className="flex-1 bg-black/40 rounded-[1.5rem] p-4 mb-8 border border-white/5 relative z-10 min-h-[300px] flex items-center justify-center overflow-hidden">
                  <D3SkillRadar data={squad.radar} width={300} height={300} />
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto z-10">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-1">Required Role Parameter</p>
                    <p className="font-bold text-white flex items-center gap-2 text-lg">
                      {squad.missingRole ? (
                         <><Hash className="w-4 h-4 text-void" /> {squad.missingRole}</>
                      ) : (
                         <><CheckCircle2 className="w-4 h-4 text-neon-cyan" /> Complete Roster</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(!currentUser?.teamId && currentUser?.role === squad.missingRole) && (
                      <button onClick={() => joinTeam(squad.id)} className="px-4 py-3 rounded-xl bg-void/10 text-void border border-void hover:bg-void hover:text-white hover:shadow-[0_0_20px_rgba(255,42,95,0.6)] transition-all font-bold font-mono text-xs tracking-widest">
                        [ FILL VOID ]
                      </button>
                    )}
                    <Link to={`/team/${squad.id}`} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white text-white hover:text-background flex items-center justify-center transition-all duration-300 border border-white/10">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            )})}
          </motion.div>
        ) : (
          <motion.div
            key="solo"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
          >
             {soloDevs.map((dev) => {
               const pending = hasPendingInvite(dev.id);
               return (
              <div 
                key={dev.id} 
                className="glass-panel p-6 rounded-[1.5rem] border border-white/5 hover:border-neon-purple/50 transition-all duration-300 group relative overflow-hidden flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center border border-white/10">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono font-bold text-gray-300">
                    {dev.match}% MATCH
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-1 tracking-tight">{dev.name}</h3>
                <p className="text-sm font-mono text-neon-cyan mb-4">{dev.role}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {dev.stack.map(tech => (
                    <span key={tech} className="px-2 py-1 text-[10px] uppercase font-mono font-medium bg-white/5 rounded-md border border-white/5 text-gray-400">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <span className="text-xs font-mono text-gray-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> {dev.status.toUpperCase()}
                  </span>
                  {currentUser?.teamId && dev.id !== currentUser.id && (
                    <button 
                      onClick={() => handleInvite(dev.id)}
                      disabled={pending}
                      className={cn(
                        "text-xs font-bold font-mono transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
                        pending ? "bg-white/10 border-white/10 text-gray-400 cursor-not-allowed" : "bg-neon-purple/10 border-neon-purple/30 text-neon-purple hover:bg-neon-purple hover:text-white"
                      )}
                    >
                      {pending ? 'PINGED...' : 'PING'} <Send className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )})}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
