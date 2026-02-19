/**
 * Scripted conversation flow for the CoPilot troubleshooting demo.
 * Each step defines what the assistant says and what tool cards to show.
 * The conversation progresses through steps as the user responds.
 */

export type ToolCard =
  | {
      type: "troubleshooting";
      recommendation: string;
      sources: string[];
    }
  | {
      type: "escalation";
      expertName: string;
      expertTitle: string;
      availability: string;
      reason: string;
    }
  | {
      type: "summary";
      stepsAttempted: string[];
      outcome: string;
    };

export interface ScriptedStep {
  /** Text segments for the copilot response, streamed sequentially */
  text: string[];
  /** Tool cards to display after the text finishes streaming */
  tools: ToolCard[];
  /** Suggested user replies shown as quick-reply chips */
  suggestions?: string[];
}

/**
 * The full scripted conversation for the engine overheating scenario.
 * Step 0 is triggered automatically when the user starts troubleshooting.
 * Subsequent steps are triggered by any user message.
 */
export const TROUBLESHOOT_FLOW: ScriptedStep[] = [
  // Step 0: Initial assessment + diagnostic questions
  {
    text: [
      "I can see from the work order that the coolant temp gauge is hitting the red zone during normal transport with a moderate load. Let me help you work through this systematically.",
      "\n\nBefore we dive in, a couple of quick questions:\n\n**1.** How long into operation does the overheating start — is it right away or after 15–20 minutes of driving?\n\n**2.** Have you noticed any coolant on the ground under the vehicle, or any sweet smell from the engine area?\n\n**3.** When was the last time you checked the coolant level in the recovery tank?",
    ],
    tools: [],
    suggestions: [
      "Starts after about 20 min. No leaks that I can see. Haven't checked coolant recently.",
      "It overheats almost immediately on startup.",
      "Happens intermittently — sometimes fine, sometimes red zone.",
    ],
  },

  // Step 1: Triage check + first diagnostic step (coolant level)
  {
    text: [
      "Thanks — overheating after 20 minutes with no visible leaks is a helpful clue. That pattern usually points to a cooling capacity issue rather than a catastrophic failure.",
      "\n\nLet's start with the basics. The most common cause per the Kubota manual (p. 85) is insufficient coolant. Since you haven't checked recently, let's start there.",
    ],
    tools: [
      {
        type: "troubleshooting",
        recommendation:
          "Check the coolant recovery tank level. With the engine COOL, verify the coolant is between the FULL and LOW marks on the tank. The recovery tank is located on the left side of the engine compartment.\n\n⚠️ Do NOT remove the radiator cap while the engine is hot — risk of burns from pressurized coolant.\n\nIf low, top off with a 50/50 mix of distilled water and approved antifreeze (see p. 53 for specs).",
        sources: [
          "Operator's Manual, p. 60 — Checking coolant level",
          "Operator's Manual, p. 53 — Coolant specifications",
        ],
      },
    ],
    suggestions: [
      "Coolant is low — about an inch below the LOW mark.",
      "Coolant level looks fine, right between the marks.",
      "Recovery tank is empty.",
    ],
  },

  // Step 2: Coolant was low — top off + check radiator screen
  {
    text: [
      "Good find — low coolant is very likely the primary cause. Go ahead and top it off with the 50/50 mix.",
      "\n\nSince this unit had a radiator screen cleaning 3 months ago (WO #47801) and it's mowing season, let's also check the radiator screen. A clogged screen reduces airflow and compounds overheating — especially when the coolant is already low.",
    ],
    tools: [
      {
        type: "troubleshooting",
        recommendation:
          "Raise the cargo bed using the hydraulic lift and engage the safety support bar (p. 56). The radiator is located under the bed.\n\nInspect the radiator grille screens for grass clippings, dirt, or debris buildup. Clean with compressed air (blow from engine side outward) or a soft brush.\n\nAlso visually inspect the radiator core fins — look for any bent or damaged fins that could restrict airflow.",
        sources: [
          "Operator's Manual, p. 60 — Radiator cleaning",
          "Operator's Manual, p. 56 — Cargo bed raise procedure",
          "WO #47801 — Previous radiator screen cleaning",
        ],
      },
    ],
    suggestions: [
      "Screen had a lot of grass buildup. Cleaned it out. Want me to run it and see?",
      "Screen looks clean actually. Fins look good too.",
      "Found some debris but also noticed a radiator hose looks swollen.",
    ],
  },

  // Step 3: Both fixed — test run + resolution
  {
    text: [
      "Nice work — low coolant plus a clogged screen is a classic combo, especially during mowing season. With both addressed, I'm optimistic this will resolve it.",
      "\n\n**Go ahead and start the engine and let it run for 20–25 minutes** (the timeframe when you were seeing overheating). Monitor the temp gauge — it should stay well within the normal range now.",
      "\n\nIf it holds steady, we can close this out. Let me know how it goes.",
    ],
    tools: [],
    suggestions: [
      "Ran it for 25 min — temp gauge stayed right in the middle. Looks good!",
      "Still climbing into the red after about 15 min.",
    ],
  },

  // Step 4: Resolved — session summary
  {
    text: [
      "That's the result we wanted. The combination of low coolant and a debris-clogged radiator screen was causing the overheating.",
      "\n\n**Recommended preventive action:** During mowing season, add the radiator screen check to the daily pre-operation inspection (p. 57). This unit tends to accumulate grass clippings quickly given its grounds maintenance role.",
      "\n\nI'll attach the session summary to the work order.",
    ],
    tools: [
      {
        type: "summary",
        stepsAttempted: [
          "Checked coolant recovery tank — found level below LOW mark, topped off with 50/50 mix",
          "Raised cargo bed and inspected radiator — found heavy grass/debris buildup on screen",
          "Cleaned radiator screen with compressed air",
          "Test ran engine for 25 minutes — temp gauge normal",
        ],
        outcome:
          "Resolved. Root cause: insufficient coolant combined with clogged radiator screen restricting airflow. Recommended adding daily radiator screen check during mowing season.",
      },
    ],
    suggestions: [],
  },
];

