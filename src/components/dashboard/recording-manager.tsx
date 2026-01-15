"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Recording {
  id: string;
  callId: string;
  direction: string;
  callerNumber: string;
  calledNumber: string;
  duration: number;
  recordingUrl: string;
  hasTranscription: boolean;
  transcription: string | null;
  recordedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function RecordingManager() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchRecordings = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (dateRange.start) params.set("startDate", dateRange.start);
      if (dateRange.end) params.set("endDate", dateRange.end);

      const response = await fetch(`/api/recordings?${params}`);
      if (!response.ok) throw new Error("Failed to fetch recordings");

      const data = await response.json();
      setRecordings(data.recordings);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchRecordings(1);
  }, [fetchRecordings]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handlePlay = (recording: Recording) => {
    if (playingId === recording.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = recording.recordingUrl;
        audioRef.current.play();
        setPlayingId(recording.id);
      }
    }
  };

  const handleTranscribe = async (recordingId: string) => {
    setIsTranscribing(recordingId);
    try {
      const response = await fetch(`/api/recordings/${recordingId}/transcribe`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to transcribe");

      const data = await response.json();

      // Update recording in list
      setRecordings((prev) =>
        prev.map((r) =>
          r.id === recordingId
            ? { ...r, hasTranscription: true, transcription: data.transcription }
            : r
        )
      );

      // Update selected recording if open
      if (selectedRecording?.id === recordingId) {
        setSelectedRecording((prev) =>
          prev ? { ...prev, hasTranscription: true, transcription: data.transcription } : null
        );
      }
    } catch (err) {
      console.error("Transcription error:", err);
    } finally {
      setIsTranscribing(null);
    }
  };

  const handleDelete = async (recordingId: string) => {
    if (!confirm("Are you sure you want to delete this recording?")) return;

    try {
      const response = await fetch(`/api/recordings/${recordingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setRecordings((prev) => prev.filter((r) => r.id !== recordingId));
      if (selectedRecording?.id === recordingId) {
        setSelectedRecording(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingId(null)}
        className="hidden"
      />

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white">
              Call Recordings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Listen to, transcribe, and manage call recordings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <button
              onClick={() => fetchRecordings(1)}
              className="px-4 py-1.5 bg-[#C9A227] text-white rounded-lg hover:bg-[#B8922C] transition-colors text-sm"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[500px]">
        {/* Recording List */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full mx-auto" />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : recordings.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 mt-4">No recordings found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recordings.map((recording) => (
                <button
                  key={recording.id}
                  onClick={() => setSelectedRecording(recording)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedRecording?.id === recording.id
                      ? "bg-[#C9A227]/10"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(recording);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          playingId === recording.id
                            ? "bg-[#C9A227] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {playingId === recording.id ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                      <div>
                        <p className="font-medium text-[#1E3A5F] dark:text-white text-sm">
                          {recording.direction === "inbound"
                            ? recording.callerNumber
                            : recording.calledNumber}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(recording.recordedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDuration(recording.duration)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            recording.direction === "inbound"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="text-xs text-gray-400 capitalize">
                          {recording.direction}
                        </span>
                      </div>
                    </div>
                  </div>
                  {recording.hasTranscription && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#C9A227]">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Transcribed
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recording Details */}
        <div className="w-1/2 flex flex-col">
          {selectedRecording ? (
            <>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1E3A5F] dark:text-white">
                    Recording Details
                  </h3>
                  <div className="flex items-center gap-2">
                    {!selectedRecording.hasTranscription && (
                      <button
                        onClick={() => handleTranscribe(selectedRecording.id)}
                        disabled={isTranscribing === selectedRecording.id}
                        className="px-3 py-1.5 text-sm bg-[#1E3A5F] text-white rounded-lg hover:bg-[#2D4A6F] disabled:opacity-50 transition-colors"
                      >
                        {isTranscribing === selectedRecording.id
                          ? "Transcribing..."
                          : "Transcribe"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedRecording.id)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Direction</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {selectedRecording.direction}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDuration(selectedRecording.duration)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">From</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedRecording.callerNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">To</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedRecording.calledNumber}
                    </p>
                  </div>
                </div>

                {/* Audio Player */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePlay(selectedRecording)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        playingId === selectedRecording.id
                          ? "bg-[#C9A227] text-white"
                          : "bg-[#1E3A5F] text-white hover:bg-[#2D4A6F]"
                      }`}
                    >
                      {playingId === selectedRecording.id ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C9A227] rounded-full transition-all"
                          style={{ width: playingId === selectedRecording.id ? "50%" : "0%" }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {formatDuration(selectedRecording.duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transcription */}
              <div className="flex-1 p-6 overflow-y-auto">
                <h4 className="font-medium text-[#1E3A5F] dark:text-white mb-3">
                  Transcription
                </h4>
                {selectedRecording.hasTranscription && selectedRecording.transcription ? (
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    {selectedRecording.transcription}
                  </pre>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">
                      No transcription available
                    </p>
                    <button
                      onClick={() => handleTranscribe(selectedRecording.id)}
                      disabled={isTranscribing === selectedRecording.id}
                      className="mt-3 px-4 py-2 text-sm text-[#C9A227] hover:bg-[#C9A227]/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isTranscribing === selectedRecording.id
                        ? "Transcribing..."
                        : "Generate Transcription"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                <p className="mt-3">Select a recording to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchRecordings(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => fetchRecordings(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordingManager;
