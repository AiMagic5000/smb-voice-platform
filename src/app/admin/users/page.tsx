"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Plus,
  Building,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  status: string;
  organizationId: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

interface Organization {
  id: string;
  name: string;
  tier: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createResult, setCreateResult] = useState<{
    success: boolean;
    signupLink?: string;
    message?: string;
    error?: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    organizationName: "",
    tier: "starter",
    role: "user",
    skipPayment: true,
    notes: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createUser() {
    setIsCreating(true);
    setCreateResult(null);

    try {
      const response = await fetch("/api/admin/users/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setCreateResult({
          success: true,
          signupLink: data.signupLink,
          message: data.message,
        });
        fetchUsers();
      } else {
        setCreateResult({
          success: false,
          error: data.error || "Failed to create user",
        });
      }
    } catch (error) {
      setCreateResult({
        success: false,
        error: "An error occurred while creating the user",
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function updateUser(userId: string, updates: Record<string, unknown>) {
    try {
      const response = await fetch("/api/admin/users/manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      organizationName: "",
      tier: "starter",
      role: "user",
      skipPayment: true,
      notes: "",
    });
    setCreateResult(null);
  };

  const copySignupLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      super_admin: { bg: "bg-purple-500/20", text: "text-purple-400" },
      admin: { bg: "bg-blue-500/20", text: "text-blue-400" },
      user: { bg: "bg-slate-500/20", text: "text-slate-400" },
    };
    const badge = badges[role] || badges.user;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {role.replace("_", " ")}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      active: { bg: "bg-green-500/20", text: "text-green-400" },
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      suspended: { bg: "bg-red-500/20", text: "text-red-400" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {status}
      </span>
    );
  };

  const getTierBadge = (tier: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      starter: { bg: "bg-slate-500/20", text: "text-slate-400", label: "Starter" },
      professional: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Professional" },
      enterprise: { bg: "bg-[#C9A227]/20", text: "text-[#C9A227]", label: "Enterprise" },
    };
    const badge = badges[tier] || badges.starter;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">Manage platform users and accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-white w-64"
            />
          </div>
          <Dialog open={createDialogOpen} onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#C9A227] hover:bg-[#B8921F] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white">Create New User Account</DialogTitle>
              </DialogHeader>

              {createResult?.success ? (
                <div className="space-y-4 py-4">
                  <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <UserCheck className="h-5 w-5" />
                      <span className="font-medium">Account Created Successfully</span>
                    </div>
                    <p className="text-slate-300 text-sm">{createResult.message}</p>
                  </div>

                  {createResult.signupLink && (
                    <div className="space-y-2">
                      <Label className="text-slate-300">Signup Link for User</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={createResult.signupLink}
                          className="bg-slate-900 border-slate-700 text-white text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-slate-700"
                          onClick={() => copySignupLink(createResult.signupLink!)}
                        >
                          {copiedLink ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-slate-700"
                          asChild
                        >
                          <a href={createResult.signupLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 text-slate-400" />
                          </a>
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Send this link to the user to complete their account setup
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-300"
                      onClick={() => setCreateDialogOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      className="bg-[#C9A227] hover:bg-[#B8921F] text-white"
                      onClick={resetForm}
                    >
                      Create Another
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {createResult?.error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm">
                      {createResult.error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">First Name</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Last Name</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Organization Name *</Label>
                    <Input
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      placeholder="Acme Inc"
                      className="bg-slate-900 border-slate-700 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Subscription Tier *</Label>
                      <Select
                        value={formData.tier}
                        onValueChange={(value) => setFormData({ ...formData, tier: value })}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="starter">
                            <div className="flex items-center gap-2">
                              <span>Starter</span>
                              <span className="text-slate-500">$7.95/mo</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="professional">
                            <div className="flex items-center gap-2">
                              <span>Professional</span>
                              <span className="text-slate-500">$19.95/mo</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="enterprise">
                            <div className="flex items-center gap-2">
                              <span>Enterprise</span>
                              <span className="text-slate-500">$49.95/mo</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">User Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-900">
                    <Checkbox
                      id="skipPayment"
                      checked={formData.skipPayment}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, skipPayment: checked as boolean })
                      }
                      className="border-slate-600"
                    />
                    <div>
                      <Label htmlFor="skipPayment" className="text-white cursor-pointer">
                        Skip Payment Requirement
                      </Label>
                      <p className="text-xs text-slate-400">
                        Grant full access without Gumroad payment
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Admin Notes (optional)</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Internal notes about this account..."
                      className="bg-slate-900 border-slate-700 text-white resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-300"
                      onClick={() => setCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createUser}
                      disabled={isCreating || !formData.email || !formData.organizationName}
                      className="bg-[#C9A227] hover:bg-[#B8921F] text-white"
                    >
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-sm text-slate-400">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.role === "admin" || u.role === "super_admin").length}
              </p>
              <p className="text-sm text-slate-400">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.status === "active").length}
              </p>
              <p className="text-sm text-slate-400">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Building className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.status === "pending").length}
              </p>
              <p className="text-sm text-slate-400">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Last Login
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.email}
                            </p>
                            <p className="text-sm text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem
                              className="text-slate-300 focus:bg-slate-700"
                              onClick={() => updateUser(user.id, { newRole: "user" })}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Set as User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-slate-300 focus:bg-slate-700"
                              onClick={() => updateUser(user.id, { newRole: "admin" })}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Set as Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-purple-400 focus:bg-slate-700"
                              onClick={() => updateUser(user.id, { newRole: "super_admin" })}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Set as Super Admin
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-700" />
                            <DropdownMenuItem
                              className="text-green-400 focus:bg-slate-700"
                              onClick={() => updateUser(user.id, { newStatus: "active" })}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 focus:bg-slate-700"
                              onClick={() => updateUser(user.id, { newStatus: "suspended" })}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Payment Integration</p>
              <p className="text-sm text-slate-300 mt-1">
                Users created with &quot;Skip Payment&quot; enabled will have full access without needing to complete Gumroad checkout.
                Use this for demo accounts, partners, or special arrangements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
