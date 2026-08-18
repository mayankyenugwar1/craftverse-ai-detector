export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
export const SUPPORTED_FORMATS = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
export const SUPPORTED_EXTENSIONS = '.jpg, .jpeg, .png, .webp, .mp4, .mov, .webm';
export const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export const ROUTES = {
  HOME: '/',
  DETECT: '/detect',
  HISTORY: '/history',
  HISTORY_DETAIL: '/history/:id',
  REPORT: '/reports/:id',
  HOW_IT_WORKS: '/how-it-works',
};

export const ANALYSIS_STEPS = [
  'Uploading media...',
  'Reading media structure...',
  'Scanning visual patterns...',
  'Checking synthetic artifacts...',
  'Evaluating authenticity signals...',
  'Generating forensic explanation...',
  'Finalizing result...',
];

export const VERDICT_CONFIG: Record<string, { color: string; bgClass: string; textClass: string; borderClass: string; label: string }> = {
  AI_GENERATED: {
    color: '#E8D3A8',
    bgClass: 'bg-beige-200/10',
    textClass: 'text-beige-200',
    borderClass: 'border-beige-200/30',
    label: 'AI Generated',
  },
  LIKELY_AUTHENTIC: {
    color: '#F3E7CE',
    bgClass: 'bg-beige-100/10',
    textClass: 'text-beige-100',
    borderClass: 'border-beige-100/25',
    label: 'Likely Authentic',
  },
  MANIPULATED: {
    color: '#C8A96B',
    bgClass: 'bg-beige-400/10',
    textClass: 'text-beige-300',
    borderClass: 'border-beige-400/30',
    label: 'Manipulated',
  },
  UNCERTAIN: {
    color: '#BBAF98',
    bgClass: 'bg-beige-500/10',
    textClass: 'text-beige-500',
    borderClass: 'border-beige-500/25',
    label: 'Uncertain',
  },
};

export const CONFIDENCE_LABELS: Record<string, string> = {
  low: 'Low Confidence',
  medium: 'Medium Confidence',
  high: 'High Confidence',
};
