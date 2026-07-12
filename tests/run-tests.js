/**
 * Production-quality Unit Tests for AURA Habit Tracker.
 * Leverages Node.js v22+ built-in test runner for maximum speed and zero dependencies.
 */

import test from 'node:test';
import assert from 'node:assert';
import { getMonthlyAdvice, calculateStreaks } from '../src/lib/advice.js';

test('Habit Tracker Logic - Frequency Scales', async (t) => {
  await t.test('should categorize 3 logs as LOW frequency', () => {
    const mockLogs = [
      { timestamp: new Date().toISOString(), count: 1 },
      { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), count: 1 },
      { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), count: 1 }
    ];
    
    const advice = getMonthlyAdvice(mockLogs);
    assert.strictEqual(advice.scale, 'LOW');
    assert.strictEqual(advice.level, 'Low');
    assert.strictEqual(advice.totalCount, 3);
    assert.ok(advice.bulletAdvice.length > 0);
  });

  await t.test('should categorize 10 logs as MEDIUM frequency', () => {
    // Generate 10 logs
    const mockLogs = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 1000 * 60 * 60 * 12).toISOString(),
      count: 1
    }));

    const advice = getMonthlyAdvice(mockLogs);
    assert.strictEqual(advice.scale, 'MEDIUM');
    assert.strictEqual(advice.level, 'Medium');
    assert.strictEqual(advice.totalCount, 10);
  });

  await t.test('should categorize 18 logs as HIGH frequency', () => {
    // Generate 18 logs
    const mockLogs = Array.from({ length: 18 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 1000 * 60 * 60 * 10).toISOString(),
      count: 1
    }));

    const advice = getMonthlyAdvice(mockLogs);
    assert.strictEqual(advice.scale, 'HIGH');
    assert.strictEqual(advice.level, 'High');
    assert.strictEqual(advice.totalCount, 18);
  });
});

test('Streak Calculations', async (t) => {
  await t.test('should compute zero streaks for empty logs list', () => {
    const streaks = calculateStreaks([]);
    assert.strictEqual(streaks.cleanStreakDays, 0);
    assert.strictEqual(streaks.trackingStreakDays, 0);
  });

  await t.test('should calculate clean streak (days since last log)', () => {
    // Last log was 5 days ago
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    fiveDaysAgo.setHours(12, 0, 0, 0);

    const mockLogs = [
      { timestamp: fiveDaysAgo.toISOString(), count: 1 }
    ];

    const streaks = calculateStreaks(mockLogs);
    assert.strictEqual(streaks.cleanStreakDays, 5);
  });

  await t.test('should calculate tracking consistency streak correctly', () => {
    // Create logs on consecutive dates: today, yesterday, 2 days ago
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Some gap, then logs on 5 days ago and 6 days ago
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    const mockLogs = [
      { timestamp: today.toISOString(), count: 1 },
      { timestamp: yesterday.toISOString(), count: 1 },
      { timestamp: twoDaysAgo.toISOString(), count: 1 },
      { timestamp: fiveDaysAgo.toISOString(), count: 1 },
      { timestamp: sixDaysAgo.toISOString(), count: 1 }
    ];

    const streaks = calculateStreaks(mockLogs);
    // Tracking streak should represent the current block of consecutive logging days (today, yesterday, two days ago)
    assert.strictEqual(streaks.trackingStreakDays, 3);
  });
});
