// User-facing simulation errors carry an HTTP status so route handlers can map
// them to the right response instead of a generic 500.
export class SimulationError extends Error {
  constructor(message, status = 422) {
    super(message)
    this.name = 'SimulationError'
    this.status = status
  }
}
