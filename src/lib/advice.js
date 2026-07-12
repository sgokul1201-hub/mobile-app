/**
 * Predefined health advice and command modules based on monthly tracking scale.
 */

export const FREQUENCY_SCALES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

const ADVICE_CONTENT = {
  [FREQUENCY_SCALES.LOW]: {
    title: 'Optimal Vitality & Focus',
    subtitle: 'Frequency: 0-4 times / month',
    level: 'Low',
    color: 'emerald', // Tailwind color name
    scoreDescription: 'Your current frequency indicates a high retention of energy and mental clarity.',
    bulletAdvice: [
      'Channel your high vitality into intense strength training or athletic goals.',
      'Utilize this peak focus window for complex professional tasks or creative work.',
      'Maintain this baseline to preserve androgen receptor sensitivity and dopamine baselines.',
      'Practice deep breathing or meditation to distribute built-up physical energy.'
    ],
    commands: [
      { text: 'Start a 45-minute gym session', icon: 'Dumbbell' },
      { text: 'Read 10 pages of a development book', icon: 'BookOpen' },
      { text: 'Engage in deep breathing focus (5 mins)', icon: 'Wind' }
    ]
  },
  [FREQUENCY_SCALES.MEDIUM]: {
    title: 'Balanced Habit & Awareness',
    subtitle: 'Frequency: 5-15 times / month',
    level: 'Medium',
    color: 'amber',
    scoreDescription: 'Your frequency is moderate. Ensure this remains a conscious choice rather than an automatic reaction to stress or boredom.',
    bulletAdvice: [
      'Keep a journal of emotional states prior to logs (stress, loneliness, fatigue).',
      'Ensure you are getting 7-8 hours of high-quality sleep to maintain endocrine health.',
      'Avoid pornography entirely; prioritize real-world social and romantic connections.',
      'Introduce a new productivity hobby to fill transition periods in your schedule.'
    ],
    commands: [
      { text: 'Drink a glass of cold water', icon: 'Droplet' },
      { text: 'Do 20 rapid pushups to break triggers', icon: 'Zap' },
      { text: 'Write down 3 current goals in a journal', icon: 'PenTool' }
    ]
  },
  [FREQUENCY_SCALES.HIGH]: {
    title: 'Mindful Redirection & Recovery',
    subtitle: 'Frequency: 16+ times / month',
    level: 'High',
    color: 'rose',
    scoreDescription: 'Your current scale is elevated. A short dopamine reset will help restore natural energy, mental acuity, and focus thresholds.',
    bulletAdvice: [
      'Initiate a 7-day "dopamine detox" reset phase to recalibrate reward pathways.',
      'Replace instant gratification triggers with delayed gratification activities (cold showers, reading).',
      'Install website block filters to sever accessibility pathways to high-stimulation triggers.',
      'Seek physical outlets to release tension, such as jogging, swimming, or running.',
      'Speak to a partner or support circle if logs are linked with emotional distress.'
    ],
    commands: [
      { text: 'Take a 5-minute cold shower immediately', icon: 'Ice' },
      { text: 'Leave the room and go for a 15-minute walk', icon: 'Navigation' },
      { text: 'Delete trigger apps or block browser URLs', icon: 'ShieldAlert' }
    ]
  }
};

/**
 * Computes frequency scale from logs within the last 30 days.
 * @param {Array} logs - List of log objects.
 * @returns {Object} Advice payload.
 */
export const getMonthlyAdvice = (logs = []) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter logs within the last 30 days
  const monthlyLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= thirtyDaysAgo && logDate <= now;
  });

  // Calculate cumulative counts
  const totalCount = monthlyLogs.reduce((sum, log) => sum + (log.count || 1), 0);

  let scale = FREQUENCY_SCALES.LOW;
  if (totalCount >= 5 && totalCount <= 15) {
    scale = FREQUENCY_SCALES.MEDIUM;
  } else if (totalCount > 15) {
    scale = FREQUENCY_SCALES.HIGH;
  }

  return {
    scale,
    totalCount,
    last30DaysLogCount: monthlyLogs.length,
    ...ADVICE_CONTENT[scale]
  };
};

/**
 * Calculates current streak (consecutive days of tracked logs, or clean streak depending on user focus).
 * Here, we will calculate the "Tracking Consistency Streak" (days in a row with logs)
 * AND the "Clean Streak" (days since the last tracked session).
 * Since this is a wellness tracker, both metrics are valuable.
 * @param {Array} logs 
 * @returns {Object} { cleanStreakDays, trackingStreakDays }
 */
export const calculateStreaks = (logs = []) => {
  if (logs.length === 0) {
    return { cleanStreakDays: 0, trackingStreakDays: 0 };
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Clean Streak (days since the last log entry)
  const lastLog = sortedLogs[sortedLogs.length - 1];
  const lastLogDate = new Date(lastLog.timestamp);
  lastLogDate.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(today - lastLogDate);
  const cleanStreakDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 2. Tracking Streak (consecutive days of logging - to show user consistent engagement)
  let trackingStreakDays = 0;
  const uniqueDates = Array.from(
    new Set(
      sortedLogs.map(log => {
        const d = new Date(log.timestamp);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
    )
  ).sort(); // Sort chronological ascending

  if (uniqueDates.length > 0) {
    let currentCheck = new Date();
    currentCheck.setHours(0, 0, 0, 0);
    
    // Check if there's an entry today or yesterday to continue streak
    let formattedToday = `${currentCheck.getFullYear()}-${String(currentCheck.getMonth() + 1).padStart(2, '0')}-${String(currentCheck.getDate()).padStart(2, '0')}`;
    currentCheck.setDate(currentCheck.getDate() - 1);
    let formattedYesterday = `${currentCheck.getFullYear()}-${String(currentCheck.getMonth() + 1).padStart(2, '0')}-${String(currentCheck.getDate()).padStart(2, '0')}`;
    
    const hasToday = uniqueDates.includes(formattedToday);
    const hasYesterday = uniqueDates.includes(formattedYesterday);
    
    if (hasToday || hasYesterday) {
      trackingStreakDays = 1;
      let checkDate = new Date(hasToday ? formattedToday : formattedYesterday);
      
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (uniqueDates.includes(checkStr)) {
          trackingStreakDays++;
        } else {
          break;
        }
      }
    }
  }

  return {
    cleanStreakDays: lastLogDate > today ? 0 : cleanStreakDays, // If log is today, clean streak is 0
    trackingStreakDays
  };
};
