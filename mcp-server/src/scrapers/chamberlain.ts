import axios from 'axios'
import { load } from 'cheerio'

interface CurriculumContent {
  title: string
  course: string
  topic: string
  content: string
  learningObjectives: string[]
  keyTerms: string[]
  relatedTopics: string[]
  source: string
  timestamp: string
}

interface SearchResult {
  title: string
  course: string
  topic: string
  summary: string
  url?: string
}

interface CurriculumIndex {
  courses: Array<{
    id: string
    name: string
    code: string
    description: string
  }>
  topics: Array<{
    name: string
    course: string
    keywords: string[]
  }>
}

// Sample curriculum data (this demonstrates the structure)
// In production, this would be replaced with actual web scraping
const SAMPLE_CURRICULUM: Record<string, CurriculumContent> = {
  'anxiety-disorders': {
    title: 'Anxiety Disorders',
    course: 'PMHNP-600',
    topic: 'Anxiety Disorders',
    content: `
Anxiety disorders are characterized by persistent, excessive worry about various aspects of daily life.
These disorders are among the most common mental health conditions affecting the general population.

GENERALIZED ANXIETY DISORDER (GAD):
- Definition: Persistent, excessive worry about multiple aspects of daily life for at least 6 months
- Prevalence: Affects 2-3% of the population at any given time
- Gender distribution: More common in women (2:1 ratio)
- Onset: Typically in late childhood or early adulthood

DSM-5 DIAGNOSTIC CRITERIA:
1. Excessive anxiety and worry about a number of events or activities for at least 6 months
2. Difficulty controlling the worry
3. Associated with physical symptoms:
   - Restlessness or feeling on edge
   - Easy fatigability
   - Difficulty concentrating or mind going blank
   - Irritability
   - Muscle tension
   - Sleep disturbance

NEUROBIOLOGY:
- Dysregulation of gamma-aminobutyric acid (GABA) system
- Elevated activity in amygdala
- Decreased hippocampal volume in chronic cases
- HPA axis dysfunction with cortisol dysregulation
- Serotonergic dysfunction

NEUROCHEMICAL THEORIES:
1. GABA hypothesis: Insufficient inhibitory neurotransmission
2. Serotonin hypothesis: Hyposerotonergic function
3. CRH hypothesis: Dysregulated stress response

TREATMENT APPROACHES:
Pharmacological: First-line medications are SSRIs (selective serotonin reuptake inhibitors)
- Sertraline: 50-200 mg daily
- Paroxetine: 20-60 mg daily
- Escitalopram: 10-20 mg daily
- Venlafaxine: 75-225 mg daily

Psychological: Cognitive-behavioral therapy (CBT), acceptance and commitment therapy (ACT)
    `,
    learningObjectives: [
      'Identify diagnostic criteria for GAD according to DSM-5',
      'Explain the neurobiological basis of anxiety disorders',
      'Describe first-line pharmacological treatments',
      'Evaluate efficacy of psychotherapeutic interventions',
    ],
    keyTerms: ['GAD', 'GABA', 'SSRI', 'Amygdala', 'HPA axis', 'Cortisol'],
    relatedTopics: ['Panic Disorder', 'Social Anxiety Disorder', 'Medication Management', 'Psychopharmacology'],
    source: 'Chamberlain University PMHNP-600 Course Materials',
    timestamp: new Date().toISOString(),
  },

  'depression-disorders': {
    title: 'Major Depressive Disorder',
    course: 'PMHNP-600',
    topic: 'Depression',
    content: `
Major Depressive Disorder (MDD) is a serious mental health condition characterized by persistent depressed mood
and loss of interest or pleasure in activities.

DSM-5 DIAGNOSTIC CRITERIA:
Five or more symptoms during a 2-week period:
1. Depressed mood most of the day, nearly every day
2. Markedly diminished interest or pleasure in activities
3. Significant weight loss or gain
4. Insomnia or hypersomnia nearly every day
5. Psychomotor agitation or retardation
6. Fatigue or loss of energy
7. Feelings of worthlessness or excessive guilt
8. Diminished ability to concentrate
9. Recurrent thoughts of death or suicide

EPIDEMIOLOGY:
- Lifetime prevalence: 10-15% of population
- Gender: 2:1 female to male ratio
- Age of onset: Late teens to mid-20s typically
- Disability: Leading cause of disability globally

NEUROBIOLOGICAL FACTORS:
1. Monoamine hypothesis:
   - Serotonin deficiency
   - Norepinephrine deficiency
   - Dopamine deficiency

2. Neuroplasticity changes:
   - Hippocampal volume reduction
   - Prefrontal cortex dysfunction
   - Amygdala hyperactivity

3. HPA axis dysregulation:
   - Elevated cortisol
   - Abnormal dexamethasone suppression test
   - CRH elevation

RISK FACTORS:
- Genetic: 37% heritability
- Environmental: Life stressors, trauma, medical conditions
- Psychosocial: Loss, isolation, role changes

FIRST-LINE TREATMENTS:
Pharmacological (SSRIs):
- Fluoxetine: 20-40 mg daily
- Sertraline: 50-200 mg daily
- Citalopram: 20-40 mg daily

Psychological:
- Cognitive-behavioral therapy (CBT)
- Interpersonal therapy (IPT)
- Behavioral activation
    `,
    learningObjectives: [
      'Identify diagnostic criteria for MDD',
      'Explain neurobiology of depression',
      'Compare SSRI medications and side effects',
      'Discuss evidence-based psychotherapy approaches',
      'Assess suicide risk and safety planning',
    ],
    keyTerms: ['MDD', 'Monoamine', 'SSRI', 'Hippocampus', 'HPA axis', 'Cortisol', 'Suicide risk'],
    relatedTopics: ['Bipolar Disorder', 'Persistent Depressive Disorder', 'Antidepressant Medications', 'Suicide Assessment'],
    source: 'Chamberlain University PMHNP-600 Course Materials',
    timestamp: new Date().toISOString(),
  },

  'antipsychotics': {
    title: 'Antipsychotic Medications',
    course: 'PMHNP-700',
    topic: 'Psychopharmacology',
    content: `
Antipsychotic medications are used to treat psychotic symptoms in conditions like schizophrenia,
bipolar disorder, and major depression with psychotic features.

CLASSIFICATION:
First-generation (Typical):
- Higher potency for D2 blockade
- Greater risk of extrapyramidal side effects
- Examples: Haloperidol, chlorpromazine, perphenazine

Second-generation (Atypical):
- Lower EPS risk
- Greater metabolic side effects
- Examples: Risperidone, olanzapine, quetiapine, aripiprazole

MECHANISM OF ACTION:
- Dopamine antagonism (D2 receptors)
- Serotonin antagonism (5-HT2A receptors)
- Variable affinity for other receptors

FIRST-GENERATION ANTIPSYCHOTICS:
Haloperidol:
- Potency: High
- D2 blockade: 90%+
- Dosing: 2-20 mg daily in divided doses
- EPS risk: Very high
- NMS risk: High

SECOND-GENERATION ANTIPSYCHOTICS:
Risperidone:
- Dosing: 2-16 mg daily
- D2 occupancy: 60-80%
- Side effects: Weight gain, metabolic syndrome
- FDA approved for: Schizophrenia, bipolar mania

Olanzapine:
- Dosing: 5-20 mg daily
- Broad receptor antagonism
- Significant weight gain
- Good for treatment-resistant cases

Aripiprazole:
- Dosing: 10-30 mg daily
- Dopamine partial agonist
- Minimal weight gain
- Good tolerability

MONITORING REQUIREMENTS:
1. Baseline: Weight, BMI, waist circumference, blood pressure, fasting glucose, lipid panel
2. Ongoing: Repeat metabolic panel at 3 months, then annually
3. EPS monitoring: Use AIMS scale for dyskinesias
4. Prolactin monitoring: Especially with risperidone and paliperidone

SIDE EFFECTS:
Extrapyramidal: Akathisia, dystonia, parkinsonism, tardive dyskinesia
Metabolic: Weight gain, diabetes risk, dyslipidemia
Cardiovascular: QTc prolongation (especially with high doses)
Other: Hyperprolactinemia, sexual dysfunction, sedation

PATIENT EDUCATION:
- Importance of adherence
- Gradual onset of improvement (2-4 weeks minimum)
- Common side effects and management
- Need for regular monitoring
    `,
    learningObjectives: [
      'Distinguish first and second-generation antipsychotics',
      'Explain dopamine antagonism and clinical effects',
      'Identify and manage EPS',
      'Monitor for metabolic complications',
      'Provide patient education on antipsychotics',
    ],
    keyTerms: ['Antipsychotic', 'D2 receptor', 'EPS', 'NMS', 'Metabolic syndrome', 'Tardive dyskinesia'],
    relatedTopics: ['Schizophrenia', 'Bipolar Disorder', 'Drug Interactions', 'Side Effect Management'],
    source: 'Chamberlain University PMHNP-700 Course Materials',
    timestamp: new Date().toISOString(),
  },
}

