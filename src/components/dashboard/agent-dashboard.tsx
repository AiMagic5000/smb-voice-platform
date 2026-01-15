'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Star,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  MessageSquare,
  Headphones,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Calendar,
  BarChart3,
  Timer,
  Users,
  Zap,
} from 'lucide-react'

interface AgentStats {
  today: {
    totalCalls: number
    inbound: number
    outbound: number
    missed: number
    avgHandleTime: string
    avgWrapTime: string
    talkTime: string
    holdTime: string
  }
  week: {
    totalCalls: number
    inbound: number
    outbound: number
    missed: number
    avgHandleTime: string
    avgWrapTime: string
    talkTime: string
    holdTime: string
  }
  month: {
    totalCalls: number
    inbound: number
    outbound: number
    missed: number
    avgHandleTime: string
    avgWrapTime: string
    talkTime: string
    holdTime: string
  }
}

interface Goal {
  id: string
  name: string
  target: number
  current: number
  unit: string
  period: 'daily' | 'weekly' | 'monthly'
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface QAScore {
  id: string
  date: string
  evaluator: string
  score: number
  maxScore: number
  category: string
  feedback: string
}

// Mock data
const mockStats: AgentStats = {
  today: {
    totalCalls: 47,
    inbound: 32,
    outbound: 15,
    missed: 2,
    avgHandleTime: '4:32',
    avgWrapTime: '0:45',
    talkTime: '3:12:45',
    holdTime: '0:18:30',
  },
  week: {
    totalCalls: 234,
    inbound: 156,
    outbound: 78,
    missed: 8,
    avgHandleTime: '4:18',
    avgWrapTime: '0:42',
    talkTime: '16:45:20',
    holdTime: '1:32:15',
  },
  month: {
    totalCalls: 892,
    inbound: 598,
    outbound: 294,
    missed: 32,
    avgHandleTime: '4:24',
    avgWrapTime: '0:44',
    talkTime: '65:30:00',
    holdTime: '5:45:30',
  },
}

const mockGoals: Goal[] = [
  { id: '1', name: 'Calls Handled', target: 50, current: 47, unit: 'calls', period: 'daily' },
  { id: '2', name: 'Average Handle Time', target: 5, current: 4.53, unit: 'min', period: 'daily' },
  { id: '3', name: 'Customer Satisfaction', target: 95, current: 92, unit: '%', period: 'weekly' },
  { id: '4', name: 'First Call Resolution', target: 85, current: 88, unit: '%', period: 'weekly' },
  { id: '5', name: 'Quality Score', target: 90, current: 94, unit: '%', period: 'monthly' },
]

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Call Champion',
    description: 'Handle 100 calls in a single day',
    icon: '🏆',
    earnedAt: '2026-01-10',
    rarity: 'epic',
  },
  {
    id: '2',
    name: 'Perfect Score',
    description: 'Achieve 100% QA score',
    icon: '⭐',
    earnedAt: '2026-01-08',
    rarity: 'legendary',
  },
  {
    id: '3',
    name: 'Speed Demon',
    description: 'Maintain AHT under 3 min for a week',
    icon: '⚡',
    earnedAt: '2026-01-05',
    rarity: 'rare',
  },
  {
    id: '4',
    name: 'Team Player',
    description: 'Help 10 colleagues this month',
    icon: '🤝',
    earnedAt: '2026-01-03',
    rarity: 'common',
  },
]

const mockQAScores: QAScore[] = [
  {
    id: '1',
    date: '2026-01-14',
    evaluator: 'Sarah M.',
    score: 94,
    maxScore: 100,
    category: 'Sales Call',
    feedback: 'Excellent product knowledge and rapport building.',
  },
  {
    id: '2',
    date: '2026-01-12',
    evaluator: 'John D.',
    score: 88,
    maxScore: 100,
    category: 'Support Call',
    feedback: 'Good resolution, could improve on empathy statements.',
  },
  {
    id: '3',
    date: '2026-01-10',
    evaluator: 'Sarah M.',
    score: 100,
    maxScore: 100,
    category: 'Complaint',
    feedback: 'Perfect handling of difficult customer. Great de-escalation.',
  },
]

