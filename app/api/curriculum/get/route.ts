import { NextRequest, NextResponse } from 'next/server'

const CURRICULUM_DATA: Record<
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

TREATMENT APPROACHES:
Pharmacological: First-line medications are SSRIs
- Sertraline: 50-200 mg daily
- Paroxetine: 20-60 mg daily
- Escitalopram: 10-20 mg daily
- Venlafaxine: 75-225 mg daily

Psychological: Cognitive-behavioral therapy (CBT), acceptance and commitment therapy (ACT)`,
    learningObjectives: [
      'Identify diagnostic criteria for GAD according to DSM-5',
      'Explain the neurobiological basis of anxiety disorders',
      'Describe first-line pharmacological treatments',
      'Evaluate efficacy of psychotherapeutic interventions',
      'Apply evidence-based assessment tools',
    ],
    keyTerms: ['GAD', 'GABA', 'SSRI', 'Amygdala', 'HPA axis', 'Cortisol', 'DSM-5'],
    relatedTopics: ['Panic Disorder', 'Social Anxiety Disorder', 'Medication Management', 'Psychopharmacology'],
  },

  depression: {
    title: 'Major Depressive Disorder',
    course: 'PMHNP-600',
    topic: 'Depression',
    content: `Major Depressive Disorder (MDD) is a serious mental health condition characterized by persistent depressed mood
and loss of interest or pleasure in activities. It is the leading cause of disability worldwide.

DSM-5 DIAGNOSTIC CRITERIA:
Five or more symptoms during a 2-week period:
1. Depressed mood most of the day, nearly every day
2. Markedly diminished interest or pleasure in activities (anhedonia)
3. Significant weight loss or gain, or appetite changes
4. Insomnia or hypersomnia nearly every day
5. Psychomotor agitation or retardation observable by others
6. Fatigue or loss of energy
7. Feelings of worthlessness or excessive inappropriate guilt
8. Diminished ability to concentrate, make decisions
9. Recurrent thoughts of death, recurrent suicidal ideation, suicide attempt, or suicide plan

EPIDEMIOLOGY:
- Lifetime prevalence: 10-15% of population
- Gender: 2:1 female to male ratio
- Age of onset: Late teens to mid-20s typically
- Disability: Leading cause of disability globally (WHO)
- Medical comorbidity: Higher risk with chronic medical conditions

NEUROBIOLOGICAL FACTORS:
1. Monoamine hypothesis:
   - Serotonin deficiency
   - Norepinephrine deficiency
   - Dopamine deficiency

2. Neuroplasticity changes:
   - Hippocampal volume reduction
   - Prefrontal cortex dysfunction
   - Amygdala hyperactivity
   - Impaired neurogenesis in hippocampus

3. HPA axis dysregulation:
   - Elevated cortisol
   - Abnormal dexamethasone suppression test
   - CRH elevation
   - Loss of circadian rhythm

4. Inflammatory markers:
   - Elevated IL-6, TNF-α
   - Increased CRP
   - Cytokine imbalance

RISK FACTORS:
- Genetic: 37% heritability
- Environmental: Life stressors, trauma, medical conditions
- Psychosocial: Loss, isolation, role changes
- Biological: Hormonal changes, medical illness

TREATMENT APPROACHES:

Pharmacological (First-line SSRIs):
- Fluoxetine: 20-40 mg daily
- Sertraline: 50-200 mg daily
- Citalopram: 20-40 mg daily (max 40 mg if over 60)
- Escitalopram: 10-20 mg daily
- Paroxetine: 20-50 mg daily

SNRIs:
- Venlafaxine: 75-225 mg daily
- Duloxetine: 40-60 mg daily

Tricyclic antidepressants:
- Amitriptyline: 75-300 mg daily
- Nortriptyline: 75-150 mg daily (higher weight/cardiac risk)

Atypical:
- Bupropion: 300 mg daily (good for anhedonia, sexual side effects)
- Mirtazapine: 15-45 mg daily (good for insomnia, appetite)

Psychotherapy:
- Cognitive-behavioral therapy (CBT)
- Interpersonal therapy (IPT)
- Behavioral activation
- Psychodynamic psychotherapy
- Mindfulness-based cognitive therapy

Somatic treatments:
- Electroconvulsive therapy (ECT): Most effective, 60-80% response rate
- Transcranial magnetic stimulation (TMS)
- Ketamine/esketamine: For treatment-resistant depression

