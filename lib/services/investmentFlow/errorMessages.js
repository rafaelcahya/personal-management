// User-facing messages for known investment flow domain error codes.
// Route handlers must never forward err.message directly to the client —
// look up the code here instead so internal details never leak.
export const USER_FACING_ERRORS = {
  PARENT_NOT_FOUND: 'Parent node not found.',
  NODE_LIMIT_EXCEEDED: 'Node limit reached (max 500 nodes per portfolio).',
  CYCLE: 'A node cannot be moved into its own subtree.',
  INVALID_FIELD: 'Category nodes must not have nominal or notes.',
}

export const UNEXPECTED_ERROR_MESSAGE = 'An unexpected error occurred.'
