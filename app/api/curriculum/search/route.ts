import { NextRequest, NextResponse } from 'next/server'

// Sample curriculum data (same as MCP server)
const SAMPLE_CURRICULUM: Record<
  string,
  {
    title: string
    course: string
    topic: string
    content: string
    learningObjectives: string[]
    keyTerms: string[]
    relatedTopics: string[]
  }
> = {
  'anxiety-disorders': {
    title: 'Anxiety Disorders',
    course: 'PMHNP-600',
    topic: 'Anxiety Disorders',
    content: `Anxiety disorders are characterized by persistent, excessive worry about various aspects of daily life.

GENERALIZED ANXIETY DISORDER (GAD):
- Definition: Persistent, excessive worry for at least 6 months
- DSM-5 criteria include: worry, difficulty controlling worry, and 3+ physical symptoms
- Neurobiology: GABA dysregulation, elevated amygdala activity, HPA axis dysfunction
- Treatment: SSRIs (sertraline, paroxetine, escitalopram), CBT, ACT

PANIC DISORDER:
- Recurrent unexpected panic attacks
- Anticipatory anxiety about future attacks
- Agoraphobic avoidance patterns
- Treatment: SSRIs, exposure therapy, CBT

SOCIAL ANXIETY DISORDER:
- Intense fear of social situations and scrutiny
- Performance anxiety
- Treatment: SSRIs, MAOIs, CBT with exposure`,
    learningObjectives: [
      'Identify diagnostic criteria for anxiety disorders',
      'Explain neurobiological mechanisms',
      'Prescribe first-line pharmacological treatments',
      'Implement evidence-based psychotherapy',
    ],
    keyTerms: ['anxiety', 'GAD', 'panic', 'SSRI', 'GABA', 'exposure therapy'],
    relatedTopics: ['OCD', 'PTSD', 'Medication Management'],
  },

  'depression': {
    title: 'Major Depressive Disorder',
    course: 'PMHNP-600',
    topic: 'Depression',
    content: `Major Depressive Disorder is the leading cause of disability worldwide.

DSM-5 DIAGNOSTIC CRITERIA:
- 5+ symptoms during 2-week period
- Depressed mood, anhedonia, sleep changes, guilt, concentration issues
- Significant distress or impairment
- Not attributable to substance use or medical condition

NEUROBIOLOGY:
- Monoamine hypothesis: Serotonin, norepinephrine, dopamine deficiency
- Neuroplasticity: Hippocampal volume reduction, prefrontal dysfunction
- HPA axis: Elevated cortisol, abnormal dexamethasone test
- Inflammation: Elevated cytokines (IL-6, TNF-α, CRP)

TREATMENT:
SSRIs: Fluoxetine, sertraline, citalopram
SNRIs: Venlafaxine, duloxetine
Tricyclic antidepressants: Amitriptyline, nortriptyline
Psychotherapy: CBT, IPT, behavioral activation
Somatic: ECT, TMS, ketamine`,
    learningObjectives: [
      'Assess depression severity and suicide risk',
      'Select appropriate antidepressant',
      'Monitor for serotonin syndrome',
      'Implement suicide safety planning',
    ],
    keyTerms: ['depression', 'MDD', 'monoamine', 'SSRI', 'suicide'],
    relatedTopics: ['Bipolar Disorder', 'Persistent Depressive Disorder'],
  },

  'antipsychotics': {
    title: 'Antipsychotic Medications',
    course: 'PMHNP-700',
    topic: 'Psychopharmacology',
    content: `Antipsychotics treat positive symptoms of psychosis through dopamine antagonism.

FIRST-GENERATION (TYPICAL):
- Higher potency D2 blockade (90%+)
- Greater EPS risk
- Haloperidol, chlorpromazine, perphenazine
- Dosing: 2-20 mg daily for haloperidol

SECOND-GENERATION (ATYPICAL):
- Lower EPS risk, higher metabolic side effects
- Partial dopamine agonism (aripiprazole)
- Risperidone: 2-16 mg daily
- Olanzapine: 5-20 mg daily
- Quetiapine: 150-750 mg daily
- Aripiprazole: 10-30 mg daily

MONITORING:
- Baseline: Weight, BMI, glucose, lipids, prolactin, ECG
- Regular: Metabolic panel at 3 months, then annually
- EPS: Use AIMS and Barnes Akathisia scales
- Prolactin effects: Sexual dysfunction, galactorrhea

SIDE EFFECTS:
- EPS: Dystonia, akathisia, parkinsonism, tardive dyskinesia
- Metabolic: Weight gain, diabetes, dyslipidemia
- Cardiovascular: QTc prolongation
- Endocrine: Hyperprolactinemia`,
    learningObjectives: [
      'Compare first and second-generation antipsychotics',
      'Explain dopamine hypothesis of schizophrenia',
      'Identify and manage EPS and NMS',
      'Monitor metabolic complications',
      'Assess treatment response',
    ],
    keyTerms: ['antipsychotic', 'dopamine', 'D2 receptor', 'EPS', 'metabolic syndrome'],
    relatedTopics: ['Schizophrenia', 'Bipolar Disorder', 'Psychosis'],
  },

  'mood-stabilizers': {
    title: 'Mood Stabilizing Medications',
    course: 'PMHNP-700',
    topic: 'Psychopharmacology',
    content: `Mood stabilizers prevent both manic and depressive episodes in bipolar disorder.

LITHIUM:
- Mechanism: Unclear, affects multiple neurotransmitter systems
- Narrow therapeutic window: 0.6-1.2 mEq/L
- Monitoring: Baseline and regular renal/thyroid function, lithium levels
- Side effects: Tremor, polyuria, polydipsia, weight gain, thyroid dysfunction
- Teratogenic: Associated with Ebstein's anomaly

ANTICONVULSANTS:
Valproate:
- Dosing: 500-3000 mg daily in divided doses
- Therapeutic level: 50-125 mcg/mL
- Monitoring: LFTs, CBC, level monitoring
- Pregnancy: Contraindicated, high teratogenic risk

Lamotrigine:
- Particularly effective for bipolar depression
- Requires slow titration to prevent SJS/TEN
- Dosing: 200-400 mg daily (lower with certain drugs)

Carbamazepine:
- Potent CYP3A4 inducer (many drug interactions)
- Dosing: 800-1600 mg daily
- Monitoring: CBC, LFTs, levels

ATYPICAL ANTIPSYCHOTICS:
- Quetiapine, aripiprazole, lurasidone
- FDA approved for bipolar maintenance
- Effect on both mania and depression`,
    learningObjectives: [
      'Explain mechanisms of mood stabilizers',
      'Select appropriate mood stabilizer for clinical presentation',
      'Monitor therapeutic levels and toxicity',
      'Manage drug interactions',
      'Counsel on pregnancy risks',
    ],
    keyTerms: ['lithium', 'mood stabilizer', 'anticonvulsant', 'valproate', 'therapeutic level'],
    relatedTopics: ['Bipolar Disorder', 'Drug Interactions', 'Pregnancy and Psychiatry'],
  },
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const course = searchParams.get('course')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter (q) is required' },
        { status: 400 }
      )
    }

    const normalizedQuery = query.toLowerCase()
    const results: Array<{
      title: string
      course: string
      topic: string
      summary: string
      keyTerms: string[]
    }> = []

    // Search through curriculum
    Object.entries(SAMPLE_CURRICULUM).forEach(([_key, content]) => {
      const courseMatch = !course || content.course.toLowerCase().includes(course.toLowerCase())
      const queryMatch =
        content.title.toLowerCase().includes(normalizedQuery) ||
        content.topic.toLowerCase().includes(normalizedQuery) ||
        content.keyTerms.some((term) => term.toLowerCase().includes(normalizedQuery)) ||
        content.relatedTopics.some((topic) => topic.toLowerCase().includes(normalizedQuery)) ||
        content.content.toLowerCase().includes(normalizedQuery)

      if (courseMatch && queryMatch) {
        results.push({
          title: content.title,
          course: content.course,
          topic: content.topic,
          summary: content.content.substring(0, 200) + '...',
          keyTerms: content.keyTerms,
        })
      }
    })

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
    })
  } catch (error) {
    console.error('Error searching curriculum:', error)
    return NextResponse.json(
      {
        error: 'Failed to search curriculum',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