/**
 * Alternate flow branch: if the user says coolant level is fine at step 2
 */
export const ALTERNATE_FLOW_COOLANT_OK: ScriptedStep = {
  text: [
    "Coolant level is good — that rules out the most common cause. Let's move to the next item on the manual's list.",
    "\n\nGiven the previous work history (WO #47801 found a heavily clogged radiator screen), and that this vehicle is in grounds maintenance, the radiator screen is our prime suspect.",
  ],
  tools: [
    {
      type: "troubleshooting",
      recommendation:
        "Raise the cargo bed using the hydraulic lift and engage the safety support bar (p. 56). The radiator is located under the bed.\n\nInspect the radiator grille screens for grass clippings, dirt, or debris buildup. Clean with compressed air (blow from engine side outward) or a soft brush.\n\nAlso check the motor-driven cooling fan — with the engine running and warm, the fan should be spinning. If not, check the cooling fan fuse (fuse box location p. 80–81).",
      sources: [
        "Operator's Manual, p. 60 — Radiator cleaning",
        "Operator's Manual, p. 86 — Cooling fan check",
        "WO #47801 — Previous radiator screen cleaning",
      ],
    },
  ],
  suggestions: [
    "Screen was packed with grass again. Fan is spinning fine. Cleaned it out.",
    "Screen looks okay but the fan isn't turning at all.",
  ],
};

/**
 * Escalation step: used when troubleshooting is exhausted
 */
export const ESCALATION_STEP: ScriptedStep = {
  text: [
    "We've worked through the most common causes from the manual — coolant level, radiator screen, and cooling fan — without finding a definitive fix. At this point, the issue could be internal: a sticking thermostat (p. 77), water pump degradation (p. 81), or a head gasket issue.",
    "\n\nThese require specialized diagnostic equipment. I'd recommend pulling in our Kubota specialist.",
  ],
  tools: [
    {
      type: "escalation",
      expertName: "Jake Torres",
      expertTitle: "Kubota Certified Technician",
      availability: "Available today",
      reason:
        "All field-serviceable causes for engine overheating have been checked. Further diagnosis requires pressure testing the cooling system and inspecting internal components (thermostat, water pump, head gasket).",
    },
  ],
  suggestions: [],
};

/** Simple keyword matching to detect conversation intent */
export function detectBranch(userText: string): "low" | "ok" | "escalate" | "resolved" | "continue" {
  const lower = userText.toLowerCase();
  if (lower.includes("still") && (lower.includes("red") || lower.includes("overheat") || lower.includes("climbing"))) {
    return "escalate";
  }
  if (lower.includes("looks good") || lower.includes("stayed") || lower.includes("normal") || lower.includes("middle") || lower.includes("resolved")) {
    return "resolved";
  }
  if (lower.includes("fine") || lower.includes("between") || lower.includes("good") || lower.includes("looks ok") || lower.includes("level is good")) {
    // At step 2, this means coolant is OK
    return "ok";
  }
  if (lower.includes("low") || lower.includes("below") || lower.includes("empty")) {
    return "low";
  }
  return "continue";
}
