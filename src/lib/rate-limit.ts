'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp, type Firestore } from 'firebase/firestore';

let firestore: Firestore | null = null;

function getDb() {
  if (!firestore) {
    const { firestore: db } = initializeFirebase();
    firestore = db;
  }
  return firestore;
}

export type RateLimitConfig = {
  maxAttempts: number;
  windowMinutes: number;
  blockMinutes: number;
};

/**
 * Checks and updates rate limit status for a given identifier.
 * Returns { allowed: boolean, remaining: number, resetTime?: Date, error?: string }
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime?: Date; error?: string }> {
  const db = getDb();
  if (!db) return { allowed: true, remaining: 1 };

  const limitRef = doc(db, 'rateLimits', identifier);
  
  try {
    const limitDoc = await getDoc(limitRef);
    const now = new Date();

    if (limitDoc.exists()) {
      const data = limitDoc.data();
      const blockedUntil = data.blockedUntil?.toDate();
      const lastAttempt = data.lastAttempt?.toDate();
      let attempts = data.attempts || 0;

      // Check if still blocked
      if (blockedUntil && blockedUntil > now) {
        return { 
          allowed: false, 
          remaining: 0, 
          resetTime: blockedUntil,
          error: `Too many attempts. Blocked until ${blockedUntil.toLocaleTimeString()}.`
        };
      }

      // Reset window if enough time has passed
      const windowMs = config.windowMinutes * 60 * 1000;
      if (lastAttempt && (now.getTime() - lastAttempt.getTime() > windowMs)) {
        attempts = 0;
      }

      attempts += 1;

      const isBlocking = attempts >= config.maxAttempts;
      const newBlockedUntil = isBlocking ? new Date(now.getTime() + config.blockMinutes * 60 * 1000) : null;

      await setDoc(limitRef, {
        attempts,
        lastAttempt: serverTimestamp(),
        blockedUntil: newBlockedUntil ? Timestamp.fromDate(newBlockedUntil) : null
      }, { merge: true });

      if (isBlocking) {
        return { 
          allowed: false, 
          remaining: 0, 
          resetTime: newBlockedUntil!,
          error: "Rate limit exceeded. Access suspended temporarily."
        };
      }

      return { allowed: true, remaining: config.maxAttempts - attempts };
    } else {
      // First attempt
      await setDoc(limitRef, {
        attempts: 1,
        lastAttempt: serverTimestamp(),
        blockedUntil: null
      });
      return { allowed: true, remaining: config.maxAttempts - 1 };
    }
  } catch (e) {
    console.error("Rate limit check failed:", e);
    // Fail open to avoid blocking users if DB is down, but log the error
    return { allowed: true, remaining: 1 };
  }
}