const CURRICULUM_INDEX: CurriculumIndex = {
  courses: [
    {
      id: 'PMHNP-600',
      name: 'Psychiatric Nursing I',
      code: 'NP-600',
      description: 'Assessment, diagnosis, and treatment of major psychiatric disorders',
    },
    {
      id: 'PMHNP-700',
      name: 'Psychopharmacology and Therapeutics',
      code: 'NP-700',
      description: 'Detailed study of psychiatric medications and mechanism of action',
    },
    {
      id: 'PMHNP-800',
      name: 'Advanced Psychiatric Nursing',
      code: 'NP-800',
      description: 'Complex psychiatric cases and specialized treatment modalities',
    },
  ],
  topics: [
    { name: 'Anxiety Disorders', course: 'PMHNP-600', keywords: ['anxiety', 'GAD', 'panic', 'worry'] },
    { name: 'Depression', course: 'PMHNP-600', keywords: ['depression', 'MDD', 'mood', 'sadness'] },
    { name: 'Bipolar Disorder', course: 'PMHNP-600', keywords: ['bipolar', 'mania', 'mood episodes'] },
    { name: 'Schizophrenia', course: 'PMHNP-600', keywords: ['psychosis', 'delusions', 'hallucinations'] },
    { name: 'Antipsychotics', course: 'PMHNP-700', keywords: ['antipsychotic', 'D2', 'dopamine'] },
    { name: 'Antidepressants', course: 'PMHNP-700', keywords: ['SSRI', 'antidepressant', 'serotonin'] },
    { name: 'Anxiolytics', course: 'PMHNP-700', keywords: ['benzodiazepine', 'buspirone', 'GABA'] },
    { name: 'Mood Stabilizers', course: 'PMHNP-700', keywords: ['lithium', 'anticonvulsant', 'valproate'] },
  ],
}

