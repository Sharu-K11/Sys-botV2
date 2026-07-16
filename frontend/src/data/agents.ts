import type { Agent } from '../types'

export const studyAgents: Agent[] = [
  {
    id: 'simple-langgraph',
    name: 'Simple LangGraph Agent',
    technique: 'Graph-based workflow orchestration',
    description:
      'A straightforward agent flow for answering textbook questions with reliable step-by-step logic.',
    recommendedUse:
      'Use this for quick chapter reviews, concept checks, and lightweight Q&A sessions.',
  },
  {
    id: 'raptor',
    name: 'RAPTOR Agent',
    technique: 'Recursive abstractive processing and retrieval',
    description:
      'Builds hierarchical summaries to answer deeper questions that require multi-level understanding.',
    recommendedUse:
      'Use this for dense textbook sections, theory-heavy exams, and long-form explanations.',
  },
  {
    id: 'colbert',
    name: 'ColBERT Agent',
    technique: 'Late interaction semantic retrieval',
    description:
      'Finds highly relevant passages with token-level matching for precise, citation-style responses.',
    recommendedUse:
      'Use this for targeted queries, definitions, and finding exact evidence from course material.',
  },
  {
    id: 'multi-vector',
    name: 'Multi-Vector Agent',
    technique: 'Hybrid retrieval across multiple embeddings',
    description:
      'Combines different vector views to improve recall when concepts appear in varied contexts.',
    recommendedUse:
      'Use this for interdisciplinary topics, mixed-format chapters, and broad revision sessions.',
  },
]
