import OpenAI from 'openai';
import axios from 'axios';
import config from '../../../config';
import { Venue } from '../venue/venue.model';
import { VenueZone } from '../venueZone/venueZone.model';
import { VisualLandmark } from '../visualLandmark/visualLandmark.model';
import { User } from '../user/user.model';
import { Subscription } from '../subscription/subscription.model';
import { VenueContribution } from '../contribution/contribution.model';
import { NavigationSession } from '../navigation/navigation.model';

const openai = new OpenAI({
  apiKey: config.openai_api_key || '',
});

// --- Database Access Tools ---

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "queryVenues",
      description: "Search for venues, zones, and landmarks. Filter by floor for precision indoor location.",
      parameters: {
        type: "object",
        properties: {
          searchTerm: { type: "string", description: "Name or keyword to search for" },
          venueId: { type: "string", description: "Optional venue ID to filter by" },
          floor: { type: "number", description: "Optional floor level to narrow down indoor search" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getUserProfile",
      description: "Get user profile and subscription information.",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "The ID of the user" },
        },
        required: ["userId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "queryContributions",
      description: "Search for approved user contributions to find visual details or new place info.",
      parameters: {
        type: "object",
        properties: {
          searchTerm: { type: "string", description: "Keyword to search in descriptions or venue names" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "queryNavigationHistory",
      description: "Search previous navigation sessions to learn from past user paths and accuracy.",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string", description: "Optional user ID to filter history" },
          destinationName: { type: "string", description: "Optional destination name to find similar trips" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "verifyFloorLevel",
      description: "Compare the user's current detected floor with their target floor for inbound navigation.",
      parameters: {
        type: "object",
        properties: {
          detectedFloor: { type: "number", description: "The floor level detected from the image" },
          targetFloor: { type: "number", description: "The floor level the user is supposed to be on" },
        },
        required: ["detectedFloor", "targetFloor"],
      },
    },
  },
];

const handleToolCall = async (toolCall: any) => {
  const { name, arguments: argsString } = toolCall.function;
  const args = JSON.parse(argsString);

  switch (name) {
    case "queryVenues":
      const venueQuery: any = { name: new RegExp(args.searchTerm, 'i') };
      if (args.venueId) venueQuery._id = args.venueId;
      const venues = await Venue.find(venueQuery).limit(5);

      const zoneQuery: any = { name: new RegExp(args.searchTerm, 'i') };
      if (args.floor !== undefined) zoneQuery.floor = args.floor;
      const zones = await VenueZone.find(zoneQuery).limit(5);

      const landmarkQuery: any = { name: new RegExp(args.searchTerm, 'i') };
      if (args.floor !== undefined) landmarkQuery.floor = args.floor;
      const landmarks = await VisualLandmark.find(landmarkQuery).limit(10);
      
      return JSON.stringify({ venues, zones, landmarks });

    case "getUserProfile":
      const user = await User.findById(args.userId).select('-password');
      const subscription = await Subscription.findOne({ user: args.userId, status: 'active' });
      return JSON.stringify({ user, subscription });

    case "queryContributions":
      const contributions = await VenueContribution.find({
        status: 'approved',
        $or: [
          { description: new RegExp(args.searchTerm, 'i') },
          { 'suggestedVenueDetails.name': new RegExp(args.searchTerm, 'i') }
        ]
      }).limit(5).populate('mediaAssets');
      return JSON.stringify(contributions);

    case "queryNavigationHistory":
      const history = await NavigationSession.find({
        status: 'completed',
        ...(args.userId && { user: args.userId }),
        ...(args.destinationName && { destinationLabel: new RegExp(args.destinationName, 'i') })
      }).sort({ createdAt: -1 }).limit(5);
      return JSON.stringify(history);

    case "verifyFloorLevel":
      const diff = args.detectedFloor - args.targetFloor;
      if (diff === 0) {
        return JSON.stringify({ match: true, instruction: "Success! You are on the correct floor. Proceed to your destination." });
      } else if (diff < 0) {
        return JSON.stringify({ match: false, instruction: `You are on the ${args.detectedFloor} floor, but you need to be on the ${args.targetFloor} floor. Please go UP ${Math.abs(diff)} floor(s).` });
      } else {
        return JSON.stringify({ match: false, instruction: `You are on the ${args.detectedFloor} floor, but you need to be on the ${args.targetFloor} floor. Please go DOWN ${diff} floor(s).` });
      }

    default:
      return JSON.stringify({ error: "Unknown function" });
  }
};

const analyzeGroundingPhoto = async (imageUrl: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this photo of an indoor environment (like a mall, airport, or supermarket). Identify: 1. The type of venue. 2. Any visible landmarks (store signs, aisle markers, etc.). 3. The likely zone (e.g., Food Court, Electronics section). 4. Any text visible on signs. 5. The detected Floor Level (if visible or inferable from signs). Return the result in JSON format with keys: detectedVenueType, detectedZone, detectedLandmarks (array of objects with name and confidence), detectedText, detectedFloor (number or null), overallConfidence." },
          {
            type: "image_url",
            image_url: {
              "url": imageUrl,
            },
          },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || '{}');
};

const generateNavigationInstruction = async (
  currentLocation: string,
  destination: string,
  visibleLandmarks: string[],
  userId?: string
) => {
  const prompt = `
    The user is at ${currentLocation} and wants to go to ${destination}.
    Visible landmarks are: ${visibleLandmarks.join(', ')}.
    Current User ID: ${userId || 'unknown'}.
    Provide a human-like navigation instruction.
    Example: "Walk forward until you see the Starbucks sign, then turn left."
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    tools,
    tool_choice: "auto",
  });

  let finalResponse = response.choices[0].message;

  if (finalResponse.tool_calls) {
    const toolMessages: any[] = [{ role: "user", content: prompt }, finalResponse];
    for (const toolCall of finalResponse.tool_calls) {
      const result = await handleToolCall(toolCall);
      toolMessages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    const secondResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: toolMessages,
    });
    return secondResponse.choices[0].message.content || "Continue walking towards your destination.";
  }

  return finalResponse.content || "Continue walking towards your destination.";
};

const generateChatResponse = async (history: any[], userMessage: string, userId?: string) => {
  const messages: any[] = [
    { role: "system", content: `You are MAIZ, an AI navigation assistant. Help users find their way in indoor environments like malls, airports, and supermarkets. 
    You have access to the database to look up venues, landmarks, user profiles, and previous navigation history. 
    VERY IMPORTANT:
    - If a user provides an image or location context, use 'queryVenues' specifically filtering by 'floor' to find exactly where they are and what doors or landmarks are nearby.
    - Be precise about floor-to-floor transitions (Escalators/Elevators).
    - If they are on the wrong floor, tell them clearly and give instructions to move to the target floor.
    - If they are on the right floor, find nearby landmarks (like doors, specific shops) to guide them to their goal.
    Current User ID: ${userId || 'unknown'}.
    Be concise, helpful, and friendly.` }
  ];

  history.forEach(msg => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content || msg.message || ''
    });
  });

  messages.push({ role: "user", content: userMessage });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
    tool_choice: "auto",
  });

  let finalResponse = response.choices[0].message;

  if (finalResponse.tool_calls) {
    const toolMessages: any[] = [...messages, finalResponse];
    for (const toolCall of finalResponse.tool_calls) {
      const result = await handleToolCall(toolCall);
      toolMessages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    const secondResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: toolMessages,
    });
    return secondResponse.choices[0].message.content || "I'm sorry, I couldn't process that. How can I help you with navigation?";
  }

  return finalResponse.content || "I'm sorry, I couldn't process that. How can I help you with navigation?";
};

const resolveLocationFromInput = async (input: { type: 'image' | 'voice' | 'text', data: string }) => {
  let content: any[] = [];
  
  if (input.type === 'image') {
    content = [
      { type: "text", text: "Analyze this image and resolve it to a specific physical location. Return JSON with locationName, estimatedLatLng (lat, lng), floor (number), and confidence." },
      { type: "image_url", image_url: { url: input.data } }
    ];
  } else {
    content = [
      { type: "text", text: `Analyze this ${input.type} input: "${input.data}". Resolve it to a specific physical location. Return JSON with locationName, estimatedLatLng (lat, lng), floor (number), and confidence.` }
    ];
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content }],
    response_format: { type: "json_object" },
    tools,
    tool_choice: "auto",
  });

  let finalResponse = response.choices[0].message;

  if (finalResponse.tool_calls) {
    const toolMessages: any[] = [{ role: "user", content }, finalResponse];
    for (const toolCall of finalResponse.tool_calls) {
      const result = await handleToolCall(toolCall);
      toolMessages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    const secondResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: toolMessages,
      response_format: { type: "json_object" },
    });
    return JSON.parse(secondResponse.choices[0].message.content || '{}');
  }

  return JSON.parse(finalResponse.content || '{}');
};

export const AIService = {
  analyzeGroundingPhoto,
  generateNavigationInstruction,
  generateChatResponse,
  resolveLocationFromInput,
};
