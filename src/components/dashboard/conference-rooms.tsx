"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Copy,
  Check,
  Clock,
  Calendar,
  Link2,
  User,
  Lock,
  Unlock,
  Video,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  phoneNumber: string;
  isMuted: boolean;
  isHost: boolean;
  joinedAt: string;
}

interface ConferenceRoom {
  id: string;
  name: string;
  pin: string;
  dialInNumber: string;
  moderatorPin?: string;
  maxParticipants: number;
  isActive: boolean;
  isLocked: boolean;
  participants: Participant[];
  createdAt: string;
  settings: {
    muteOnEntry: boolean;
    recordCalls: boolean;
    announceJoinLeave: boolean;
    waitForModerator: boolean;
  };
}

// Mock conference rooms
const mockRooms: ConferenceRoom[] = [
  {
    id: "1",
    name: "Sales Team Daily",
    pin: "123456",
    dialInNumber: "+1 (555) 800-1000",
    moderatorPin: "789012",
    maxParticipants: 50,
    isActive: true,
    isLocked: false,
    participants: [
      {
        id: "p1",
        name: "John Smith",
        phoneNumber: "+1 (555) 123-4567",
        isMuted: false,
        isHost: true,
        joinedAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "p2",
        name: "Sarah Wilson",
        phoneNumber: "+1 (555) 987-6543",
        isMuted: true,
        isHost: false,
        joinedAt: new Date(Date.now() - 180000).toISOString(),
      },
      {
        id: "p3",
        name: "Mike Johnson",
        phoneNumber: "+1 (555) 456-7890",
        isMuted: false,
        isHost: false,
        joinedAt: new Date(Date.now() - 60000).toISOString(),
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    settings: {
      muteOnEntry: true,
      recordCalls: true,
      announceJoinLeave: true,
      waitForModerator: false,
    },
  },
  {
    id: "2",
    name: "Engineering Standup",
    pin: "456789",
    dialInNumber: "+1 (555) 800-2000",
    moderatorPin: "012345",
    maxParticipants: 25,
    isActive: false,
    isLocked: false,
    participants: [],
    createdAt: "2024-01-05T00:00:00Z",
    settings: {
      muteOnEntry: false,
      recordCalls: false,
      announceJoinLeave: true,
      waitForModerator: true,
    },
  },
];

export function ConferenceRooms() {
  const [rooms, setRooms] = useState<ConferenceRoom[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(
    mockRooms.find((r) => r.isActive)?.id || null
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState({
    name: "",
    maxParticipants: 50,
  });

  const activeRoom = rooms.find((r) => r.id === selectedRoom);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleMute = (roomId: string, participantId: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              participants: room.participants.map((p) =>
                p.id === participantId ? { ...p, isMuted: !p.isMuted } : p
              ),
            }
          : room
      )
    );
  };

  const handleToggleLock = (roomId: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, isLocked: !room.isLocked } : room
      )
    );
  };

  const handleKickParticipant = (roomId: string, participantId: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              participants: room.participants.filter(
                (p) => p.id !== participantId
              ),
            }
          : room
      )
    );
  };

  const handleCreateRoom = () => {
    if (!newRoom.name) return;

    const room: ConferenceRoom = {
      id: Date.now().toString(),
      name: newRoom.name,
      pin: Math.floor(100000 + Math.random() * 900000).toString(),
      dialInNumber: `+1 (555) 800-${Math.floor(1000 + Math.random() * 9000)}`,
      moderatorPin: Math.floor(100000 + Math.random() * 900000).toString(),
      maxParticipants: newRoom.maxParticipants,
      isActive: false,
      isLocked: false,
      participants: [],
      createdAt: new Date().toISOString(),
      settings: {
        muteOnEntry: true,
        recordCalls: false,
        announceJoinLeave: true,
        waitForModerator: false,
      },
    };

    setRooms([...rooms, room]);
    setShowCreateForm(false);
    setNewRoom({ name: "", maxParticipants: 50 });
  };

  const formatDuration = (joinedAt: string) => {
    const seconds = Math.floor(
      (Date.now() - new Date(joinedAt).getTime()) / 1000
    );
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conference Rooms
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage audio conference bridges for team meetings
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Room
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Create Conference Room
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Name
              </label>
              <Input
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name: e.target.value })
                }
                placeholder="Team Meeting"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Participants
              </label>
              <Input
                type="number"
                value={newRoom.maxParticipants}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    maxParticipants: parseInt(e.target.value) || 50,
                  })
                }
                min={2}
                max={100}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleCreateRoom} className="btn-primary">
              Create Room
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
              className="dark:border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rooms List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Your Rooms
          </h3>
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={cn(
                "w-full p-4 rounded-xl border text-left transition-all",
                selectedRoom === room.id
                  ? "border-[#C9A227] bg-white dark:bg-gray-800 shadow-md"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {room.name}
                </h4>
                {room.isActive && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {room.participants.length}/{room.maxParticipants}
                </span>
                {room.isLocked && <Lock className="h-4 w-4 text-amber-500" />}
              </div>
            </button>
          ))}
        </div>

        {/* Room Details */}
        {activeRoom && (
          <div className="lg:col-span-2 space-y-6">
            {/* Room Info Card */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {activeRoom.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activeRoom.participants.length} participant
                    {activeRoom.participants.length !== 1 ? "s" : ""} •{" "}
                    {activeRoom.isActive ? "In Progress" : "Not Active"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleLock(activeRoom.id)}
                    className={cn(
                      "gap-2 dark:border-gray-600",
                      activeRoom.isLocked && "border-amber-500 text-amber-600"
                    )}
                  >
                    {activeRoom.isLocked ? (
                      <>
                        <Lock className="h-4 w-4" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4" />
                        Unlocked
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Dial-in Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Dial-in Number
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-medium text-gray-900 dark:text-white">
                      {activeRoom.dialInNumber}
                    </p>
                    <button
                      onClick={() =>
                        handleCopy(activeRoom.dialInNumber, "dialIn")
                      }
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {copiedField === "dialIn" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Participant PIN
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-medium text-gray-900 dark:text-white">
                      {activeRoom.pin}
                    </p>
                    <button
                      onClick={() => handleCopy(activeRoom.pin, "pin")}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {copiedField === "pin" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {activeRoom.moderatorPin && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Moderator PIN
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-medium text-gray-900 dark:text-white">
                        {activeRoom.moderatorPin}
                      </p>
                      <button
                        onClick={() =>
                          handleCopy(activeRoom.moderatorPin!, "modPin")
                        }
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {copiedField === "modPin" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Participants */}
            {activeRoom.participants.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Participants
                </h4>
                {activeRoom.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            participant.isHost
                              ? "bg-[#C9A227]/20 text-[#C9A227]"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          )}
                        >
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {participant.name}
                            </p>
                            {participant.isHost && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#C9A227]/20 text-[#C9A227]">
                                Host
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {participant.phoneNumber} •{" "}
                            {formatDuration(participant.joinedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleMute(activeRoom.id, participant.id)
                          }
                          className={cn(
                            participant.isMuted && "text-red-500"
                          )}
                        >
                          {participant.isMuted ? (
                            <MicOff className="h-4 w-4" />
                          ) : (
                            <Mic className="h-4 w-4" />
                          )}
                        </Button>
                        {!participant.isHost && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleKickParticipant(
                                activeRoom.id,
                                participant.id
                              )
                            }
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <PhoneOff className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="font-medium text-gray-900 dark:text-white">
                  No Active Participants
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Share the dial-in number and PIN to invite participants
                </p>
              </div>
            )}

            {/* Room Settings */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Room Settings
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      activeRoom.settings.muteOnEntry
                        ? "bg-green-500"
                        : "bg-gray-300"
                    )}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Mute on entry
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      activeRoom.settings.recordCalls
                        ? "bg-green-500"
                        : "bg-gray-300"
                    )}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Record calls
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      activeRoom.settings.announceJoinLeave
                        ? "bg-green-500"
                        : "bg-gray-300"
                    )}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Announce join/leave
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      activeRoom.settings.waitForModerator
                        ? "bg-green-500"
                        : "bg-gray-300"
                    )}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Wait for moderator
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
