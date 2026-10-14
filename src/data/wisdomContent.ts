import type { WisdomPassage, DailyReflection, WisdomTopic, RepoMeta, TopicKey } from "@/types"

export const TOPICS: WisdomTopic[] = [
  { key: "faith", label: "Faith", description: "Trust beyond sight, conviction in the unseen.", passageCount: 3 },
  { key: "purpose", label: "Purpose", description: "Calling, meaning, and the shape of a life well-lived.", passageCount: 3 },
  { key: "resilience", label: "Resilience", description: "Strength forged in trial, grace found in endurance.", passageCount: 3 },
  { key: "calm", label: "Calm", description: "Stillness amid noise, peace that surpasses understanding.", passageCount: 3 },
  { key: "justice", label: "Justice", description: "Righteous action, equity for the voiceless.", passageCount: 2 },
  { key: "hope", label: "Hope", description: "The anchor of the soul in uncertain waters.", passageCount: 2 },
]

export const PASSAGES: WisdomPassage[] = [
  // Faith
  {
    id: "f1", topic: "faith",
    title: "Trusting When the Path Is Hidden",
    question: "How do I maintain faith when everything feels uncertain?",
    answer: "Faith is not the absence of doubt but the decision to move forward despite it. Like a seed planted in darkness, trust grows strongest when you cannot yet see the fruit. The ground beneath you may feel unstable, but the roots you are building are real.",
    scripture: "For we walk by faith, not by sight.",
    reference: "2 Corinthians 5:7",
    reflection: "Consider what you would attempt today if you were certain the outcome was already secured. Take one small step in that direction.",
  },
  {
    id: "f2", topic: "faith",
    title: "The Quiet Evidence of Belief",
    question: "Why does faith feel so silent when the world is so loud?",
    answer: "Faith speaks in whispers because it lives in the space between noise and meaning. The world rewards volume; the spirit rewards depth. What you hear in stillness is more enduring than any proclamation made in haste.",
    scripture: "After the earthquake came a fire, but the Lord was not in the fire. And after the fire came a gentle whisper.",
    reference: "1 Kings 19:11-12",
    reflection: "Set aside five minutes today where you do not speak, scroll, or plan. Simply listen to what arises.",
  },
  {
    id: "f3", topic: "faith",
    title: "Doubt as a doorway, not a wall",
    question: "Is it wrong to question what I believe?",
    answer: "Questioning is not the enemy of faith; it is the refinement of it. Every honest doubt carries within it the seed of a deeper conviction. The faith that survives examination is the faith worth holding.",
    scripture: "I believe; help my unbelief!",
    reference: "Mark 9:24",
    reflection: "Write down one belief you have never tested. Spend this evening examining it honestly, without judgment.",
  },
  // Purpose
  {
    id: "p1", topic: "purpose",
    title: "The Work That Finds You",
    question: "How do I discover my life purpose?",
    answer: "Purpose is not a destination you arrive at but a pattern you recognize. Look at what you return to again and again, what makes you lose track of time, what you would do even if no one noticed. That thread, woven through years, is your calling.",
    scripture: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",
    reference: "Ephesians 2:10",
    reflection: "List three activities from the past month where you lost awareness of time. The pattern reveals direction.",
  },
  {
    id: "p2", topic: "purpose",
    title: "Small Obedience, Large Meaning",
    question: "My purpose feels too small to matter. Is it?",
    answer: "The largest movements in history were carried by small, faithful acts done in obscurity. A meal shared, a letter written, a boundary held quietly. Purpose is not measured in scale but in sincerity. What you do with what is in front of you is enough.",
    scripture: "Whoever can be trusted with very little can also be trusted with much.",
    reference: "Luke 16:10",
    reflection: "Identify one small act of care you have been postponing. Do it today, without announcement.",
  },
  {
    id: "p3", topic: "purpose",
    title: "When the Season Changes",
    question: "What if my purpose shifts and I no longer recognize my path?",
    answer: "A changing purpose is not a failed one. Ecclesiastes reminds us there is a season for everything. The purpose you carried in one chapter may not be the one you need in the next. Release it without guilt. The next season will name itself.",
    scripture: "There is a time for everything, and a season for every activity under the heavens.",
    reference: "Ecclesiastes 3:1",
    reflection: "Name one role or ambition you have outgrown. Thank it for what it gave you, then set it down.",
  },
  // Resilience
  {
    id: "r1", topic: "resilience",
    title: "Bending Without Breaking",
    question: "How do I endure suffering without becoming bitter?",
    answer: "Resilience is not hardness. A tree that refuses to bend will snap in the storm. The strongest people are those who allow themselves to grieve, to rest, to ask for help, and then rise again with tenderness intact. Bitterness is the choice; softness is the courage.",
    scripture: "Though the fig tree does not bud and there are no grapes on the vines, yet I will rejoice in the Lord.",
    reference: "Habakkuk 3:17-18",
    reflection: "Where in your life are you trying to be harder than you need to be? Give yourself permission to be gentle there.",
  },
  {
    id: "r2", topic: "resilience",
    title: "The Strength of Returning",
    question: "I keep falling back into old patterns. Is recovery even possible?",
    answer: "Recovery is not a straight line. It is a spiral, and each return to awareness is a victory, not a failure. The fact that you notice the pattern means you are no longer fully inside it. Every honest beginning is a triumph over the inertia of the past.",
    scripture: "Though the righteous fall seven times, they rise again.",
    reference: "Proverbs 24:16",
    reflection: "Write down one pattern you keep returning to. Next to it, write the moment you first noticed it. That noticing was the beginning of freedom.",
  },
  {
    id: "r3", topic: "resilience",
    title: "Carrying What Cannot Be Carried Alone",
    question: "When is it strength to ask for help?",
    answer: "Asking for help is the most courageous form of resilience. The stoic ideal of solitary endurance is a myth that breaks people in silence. True strength knows its limits and reaches outward. You were never meant to carry everything alone.",
    scripture: "Carry each other's burdens, and in this way you will fulfill the law of Christ.",
    reference: "Galatians 6:2",
    reflection: "Name one burden you have been carrying alone. This week, share it with one trusted person.",
  },
  // Calm
  {
    id: "c1", topic: "calm",
    title: "The Practice of Enough",
    question: "Why can I never seem to slow down?",
    answer: "Stillness is not the absence of activity but the presence of intention. You do not need fewer tasks; you need fewer compulsions. The rush is often not toward something but away from something. Sit with what you are running from, and the pace will find its natural rhythm.",
    scripture: "Be still, and know that I am God.",
    reference: "Psalm 46:10",
    reflection: "Choose one routine activity today (walking, eating, washing dishes) and do it at half your usual speed. Notice what you were missing.",
  },
  {
    id: "c2", topic: "calm",
    title: "Peace That Does Not Depend on Circumstance",
    question: "Can I be calm when everything around me is chaotic?",
    answer: "The deepest peace is not the calm after the storm but the calm within it. It comes not from controlling outcomes but from trusting that you can meet whatever comes. This kind of peace is built in small daily acts of surrender.",
    scripture: "Peace I leave with you; my peace I give you. I do not give to you as the world gives.",
    reference: "John 14:27",
    reflection: "List three things you are trying to control that are genuinely beyond your power. Write them down, then fold the paper away.",
  },
  {
    id: "c3", topic: "calm",
    title: "Breath as a Bridge",
    question: "What is the simplest way to return to myself?",
    answer: "The breath is the one function of your body that is both automatic and voluntary. It is the bridge between the nervous system and the will. When everything else feels out of reach, the breath is always here, always now, always enough.",
    scripture: "The breath of the Almighty gives me life.",
    reference: "Job 33:4",
    reflection: "Take four breaths: inhale for four counts, hold for four, exhale for six. Repeat three times. Notice the shift.",
  },
  // Justice
  {
    id: "j1", topic: "justice",
    title: "Speaking for Those the World Overlooks",
    question: "What does justice look like in daily life?",
    answer: "Justice is not only a grand political act. It lives in the small choices: how you speak about people who are not in the room, whether you notice who is being left out, if you use your privilege as a bridge rather than a wall. Daily justice is attention made actionable.",
    scripture: "Speak up for those who cannot speak for themselves, for the rights of all who are destitute.",
    reference: "Proverbs 31:8",
    reflection: "Think of one voice you have heard dismissed recently. What would it mean to amplify it this week?",
  },
  {
    id: "j2", topic: "justice",
    title: "The Long Arc and the Short Step",
    question: "How do I stay committed to justice when progress feels impossibly slow?",
    answer: "You are not required to finish the work. You are required not to abandon it. The long arc bends because of thousands of short steps taken by people who never saw the outcome. Your step matters even if you never see where it lands.",
    scripture: "Let justice roll on like a river, righteousness like a never-failing stream!",
    reference: "Amos 5:24",
    reflection: "Choose one cause that moves you. Commit to one small, sustainable action you can do weekly. Consistency outlasts intensity.",
  },
  // Hope
  {
    id: "h1", topic: "hope",
    title: "Hope Is Not Naivety",
    question: "Is it realistic to hope when the evidence is so grim?",
    answer: "Hope is not optimism that ignores the data. It is the stubborn refusal to let the worst moment have the final word. The seed does not deny winter; it simply trusts that spring is not optional. Hope is what the evidence cannot disprove.",
    scripture: "For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
    reflection: "Recall one moment you thought was your ending that turned out to be a turning point. Write it down as evidence.",
  },
  {
    id: "h2", topic: "hope",
    title: "Anchored in the Unseen",
    question: "Where does hope come from when I have nothing left?",
    answer: "Hope does not come from having enough. It comes from being held by something that does not depend on your circumstances. The anchor is not in the water you can see but in the deep that holds regardless of the storm above.",
    scripture: "We have this hope as an anchor for the soul, firm and secure.",
    reference: "Hebrews 6:19",
    reflection: "Write one sentence beginning with 'I am still held by...' Complete it without editing. That is your anchor.",
  },
]

