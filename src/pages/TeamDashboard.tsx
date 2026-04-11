import { useParams, Link } from 'react-router-dom';
import { Users, Shield, Zap, CircleDashed, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import D3SkillRadar, { type RadarData } from '../components/Visualizations/D3SkillRadar';
import { useApp } from '../contexts/AppContext';
import { cn } from '../lib/utils';

export default function TeamDashboard() {
  const { id } = useParams();
  const { teams, currentUser, invites, acceptInvite, users, joinTeam } = useApp();

  const team = teams.find(t => t.id === id);

  if (!team) {
    return <div className="min-h-screen text-white flex items-center justify-center">Team not found in nexus.</div>;
  }

  // Find if current user has a pending invite to THIS team
  const pendingInvite = invites.find(i => i.toUserId === currentUser?.id && i.fromTeamId === team.id && i.status === 'Pending');
  const isMyTeam = currentUser?.teamId === team.id;
  const isSolo = currentUser && !currentUser.teamId;
  const matchesVoid = isSolo && currentUser.role === team.missingRole;

  // Mock suggested matches (in a real app, calculate mathematically)
  const suggestedMatches = users.filter(u => u.status === 'Available' && u.role === team.missingRole).slice(0, 2);

  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 max-w-7xl">
      <Link to="/discover" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 font-mono">
        <ArrowLeft className="w-4 h-4" /> REVERT TO DISCOVERY
      </Link>

      {pendingInvite && (
        <div className="w-full bg-void/10 border border-void/30 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-void/5 to-transparent">
          <div>
            <h3 className="text-xl font-bold font-mono text-void tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 fill-void" /> 
              INCOMING PING DETECTED
            </h3>
            <p className="text-gray-400 mt-1">This squad has requested your specialized skills to fill their void.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button 
              onClick={() => acceptInvite(pendingInvite.id)}
              className="px-6 py-2.5 bg-void text-white font-bold font-mono tracking-widest uppercase rounded-lg shadow-[0_0_15px_rgba(255,42,95,0.4)] hover:shadow-[0_0_25px_rgba(255,42,95,0.6)] transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Accept Protocol
            </button>
          </div>
        </div>
      )}

      {team.status === 'Complete' && (
         <div className="w-full bg-neon-cyan/10 border border-neon-cyan/30 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-center items-center bg-gradient-to-r from-neon-cyan/5 to-transparent">
            <h3 className="text-xl font-bold font-mono text-neon-cyan tracking-tight flex items-center gap-3 uppercase">
              <CheckCircle2 className="w-6 h-6 text-neon-cyan" /> 
              TEAM COMPLETED — ROSTER SECURED
            </h3>
         </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Team Identity & Members */}
        <div className="lg:col-span-1 space-y-6">
          <div className={cn("glass-panel p-8 rounded-[2rem] border relative overflow-hidden", team.status === 'Complete' ? 'border-neon-cyan/30' : 'border-white/5')}>
            {isMyTeam && <div className="absolute top-0 right-0 bg-neon-cyan/20 text-neon-cyan text-[10px] font-bold font-mono px-3 py-1 rounded-bl-xl border-b border-l border-neon-cyan/20 tracking-widest">MY SQUAD</div>}
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-neon-cyan" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{team.name}</h1>
            <p className="text-gray-400 text-sm mb-6">A collective of engineers focused on high-performance infrastructure.</p>
            
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest border-t border-white/5 pt-6">
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-white" /> {team.members.length} Members</span>
              {team.missingRole && (
                <>
                  <span className="w-1 h-1 rounded-full bg-void" />
                  <span className="text-void font-bold shadow-[0_0_10px_rgba(255,42,95,0.2)]">Void Detected</span>
                </>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[1.5rem] border border-white/5">
            <h3 className="font-mono text-sm tracking-widest text-gray-400 mb-4 uppercase">Current Roster</h3>
            <div className="space-y-4">
              {team.members.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center text-neon-cyan text-xs font-bold font-mono shadow-[0_0_10px_rgba(0,245,255,0.1)]">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-medium block">{member.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: The Radar / Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          <div className={cn("glass-panel p-8 rounded-[2rem] border relative overflow-hidden min-h-[400px] flex flex-col", team.status === 'Complete' ? 'border-neon-cyan/20 bg-neon-cyan/5' : 'border-white/5')}>
            <div className="absolute top-0 right-0 p-8 z-10 w-full flex justify-between items-start pointer-events-none">
              <h2 className="text-2xl font-bold font-mono tracking-tight">Void Analysis</h2>
              {team.missingRole ? (
                <div className="px-3 py-1 rounded bg-void/10 border border-void/20 text-void text-xs font-bold font-mono uppercase tracking-widest shadow-[0_0_10px_rgba(255,42,95,0.2)] flex items-center gap-2">
                  <CircleDashed className="w-3 h-3 animate-pulse" /> {team.missingRole}
                </div>
              ) : (
                <div className="px-3 py-1 rounded bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-bold font-mono uppercase tracking-widest shadow-[0_0_10px_rgba(0,245,255,0.2)] flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" /> Integrity 100%
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center relative -mt-4">
              <D3SkillRadar data={team.radar} width={450} height={450} />
            </div>
          </div>

          {/* Conditional Action Panel: Matches Void OR Suggest Matches */}
          {matchesVoid ? (
            <div className="glass-panel p-8 rounded-[2rem] border border-void/40 bg-void/5 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-6 group">
              <div>
                <h3 className="text-2xl font-bold font-mono text-void mb-1 tracking-tight">YOU ARE THE MISSING LINK</h3>
                <p className="text-gray-400 text-sm">Your registered role perfectly coordinates with this team's void. Initiate connection?</p>
              </div>
              <button onClick={() => joinTeam(team.id)} className="px-8 py-4 bg-void text-white font-bold font-mono tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(255,42,95,0.5)] group-hover:shadow-[0_0_40px_rgba(255,42,95,0.8)] transition-all flex items-center gap-2 whitespace-nowrap">
                 [ FILL THE VOID ]
              </button>
            </div>
          ) : team.missingRole && suggestedMatches.length > 0 && !isSolo ? (
            <div className="glass-panel p-8 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-neon-purple" />
                <h3 className="text-lg font-bold">Suggested Automated Matches</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {suggestedMatches.map(match => (
                  <div key={match.id} className="p-4 rounded-xl border border-white/10 hover:border-neon-purple/40 bg-white/5 transition-all flex justify-between items-center group cursor-pointer">
                    <div>
                      <p className="font-bold text-white mb-1">{match.name}</p>
                      <p className="text-xs text-neon-purple font-mono mb-2">{match.role}</p>
                      <div className="flex gap-1">
                        {match.stack.slice(0,3).map(s => <span key={s} className="text-[9px] px-1.5 py-0.5 border border-white/10 rounded bg-black/50 text-gray-400">{s}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xl font-bold font-mono shadow-[0_0_5px_rgba(157,0,255,0.5)]">{match.match}%</span>
                      {isMyTeam && (
                        <button className="text-[10px] font-bold tracking-widest uppercase bg-white text-background px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Ping</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
