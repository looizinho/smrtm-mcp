import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { loremIpsum } from "lorem-ipsum";

// Define the schema for tool parameters
export const schema = {
  count: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("Number of units to generate (default: 1)"),
  units: z
    .enum(["words", "sentences", "paragraphs"])
    .optional()
    .describe("Unit of text: 'words', 'sentences', or 'paragraphs' (default: 'paragraphs')"),
  format: z
    .enum(["plain", "html"])
    .optional()
    .describe("Output format: 'plain' or 'html' (default: 'plain')"),
};

// Define tool metadata
export const metadata: ToolMetadata = {
  name: "lorem_gen",
  description: "Generate Lorem Ipsum placeholder text in plain text or HTML",
  annotations: {
    title: "Lorem Ipsum Generator",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
  },
};

// Tool implementation
export default function loremGen({
  count = 1,
  units = "paragraphs",
  format = "plain",
}: InferSchema<typeof schema>) {
  return loremIpsum({
    count,
    units,
    format,
  });
}