SUICIDE ASSESSMENT AND SAFETY PLANNING:
- Assess current ideation, intent, plan, access to means
- Protective factors: Social support, religious beliefs, reasons for living
- Safety planning: Remove access to means, identify support
- Hospitalization: Imminent risk, inability to care for self`,
    learningObjectives: [
      'Identify diagnostic criteria for MDD and distinguish from other conditions',
      'Explain neurobiological mechanisms and neurotransmitter dysfunction',
      'Assess suicide risk comprehensively',
      'Select appropriate antidepressant based on symptom profile',
      'Monitor for side effects and serotonin syndrome',
      'Implement evidence-based psychotherapy approaches',
      'Coordinate care with multidisciplinary team',
    ],
    keyTerms: ['MDD', 'Monoamine', 'SSRI', 'Hippocampus', 'HPA axis', 'Cortisol', 'Suicide risk', 'Anhedonia'],
    relatedTopics: ['Bipolar Disorder', 'Persistent Depressive Disorder', 'Antidepressant Medications', 'Suicide Assessment', 'Treatment-Resistant Depression'],
  },

  antipsychotics: {
    title: 'Antipsychotic Medications',
    course: 'PMHNP-700',
    topic: 'Psychopharmacology',
    content: `Antipsychotic medications are used to treat psychotic symptoms in conditions like schizophrenia,
bipolar disorder, and major depression with psychotic features.

CLASSIFICATION:

First-generation (Typical) Antipsychotics:
- Higher potency for D2 blockade (dopamine antagonism)
- Greater risk of extrapyramidal side effects (EPS)
- Examples: Haloperidol, chlorpromazine, perphenazine, fluphenazine

Second-generation (Atypical) Antipsychotics:
- Lower EPS risk due to different receptor binding profile
- Greater metabolic side effects (weight gain, metabolic syndrome)
- Examples: Risperidone, olanzapine, quetiapine, aripiprazole, paliperidone

MECHANISM OF ACTION:
- Dopamine antagonism (D2 receptors) - blocks positive symptoms
- Serotonin antagonism (5-HT2A receptors) - may reduce negative symptoms
- Variable affinity for other receptors (H1, M1, α-adrenergic)

FIRST-GENERATION ANTIPSYCHOTICS:

Haloperidol:
- Potency: High
- D2 blockade: 90%+
- Dosing: 2-20 mg daily in divided doses
- Onset: 1-2 weeks for full effect
- EPS risk: Very high
- Neuroleptic malignant syndrome (NMS) risk: High
- Use: Acute agitation, psychosis

Chlorpromazine:
- Potency: Lower (more sedating)
- Dosing: 100-1000 mg daily
- More anticholinergic effects
- Orthostatic hypotension more common

SECOND-GENERATION ANTIPSYCHOTICS:

Risperidone:
- Dosing: 2-16 mg daily (start low, titrate)
- D2 occupancy: 60-80%
- Side effects: Weight gain, metabolic syndrome, hyperprolactinemia
- FDA approved for: Schizophrenia, bipolar mania, irritability in autism
- Onset: 2-4 weeks

Olanzapine:
- Dosing: 5-20 mg daily
- Broad receptor antagonism
- Significant weight gain (average 5-7 kg)
- Excellent for treatment-resistant schizophrenia
- FDA approved for: Schizophrenia, bipolar disorder
- IM formulation available for acute agitation

Quetiapine:
- Dosing: 150-750 mg daily in divided doses
- Lower EPS risk
- More sedating (useful for insomnia/agitation)
- Less weight gain than olanzapine
- ER formulation available

Aripiprazole:
- Dosing: 10-30 mg daily
- Dopamine partial agonist (unique mechanism)
- Minimal weight gain
- Good tolerability profile
- Long-acting IM available (Abilify Maintena)
- FDA approved for: Schizophrenia, bipolar disorder, major depression augmentation

Paliperidone:
- Active metabolite of risperidone
- Dosing: 6-12 mg daily
- Monthly IM available (Invega Sustenna)
- Good for poor adherence

Lurasidone:
- Dosing: 40-120 mg daily
- Minimal weight gain
- Must take with food
- Effective for bipolar depression

MONITORING REQUIREMENTS:

Baseline (before starting):
- Weight, BMI, waist circumference
- Blood pressure (lying and standing)
- Fasting glucose or HbA1c
- Lipid panel (total cholesterol, LDL, HDL, triglycerides)
- Prolactin level
- 12-lead ECG (especially for haloperidol, quetiapine, ziprasidone)
- Baseline metabolic assessment

