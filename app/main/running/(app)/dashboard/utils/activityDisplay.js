import {
  Trophy,
  Footprints,
  Bike,
  Waves,
  Mountain,
  Dumbbell,
  Zap,
  Timer,
  Map as MapIcon,
  Heart,
  Activity,
  PersonStanding,
  Wind,
} from 'lucide-react'

export const ACTIVITY_CONFIG = {
  Run: {
    icon: Footprints,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    dot: 'bg-green-500',
    label: 'Run',
  },
  TrailRun: {
    icon: Mountain,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    dot: 'bg-emerald-600',
    label: 'Trail Run',
  },
  VirtualRun: {
    icon: Footprints,
    color: 'text-violet-400',
    bg: 'bg-violet-50',
    dot: 'bg-green-300',
    label: 'Virtual Run',
  },
  Walk: {
    icon: PersonStanding,
    color: 'text-green-600',
    bg: 'bg-green-50',
    dot: 'bg-slate-400',
    label: 'Walk',
  },
  Hike: {
    icon: Mountain,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    dot: 'bg-amber-600',
    label: 'Hike',
  },
  Ride: {
    icon: Bike,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    dot: 'bg-orange-400',
    label: 'Ride',
  },
  VirtualRide: {
    icon: Bike,
    color: 'text-blue-400',
    bg: 'bg-blue-50',
    dot: 'bg-orange-300',
    label: 'Virtual Ride',
  },
  MountainBikeRide: {
    icon: Bike,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    dot: 'bg-orange-500',
    label: 'MTB',
  },
  GravelRide: {
    icon: Bike,
    color: 'text-stone-600',
    bg: 'bg-stone-50',
    dot: 'bg-stone-500',
    label: 'Gravel',
  },
  Swim: {
    icon: Waves,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    dot: 'bg-blue-400',
    label: 'Swim',
  },
  WeightTraining: {
    icon: Dumbbell,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    dot: 'bg-slate-400',
    label: 'Weights',
  },
  Yoga: { icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50', dot: 'bg-teal-400', label: 'Yoga' },
  easy: {
    icon: Footprints,
    color: 'text-green-600',
    bg: 'bg-green-50',
    dot: 'bg-green-400',
    label: 'Easy',
  },
  tempo: {
    icon: Zap,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    label: 'Tempo',
  },
  interval: {
    icon: Timer,
    color: 'text-red-600',
    bg: 'bg-red-50',
    dot: 'bg-red-400',
    label: 'Interval',
  },
  long: {
    icon: MapIcon,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    label: 'Long Run',
  },
  race: {
    icon: Trophy,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    dot: 'bg-purple-400',
    label: 'Race',
  },
  recovery: {
    icon: Heart,
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    dot: 'bg-slate-300',
    label: 'Recovery',
  },
}
const DEFAULT_CONFIG = {
  icon: Activity,
  color: 'text-slate-500',
  bg: 'bg-slate-100',
  dot: 'bg-slate-300',
  label: null,
}

// Map Strava workout_type int → config key
const WORKOUT_TYPE_KEY = { 1: 'race', 2: 'long', 3: 'interval' }

export function getCfg(type) {
  return ACTIVITY_CONFIG[type] ?? DEFAULT_CONFIG
}

export function getActivityCfg(activity) {
  const wtKey = activity.workout_type != null ? WORKOUT_TYPE_KEY[activity.workout_type] : null
  if (wtKey) return ACTIVITY_CONFIG[wtKey] ?? getCfg(activity.activity_type)
  return getCfg(activity.activity_type)
}

export function toLocalDateStr(isoString) {
  const d = new Date(isoString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function groupByDate(activities) {
  const map = new Map()
  for (const a of activities) {
    const key = toLocalDateStr(a.started_at)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(a)
  }
  return map
}

export function effortOpacity(effort) {
  if (!effort) return 'opacity-60'
  if (effort < 30) return 'opacity-50'
  if (effort < 60) return 'opacity-70'
  if (effort < 100) return 'opacity-90'
  return 'opacity-100'
}

export function fmtElevation(m) {
  if (!m || m <= 0) return null
  return `↑${Math.round(m)}m`
}
