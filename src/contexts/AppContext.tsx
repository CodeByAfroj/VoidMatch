import React, { createContext, useContext, useState, ReactNode } from 'react';
import { type RadarData } from '../components/Visualizations/D3SkillRadar';

export interface User {
  id: string;
  name: string;
  role: string;
  stack: string[];
  status: 'Available' | 'Busy' | 'In Team';
  teamId?: string;
  match?: number;
}

export interface Team {
  id: string;
  name: string;
  members: User[];
  radar: RadarData[];
  missingRole: string | null;
  status: 'Scouting' | 'High Priority' | 'Complete';
  match?: number;
}

export interface Invite {
  id: string;
  fromTeamId: string;
  toUserId: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

interface AppState {
  currentUser: User | null;
  users: User[];
  teams: Team[];
  invites: Invite[];
  login: (name: string) => void;
  logout: () => void;
  register: (name: string, role: string, stack: string[]) => void;
  sendInvite: (teamId: string, userId: string) => void;
  acceptInvite: (inviteId: string) => void;
  joinTeam: (teamId: string) => void;
}

const defaultState: AppState = {
  currentUser: null,
  users: [],
  teams: [],
  invites: [],
  login: () => {},
  logout: () => {},
  register: () => {},
  sendInvite: () => {},
  acceptInvite: () => {},
  joinTeam: () => {}
};

const AppContext = createContext<AppState>(defaultState);

export const useApp = () => useContext(AppContext);

// Mock Initial Data
const initialUsers: User[] = [
  { id: '1', name: 'Alex K.', role: 'Frontend Wizard', stack: ['React', 'D3.js', 'Tailwind'], status: 'Available', match: 92 },
  { id: '2', name: 'Sarah M.', role: 'Backend Architect', stack: ['Node.js', 'Go', 'PostgreSQL'], status: 'Available', match: 45 },
  { id: '3', name: 'David L.', role: 'UI/UX Visionary', stack: ['Figma', 'Framer', 'CSS'], status: 'Busy', match: 78 },
  { id: '4', name: 'Elena R.', role: 'Fullstack Engineer', stack: ['Next.js', 'Prisma', 'AWS'], status: 'Available', match: 88 },
];

const initialTeams: Team[] = [
  {
    id: 't1',
    name: 'Quantum Hackers',
    members: [{ id: 'm1', name: 'Sarah M.', role: 'Backend Architect', stack: [], status: 'In Team' }],
    radar: [
      { axis: 'Frontend', value: 90 },
      { axis: 'Backend', value: 85 },
      { axis: 'UI/UX', value: 20, isMissing: true },
      { axis: 'DevOps', value: 70 },
      { axis: 'Product', value: 60 },
    ],
    missingRole: 'UI/UX Visionary',
    status: 'Scouting',
    match: 95
  },
  {
    id: 't2',
    name: 'Data Synapse',
    members: [
      { id: 'm2', name: 'Liam P.', role: 'Backend Architect', stack: [], status: 'In Team' },
      { id: 'm3', name: 'Jessica R.', role: 'UI/UX Visionary', stack: [], status: 'In Team' }
    ],
    radar: [
      { axis: 'Frontend', value: 20, isMissing: true },
      { axis: 'Backend', value: 95 },
      { axis: 'UI/UX', value: 50 },
      { axis: 'DevOps', value: 80 },
      { axis: 'Product', value: 85 },
    ],
    missingRole: 'Frontend Wizard',
    status: 'High Priority',
    match: 82
  },
  {
    id: 't3',
    name: 'Neon Horizon',
    members: [
      { id: 'm4', name: 'Chris T.', role: 'Frontend Wizard', stack: [], status: 'In Team' },
      { id: 'm5', name: 'Alice W.', role: 'Frontend Wizard', stack: [], status: 'In Team' }
    ],
    radar: [
      { axis: 'Frontend', value: 98 },
      { axis: 'Backend', value: 15, isMissing: true },
      { axis: 'UI/UX', value: 75 },
      { axis: 'DevOps', value: 30 },
      { axis: 'Product', value: 60 },
    ],
    missingRole: 'Backend Architect',
    status: 'Scouting',
    match: 88
  },
  {
    id: 't4',
    name: 'Aero Dynamics',
    members: [
      { id: 'm6', name: 'Samira L.', role: 'Frontend Wizard', stack: [], status: 'In Team' },
      { id: 'm7', name: 'John D.', role: 'Backend Architect', stack: [], status: 'In Team' },
      { id: 'm8', name: 'Maya C.', role: 'UI/UX Visionary', stack: [], status: 'In Team' }
    ],
    radar: [
      { axis: 'Frontend', value: 90 },
      { axis: 'Backend', value: 90 },
      { axis: 'UI/UX', value: 95 },
      { axis: 'DevOps', value: 15, isMissing: true },
      { axis: 'Product', value: 80 },
    ],
    missingRole: 'Fullstack Engineer',
    status: 'High Priority',
    match: 94
  },
  {
    id: 't5',
    name: 'Cybernetics Core',
    members: [
      { id: 'm9', name: 'Oliver B.', role: 'Fullstack Engineer', stack: [], status: 'In Team' },
      { id: 'm10', name: 'Emma H.', role: 'Fullstack Engineer', stack: [], status: 'In Team' },
      { id: 'm11', name: 'Noah S.', role: 'Backend Architect', stack: [], status: 'In Team' },
      { id: 'm12', name: 'Ava J.', role: 'UI/UX Visionary', stack: [], status: 'In Team' }
    ],
    radar: [
      { axis: 'Frontend', value: 95 },
      { axis: 'Backend', value: 95 },
      { axis: 'UI/UX', value: 95 },
      { axis: 'DevOps', value: 90 },
      { axis: 'Product', value: 85 },
    ],
    missingRole: null,
    status: 'Complete',
    match: 100
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [invites, setInvites] = useState<Invite[]>([]);

  const login = (name: string) => {
    const user = users.find(u => u.name === name);
    if (user) setCurrentUser(user);
    // Else, normally handle error
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (name: string, role: string, stack: string[]) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      stack,
      status: 'Available',
      match: 100 // new users are 100% match to something!
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const sendInvite = (teamId: string, userId: string) => {
    const newInvite: Invite = {
      id: Math.random().toString(36).substr(2, 9),
      fromTeamId: teamId,
      toUserId: userId,
      status: 'Pending'
    };
    setInvites([...invites, newInvite]);
  };

  const executeJoinLogic = (userToJoin: User, teamId: string) => {
    const updatedUser = { ...userToJoin, status: 'In Team' as const, teamId };
    
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);

    setTeams(teams.map(t => {
      if (t.id === teamId) {
        // Resolve the radar void. Find if their role matches the missingRole
        const updatedRadar = t.radar.map(r => {
           if (r.isMissing && t.missingRole === updatedUser.role) {
             return { ...r, value: 95, isMissing: false }; // Max out value, resolve it
           }
           return r;
        });

        const resolvedMissing = t.missingRole === updatedUser.role ? null : t.missingRole;

        return {
          ...t,
          members: [...t.members, updatedUser],
          radar: updatedRadar,
          missingRole: resolvedMissing,
          status: resolvedMissing ? t.status : 'Complete'
        };
      }
      return t;
    }));
  };

  const acceptInvite = (inviteId: string) => {
    const invite = invites.find(i => i.id === inviteId);
    if (!invite) return;

    setInvites(invites.map(i => i.id === inviteId ? { ...i, status: 'Accepted' } : i));

    const userToJoin = users.find(u => u.id === invite.toUserId) || currentUser;
    if (!userToJoin) return;
    executeJoinLogic(userToJoin, invite.fromTeamId);
  };

  const joinTeam = (teamId: string) => {
    if (!currentUser) return;
    executeJoinLogic(currentUser, teamId);
  };

  return (
    <AppContext.Provider value={{ currentUser, users, teams, invites, login, logout, register, sendInvite, acceptInvite, joinTeam }}>
      {children}
    </AppContext.Provider>
  );
};
