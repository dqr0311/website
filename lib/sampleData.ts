// lib/sampleData.ts

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
    description: "Conversational AI assistant by OpenAI.",
    url: "https://chat.openai.com/",
    category: "Chatbot",
    tags: ["NLP", "Assistant"],
    pricing: "freemium"
  },
  {
    name: "Midjourney",
    description: "AI image generation for creative artwork.",
    url: "https://www.midjourney.com/",
    category: "Image",
    tags: ["Generative", "Art"],
    pricing: "paid"
  },
  {
    name: "Whisper",
    description: "OpenAI speech-to-text model for transcription.",
    url: "https://openai.com/research/whisper",
    category: "Audio",
    tags: ["ASR", "Transcription"],
    pricing: "free"
  },
  {
    name: "Notion AI",
    description: "Write and summarize with AI inside Notion.",
    url: "https://www.notion.so/product/ai",
    category: "Productivity",
    tags: ["Writing", "Summarization"],
    pricing: "freemium"
  },
  {
    name: "Hugging Face",
    description: "Models and datasets hub for machine learning.",
    url: "https://huggingface.co/",
    category: "Platform",
    tags: ["Models", "Datasets"],
    pricing: "free"
  }
];
