"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Voicemail,
  Search,
  Play,
  Pause,
  Download,
  Trash2,
  Phone,
  Clock,
  Mail,
  Check,
} from "lucide-react";

const voicemails = [
  {
    id: "1",
    from: "Lisa Rodriguez",
    number: "+1 (555) 111-2222",
    duration: "0:45",
    date: "Today",
    time: "10:32 AM",
    isNew: true,
    transcription:
      "Hi, I'm calling about the quote you sent over yesterday. I had a few questions about the pricing. Can you give me a call back when you get a chance? Thanks!",
  },
  {
    id: "2",
    from: "Unknown Caller",
    number: "+1 (555) 333-4444",
    duration: "0:23",
    date: "Today",
    time: "9:15 AM",
    isNew: true,
    transcription:
      "This is regarding your service inquiry from last week. Please call us back at your earliest convenience.",
  },
  {
    id: "3",
    from: "Mike Chen",
    number: "+1 (555) 555-6666",
    duration: "1:12",
    date: "Yesterday",
    time: "4:45 PM",
    isNew: false,
    transcription:
      "Hey, it's Mike. Just wanted to follow up on our meeting from earlier. I think we should move forward with the project. Let me know what you think.",
  },
  {
    id: "4",
    from: "Sarah Johnson",
    number: "+1 (555) 777-8888",
    duration: "0:38",
    date: "Yesterday",
    time: "2:20 PM",
    isNew: false,
    transcription:
      "Hi there! I'm interested in your business phone service. Could someone call me back to discuss options? Thank you.",
  },
];

export default function VoicemailsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const newCount = voicemails.filter((vm) => vm.isNew).length;
  const filteredVoicemails = voicemails.filter(
    (vm) =>
      vm.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vm.number.includes(searchQuery) ||
      vm.transcription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header
        title="Voicemails"
        description={`${newCount} new message${newCount !== 1 ? "s" : ""}`}
      />

      <div className="p-8 space-y-6">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search voicemails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Check className="h-4 w-4" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Voicemails List */}
        <div className="space-y-4">
          {filteredVoicemails.map((vm, i) => (
            <motion.div
              key={vm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`hover:shadow-lg transition-shadow ${
                  vm.isNew ? "border-l-4 border-l-[#C9A227]" : ""
                }`}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          vm.isNew ? "bg-[#FDF8E8]" : "bg-gray-100"
                        }`}
                      >
                        <Voicemail
                          className={`h-6 w-6 ${
                            vm.isNew ? "text-[#C9A227]" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#1E3A5F]">
                            {vm.from}
                          </h3>
                          {vm.isNew && (
                            <Badge className="bg-[#C9A227] text-white">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{vm.number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">
                        {vm.date}
                      </p>
                      <p className="text-sm text-gray-400">{vm.time}</p>
                    </div>
                  </div>

                  {/* Transcription */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      &ldquo;{vm.transcription}&rdquo;
                    </p>
                  </div>

                  {/* Audio Player and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Play Button */}
                      <Button
                        size="sm"
                        variant={playingId === vm.id ? "default" : "outline"}
                        className={`gap-2 ${
                          playingId === vm.id ? "btn-primary" : ""
                        }`}
                        onClick={() =>
                          setPlayingId(playingId === vm.id ? null : vm.id)
                        }
                      >
                        {playingId === vm.id ? (
                          <>
                            <Pause className="h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Play
                          </>
                        )}
                      </Button>

                      {/* Duration */}
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {vm.duration}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Call back"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Send to email"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredVoicemails.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Voicemail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-[#1E3A5F] mb-2">
                No voicemails found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "You don't have any voicemails yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
