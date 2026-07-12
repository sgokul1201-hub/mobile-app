'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Dumbbell, BookOpen, Wind, Droplet, Zap, PenTool, 
  Navigation, ShieldAlert, ArrowLeft, BrainCircuit, Activity
} from 'lucide-react';
import Header from '@/components/Header';

// 9 Redirection Articles Database
const REDIRECTION_ARTICLES = {
  Dumbbell: {
    title: 'Strength Training & Energy Channeling',
    subtitle: 'Physical Exertion as a Neuro-Regulator',
    icon: Dumbbell,
    color: 'from-blue-500 to-indigo-600',
    content: `When physical energy build-up occurs, the body's natural response is to seek immediate release. Strength training channels this energy constructively.

### How it Works:
* **Endorphin Spikes**: Heavy lifting triggers the release of beta-endorphins, which act as natural stress relievers, improving mood and stabilizing dopamine levels.
* **Muscular Focus**: Engaging large muscle groups (legs, back, chest) forces the nervous system to focus on motor control, redirecting focus away from triggers.
* **Tension Release**: Physical exertion acts as a release valve for adrenaline and cortisol that build up during periods of high stress.

### Step-by-Step Exercise:
1. Perform 3 sets of squats, pushups, or dumbbell presses to failure.
2. Focus deeply on the contraction and stretch of the muscle fibers.
3. Rest for 60 seconds between sets, concentrating purely on deep, slow breaths.`
  },
  BookOpen: {
    title: 'Cognitive Shifting via Reading',
    subtitle: 'Re-engaging the Prefrontal Cortex',
    icon: BookOpen,
    color: 'from-violet-500 to-purple-600',
    content: `Trigger states place the brain in an impulsive, emotional loop managed by the amygdala. Reading complex technical or structural literature re-engages the logical centers of the brain.

### How it Works:
* **Prefrontal Activation**: Comprehending complex sentences requires active working memory and logical processing, which overrides raw emotional impulses.
* **Attention Anchoring**: Immersive reading blocks out environmental distractions, creating a quiet mental space.
* **Dopamine Shift**: Shifting from passive entertainment to active learning restructures the reward pathway toward delayed gratification.

### Step-by-Step Exercise:
1. Open a book or article (preferably educational or non-fiction).
2. Read slowly for 10-15 minutes, avoiding skimming.
3. Write a 2-sentence mental summary of what you just read to verify comprehension.`
  },
  Wind: {
    title: 'Parasympathetic Breathing Focus',
    subtitle: 'Restoring Autonomic Nervous System Balance',
    icon: Wind,
    color: 'from-cyan-500 to-blue-600',
    content: `Triggers generate a subtle "fight-or-flight" response, characterized by shallow breathing and an elevated heart rate. Conscious deep breathing is the fastest way to deactivate this physical cycle.

### How it Works:
* **Vagus Nerve Stimulation**: Deep diaphragmatic breathing stimulates the vagus nerve, initiating the parasympathetic nervous system's relaxation response.
* **Heart Rate Variability**: Prolonged exhalations naturally slow down the heart rate and lower blood pressure.
* **Oxygen Saturation**: Flooding the brain with oxygen restores rational thinking and calms the amygdala.

### Step-by-Step Exercise:
1. **Inhale**: Breathe in through your nose for 4 seconds, filling your abdomen.
2. **Hold**: Hold the breath for 4 seconds.
3. **Exhale**: Breathe out slowly through pursed lips for 6 seconds.
4. Repeat this loop 10 times, focusing entirely on the sound and sensation of the air.`
  },
  Droplet: {
    title: 'System Shock via Hydration',
    subtitle: 'Interrupting the Habit Loop with Cold Shock',
    icon: Droplet,
    color: 'from-teal-500 to-emerald-600',
    content: `Automated habits thrive on unconscious behavior. Drinking ice-cold water introduces a sudden, mild physical sensation that breaks the trigger cycle.

### How it Works:
* **Physical Interruption**: The cold sensation in the throat signals the brain to pay attention to immediate sensory input, breaking recursive thought loops.
* **Cognitive Rehydration**: Dehydration leads to cognitive fatigue and increased vulnerability to stress and impulse. Proper hydration immediately restores mental focus.
* **Trigeminal Reflex**: Cold stimuli inside the mouth trigger the trigeminal nerve, causing a momentary spike in alertness.

### Step-by-Step Exercise:
1. Pour a tall glass of cold water (add ice cubes if possible).
2. Take 5 slow, deliberate sips, pausing to feel the temperature in your mouth and throat.
3. Stand up, stretch your body, and take a deep breath before moving to a new task.`
  },
  Zap: {
    title: 'Rapid Physical Dissipation',
    subtitle: 'Exhausting Immediate Adrenaline Surges',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    content: `An urge represents a surge of adrenaline seeking an outlet. By immediately directing this energy into high-intensity physical movement, you exhaust the urge.

### How it Works:
* **Lactic Acid Build-up**: Rapid physical exhaustion generates lactic acid, demanding recovery resources from the body and overriding mental triggers.
* **Somatic Diversion**: High-intensity movement floods the sensory cortex, overriding cognitive loops.
* **Immediate Reset**: Physical tiredness brings a sense of calm and biological grounding.

### Step-by-Step Exercise:
1. Drop and do as many pushups or air squats as you can in 60 seconds.
2. Push yourself until your muscles feel a deep burn.
3. Stand up, shake out your arms and legs, and wash your face with cold water.`
  },
  PenTool: {
    title: 'Intentional Journaling & Mapping',
    subtitle: 'Moving Impulses to the Written Page',
    icon: PenTool,
    color: 'from-fuchsia-500 to-pink-600',
    content: `Writing is a powerful self-reflective tool. Expressing your goals or emotional state in writing forces you to step outside the trigger and look at it objectively.

### How it Works:
* **Cognitive Offloading**: Putting thoughts onto paper clears mental bandwidth and stops cyclical thinking.
* **Metacognition**: Writing creates distance between the urge ("I want this") and the observer ("I notice I am feeling a trigger because...").
* **Goal Reinforcement**: Re-stating your current goals signals your brain's RAS (Reticular Activating System) to focus on target outcomes.

### Step-by-Step Exercise:
1. Open a blank page or document.
2. Write down exactly what triggered you (e.g. boredom, fatigue, stress).
3. Write down your top 3 current goals and why they are important to you.
4. Conclude with: "I choose to redirect my energy toward my goals today."`
  },
  Ice: {
    title: 'Cold Shock Therapy',
    subtitle: 'Resetting the Dopaminergic Baseline',
    icon: Droplet, // Fallback to Droplet
    color: 'from-sky-400 to-blue-600',
    content: `Cold showers are one of the most effective tools to interrupt high-intensity triggers. The sensory overload acts as a hard reboot for the nervous system.

### How it Works:
* **Norepinephrine Release**: Cold water shock triggers a massive surge of norepinephrine, increasing alertness and immediately severing trigger pathways.
* **Dopamine Recalibration**: Studies show that cold water exposure increases baseline dopamine levels gradually for hours without the crash associated with instant gratification.
* **Vagal Tone Improvement**: Regular cold exposure strengthens your autonomic nervous system's resilience to stress.

### Step-by-Step Exercise:
1. Go to the shower and turn the knob to cold.
2. Step in directly and allow the cold water to hit your chest and back.
3. Focus on controlling your breathing—slow, steady inhales and exhales.
4. Stay in the cold for 2-3 minutes, then dry off and change your environment.`
  },
  Navigation: {
    title: 'Spatial Disruption & Walk',
    subtitle: 'Breaking Environmental Associations',
    icon: Navigation,
    color: 'from-emerald-500 to-teal-600',
    content: `Triggers are heavily linked to environmental cues (like sitting at your desk, lying in bed, or looking at a screen). Leaving the room breaks these spatial cues.

### How it Works:
* **Optical Flow**: Moving forward while walking outdoors creates "optical flow" across the eyes, which has been shown to naturally calm the amygdala and lower stress.
* **Context Severance**: Changing physical rooms or stepping outside severs the environmental stimuli associated with the trigger.
* **Sensory Re-engagement**: Feeling the wind, sun, or temperature outdoors anchors your attention in reality.

### Step-by-Step Exercise:
1. Immediately stand up and walk out of the room.
2. Go outside or walk to a window where you can see natural light.
3. Walk continuously for 10-15 minutes, observing 5 distinct things in your surroundings.`
  },
  ShieldAlert: {
    title: 'Designing Your Environment',
    subtitle: 'Adding Digital Friction to Eliminate Temptation',
    icon: ShieldAlert,
    color: 'from-rose-500 to-red-600',
    content: `Willpower alone is a finite resource. The most successful way to maintain wellness habits is to design an environment where temptation is physically hard to reach.

### How it Works:
* **Decision Fatigue Avoidance**: By blocking triggers in advance, you save mental energy and avoid having to "fight" urges.
* **The 20-Second Rule**: Adding just 20 seconds of friction (installing a blocker, locking apps, turning off devices) is usually enough to let the prefrontal cortex catch up and halt impulsive behavior.
* **Systematic Control**: Eliminating paths of least resistance forces your attention back to constructive alternatives.

### Step-by-Step Exercise:
1. Turn off your devices or put them in another room.
2. Use website blockers or app limits to lock trigger URLs and apps.
3. Write down a physical task you can complete immediately (e.g. cleaning, organizing, stretching).`
  }
};

function RedirectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cmd = searchParams.get('cmd') || 'Dumbbell';
  
  // Find article details
  const article = REDIRECTION_ARTICLES[cmd] || REDIRECTION_ARTICLES.Dumbbell;
  const IconComponent = article.icon;

  const handleDone = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background pb-12 text-foreground flex flex-col">
      {/* Dynamic Colored Header Panel */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${article.color} text-white pt-10 pb-16 px-6 shadow-lg safe-top`}>
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        
        {/* Back Button */}
        <button 
          onClick={handleDone}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors border border-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 border border-white/10 shadow-inner">
            <IconComponent className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-tight">
              {article.title}
            </h1>
            <p className="text-xs text-white/80 font-bold uppercase tracking-wider mt-1">
              {article.subtitle}
            </p>
          </div>
        </div>

        {/* Absolute Background Shape */}
        <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Article Body */}
      <main className="flex-1 px-5 -mt-6 max-w-lg mx-auto w-full">
        <div className="glass-panel border border-card-border bg-card-bg rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <BrainCircuit className="h-4.5 w-4.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Cognitive Strategy</span>
          </div>

          {/* Formatted Article Content */}
          <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium space-y-4">
            {article.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={index} className="text-sm font-bold text-foreground uppercase tracking-wider pt-2 border-b border-card-border pb-1">
                    {paragraph.replace('###', '').trim()}
                  </h3>
                );
              }
              if (paragraph.startsWith('*')) {
                return (
                  <ul key={index} className="space-y-2 pl-1">
                    {paragraph.split('\n').map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                        <span>{bullet.replace('*', '').trim()}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d+\./)) {
                return (
                  <ol key={index} className="space-y-2.5 pl-1">
                    {paragraph.split('\n').map((step, sIdx) => (
                      <li key={sIdx} className="flex gap-2">
                        <span className="font-bold text-indigo-500 shrink-0">{sIdx + 1}.</span>
                        <span>{step.replace(/^\d+\./, '').trim()}</span>
                      </li>
                    ))}
                  </ol>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* Call to Action Button */}
          <div className="pt-4">
            <button
              onClick={handleDone}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 font-bold shadow-md active:scale-[0.98] transition-all"
            >
              <Activity className="h-4.5 w-4.5" />
              <span>I completed this redirection</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function RedirectionPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
      </div>
    }>
      <RedirectionContent />
    </Suspense>
  );
}