Ongoing monitoring:
- Weight and BMI: At each visit
- Blood pressure: At each visit
- Fasting glucose: At 3 months, then annually
- Lipid panel: At 3 months, then annually
- Prolactin: If symptoms develop (annually minimal)
- EPS assessment: Use AIMS scale for dyskinesias, SAS for parkinsonism
- ECG: If QTc risk factors develop

SIDE EFFECTS:

Extrapyramidal Side Effects (EPS):
- Acute dystonia: Muscle spasms, oculogyric crisis (hours to days)
  Treatment: Benztropine 1-2 mg IM/IV
- Akathisia: Subjective restlessness, physical restlessness (days to weeks)
  Treatment: Beta-blocker (propranolol) or benzodiazepine
- Parkinsonism: Tremor, rigidity, bradykinesia (weeks)
  Treatment: Anticholinergic (benztropine, trihexyphenidyl)
- Tardive dyskinesia: Involuntary movements (months to years)
  Prevention: Use lowest effective dose, consider valbenazine or deutetrabenazine

Metabolic Side Effects:
- Weight gain: Average 2-5 kg (olanzapine >risperidone >haloperidol)
- Diabetes: Risk increases with weight gain and metabolic syndrome
- Dyslipidemia: Particularly with olanzapine
- Management: Lifestyle modification, metformin, diet, exercise, consider switching agents

Cardiovascular:
- QTc prolongation: Risk with haloperidol, ziprasidone, quetiapine
- Orthostatic hypotension: Especially with low-potency typical antipsychotics
- Myocarditis/pericarditis: Rare, with clozapine

Endocrine:
- Hyperprolactinemia: Especially risperidone, paliperidone, amisulpride
- Sexual dysfunction: Decreased libido, erectile dysfunction, anorgasmia
- Galactorrhea, amenorrhea

Neuroleptic Malignant Syndrome (NMS):
- Life-threatening reaction: High fever, muscle rigidity, altered consciousness
- Occurs in 0.1-1% on antipsychotics
- Management: Stop antipsychotic, supportive care, cooling measures, consider benzodiazepines
- Monitor: CK, CBC, renal function

Other:
- Sedation
- Constipation and ileus
- Photosensitivity
- Agranulocytosis (clozapine - requires regular monitoring)

PATIENT EDUCATION:
- Importance of adherence (relapse risk 40-60% if stopped)
- Gradual onset of improvement (2-4 weeks minimum)
- Common side effects and when to report concerning effects
- Need for regular monitoring and blood work
- Avoid anticholinergics unless prescribed
- Pregnancy planning (antipsychotics generally low teratogenic risk)
- Can take with or without food (unless lurasidone)`,
    learningObjectives: [
      'Distinguish first and second-generation antipsychotics and their clinical advantages',
      'Explain dopamine hypothesis of schizophrenia and mechanism of antipsychotics',
      'Select appropriate antipsychotic based on clinical presentation and patient factors',
      'Identify and manage EPS, metabolic complications, and NMS',
      'Monitor for long-term side effects including tardive dyskinesia',
      'Provide comprehensive patient education on antipsychotics',
      'Manage treatment-resistant schizophrenia',
    ],
    keyTerms: ['Antipsychotic', 'D2 receptor', 'EPS', 'NMS', 'Metabolic syndrome', 'Tardive dyskinesia', 'Hyperprolactinemia'],
    relatedTopics: ['Schizophrenia', 'Bipolar Disorder', 'Psychosis', 'Drug Interactions', 'Side Effect Management'],
  },
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const topic = searchParams.get('topic')

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic parameter is required' },
        { status: 400 }
      )
    }

    const normalizedTopic = topic.toLowerCase().replace(/\s+/g, '-')

    let content = null

    // Try to find exact match
    if (normalizedTopic in CURRICULUM_DATA) {
      content = CURRICULUM_DATA[normalizedTopic as keyof typeof CURRICULUM_DATA]
    } else {
      // Try to find by key
      for (const [key, data] of Object.entries(CURRICULUM_DATA)) {
        if (
          key.includes(normalizedTopic) ||
          data.title.toLowerCase().includes(topic.toLowerCase()) ||
          data.topic.toLowerCase().includes(topic.toLowerCase())
        ) {
          content = data
          break
        }
      }
    }

    if (!content) {
      return NextResponse.json(
        {
          error: 'Topic not found',
          available_topics: Object.values(CURRICULUM_DATA).map((c) => ({
            title: c.title,
            course: c.course,
            topic: c.topic,
          })),
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error('Error fetching curriculum content:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch curriculum content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