export async function searchCurriculumTopics(query: string, course?: string): Promise<SearchResult[]> {
  const normalizedQuery = query.toLowerCase()
  const results: SearchResult[] = []

  // Search through sample curriculum
  Object.entries(SAMPLE_CURRICULUM).forEach(([key, content]) => {
    const courseMatch = !course || content.course.toLowerCase().includes(course.toLowerCase())
    const queryMatch =
      content.title.toLowerCase().includes(normalizedQuery) ||
      content.topic.toLowerCase().includes(normalizedQuery) ||
      content.keyTerms.some((term) => term.toLowerCase().includes(normalizedQuery)) ||
      content.relatedTopics.some((topic) => topic.toLowerCase().includes(normalizedQuery))

    if (courseMatch && queryMatch) {
      results.push({
        title: content.title,
        course: content.course,
        topic: content.topic,
        summary: content.content.substring(0, 300) + '...',
      })
    }
  })

  // Also search curriculum index
  CURRICULUM_INDEX.topics.forEach((topic) => {
    const courseMatch = !course || topic.course.toLowerCase().includes(course.toLowerCase())
    const queryMatch = topic.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery))

    if (courseMatch && queryMatch && !results.some((r) => r.topic === topic.name)) {
      results.push({
        title: topic.name,
        course: topic.course,
        topic: topic.name,
        summary: `Content available for ${topic.name} in ${topic.course}`,
      })
    }
  })

  return results
}

export async function getCurriculumIndex(): Promise<CurriculumIndex> {
  return CURRICULUM_INDEX
}

export async function scrapeCurriculumContent(
  topic: string,
  _course?: string,
  _detailed: boolean = true
): Promise<CurriculumContent | null> {
  // Search for the topic in our sample curriculum
  const normalizedTopic = topic.toLowerCase().replace(/\s+/g, '-')

  for (const [key, content] of Object.entries(SAMPLE_CURRICULUM)) {
    if (key.includes(normalizedTopic) || content.topic.toLowerCase() === topic.toLowerCase()) {
      return content
    }
  }

  // If topic not found, try searching by keywords
  for (const content of Object.values(SAMPLE_CURRICULUM)) {
    if (content.keyTerms.some((term) => term.toLowerCase().includes(topic.toLowerCase()))) {
      return content
    }
  }

  // Return null if not found
  return null
}

/**
 * Placeholder for actual web scraping functionality
 * This would scrape real Chamberlain curriculum pages
 * Currently uses sample data to demonstrate structure
 */
export async function scrapeChamberlainWebsite(_query: string): Promise<string[]> {
  // Respect robots.txt and terms of service
  // This is a placeholder - actual implementation would:
  // 1. Check robots.txt
  // 2. Use appropriate delays between requests
  // 3. Respect rate limiting
  // 4. Only scrape publicly available content
  // 5. Provide proper attribution

  return ['Sample curriculum content - replace with actual web scraping']
}
