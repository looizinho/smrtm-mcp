import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { type InferSchema, type ToolMetadata } from "xmcp";
import { loremIpsum, type LoremUnit, type LoremFormat } from "lorem-ipsum";
import "../../globals.css";

export const schema = {
  units: z
    .enum(["words", "sentences", "paragraphs"])
    .optional()
    .describe("Initial unit type ('words', 'sentences', or 'paragraphs')"),
  count: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("Initial unit count"),
  format: z
    .enum(["plain", "html"])
    .optional()
    .describe("Initial format ('plain' or 'html')"),
};

export const metadata: ToolMetadata = {
  name: "lorem_app",
  description: "Interactive Lorem Ipsum Generator widget with sliders for words, sentences, and paragraphs",
  _meta: {
    ui: {
      prefersBorder: true,
    },
  },
};

export default function LoremApp({
  units: initialUnits = "paragraphs",
  count: initialCount = 2,
  format: initialFormat = "plain",
}: Partial<InferSchema<typeof schema>> = {}) {
  const [activeUnit, setActiveUnit] = useState<LoremUnit>(initialUnits);
  const [wordCount, setWordCount] = useState<number>(activeUnit === "words" ? initialCount : 25);
  const [sentenceCount, setSentenceCount] = useState<number>(activeUnit === "sentences" ? initialCount : 4);
  const [paragraphCount, setParagraphCount] = useState<number>(activeUnit === "paragraphs" ? initialCount : 2);
  const [format, setFormat] = useState<LoremFormat>(initialFormat);
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(0);

  const generateText = useCallback(() => {
    let count = 1;
    if (activeUnit === "words") count = wordCount;
    else if (activeUnit === "sentences") count = sentenceCount;
    else count = paragraphCount;

    try {
      const text = loremIpsum({
        count,
        units: activeUnit,
        format,
      });
      setOutput(text);
    } catch {
      setOutput("Erro ao gerar Lorem Ipsum");
    }
  }, [activeUnit, wordCount, sentenceCount, paragraphCount, format, seed]);

  useEffect(() => {
    generateText();
  }, [generateText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = output;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wordStats = output.trim() ? output.trim().split(/\s+/).length : 0;
  const charStats = output.length;

  return (
    <div className="w-full max-w-2xl mx-auto p-5 bg-zinc-950 text-zinc-100 rounded-xl border border-zinc-800 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
            ¶
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
              Lorem Ipsum Studio
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                MCP Widget
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Ajuste os sliders para gerar texto dummy sob demanda
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setFormat("plain")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              format === "plain"
                ? "bg-zinc-800 text-white font-medium shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            TXT
          </button>
          <button
            type="button"
            onClick={() => setFormat("html")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              format === "html"
                ? "bg-zinc-800 text-white font-medium shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            HTML
          </button>
        </div>
      </div>

      {/* Sliders Container */}
      <div className="mt-5 space-y-4">
        {/* Slider 1: Paragraphs */}
        <div
          onClick={() => setActiveUnit("paragraphs")}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeUnit === "paragraphs"
              ? "bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/20"
              : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeUnit === "paragraphs" ? "bg-indigo-400 animate-pulse" : "bg-zinc-600"
                }`}
              />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-300">
                Parágrafos (Paragraphs)
              </span>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-indigo-300 font-semibold">
              {paragraphCount} {paragraphCount === 1 ? "parágrafo" : "parágrafos"}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={paragraphCount}
            onChange={(e) => {
              setActiveUnit("paragraphs");
              setParagraphCount(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Slider 2: Sentences */}
        <div
          onClick={() => setActiveUnit("sentences")}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeUnit === "sentences"
              ? "bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/20"
              : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeUnit === "sentences" ? "bg-indigo-400 animate-pulse" : "bg-zinc-600"
                }`}
              />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-300">
                Frases (Sentences)
              </span>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-indigo-300 font-semibold">
              {sentenceCount} {sentenceCount === 1 ? "frase" : "frases"}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={sentenceCount}
            onChange={(e) => {
              setActiveUnit("sentences");
              setSentenceCount(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>

        {/* Slider 3: Words */}
        <div
          onClick={() => setActiveUnit("words")}
          className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
            activeUnit === "words"
              ? "bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/20"
              : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeUnit === "words" ? "bg-indigo-400 animate-pulse" : "bg-zinc-600"
                }`}
              />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-300">
                Palavras (Words)
              </span>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-indigo-300 font-semibold">
              {wordCount} {wordCount === 1 ? "palavra" : "palavras"}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={wordCount}
            onChange={(e) => {
              setActiveUnit("words");
              setWordCount(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Output Display Area */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span>Resultado:</span>
            <span className="text-[11px] text-zinc-400">
              ({charStats} caracteres · ~{wordStats} palavras)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="px-2.5 py-1 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-md text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>↻</span>
              <span>Regenerar</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                copied
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
              }`}
            >
              <span>{copied ? "✓ Copiado!" : "Copiar"}</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-200 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 selection:bg-indigo-500/30"
          />
        </div>
      </div>
    </div>
  );
}
