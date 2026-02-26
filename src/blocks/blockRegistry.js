export const BLOCK_REGISTRY = {
  explanation: {
    requiredFields: ["content"],

    validate: (block) => {
      if (typeof block.content !== "string" || block.content.trim() === "") {
        throw new Error("Explanation block must have non-empty content")
      }
    }
  },

  exercise: {
    requiredFields: ["instructions", "minSentences", "evaluationMode"],

    validate: (block) => {
      if (
        typeof block.instructions !== "string" ||
        block.instructions.trim() === ""
      ) {
        throw new Error("Exercise block must have valid instructions")
      }

      if (
        typeof block.minSentences !== "number" ||
        !Number.isInteger(block.minSentences) ||
        block.minSentences < 1
      ) {
        throw new Error("Exercise block must have minSentences >= 1")
      }

      if (
        typeof block.evaluationMode !== "string" ||
        block.evaluationMode.trim() === ""
      ) {
        throw new Error("Exercise block must define evaluationMode")
      }
    }
  }
}