"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building,
  MoreVertical,
  Edit2,
  Trash2,
  Star,
  StarOff,
  Filter,
  Download,
  Upload,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  company?: string;
  department?: string;
  isFavorite: boolean;
  tags: string[];
  lastContacted?: Date;
  notes?: string;
}

interface ContactListProps {
  contacts?: Contact[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCall?: (phone: string) => void;
  onToggleFavorite?: (id: string) => void;
  onImport?: () => void;
  onExport?: () => void;
  className?: string;
}

const sampleContacts: Contact[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@acme.com",
    phone: "(555) 123-4567",
    company: "Acme Corp",
    department: "Sales",
    isFavorite: true,
    tags: ["client", "priority"],
    lastContacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@techstart.io",
    phone: "(555) 234-5678",
    company: "TechStart",
    department: "Engineering",
    isFavorite: true,
    tags: ["partner"],
    lastContacted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    email: "m.brown@globalinc.com",
    phone: "(555) 345-6789",
    company: "Global Inc",
    isFavorite: false,
    tags: ["lead"],
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    phone: "(555) 456-7890",
    company: "Davis & Associates",
    isFavorite: false,
    tags: ["vendor"],
    lastContacted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Wilson",
    email: "rwilson@enterprise.co",
    phone: "(555) 567-8901",
    company: "Enterprise Co",
    department: "Procurement",
    isFavorite: false,
    tags: ["client"],
  },
];

const tagColors: Record<string, string> = {
  client: "bg-blue-100 text-blue-700",
  partner: "bg-green-100 text-green-700",
  lead: "bg-yellow-100 text-yellow-700",
  vendor: "bg-purple-100 text-purple-700",
  priority: "bg-red-100 text-red-700",
};

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}

function formatLastContacted(date?: Date): string {
  if (!date) return "Never";
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

export function ContactList({
  contacts = sampleContacts,
  onAdd,
  onEdit,
  onDelete,
  onCall,
  onToggleFavorite,
  onImport,
  onExport,
  className,
}: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach((c) => c.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          contact.firstName.toLowerCase().includes(query) ||
          contact.lastName.toLowerCase().includes(query) ||
          contact.email?.toLowerCase().includes(query) ||
          contact.phone.includes(query) ||
          contact.company?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Tag filter
      if (filterTag && !contact.tags.includes(filterTag)) {
        return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !contact.isFavorite) {
        return false;
      }

      return true;
    });
  }, [contacts, searchQuery, filterTag, showFavoritesOnly]);

  // Sort: favorites first, then alphabetically
  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });
  }, [filteredContacts]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
            <Users className="h-5 w-5" />
            Contacts
            <span className="text-sm font-normal text-gray-500">
              ({filteredContacts.length})
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={onImport}
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={onExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              size="sm"
              className="gap-1 bg-[#C9A227] hover:bg-[#B8911F] text-white"
              onClick={onAdd}
            >
              <UserPlus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterTag || ""}
              onChange={(e) => setFilterTag(e.target.value || null)}
              className="px-3 py-2 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none bg-white text-sm"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "p-2 rounded-xl border transition-colors",
                showFavoritesOnly
                  ? "border-[#C9A227] bg-[#FDF8E8] text-[#C9A227]"
                  : "border-gray-200 text-gray-400 hover:text-[#C9A227]"
              )}
              title="Show favorites only"
            >
              <Star className={cn("h-5 w-5", showFavoritesOnly && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className="space-y-2">
          {sortedContacts.length > 0 ? (
            sortedContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2D5A8F] flex items-center justify-center text-white font-semibold">
                    {getInitials(contact.firstName, contact.lastName)}
                  </div>
                  {contact.isFavorite && (
                    <Star className="absolute -top-1 -right-1 h-4 w-4 text-[#C9A227] fill-current" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#1E3A5F] truncate">
                      {contact.firstName} {contact.lastName}
                    </h4>
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full hidden sm:inline-block",
                          tagColors[tag] || "bg-gray-100 text-gray-600"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    {contact.company && (
                      <span className="flex items-center gap-1 truncate">
                        <Building className="h-3.5 w-3.5" />
                        {contact.company}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {contact.phone}
                    </span>
                  </div>
                </div>

                {/* Last Contacted */}
                <div className="hidden md:block text-right">
                  <p className="text-xs text-gray-400">Last contacted</p>
                  <p className="text-sm text-gray-600">
                    {formatLastContacted(contact.lastContacted)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onCall?.(contact.phone)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Call"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => onToggleFavorite?.(contact.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      contact.isFavorite
                        ? "text-[#C9A227] hover:bg-[#FDF8E8]"
                        : "text-gray-400 hover:text-[#C9A227] hover:bg-gray-100"
                    )}
                    title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {contact.isFavorite ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </button>

                  {/* More Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === contact.id ? null : contact.id)}
                      className="p-2 text-gray-400 hover:text-[#1E3A5F] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    <AnimatePresence>
                      {activeMenu === contact.id && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenu(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[140px]"
                          >
                            <button
                              onClick={() => {
                                onEdit?.(contact.id);
                                setActiveMenu(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                onDelete?.(contact.id);
                                setActiveMenu(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No contacts found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery || filterTag
                  ? "Try adjusting your search or filters"
                  : "Add your first contact to get started"}
              </p>
              {!searchQuery && !filterTag && (
                <Button
                  variant="link"
                  className="text-[#C9A227] mt-2"
                  onClick={onAdd}
                >
                  Add Contact
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ContactList;
