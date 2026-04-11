import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network, LogOut, KeySquare, UserCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../contexts/AppContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, invites } = useApp();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'System Core', path: '/' },
    { name: 'Discovery Feed', path: '/discover' },
    { name: 'All Teams', path: '/teams' },
  ];

  if (currentUser?.teamId) {
    navLinks.push({ name: 'My Squad', path: `/team/${currentUser.teamId}` });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pendingInvites = invites.filter(i => i.toUserId === currentUser?.id && i.status === 'Pending').length;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled 
          ? 'glass-panel border-white/5 py-3' 
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Network className="w-5 h-5 text-neon-purple transition-transform duration-500 group-hover:rotate-12" />
          <span className="font-sans font-bold text-lg tracking-tight text-white">
            Void<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">Match</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className="relative group text-[13px] font-semibold tracking-wider font-mono uppercase"
              >
                <span className={cn(
                  "transition-colors duration-200", 
                  isActive ? "text-neon-cyan" : "text-gray-500 group-hover:text-gray-300"
                )}>
                  {link.name}
                  {link.name === 'My Squad' && pendingInvites > 0 && (
                    <span className="absolute -top-1 -right-3 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-void opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-void border border-[#0B0E14]"></span>
                    </span>
                  )}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[6px] left-0 right-0 h-[2px] bg-neon-cyan rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-neon-cyan">
                <UserCircle className="w-4 h-4" />
                {currentUser.name}
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white/5 text-white hover:bg-void/20 hover:text-void border border-white/10 hover:border-void/50 transition-all duration-300 px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </>
          ) : (
            <Link to="/" className="bg-white text-background hover:bg-neon-purple hover:text-white transition-all duration-300 px-5 py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-2 shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_25px_rgba(157,0,255,0.3)]">
              <KeySquare className="w-3.5 h-3.5" />
              Join Network
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
