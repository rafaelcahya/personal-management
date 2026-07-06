import { z } from 'zod'

const waypointSchema = z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)])

export const updateRouteSchema = z.object({
  name: z.string().trim().min(1, 'Route name is required').max(100, 'Name too long'),
})

export const saveRouteSchema = z.object({
  name: z.string().min(1, 'Route name is required').max(100, 'Name too long'),
  waypoints: z
    .array(waypointSchema)
    .min(2, 'At least 2 waypoints required')
    .max(500, 'Too many waypoints (max 500)'),
  encoded_polyline: z.string().min(1),
  distance_m: z.number().int().min(1),
})
