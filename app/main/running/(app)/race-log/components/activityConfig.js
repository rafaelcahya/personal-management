import {
  Trophy,
  Heart,
  Mountain,
  Footprints,
  Bike,
  Waves,
  Dumbbell,
  Zap,
  Timer,
  Map as MapIcon,
  Activity,
  PersonStanding,
  Wind,
} from 'lucide-react'

export const ACTIVITY_CONFIG = {
  Run: { icon: Footprints, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Run' },
  TrailRun: { icon: Mountain, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Trail Run' },
  VirtualRun: {
    icon: Footprints,
    color: 'text-violet-400',
    bg: 'bg-violet-50',
    label: 'Virtual Run',
  },
  Walk: { icon: PersonStanding, color: 'text-green-600', bg: 'bg-green-50', label: 'Walk' },
  Hike: { icon: Mountain, color: 'text-amber-700', bg: 'bg-amber-50', label: 'Hike' },
  Ride: { icon: Bike, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Ride' },
  VirtualRide: { icon: Bike, color: 'text-blue-400', bg: 'bg-blue-50', label: 'Virtual Ride' },
  MountainBikeRide: { icon: Bike, color: 'text-orange-600', bg: 'bg-orange-50', label: 'MTB' },
  GravelRide: { icon: Bike, color: 'text-stone-600', bg: 'bg-stone-50', label: 'Gravel' },
  Swim: { icon: Waves, color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Swim' },
  WeightTraining: { icon: Dumbbell, color: 'text-slate-600', bg: 'bg-slate-100', label: 'Weights' },
  Yoga: { icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50', label: 'Yoga' },
  easy: { icon: Footprints, color: 'text-green-600', bg: 'bg-green-50', label: 'Easy' },
  tempo: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Tempo' },
  interval: { icon: Timer, color: 'text-red-600', bg: 'bg-red-50', label: 'Interval' },
  long: { icon: MapIcon, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Long Run' },
  race: { icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Race' },
  recovery: { icon: Heart, color: 'text-slate-500', bg: 'bg-slate-100', label: 'Recovery' },
}

export const DEFAULT_CONFIG = {
  icon: Activity,
  color: 'text-slate-500',
  bg: 'bg-slate-100',
  label: null,
}

const WORKOUT_TYPE_KEY = { 1: 'race', 2: 'long', 3: 'interval' }

export function getActivityCfg(activity) {
  const wtKey = activity.workout_type != null ? WORKOUT_TYPE_KEY[activity.workout_type] : null
  if (wtKey)
    return ACTIVITY_CONFIG[wtKey] ?? ACTIVITY_CONFIG[activity.activity_type] ?? DEFAULT_CONFIG
  return ACTIVITY_CONFIG[activity.activity_type] ?? DEFAULT_CONFIG
}

export function tempStyle(c) {
  if (c < 10) return { text: 'text-blue-700', bg: 'bg-blue-50', label: 'Cold' }
  if (c < 18) return { text: 'text-green-700', bg: 'bg-green-50', label: 'Cool' }
  if (c < 25) return { text: 'text-amber-700', bg: 'bg-amber-50', label: 'Warm' }
  if (c < 32) return { text: 'text-orange-700', bg: 'bg-orange-50', label: 'Hot' }
  return { text: 'text-red-700', bg: 'bg-red-50', label: 'Very Hot' }
}
