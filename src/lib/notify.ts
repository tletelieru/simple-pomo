export function notificationsSupported(): boolean {
  return 'Notification' in window
}

export async function requestNotifications(): Promise<boolean> {
  if (!notificationsSupported()) return false
  return (await Notification.requestPermission()) === 'granted'
}

export async function sendNotification(title: string, body: string): Promise<void> {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  const icon = `${import.meta.env.BASE_URL}pwa-192x192.png`
  try {
    const registration = await navigator.serviceWorker?.getRegistration()
    if (registration) await registration.showNotification(title, { body, icon })
    else new Notification(title, { body, icon })
  } catch {
    void 0
  }
}
