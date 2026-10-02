import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { fetchUnreadCount } from '../services/notificationService.js';

const POLL_INTERVAL_MS = 60000;

/**
 * Single source of truth for the unread notification tally.
 *
 * The navbar bell and the mobile drawer row both need the count, and the bell
 * also needs to write it back after marking things read - so the count lives
 * here instead of inside either component.
 */
export default function useUnreadNotifications() {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return 0;
    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
      return count;
    } catch {
      // A failed badge poll is not worth surfacing to the user.
      return 0;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return undefined;
    }

    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      await refresh();
    };

    tick();
    const timer = setInterval(tick, POLL_INTERVAL_MS);

    // Re-sync as soon as the tab is focused again so a badge left open in a
    // background tab catches up immediately.
    const onFocus = () => {
      if (!cancelled) refresh();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [isAuthenticated, refresh]);

  return { unreadCount, setUnreadCount, refresh };
}
