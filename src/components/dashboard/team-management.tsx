"use client";

import React, { useState } from "react";

// ============================================
// Types
// ============================================

export type TeamMemberRole = "owner" | "admin" | "member" | "viewer";
export type TeamMemberStatus = "active" | "pending" | "inactive";

export interface TeamMember {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  extension?: {
    number: string;
    id: string;
  };
  avatarUrl?: string;
  lastActive?: string;
  invitedAt?: string;
  joinedAt?: string;
}

interface TeamManagementProps {
  members: TeamMember[];
  currentUserId?: string;
  canManageTeam?: boolean;
  onInvite?: (email: string, role: TeamMemberRole) => Promise<void>;
  onUpdateRole?: (memberId: string, role: TeamMemberRole) => Promise<void>;
  onRemove?: (memberId: string) => Promise<void>;
  onResendInvite?: (memberId: string) => Promise<void>;
}

// ============================================
// Team Management Component
// ============================================

export function TeamManagement({
  members,
  currentUserId,
  canManageTeam = true,
  onInvite,
  onUpdateRole,
  onRemove,
  onResendInvite,
}: TeamManagementProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMemberRole>("member");
  const [isInviting, setIsInviting] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const roleLabels: Record<TeamMemberRole, { label: string; description: string; color: string }> = {
    owner: {
      label: "Owner",
      description: "Full access and billing",
      color: "bg-purple-100 text-purple-700",
    },
    admin: {
      label: "Admin",
      description: "Full access, no billing",
      color: "bg-blue-100 text-blue-700",
    },
    member: {
      label: "Member",
      description: "Standard access",
      color: "bg-green-100 text-green-700",
    },
    viewer: {
      label: "Viewer",
      description: "Read-only access",
      color: "bg-gray-100 text-gray-700",
    },
  };

  const filteredMembers = members.filter((m) => {
    // Status filter
    if (filter === "active" && m.status !== "active") return false;
    if (filter === "pending" && m.status !== "pending") return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
      return (
        m.email.toLowerCase().includes(query) ||
        fullName.includes(query) ||
        m.extension?.number.includes(query)
      );
    }

    return true;
  });

  const handleInvite = async () => {
    if (!inviteEmail || !onInvite) return;

    setIsInviting(true);
    try {
      await onInvite(inviteEmail, inviteRole);
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("member");
    } finally {
      setIsInviting(false);
    }
  };

  const getInitials = (member: TeamMember) => {
    if (member.firstName && member.lastName) {
      return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
    }
    return member.email[0].toUpperCase();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <p className="text-sm text-gray-500 mt-1">{members.length} members</p>
        </div>
        {canManageTeam && onInvite && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-[#C9A227] text-white rounded-lg hover:bg-[#B8911F] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invite Member
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(["all", "active", "pending"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-3 py-1.5 text-sm rounded-md transition-colors
                ${filter === status
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="divide-y divide-gray-100">
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="font-medium">No members found</p>
            <p className="text-sm mt-1">
              {searchQuery ? "Try a different search term" : "Invite team members to get started"}
            </p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isCurrentUser={member.id === currentUserId}
              roleLabels={roleLabels}
              canManage={canManageTeam && member.id !== currentUserId && member.role !== "owner"}
              getInitials={getInitials}
              formatDate={formatDate}
              onUpdateRole={onUpdateRole}
              onRemove={onRemove}
              onResendInvite={onResendInvite}
            />
          ))
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          email={inviteEmail}
          role={inviteRole}
          isInviting={isInviting}
          roleLabels={roleLabels}
          onEmailChange={setInviteEmail}
          onRoleChange={setInviteRole}
          onInvite={handleInvite}
          onClose={() => {
            setShowInviteModal(false);
            setInviteEmail("");
            setInviteRole("member");
          }}
        />
      )}
    </div>
  );
}

// ============================================
// Member Row Component
// ============================================

