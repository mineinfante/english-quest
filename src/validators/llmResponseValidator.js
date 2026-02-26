import { BLOCK_REGISTRY } from "../blocks/blockRegistry"

export function validateLLMResponse(rawText) {
  let parsed

  // 1️⃣ Parse JSON
  try {
    parsed = JSON.parse(rawText)
  } catch (error) {
    throw new Error("Invalid JSON response from LLM")
  }

  // 2️⃣ Validate root structure
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray(parsed.blocks) ||
    parsed.blocks.length === 0
  ) {
    throw new Error("Invalid LLM response structure")
  }

  // 3️⃣ Validate each block base structure
  parsed.blocks.forEach((block) => {
    if (typeof block.id !== "string" || block.id.trim() === "") {
      throw new Error("Block must have valid id")
    }

    if (typeof block.type !== "string" || block.type.trim() === "") {
      throw new Error("Block must have valid type")
    }

    if (
      typeof block.order !== "number" ||
      !Number.isInteger(block.order) ||
      block.order <= 0
    ) {
      throw new Error("Block must have valid positive integer order")
    }

    // 4️⃣ Validate type exists in registry
    const typeConfig = BLOCK_REGISTRY[block.type]

    if (!typeConfig) {
      throw new Error(`Unknown block type: ${block.type}`)
    }

    // 5️⃣ Validate required fields
    typeConfig.requiredFields.forEach((field) => {
      if (!(field in block)) {
        throw new Error(
          `Block of type ${block.type} missing required field: ${field}`
        )
      }
    })

    // 6️⃣ Run type-specific validation
    typeConfig.validate(block)
  })

  return parsed
}