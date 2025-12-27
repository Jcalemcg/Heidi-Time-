export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  topic: string
}

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Psychopharmacology',
    question: 'Which neurotransmitter is primarily implicated in major depressive disorder?',
    options: ['Serotonin', 'Acetylcholine', 'GABA', 'Glutamate'],
    correctAnswer: 0,
    explanation: 'Serotonin dysregulation is the primary neurotransmitter implicated in MDD, which is why SSRIs are used as first-line treatment.'
  },
  {
    id: 2,
    topic: 'Mental Status Examination',
    question: 'What is the first step in a mental status examination?',
    options: ['Cognitive Assessment', 'Appearance and Behavior', 'Mood and Affect', 'Thought Content'],
    correctAnswer: 1,
    explanation: 'Appearance and behavior are observed first as they provide initial clinical impressions about the client\'s general functioning.'
  },
  {
    id: 3,
    topic: 'Diagnostic Criteria',
    question: 'How many depressive symptoms are required for a diagnosis of Major Depressive Disorder?',
    options: ['At least 3', 'At least 5', 'At least 7', 'All 9'],
    correctAnswer: 1,
    explanation: 'DSM-5 requires at least 5 symptoms present during a 2-week period, with depressed mood or anhedonia being one of them.'
  },
  {
    id: 4,
    topic: 'Anxiety Disorders',
    question: 'What is the minimum duration of worry required for a GAD diagnosis?',
    options: ['1 month', '3 months', '6 months', '12 months'],
    correctAnswer: 2,
    explanation: 'Generalized Anxiety Disorder requires excessive worry for at least 6 months, occurring more days than not.'
  },
  {
    id: 5,
    topic: 'Schizophrenia',
    question: 'Which is NOT a positive symptom of schizophrenia?',
    options: ['Hallucinations', 'Delusions', 'Social withdrawal', 'Disorganized speech'],
    correctAnswer: 2,
    explanation: 'Social withdrawal is a negative symptom (diminishment of normal functioning). Hallucinations, delusions, and disorganized speech are positive symptoms.'
  },
  {
    id: 6,
    topic: 'Bipolar Disorder',
    question: 'What minimum duration defines a manic episode in Bipolar I Disorder?',
    options: ['3 days', '4 days', '7 days', '14 days'],
    correctAnswer: 2,
    explanation: 'A manic episode requires a distinct period of abnormally elevated mood lasting at least 7 consecutive days with symptoms present most of the day.'
  },
  {
    id: 7,
    topic: 'Pharmacology',
    question: 'Which class of antidepressants blocks the reuptake of both serotonin and norepinephrine?',
    options: ['SSRI', 'SNRI', 'MAOI', 'Tricyclic'],
    correctAnswer: 1,
    explanation: 'SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors) block the reuptake of both serotonin and norepinephrine.'
  },
  {
    id: 8,
    topic: 'PTSD',
    question: 'What is a criterion for PTSD diagnosis?',
    options: ['Symptoms for at least 1 month', 'Symptoms for at least 3 months', 'Symptoms for at least 6 months', 'Symptoms for at least 1 year'],
    correctAnswer: 0,
    explanation: 'PTSD requires disturbance that persists for more than 1 month. Acute Stress Disorder is diagnosed if symptoms occur within 1 month.'
  },
  {
    id: 9,
    topic: 'Substance Use',
    question: 'How many DSM-5 criteria must be met for a substance use disorder diagnosis?',
    options: ['At least 1', 'At least 2', 'At least 5', 'All 11'],
    correctAnswer: 1,
    explanation: 'A Substance Use Disorder diagnosis requires 2 or more of the 11 criteria present within a 12-month period.'
  },
  {
    id: 10,
    topic: 'Therapeutic Communication',
    question: 'Which communication technique helps clients explore thoughts and feelings in depth?',
    options: ['Advice-giving', 'Reflecting', 'Interpreting', 'Reassurance'],
    correctAnswer: 1,
    explanation: 'Reflection involves restating or paraphrasing what the client has said, demonstrating understanding and encouraging deeper exploration.'
  },
  {
    id: 11,
    topic: 'Suicide Risk Assessment',
    question: 'Which group has the highest suicide completion rate?',
    options: ['Young females', 'Young males', 'Older males', 'Middle-aged females'],
    correctAnswer: 2,
    explanation: 'Males aged 45 and older, especially Caucasian males, have significantly higher suicide completion rates, though females attempt more.'
  },
  {
    id: 12,
    topic: 'Personality Disorders',
    question: 'Which personality disorder is characterized by emotional instability and fear of abandonment?',
    options: ['Narcissistic', 'Borderline', 'Antisocial', 'Paranoid'],
    correctAnswer: 1,
    explanation: 'Borderline Personality Disorder includes unstable relationships, fear of abandonment, identity disturbance, and emotional dysregulation.'
  },
  {
    id: 13,
    topic: 'Medication Management',
    question: 'What is a major side effect of antipsychotic medications?',
    options: ['Hyperactivity', 'Tachycardia', 'Metabolic syndrome', 'Hypertension'],
    correctAnswer: 2,
    explanation: 'Antipsychotics can cause metabolic syndrome including weight gain, hyperglycemia, and dyslipidemia, requiring monitoring.'
  },
  {
    id: 14,
    topic: 'Therapeutic Relationships',
    question: 'Which is an example of transference in therapy?',
    options: ['The therapist\'s personal opinions affecting treatment', 'The client projecting past relationship patterns onto the therapist', 'The therapist sharing personal stories', 'The client refusing to attend sessions'],
    correctAnswer: 1,
    explanation: 'Transference occurs when a client projects feelings, attitudes, and expectations from past relationships onto the therapist.'
  },
  {
    id: 15,
    topic: 'Crisis Intervention',
    question: 'What is the primary goal of crisis intervention?',
    options: ['Cure the mental illness', 'Restore equilibrium and prevent further deterioration', 'Hospitalize the client', 'Prescribe medication'],
    correctAnswer: 1,
    explanation: 'Crisis intervention aims to help the individual return to baseline functioning and prevent further deterioration through immediate support.'
  },
  {
    id: 16,
    topic: 'Assessment',
    question: 'Which is NOT part of a comprehensive psychiatric assessment?',
    options: ['Medical history', 'Mental status examination', 'Blood pressure reading only', 'Substance use history'],
    correctAnswer: 2,
    explanation: 'A comprehensive assessment includes medical history, mental status exam, and substance use history. Blood pressure reading alone is insufficient.'
  },
  {
    id: 17,
    topic: 'OCD',
    question: 'What is the difference between obsessions and compulsions in OCD?',
    options: ['Obsessions are external, compulsions are internal', 'Obsessions are unwanted intrusive thoughts, compulsions are repetitive behaviors', 'They are the same thing', 'Obsessions are controllable, compulsions are not'],
    correctAnswer: 1,
    explanation: 'Obsessions are persistent, intrusive thoughts causing anxiety. Compulsions are repetitive behaviors or mental acts performed to relieve the anxiety.'
  },
  {
    id: 18,
    topic: 'Psychosis',
    question: 'Which is a negative symptom of psychosis?',
    options: ['Hallucinations', 'Alogia (poverty of speech)', 'Delusions', 'Disorganized thinking'],
    correctAnswer: 1,
    explanation: 'Negative symptoms represent a diminishment of normal functioning, including alogia, avolition, and affective flattening.'
  },
  {
    id: 19,
    topic: 'Neurobiology',
    question: 'What role does the amygdala play in anxiety and fear?',
    options: ['Executive function', 'Memory formation', 'Processing of fear and emotional responses', 'Speech production'],
    correctAnswer: 2,
    explanation: 'The amygdala is crucial for processing fear and emotional responses, particularly in anxiety and PTSD.'
  },
  {
    id: 20,
    topic: 'Ethics',
    question: 'What is the primary ethical principle regarding client confidentiality?',
    options: ['Share information with family members freely', 'Maintain strict confidentiality except when mandated by law', 'Document everything for research', 'Share with other providers without consent'],
    correctAnswer: 1,
    explanation: 'Maintaining confidentiality is a core ethical principle, with limited exceptions for mandated reporting (harm, abuse) and therapeutic necessity.'
  },
  {
    id: 21,
    topic: 'Sleep Disorders',
    question: 'Which medication is recommended for insomnia management?',
    options: ['Stimulants', 'Benzodiazepines or non-benzodiazepine hypnotics', 'Antipsychotics only', 'High-dose antidepressants'],
    correctAnswer: 1,
    explanation: 'Benzodiazepines and non-benzodiazepine hypnotics (Z-drugs) are first-line for insomnia, though CBT-I is preferred long-term.'
  },
  {
    id: 22,
    topic: 'Eating Disorders',
    question: 'What is the BMI threshold for diagnosis of Anorexia Nervosa?',
    options: ['Below 18.5', 'Below 17.5', 'Not specifically defined by BMI alone', 'Below 16'],
    correctAnswer: 2,
    explanation: 'DSM-5 doesn\'t specify a BMI threshold; diagnosis requires significantly low body weight relative to the individual\'s needs.'
  },
  {
    id: 23,
    topic: 'Dementia',
    question: 'What distinguishes dementia from delirium?',
    options: ['Dementia is acute, delirium is chronic', 'Dementia is chronic, delirium is acute and reversible', 'They are identical', 'Dementia only affects cognition'],
    correctAnswer: 1,
    explanation: 'Dementia is a chronic, progressive condition, while delirium is acute, fluctuating, and often reversible if the underlying cause is treated.'
  },
  {
    id: 24,
    topic: 'Group Therapy',
    question: 'What is a primary advantage of group therapy?',
    options: ['Faster treatment', 'Lower cost', 'Peer support and socialization', 'More privacy'],
    correctAnswer: 2,
    explanation: 'Group therapy provides peer support, reduces isolation, allows clients to learn from others, and is often more cost-effective than individual therapy.'
  },
  {
    id: 25,
    topic: 'Medication Side Effects',
    question: 'Which side effect may occur with SSRIs?',
    options: ['Tachycardia', 'Sexual dysfunction', 'Hypertension', 'Weight loss only'],
    correctAnswer: 1,
    explanation: 'Sexual dysfunction is a common SSRI side effect. Other common effects include activation, insomnia, and SIADH, not tachycardia or hypertension.'
  }
]
