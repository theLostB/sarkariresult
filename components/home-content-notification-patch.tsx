import { useState, useEffect } from "react";
import { NotificationPermissionModal } from "@/components/notification-permission-modal";

// ... import rest of HomeContent dependencies ...

export function HomeContent(props: any) {
  // ...existing HomeContent state/logic...

  const [showNotifModal, setShowNotifModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const notifFlag = localStorage.getItem('sarkari_notif_permission');
      if (!notifFlag) {
        setTimeout(() => setShowNotifModal(true), 1200);
      }
    }
  }, []);

  const handleAllowNotifications = async () => {
    setShowNotifModal(false);
    localStorage.setItem('sarkari_notif_permission', 'asked');
    if ('Notification' in window && navigator.serviceWorker) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.register('/sw.js');
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: '<REPLACE_WITH_PUBLIC_VAPID_KEY>' // TODO: Replace with your VAPID public key (Uint8Array)
        });
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        });
        localStorage.setItem('sarkari_notif_permission', 'granted');
      }
    }
  };
  const handleDenyNotifications = () => {
    setShowNotifModal(false);
    localStorage.setItem('sarkari_notif_permission', 'denied');
  };

  // ...rest of HomeContent logic...

  return (
    <>
      <NotificationPermissionModal open={showNotifModal} onAllow={handleAllowNotifications} onDeny={handleDenyNotifications} />
      {/* ...rest of HomeContent JSX... */}
    </>
  );
}
