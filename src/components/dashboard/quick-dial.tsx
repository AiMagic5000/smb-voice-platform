"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Star,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickDialContact {
  id: string;
  name: string;
  number: string;
  avatar?: string;
  isFavorite?: boolean;
}

interface QuickDialProps {
  contacts?: QuickDialContact[];
  onCall?: (number: string) => void;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

const sampleContacts: QuickDialContact[] = [
  { id: "1", name: "Main Office", number: "(555) 100-0001", isFavorite: true },
  { id: "2", name: "Support Desk", number: "(555) 100-0002", isFavorite: true },
  { id: "3", name: "John Smith", number: "(555) 234-5678", isFavorite: false },
  { id: "4", name: "Sales Team", number: "(555) 100-0003", isFavorite: false },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-orange-500",
];

function getAvatarColor(id: string): string {
  const index = parseInt(id, 10) % avatarColors.length;
  return avatarColors[index] || avatarColors[0];
}

export function QuickDial({
  contacts = sampleContacts,
  onCall,
  onAdd,
  onEdit,
  onDelete,
  onToggleFavorite,
  className,
}: QuickDialProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleCall = useCallback(
    (number: string) => {
      onCall?.(number);
      // In real implementation, this would initiate a call via SignalWire
      console.log("Calling:", number);
    },
    [onCall]
  );

  const favorites = contacts.filter((c) => c.isFavorite);
  const others = contacts.filter((c) => !c.isFavorite);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#1E3A5F]">
            Quick Dial
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-[#C9A227] hover:text-[#B8911F] hover:bg-[#FDF8E8]"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
              <Star className="h-3 w-3 fill-current text-[#C9A227]" />
              Favorites
            </div>
            <div className="grid grid-cols-2 gap-2">
              {favorites.map((contact, index) => (
                <motion.button
                  key={contact.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCall(contact.number)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#FDF8E8] hover:bg-[#F5EFDB] transition-colors text-left group"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm",
                      getAvatarColor(contact.id)
                    )}
                  >
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      getInitials(contact.name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1E3A5F] text-sm truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.number}
                    </p>
                  </div>
                  <Phone className="h-4 w-4 text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Other Contacts */}
        {others.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
              <User className="h-3 w-3" />
              Contacts
            </div>
            <div className="space-y-1">
              {others.map((contact, index) => (
                <div key={contact.id} className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (favorites.length + index) * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center text-white font-semibold text-xs",
                        getAvatarColor(contact.id)
                      )}
                    >
                      {getInitials(contact.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1E3A5F] text-sm truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500">{contact.number}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCall(contact.number)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setActiveMenu(contact.id)}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>

                  {/* Context Menu */}
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
                              onToggleFavorite?.(contact.id);
                              setActiveMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Star className="h-4 w-4" />
                            Add to favorites
                          </button>
                          <button
                            onClick={() => {
                              onEdit?.(contact.id);
                              setActiveMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDelete?.(contact.id);
                              setActiveMenu(null);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {contacts.length === 0 && (
          <div className="text-center py-6">
            <Phone className="h-10 w-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No quick dial contacts</p>
            <Button
              variant="link"
              size="sm"
              className="text-[#C9A227] mt-1"
              onClick={onAdd}
            >
              Add your first contact
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default QuickDial;
