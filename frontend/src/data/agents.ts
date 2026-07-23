import type { Agent } from '../types'

export const studyAgents: Agent[] = [
  {
    id: 'simple-langgraph',
    name: 'Simple LangGraph Agent',
    nickname: 'Loopy',
    personality: 'A cheerful route-finder who turns tangled lessons into small, steady steps.',
    traits: ['Patient', 'Structured', 'Encouraging'],
    technique: 'Graph-based workflow orchestration',
    description:
      'A straightforward agent flow for answering textbook questions with reliable step-by-step logic.',
    recommendedUse:
      'Use this for quick chapter reviews, concept checks, and lightweight Q&A sessions.',
  },
  {
    id: 'raptor',
    name: 'RAPTOR Agent',
    nickname: 'Rex',
    personality: 'A curious deep-diver who stacks big ideas into a tower you can climb.',
    traits: ['Curious', 'Thorough', 'Big-picture'],
    technique: 'Recursive abstractive processing and retrieval',
    description:
      'Builds hierarchical summaries to answer deeper questions that require multi-level understanding.',
    recommendedUse:
      'Use this for dense textbook sections, theory-heavy exams, and long-form explanations.',
  },
  {
    id: 'colbert',
    name: 'ColBERT Agent',
    nickname: 'Scout Byte',
    personality: 'A sharp-eyed evidence scout who always knows where the useful detail is hiding.',
    traits: ['Precise', 'Quick', 'Evidence-first'],
    technique: 'Late interaction semantic retrieval',
    description:
      'Finds highly relevant passages with token-level matching for precise, citation-style responses.',
    recommendedUse:
      'Use this for targeted queries, definitions, and finding exact evidence from course material.',
  },
  {
    id: 'multi-vector',
    name: 'Multi-Vector Agent',
    nickname: 'Mosaic',
    personality: 'An imaginative pattern-weaver who connects ideas other tutors might keep apart.',
    traits: ['Creative', 'Adaptive', 'Connective'],
    technique: 'Hybrid retrieval across multiple embeddings',
    description:
      'Combines different vector views to improve recall when concepts appear in varied contexts.',
    recommendedUse:
      'Use this for interdisciplinary topics, mixed-format chapters, and broad revision sessions.',
  },
]
