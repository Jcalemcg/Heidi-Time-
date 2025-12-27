export interface Flashcard {
  id: number
  question: string
  answer: string
  topic: string
}

export const flashcardData: Flashcard[] = [
  {
    id: 1,
    topic: 'Psychiatric Assessment',
    question: 'What is the primary role of a PMHNP?',
    answer: 'A PMHNP provides comprehensive mental health and psychiatric nursing care including assessment, diagnosis, treatment planning, and pharmacological management.'
  },
  {
    id: 2,
    topic: 'Therapeutic Relationships',
    question: 'Describe the therapeutic relationship in psychiatric nursing.',
    answer: 'A collaborative partnership built on trust, respect, and clear communication where the nurse uses self and evidence-based interventions to support client recovery.'
  },
  {
    id: 3,
    topic: 'Trauma-Informed Care',
    question: 'What are the key principles of trauma-informed care?',
    answer: 'Safety, trustworthiness, choice, collaboration, and empowerment - recognizing trauma\'s impact and avoiding re-traumatization.'
  },
  {
    id: 4,
    topic: 'Pharmacology',
    question: 'How do antipsychotics work in treating schizophrenia?',
    answer: 'They block dopamine and serotonin receptors in the brain, reducing positive symptoms like hallucinations and delusions.'
  },
  {
    id: 5,
    topic: 'Psychiatric Models',
    question: 'What is the biopsychosocial model in psychiatry?',
    answer: 'An integrated approach recognizing that mental health is influenced by biological, psychological, and social factors.'
  },
  {
    id: 6,
    topic: 'Mental Status Examination',
    question: 'What are the components of a mental status examination?',
    answer: 'Appearance/behavior, mood/affect, speech, thought process/content, perception, cognition, insight, and judgment.'
  },
  {
    id: 7,
    topic: 'Depression',
    question: 'Define major depressive disorder (MDD).',
    answer: 'Presence of five or more depressive symptoms during a 2-week period, with at least one being depressed mood or anhedonia, causing functional impairment.'
  },
  {
    id: 8,
    topic: 'Anxiety',
    question: 'What distinguishes generalized anxiety disorder (GAD) from normal worry?',
    answer: 'GAD involves persistent, excessive worry for at least 6 months that is difficult to control and causes significant functional impairment.'
  },
  {
    id: 9,
    topic: 'Schizophrenia',
    question: 'What are positive symptoms of schizophrenia?',
    answer: 'Hallucinations, delusions, disorganized speech, and disorganized or catatonic behavior - additions to normal experience.'
  },
  {
    id: 10,
    topic: 'Bipolar Disorder',
    question: 'What differentiates Bipolar I from Bipolar II disorder?',
    answer: 'Bipolar I includes at least one manic episode; Bipolar II includes hypomanic and depressive episodes but no full manic episodes.'
  },
  {
    id: 11,
    topic: 'Substance Use',
    question: 'Define substance use disorder (SUD) according to DSM-5.',
    answer: 'A pattern of substance use leading to clinically significant impairment or distress, with at least 2 of 11 criteria met in a 12-month period.'
  },
  {
    id: 12,
    topic: 'PTSD',
    question: 'What are the four diagnostic criteria clusters for PTSD?',
    answer: 'Re-experiencing, avoidance, negative alterations in cognition and mood, and alterations in arousal and reactivity.'
  },
  {
    id: 13,
    topic: 'Personality Disorders',
    question: 'Name the three clusters of personality disorders.',
    answer: 'Cluster A (Odd/Eccentric): Paranoid, Schizoid, Schizotypal; Cluster B (Dramatic): Antisocial, Borderline, Histrionic, Narcissistic; Cluster C (Anxious): Avoidant, Dependent, Obsessive-Compulsive.'
  },
  {
    id: 14,
    topic: 'Cognitive Therapy',
    question: 'What is cognitive distortion?',
    answer: 'Automatic negative thoughts or irrational thinking patterns that influence mood and behavior, treated through cognitive restructuring.'
  },
  {
    id: 15,
    topic: 'Neurotransmitters',
    question: 'Which neurotransmitters are involved in mood regulation?',
    answer: 'Serotonin, norepinephrine, dopamine, GABA, and glutamate play key roles in mood, motivation, pleasure, and anxiety regulation.'
  },
  {
    id: 16,
    topic: 'Psychopharmacology',
    question: 'What are SSRIs and what is their mechanism?',
    answer: 'Selective serotonin reuptake inhibitors block the reuptake of serotonin at the synapse, increasing serotonin availability in the brain.'
  },
  {
    id: 17,
    topic: 'Neurobiology',
    question: 'What is the hypothalamic-pituitary-adrenal (HPA) axis?',
    answer: 'The neuroendocrine system regulating stress response through the hypothalamus, anterior pituitary, and adrenal glands.'
  },
  {
    id: 18,
    topic: 'Psychosis',
    question: 'Differentiate between delusions and hallucinations.',
    answer: 'Delusions are false, fixed beliefs despite contrary evidence; hallucinations are sensory perceptions without external stimuli.'
  },
  {
    id: 19,
    topic: 'Suicide Risk',
    question: 'What are major risk factors for suicide?',
    answer: 'Male sex, age 45+, Caucasian, divorced/widowed/single, psychiatric illness, substance abuse, previous attempts, and access to means.'
  },
  {
    id: 20,
    topic: 'Nursing Ethics',
    question: 'Define therapeutic boundaries in psychiatric nursing.',
    answer: 'Professional limits that protect both client and nurse, maintain the therapeutic relationship, and prevent harm or exploitation.'
  }
]
