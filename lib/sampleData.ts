export type Pricing = "free" | "freemium" | "paid";

export type Tool = {
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: Pricing;
  image?: string;
};

export const sampleTools: Tool[] = [
  {
    name: "ChatGPT",
    description: "Conversational assistant for writing, coding, research, and everyday problem solving.",
    url: "https://chat.openai.com/",
    category: "Assistant",
    tags: ["Writing", "Research", "Coding"],
    pricing: "freemium",
  },
  {
    name: "Claude",
    description: "AI assistant for long-form reasoning, document work, analysis, and coding tasks.",
    url: "https://claude.ai/",
    category: "Assistant",
    tags: ["Writing", "Research", "Documents"],
    pricing: "freemium",
  },
  {
    name: "Perplexity",
    description: "Answer engine for web research with citations, follow-up questions, and topic discovery.",
    url: "https://www.perplexity.ai/",
    category: "Research",
    tags: ["Search", "Citations", "Research"],
    pricing: "freemium",
  },
  {
    name: "NotebookLM",
    description: "Research notebook that summarizes sources and helps explore uploaded documents.",
    url: "https://notebooklm.google.com/",
    category: "Research",
    tags: ["Documents", "Summaries", "Study"],
    pricing: "free",
  },
  {
    name: "Midjourney",
    description: "Image generation system for high-quality concept art, product visuals, and creative assets.",
    url: "https://www.midjourney.com/",
    category: "Image",
    tags: ["Generative", "Art", "Design"],
    pricing: "paid",
  },
  {
    name: "DALL-E",
    description: "Image generation and editing for prompts, style exploration, and visual prototyping.",
    url: "https://openai.com/dall-e/",
    category: "Image",
    tags: ["Generative", "Editing", "Design"],
    pricing: "paid",
  },
  {
    name: "Runway",
    description: "Creative suite for AI video generation, editing, motion, and visual effects workflows.",
    url: "https://runwayml.com/",
    category: "Video",
    tags: ["Video", "Editing", "Generative"],
    pricing: "freemium",
  },
  {
    name: "HeyGen",
    description: "AI video platform for avatars, localization, translation, and presenter-led content.",
    url: "https://www.heygen.com/",
    category: "Video",
    tags: ["Avatar", "Translation", "Marketing"],
    pricing: "paid",
  },
  {
    name: "Whisper",
    description: "Speech recognition model for transcription, captions, and multilingual audio processing.",
    url: "https://openai.com/research/whisper",
    category: "Audio",
    tags: ["Transcription", "Speech", "Open Source"],
    pricing: "free",
  },
  {
    name: "ElevenLabs",
    description: "Voice generation and dubbing platform for narration, character voices, and audio products.",
    url: "https://elevenlabs.io/",
    category: "Audio",
    tags: ["Voice", "Dubbing", "Narration"],
    pricing: "freemium",
  },
  {
    name: "GitHub Copilot",
    description: "AI coding assistant integrated into editors for completions, chat, and code review help.",
    url: "https://github.com/features/copilot",
    category: "Developer",
    tags: ["Coding", "IDE", "Automation"],
    pricing: "paid",
  },
  {
    name: "Cursor",
    description: "AI code editor for pair programming, repository navigation, and large codebase edits.",
    url: "https://cursor.com/",
    category: "Developer",
    tags: ["Coding", "IDE", "Agents"],
    pricing: "freemium",
  },
  {
    name: "Vercel AI SDK",
    description: "Toolkit for building AI-powered web apps with streaming responses and model adapters.",
    url: "https://sdk.vercel.ai/",
    category: "Developer",
    tags: ["SDK", "Streaming", "Apps"],
    pricing: "free",
  },
  {
    name: "Hugging Face",
    description: "Hub for models, datasets, spaces, and open machine learning collaboration.",
    url: "https://huggingface.co/",
    category: "Platform",
    tags: ["Models", "Datasets", "Open Source"],
    pricing: "free",
  },
  {
    name: "Replicate",
    description: "Run and deploy machine learning models through a simple hosted API.",
    url: "https://replicate.com/",
    category: "Platform",
    tags: ["Models", "API", "Deployment"],
    pricing: "paid",
  },
  {
    name: "Zapier AI",
    description: "Automation tools that connect apps, trigger workflows, and add AI steps without code.",
    url: "https://zapier.com/ai",
    category: "Automation",
    tags: ["Workflows", "No Code", "Integrations"],
    pricing: "freemium",
  },
  {
    name: "Notion AI",
    description: "Writing, summarization, Q&A, and database help inside Notion workspaces.",
    url: "https://www.notion.so/product/ai",
    category: "Productivity",
    tags: ["Writing", "Summaries", "Workspace"],
    pricing: "freemium",
  },
  {
    name: "Gamma",
    description: "Create presentations, documents, and web pages from prompts and structured outlines.",
    url: "https://gamma.app/",
    category: "Productivity",
    tags: ["Slides", "Documents", "Design"],
    pricing: "freemium",
  },
];
