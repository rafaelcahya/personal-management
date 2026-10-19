import { z } from 'zod'

const MAX_WAYPOINTS = 500
const MAX_POLYLINE_LENGTH = 200_000

export const waypointSchema = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])

export const routeIdSchema = z.uuid('Invalid route ID')

const routeName = z.string().trim().min(1, 'Route name is required').max(100, 'Name too long')

export const updateRouteSchema = z.object({
  name: routeName,
})

export const saveRouteSchema = z.object({
  name: routeName,
  waypoints: z
    .array(waypointSchema)
    .min(2, 'At least 2 waypoints required')
    .max(MAX_WAYPOINTS, `Too many waypoints (max ${MAX_WAYPOINTS})`),
  encoded_polyline: z.string().min(1).max(MAX_POLYLINE_LENGTH, 'Route line is too long'),
  distance_m: z.number().int().min(1),
})

export const mapDirectionsSchema = z.object({
  waypoints: z
    .array(waypointSchema)
    .min(2, 'At least 2 waypoints required')
    .max(MAX_WAYPOINTS, `Too many waypoints (max ${MAX_WAYPOINTS})`),
})

export const mapMatchSchema = z.object({
  coordinates: z
    .array(waypointSchema)
    .min(2, 'At least 2 coordinates required')
    .max(MAX_WAYPOINTS, `Too many coordinates (max ${MAX_WAYPOINTS})`),
})