export const DAILY_REFLECTIONS: DailyReflection[] = [
  {
    id: "d1",
    title: "The Weight of Morning",
    passage: "Each morning brings new mercies. The weight you carried yesterday was real, but it does not belong to today. Set it down at the threshold of this new day and walk in lightly.",
    reference: "Lamentations 3:22-23",
    journalPrompt: "What would change if I treated today as genuinely new rather than a continuation of yesterday's struggle?",
    contemplationMinutes: 5,
  },
  {
    id: "d2",
    title: "The Wisdom of Restraint",
    passage: "Not every thought requires expression. Not every reaction needs action. There is a profound strength in the pause between impulse and response. In that pause lives your freedom.",
    reference: "Proverbs 17:27-28",
    journalPrompt: "Where in my life am I moving too quickly to hear what actually matters?",
    contemplationMinutes: 4,
  },
  {
    id: "d3",
    title: "Gratitude as Resistance",
    passage: "In a world that profits from your dissatisfaction, gratitude is a quiet act of rebellion. To name what is good, even amid what is broken, is to refuse the narrative of scarcity.",
    reference: "1 Thessalonians 5:18",
    journalPrompt: "Name three specific things in my current life that I would grieve if they were taken away.",
    contemplationMinutes: 3,
  },
  {
    id: "d4",
    title: "The Courage of Enough",
    passage: "Enough is not a number. It is a decision. The world will always offer more, and the hunger will never be satisfied by consumption alone. The bravest thing you can say today is: this is enough.",
    reference: "Hebrews 13:5",
    journalPrompt: "What am I pursuing that I already have in a different form?",
    contemplationMinutes: 5,
  },
  {
    id: "d5",
    title: "Listening as Love",
    passage: "The deepest form of care is not advice but attention. To listen fully, without preparing your response, is to say: you matter more than my need to be right.",
    reference: "James 1:19",
    journalPrompt: "When did someone last truly listen to me? How did it feel? Can I offer that gift today?",
    contemplationMinutes: 4,
  },
]

export const REPO_META: RepoMeta = {
  name: "divine-wisdom",
  description: "An open-source collection of philosophical and scriptural wisdom passages, curated for clarity and contemplation.",
  stars: 1284,
  language: "TypeScript",
  license: "MIT",
  url: "https://github.com/divine-wisdom/repository",
}

export const TOPIC_KEYS: TopicKey[] = ["faith", "purpose", "resilience", "calm", "justice", "hope"]

export function getPassagesByTopic(topic: TopicKey): WisdomPassage[] {
  return PASSAGES.filter((p) => p.topic === topic)
}

export function searchPassages(query: string): WisdomPassage[] {
  const q = query.toLowerCase().trim()
  if (!q) return PASSAGES
  return PASSAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.question.toLowerCase().includes(q) ||
      p.answer.toLowerCase().includes(q) ||
      p.scripture.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q)
  )
}

export function getDailyReflection(): DailyReflection {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_REFLECTIONS[dayOfYear % DAILY_REFLECTIONS.length]
}