const hourlyData = [
  { hour: '8am', calls: 5 },
  { hour: '9am', calls: 8 },
  { hour: '10am', calls: 12 },
  { hour: '11am', calls: 10 },
  { hour: '12pm', calls: 4 },
  { hour: '1pm', calls: 6 },
  { hour: '2pm', calls: 9 },
  { hour: '3pm', calls: 7 },
  { hour: '4pm', calls: 3 },
]

export function AgentDashboard() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today')
  const [status, setStatus] = useState<'available' | 'busy' | 'break' | 'offline'>('available')

  const stats = mockStats[period]
  const maxCalls = Math.max(...hourlyData.map(d => d.calls))

  const statusColors = {
    available: 'bg-green-500',
    busy: 'bg-red-500',
    break: 'bg-yellow-500',
    offline: 'bg-gray-500',
  }

  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    rare: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    epic: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    legendary: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  }

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your performance overview.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={status} onValueChange={(v: typeof status) => setStatus(v)}>
            <SelectTrigger className="w-40">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Available
                </div>
              </SelectItem>
              <SelectItem value="busy">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Busy
                </div>
              </SelectItem>
              <SelectItem value="break">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  On Break
                </div>
              </SelectItem>
              <SelectItem value="offline">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-500" />
                  Offline
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={(v: typeof period) => setPeriod(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCalls}</p>
                <p className="text-sm text-muted-foreground">Total Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                <PhoneIncoming className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inbound}</p>
                <p className="text-sm text-muted-foreground">Inbound</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                <PhoneOutgoing className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.outbound}</p>
                <p className="text-sm text-muted-foreground">Outbound</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                <PhoneMissed className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.missed}</p>
                <p className="text-sm text-muted-foreground">Missed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Handle Time</p>
                <p className="text-2xl font-bold">{stats.avgHandleTime}</p>
              </div>
              <Timer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Wrap Time</p>
                <p className="text-2xl font-bold">{stats.avgWrapTime}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Talk Time</p>
                <p className="text-2xl font-bold">{stats.talkTime}</p>
              </div>
              <Headphones className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hold Time</p>
                <p className="text-2xl font-bold">{stats.holdTime}</p>
              </div>
              <Coffee className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          <TabsTrigger value="activity">Activity Chart</TabsTrigger>
          <TabsTrigger value="qa">QA Scores</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Goals
              </CardTitle>
              <CardDescription>
                Track your progress against daily, weekly, and monthly targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockGoals.map((goal) => {
                  const percentage = Math.min((goal.current / goal.target) * 100, 100)
                  const isAchieved = goal.current >= goal.target

                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{goal.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {goal.period}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {goal.current} / {goal.target} {goal.unit}
                          </span>
                          {isAchieved ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                      <Progress value={percentage} className={isAchieved ? '[&>div]:bg-green-500' : ''} />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Today's Call Activity
              </CardTitle>
              <CardDescription>
                Calls handled by hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-end gap-2">
                {hourlyData.map((data) => (
                  <div key={data.hour} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                      style={{ height: `${(data.calls / maxCalls) * 200}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{data.hour}</span>
                    <span className="text-xs font-medium">{data.calls}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Quality Assurance Scores
              </CardTitle>
              <CardDescription>
                Recent QA evaluations and feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockQAScores.map((qa) => (
                  <div
                    key={qa.id}
                    className="rounded-lg border p-4 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{qa.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {qa.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Evaluated by {qa.evaluator}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {qa.score}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{qa.maxScore}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((qa.score / qa.maxScore) * 100)}%
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm">{qa.feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements & Badges
              </CardTitle>
              <CardDescription>
                Recognition for outstanding performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border p-4 ${rarityColors[achievement.rarity]}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm opacity-90">
                          {achievement.description}
                        </p>
                        <p className="mt-2 text-xs opacity-70">
                          Earned: {achievement.earnedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Start Call
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send SMS
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Callback
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Transfer Call
            </Button>
            <Button variant="outline" size="sm">
              <Coffee className="mr-2 h-4 w-4" />
              Request Break
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
