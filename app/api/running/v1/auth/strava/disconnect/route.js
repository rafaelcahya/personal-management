// POST /api/running/v1/auth/strava/disconnect
export async function POST() {
  // TODO: revoke Strava token (DELETE https://www.strava.com/oauth/deauthorize)
  // TODO: unsubscribe webhook dari Strava
  // TODO: hapus row di rt_strava_credentials
  // Data historis di rt_activities TETAP ADA (default retain)
}
