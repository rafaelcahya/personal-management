import { inngest } from '@/lib/inngest/client'

export const fridayPrepNotification = inngest.createFunction(
  { id: 'friday-prep-notification', retries: 1 },
  { cron: '0 15 * * 5' }, // setiap Jumat 15:00
  async ({ step }) => {
    const data = await step.run('get-data', async () => {
      // TODO: parallel fetch:
      // - training load + ACWR minggu ini
      // - cek apakah sudah log health hari ini
      // - jumlah sesi minggu ini
      return { acwr: null, totalKm: 0, healthLoggedToday: false, sessionCount: 0 }
    })

    const _recommendation = await step.run('determine-recommendation', async () => {
      // Rules-based — tidak pakai Claude
      const { acwr } = data
      if (!acwr) return 'Belum ada sesi minggu ini — Sabtu/Minggu bagus untuk mulai'
      if (acwr > 1.5) return 'Sabtu/Minggu: prioritas recovery run pendek atau rest'
      if (acwr > 1.3) return 'Sabtu/Minggu: easy run oke, hindari sesi berat'
      if (acwr >= 0.8) return 'Sabtu/Minggu: kondisi bagus untuk long run atau quality session'
      return 'Sabtu/Minggu: volume bisa dinaikkan sedikit'
    })

    await step.run('send-notification', async () => {
      // TODO: kirim push notification kalau notify_friday_prep = true
      // Body:
      //   - "Load minggu ini: {totalKm}km, ACWR {acwr} ({status})"
      //   - health log status
      //   - recommendation
    })
  }
)
