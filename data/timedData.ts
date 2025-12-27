export interface TimedQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  topic: string
}

export const timedData: TimedQuestion[] = [
  {
    id: 1,
    topic: 'Pharmacology',
    question: 'Which SSRI is safest in pregnancy?',
    options: ['Fluoxetine', 'Paroxetine', 'Sertraline', 'All equally safe'],
    correctAnswer: 0
  },
  {
    id: 2,
    topic: 'Diagnostic Criteria',
    question: 'Define anhedonia.',
    options: ['Excessive pleasure seeking', 'Loss of interest in activities', 'Excessive anxiety', 'Sleep disturbance'],
    correctAnswer: 1
  },
  {
    id: 3,
    topic: 'Assessment',
    question: 'What is the first intervention for suicidal ideation?',
    options: ['Medication', 'Assessment of imminent danger', 'Discharge planning', 'Psychoeducation'],
    correctAnswer: 1
  },
  {
    id: 4,
    topic: 'Neurobiology',
    question: 'Which brain region is responsible for emotional regulation?',
    options: ['Cerebellum', 'Prefrontal cortex', 'Brainstem', 'Occipital lobe'],
    correctAnswer: 1
  },
  {
    id: 5,
    topic: 'Schizophrenia',
    question: 'What is the duration of symptoms needed for schizophrenia diagnosis?',
    options: ['1 month', '3 months', '6 months', '1 year'],
    correctAnswer: 2
  },
  {
    id: 6,
    topic: 'Anxiety',
    question: 'Which therapy is most effective for panic disorder?',
    options: ['Psychoanalysis', 'Cognitive-behavioral therapy', 'Hypnosis', 'Relaxation only'],
    correctAnswer: 1
  },
  {
    id: 7,
    topic: 'Mood Disorders',
    question: 'What is the treatment of choice for bipolar disorder?',
    options: ['SSRIs alone', 'Benzodiazepines', 'Lithium or other mood stabilizers', 'Antipsychotics only'],
    correctAnswer: 2
  },
  {
    id: 8,
    topic: 'Trauma',
    question: 'Which is a trauma-informed care principle?',
    options: ['Victim-blaming', 'Safety and trustworthiness', 'Authority-based approach', 'Minimal explanation needed'],
    correctAnswer: 1
  },
  {
    id: 9,
    topic: 'Substance Use',
    question: 'What is the primary goal in addiction treatment?',
    options: ['Quick abstinence', 'Harm reduction and recovery', 'Medication substitution only', 'Confrontation'],
    correctAnswer: 1
  },
  {
    id: 10,
    topic: 'Communication',
    question: 'What does active listening involve?',
    options: ['Waiting for your turn to speak', 'Full attention and reflection back', 'Advice-giving', 'Telling personal stories'],
    correctAnswer: 1
  },
  {
    id: 11,
    topic: 'Psychosis',
    question: 'What is folie à deux?',
    options: ['Two psychotic episodes', 'Shared delusional system', 'Dual diagnosis', 'Comorbid conditions'],
    correctAnswer: 1
  },
  {
    id: 12,
    topic: 'Personality',
    question: 'Which therapeutic approach is best for personality disorders?',
    options: ['Medication alone', 'Hospitalization only', 'Long-term psychotherapy', 'No treatment needed'],
    correctAnswer: 2
  },
  {
    id: 13,
    topic: 'Neurochemistry',
    question: 'Which neurotransmitter is associated with movement disorders?',
    options: ['Serotonin', 'GABA', 'Dopamine', 'Acetylcholine'],
    correctAnswer: 2
  },
  {
    id: 14,
    topic: 'Ethics',
    question: 'What is informed consent?',
    options: ['Simple permission', 'Understanding risks, benefits, and alternatives', 'Verbal agreement only', 'Family permission only'],
    correctAnswer: 1
  },
  {
    id: 15,
    topic: 'Development',
    question: 'Which disorder typically appears in childhood?',
    options: ['Dementia', 'Autism Spectrum Disorder', 'Delirium', 'Vascular depression'],
    correctAnswer: 1
  },
  {
    id: 16,
    topic: 'Medications',
    question: 'What is serotonin syndrome?',
    options: ['Depression', 'Toxicity from excessive serotonin', 'SSRI withdrawal', 'Normal therapeutic effect'],
    correctAnswer: 1
  },
  {
    id: 17,
    topic: 'Assessment',
    question: 'What does MSE stand for?',
    options: ['Mental Status Examination', 'Mental Support Evaluation', 'Major Symptom Exam', 'Mental Severity Estimate'],
    correctAnswer: 0
  },
  {
    id: 18,
    topic: 'Therapy',
    question: 'What is Dialectical Behavior Therapy primarily used for?',
    options: ['Schizophrenia', 'Borderline Personality Disorder', 'ADHD', 'Autism'],
    correctAnswer: 1
  },
  {
    id: 19,
    topic: 'Neurology',
    question: 'Which neurotransmitter is deficient in Parkinsons disease?',
    options: ['Serotonin', 'GABA', 'Dopamine', 'Glutamate'],
    correctAnswer: 2
  },
  {
    id: 20,
    topic: 'Pharmacology',
    question: 'What is the therapeutic lag for antidepressants?',
    options: ['1 week', '2-4 weeks', '10-12 weeks', 'Immediate'],
    correctAnswer: 1
  },
  {
    id: 21,
    topic: 'Substance Abuse',
    question: 'What is methadone used for?',
    options: ['Cocaine addiction', 'Alcohol withdrawal', 'Opioid addiction management', 'Stimulant abuse'],
    correctAnswer: 2
  },
  {
    id: 22,
    topic: 'Mental Health',
    question: 'Which is NOT a criterion for substance use disorder?',
    options: ['Impaired control', 'Social impairment', 'Occasional use', 'Risky use'],
    correctAnswer: 2
  },
  {
    id: 23,
    topic: 'Diagnosis',
    question: 'What distinguishes Adjustment Disorder from other conditions?',
    options: ['Lifelong condition', 'Response to identifiable stressor', 'No stressor needed', 'Always requires hospitalization'],
    correctAnswer: 1
  },
  {
    id: 24,
    topic: 'Intervention',
    question: 'What is motivational interviewing?',
    options: ['Confrontational technique', 'Client-centered approach to increase intrinsic motivation', 'Advice-giving method', 'Authority-based strategy'],
    correctAnswer: 1
  },
  {
    id: 25,
    topic: 'Prevention',
    question: 'What is primary prevention in mental health?',
    options: ['Treating existing illness', 'Preventing relapse', 'Reducing new cases in population', 'Early intervention'],
    correctAnswer: 2
  }
]
