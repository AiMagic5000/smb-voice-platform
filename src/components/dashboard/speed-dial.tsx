"use client";

import { useState } from "react";
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  Phone,
  User,
  Building,
  Star,
  GripVertical,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SpeedDialEntry {
  id: string;
  slot: number;
  name: string;
  phoneNumber: string;
  type: "person" | "business" | "extension";
  extension?: string;
  isFavorite: boolean;
}

// Mock speed dial data
const mockSpeedDials: SpeedDialEntry[] = [
  {
    id: "1",
    slot: 1,
    name: "Main Reception",
    phoneNumber: "+1 (555) 100-0000",
    type: "extension",
    extension: "100",
    isFavorite: true,
  },
  {
    id: "2",
    slot: 2,
    name: "John Smith",
    phoneNumber: "+1 (555) 123-4567",
    type: "person",
    isFavorite: true,
  },
  {
    id: "3",
    slot: 3,
    name: "IT Support",
    phoneNumber: "+1 (555) 987-6543",
    type: "business",
    isFavorite: false,
  },
  {
    id: "4",
    slot: 4,
    name: "Sarah Johnson",
    phoneNumber: "+1 (555) 456-7890",
    type: "person",
    isFavorite: true,
  },
  {
    id: "5",
    slot: 5,
    name: "Sales Hotline",
    phoneNumber: "+1 (555) 200-0000",
    type: "extension",
    extension: "200",
    isFavorite: false,
  },
];

const typeConfig = {
  person: {
    icon: User,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  business: {
    icon: Building,
    color:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  extension: {
    icon: Phone,
    color:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
};

export function SpeedDial() {
  const [speedDials, setSpeedDials] = useState<SpeedDialEntry[]>(mockSpeedDials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: "",
    phoneNumber: "",
    type: "person" as SpeedDialEntry["type"],
    extension: "",
  });

  const maxSlots = 9; // Speed dial slots 1-9
  const availableSlots = Array.from({ length: maxSlots }, (_, i) => i + 1).filter(
    (slot) => !speedDials.some((sd) => sd.slot === slot)
  );

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.phoneNumber || availableSlots.length === 0) {
      return;
    }

    const entry: SpeedDialEntry = {
      id: Date.now().toString(),
      slot: availableSlots[0],
      name: newEntry.name,
      phoneNumber: newEntry.phoneNumber,
      type: newEntry.type,
      extension: newEntry.extension || undefined,
      isFavorite: false,
    };

    setSpeedDials([...speedDials, entry].sort((a, b) => a.slot - b.slot));
    setShowAddForm(false);
    setNewEntry({ name: "", phoneNumber: "", type: "person", extension: "" });
  };

  const handleRemoveEntry = (id: string) => {
    setSpeedDials(speedDials.filter((sd) => sd.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setSpeedDials(
      speedDials.map((sd) =>
        sd.id === id ? { ...sd, isFavorite: !sd.isFavorite } : sd
      )
    );
  };

  const handleCall = (phoneNumber: string) => {
    // In real implementation, would trigger click-to-call
    console.log("Calling:", phoneNumber);
  };

  const sortedDials = [...speedDials].sort((a, b) => a.slot - b.slot);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Speed Dial
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quick-dial your most frequently called numbers
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          disabled={availableSlots.length === 0}
          className="btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Speed Dial
        </Button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {Array.from({ length: maxSlots }, (_, i) => {
          const slot = i + 1;
          const entry = speedDials.find((sd) => sd.slot === slot);

          if (entry) {
            const config = typeConfig[entry.type];
            const TypeIcon = config.icon;

            return (
              <button
                key={slot}
                onClick={() => handleCall(entry.phoneNumber)}
                className="relative p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#C9A227] hover:shadow-md transition-all group"
              >
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#1E3A5F] text-white text-xs font-bold flex items-center justify-center">
                  {slot}
                </div>
                {entry.isFavorite && (
                  <Star className="absolute top-2 right-2 h-4 w-4 text-[#C9A227] fill-current" />
                )}
                <div
                  className={cn(
                    "w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2",
                    config.color
                  )}
                >
                  <TypeIcon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white text-center truncate">
                  {entry.name}
                </p>
                <div className="absolute inset-0 bg-[#C9A227]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Phone className="h-6 w-6 text-[#C9A227]" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={slot}
              onClick={() => setShowAddForm(true)}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-[#1E3A5F] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center justify-center">
                {slot}
              </div>
              <div className="w-10 h-10 mx-auto rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                <Plus className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Empty
              </p>
            </button>
          );
        })}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Add Speed Dial Entry
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <Input
                value={newEntry.name}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, name: e.target.value })
                }
                placeholder="Contact name"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number *
              </label>
              <Input
                value={newEntry.phoneNumber}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, phoneNumber: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={newEntry.type}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    type: e.target.value as SpeedDialEntry["type"],
                  })
                }
                className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="person">Person</option>
                <option value="business">Business</option>
                <option value="extension">Extension</option>
              </select>
            </div>
            {newEntry.type === "extension" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Extension Number
                </label>
                <Input
                  value={newEntry.extension}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, extension: e.target.value })
                  }
                  placeholder="100"
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          {availableSlots.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Will be assigned to slot {availableSlots[0]}
            </p>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleAddEntry} className="btn-primary gap-2">
              <Save className="h-4 w-4" />
              Add Entry
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
              className="dark:border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Detailed List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          All Speed Dials
        </h3>
        {sortedDials.map((entry) => {
          const config = typeConfig[entry.type];
          const TypeIcon = config.icon;

          return (
            <div
              key={entry.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                    <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white font-bold flex items-center justify-center">
                      {entry.slot}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      config.color
                    )}
                  >
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {entry.name}
                      </h4>
                      {entry.isFavorite && (
                        <Star className="h-4 w-4 text-[#C9A227] fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.phoneNumber}
                      {entry.extension && ` • Ext. ${entry.extension}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(entry.id)}
                    className={cn(
                      "text-gray-400 hover:text-[#C9A227]",
                      entry.isFavorite && "text-[#C9A227]"
                    )}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        entry.isFavorite && "fill-current"
                      )}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCall(entry.phoneNumber)}
                    className="text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(entry.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {speedDials.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No speed dials configured</p>
            <p className="text-sm mt-1">
              Add your first speed dial to quickly call your contacts
            </p>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Keyboard Shortcuts
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-xs font-mono">1</kbd> - <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-xs font-mono">9</kbd> while
          on the dialer to quickly call your speed dial contacts.
        </p>
      </div>
    </div>
  );
}