function MemberRow({
  member,
  isCurrentUser,
  roleLabels,
  canManage,
  getInitials,
  formatDate,
  onUpdateRole,
  onRemove,
  onResendInvite,
}: {
  member: TeamMember;
  isCurrentUser: boolean;
  roleLabels: Record<TeamMemberRole, { label: string; description: string; color: string }>;
  canManage: boolean;
  getInitials: (m: TeamMember) => string;
  formatDate: (d?: string) => string;
  onUpdateRole?: (id: string, role: TeamMemberRole) => Promise<void>;
  onRemove?: (id: string) => Promise<void>;
  onResendInvite?: (id: string) => Promise<void>;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (role: TeamMemberRole) => {
    if (!onUpdateRole) return;
    setIsUpdating(true);
    try {
      await onUpdateRole(member.id, role);
    } finally {
      setIsUpdating(false);
      setShowMenu(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove || !confirm(`Remove ${member.email} from the team?`)) return;
    setIsUpdating(true);
    try {
      await onRemove(member.id);
    } finally {
      setIsUpdating(false);
      setShowMenu(false);
    }
  };

  const handleResendInvite = async () => {
    if (!onResendInvite) return;
    setIsUpdating(true);
    try {
      await onResendInvite(member.id);
    } finally {
      setIsUpdating(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt=""
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white font-medium">
            {getInitials(member)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {member.firstName && member.lastName
              ? `${member.firstName} ${member.lastName}`
              : member.email}
          </span>
          {isCurrentUser && (
            <span className="text-xs text-gray-500">(You)</span>
          )}
          {member.status === "pending" && (
            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
              Pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <span>{member.email}</span>
          {member.extension && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Ext {member.extension.number}
            </span>
          )}
        </div>
      </div>

      {/* Role Badge */}
      <div className={`px-3 py-1 text-xs font-medium rounded-full ${roleLabels[member.role].color}`}>
        {roleLabels[member.role].label}
      </div>

      {/* Last Active / Joined */}
      <div className="text-sm text-gray-400 w-24 text-right">
        {member.status === "pending"
          ? `Invited ${formatDate(member.invitedAt)}`
          : member.lastActive
            ? `Active ${formatDate(member.lastActive)}`
            : formatDate(member.joinedAt)
        }
      </div>

      {/* Actions */}
      {canManage && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            disabled={isUpdating}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            {isUpdating ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            )}
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                {member.status === "pending" && onResendInvite && (
                  <button
                    onClick={handleResendInvite}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Resend Invite
                  </button>
                )}
                {onUpdateRole && (
                  <>
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                      Change Role
                    </div>
                    {(["admin", "member", "viewer"] as TeamMemberRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        disabled={member.role === role}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                          member.role === role ? "text-gray-400" : ""
                        }`}
                      >
                        {roleLabels[role].label}
                      </button>
                    ))}
                  </>
                )}
                {onRemove && (
                  <>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleRemove}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// Invite Modal Component
// ============================================

function InviteModal({
  email,
  role,
  isInviting,
  roleLabels,
  onEmailChange,
  onRoleChange,
  onInvite,
  onClose,
}: {
  email: string;
  role: TeamMemberRole;
  isInviting: boolean;
  roleLabels: Record<TeamMemberRole, { label: string; description: string; color: string }>;
  onEmailChange: (email: string) => void;
  onRoleChange: (role: TeamMemberRole) => void;
  onInvite: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-0 top-[10%] mx-auto max-w-md z-50 px-4">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Invite Team Member</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="space-y-2">
                {(["admin", "member", "viewer"] as TeamMemberRole[]).map((r) => (
                  <label
                    key={r}
                    className={`
                      flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors
                      ${role === r ? "border-[#C9A227] bg-[#C9A227]/5" : "border-gray-200 hover:border-gray-300"}
                    `}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={role === r}
                      onChange={() => onRoleChange(r)}
                      className="mt-0.5 accent-[#C9A227]"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{roleLabels[r].label}</div>
                      <div className="text-sm text-gray-500">{roleLabels[r].description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onInvite}
              disabled={!email || isInviting}
              className="px-4 py-2 bg-[#C9A227] text-white rounded-lg hover:bg-[#B8911F] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isInviting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Invite
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamManagement;
