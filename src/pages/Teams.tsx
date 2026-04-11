import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, Hash, Network, CheckCircle2 } from 'lucide-react';
import D3SkillRadar from '../components/Visualizations/D3SkillRadar';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Teams() {
  const { teams, currentUser, joinTeam } = useApp();
  const [filter, setFilter] = useState('All');

  const filteredTeams = filter === 'All' 
    ? teams 
    : filter === 'Missing Skill'
    ? teams.filter(t => t.missingRole)
    : teams.filter(t => !t.missingRole);

  const isSolo = currentUser && !currentUser.teamId;

  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 max-w-7xl relative z-10">
      
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-full h-[500px] bg-gradient-to-b from-neon-cyan/5 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 mb-4">
            <Network className="w-4 h-4 text-neon-purple" />
            <span className="text-xs font-mono font-medium tracking-wider uppercase">Active Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            Squad <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Directory</span>
          </h1>
          <p className="text-gray-400 font-light">Browse the most advanced collectives currently navigating the network.</p>
        </div>

        <div className="flex p-1.5 rounded-[1.25rem] glass-panel border border-white/10 h-fit">
          {['All', 'Missing Skill', 'Complete'].map(tab => (
             <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "relative px-6 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-colors z-10",
                  filter === tab ? "text-background" : "text-gray-400 hover:text-white"
                )}
             >
               {filter === tab && (
                 <motion.div layoutId="teams-filter" className="absolute inset-0 bg-white rounded-xl -z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
               )}
               {tab.toUpperCase()}
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {filteredTeams.map((squad) => {
          const isHighPriority = squad.status === 'High Priority';
          const matchesVoid = isSolo && currentUser.role === squad.missingRole;

          return (
          <div key={squad.id} className={cn("glass-panel p-8 rounded-[2rem] border transition-all duration-300 flex flex-col group relative overflow-hidden", squad.status === 'Complete' ? 'border-neon-cyan/30 bg-neon-cyan/5' : 'border-white/5 hover:border-white/20')}>
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
                {squad.status === 'Complete' ? (
                  <span className="text-[10px] uppercase font-mono text-neon-cyan px-2 py-0.5 rounded bg-neon-cyan/10 border border-neon-cyan/20">Secure Roster</span>
                ) : isHighPriority && (
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
                     <span className="text-neon-cyan tracking-widest font-mono text-sm uppercase flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Complete Roster</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {matchesVoid && (
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
      </div>
    </div>
  );
}
