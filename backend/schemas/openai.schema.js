export const DRAFT_SCHEMA = {
  type: "json_schema",
  name: "draft",
  strict: true,
  schema: {
    type: "object",
    properties: {
      chef_names: { type: "array", items: { type: "string" } },
      venue_name: { type: "string" },
      event_title: { type: "string" },
      english_description: { type: "string" },
      hebrew_description: { type: "string" },
      start_datetime: { type: "string" },
      end_datetime: { type: "string" }
    },
    required: ["chef_names", "venue_name", "event_title", "english_description", "hebrew_description", "start_datetime", "end_datetime"],
    additionalProperties: false
  }
};

export const VISION_SCHEMA = {
  type: "json_schema",
  name: "vision_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      extractedText: { type: "string" },
      cropCoordinates: {
        type: "object",
        properties: {
          top: { type: "number" },
          left: { type: "number" },
          bottom: { type: "number" },
          right: { type: "number" }
        },
        required: ["top", "left", "bottom", "right"],
        additionalProperties: false
      }
    },
    required: ["extractedText", "cropCoordinates"],
    additionalProperties: false
  }
};
