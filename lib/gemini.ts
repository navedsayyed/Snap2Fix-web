/**
 * Google Gemini AI Service for Intelligent Complaint Routing
 * FREE API - Get your key at: https://makersuite.google.com/app/apikey
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Department } from './types';

interface AIRoutingResult {
    department: Department;
    confidence: number;
    reasoning?: string;
}

/**
 * Analyze complaint using Google Gemini AI
 * @param specifiedProblem - PRIMARY: "Specify Problem Type" field (e.g., "Projector won't turn on")
 * @param mainDescription - SECONDARY: General "Description" field (additional context if needed)
 * @param imageUrl - Optional image URL for visual analysis (currently disabled)
 * @returns Department assignment with confidence score
 */
export async function analyzeComplaintWithAI(
    specifiedProblem: string,
    mainDescription?: string | null,
    imageUrl?: string | null
): Promise<AIRoutingResult> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
        console.warn('⚠️ GOOGLE_GEMINI_API_KEY not configured - skipping AI routing');
        return {
            department: 'Administration',
            confidence: 0,
            reasoning: 'AI not configured'
        };
    }

    try {
        // Prepare the analysis prompt with both fields
        const prompt = buildAnalysisPrompt(specifiedProblem, mainDescription);
        
        // ONLY analyze description text (no image analysis)
        // Images are not reliable for department routing
        const response = await analyzeTextOnly(apiKey, prompt);

        // Parse AI response
        const result = parseAIResponse(response);
        
        console.log(`🤖 AI Analysis: ${result.department} (${result.confidence}% confidence)`);
        console.log(`   Reasoning: ${result.reasoning}`);
        
        return result;

    } catch (error) {
        console.error('❌ AI Analysis failed:', error);
        return {
            department: 'Administration',
            confidence: 0,
            reasoning: `AI error: ${error instanceof Error ? error.message : 'Unknown'}`
        };
    }
}

/**
 * Build comprehensive analysis prompt for Gemini
 */
function buildAnalysisPrompt(specifiedProblem: string, mainDescription?: string | null): string {
    // Build complaint text with priority
    let complaintText = `PRIMARY: ${specifiedProblem}`;
    if (mainDescription && mainDescription.trim()) {
        complaintText += `\n\nADDITIONAL CONTEXT (use if PRIMARY is unclear): ${mainDescription}`;
    }

    return `You are an expert facility maintenance manager. Analyze this complaint and determine the correct department to handle it.

📝 COMPLAINT DESCRIPTION:
${complaintText}

🏢 AVAILABLE DEPARTMENTS:

1. **Civil** - Handles:
   - Walls, ceilings, floors (cracks, paint, damage)
   - Windows, doors, frames
   - Furniture (desks, chairs, tables)
   - Building structure, walls, partitions
   - Fire safety equipment (extinguisher mounting, signage)

2. **Electrical** - Handles:
   - Electrical wiring and circuits
   - Lighting (bulbs, tubes, fixtures)
   - Power outages, fluctuations
   - Switches, sockets, electrical panels
   - Fans, electrical appliances
   - Electrical safety issues

3. **Mechanical** - Handles:
   - Air conditioning, HVAC
   - Heating systems
   - Plumbing (leaks, taps, pipes)
   - Drainage issues
   - Ventilation systems
   - Elevators, lifts, escalators

4. **IT** - Handles:
   - Computers, desktops, laptops
   - Projectors, displays, screens
   - Internet connectivity, WiFi, network
   - Lab equipment (software/hardware)
   - Software issues, operating systems
   - Printers, scanners
   - Teaching/presentation equipment

5. **Housekeeping** - Handles:
   - Cleanliness, sweeping, mopping
   - Washrooms, toilets (cleaning only, not plumbing)
   - Garbage collection, waste disposal
   - Pest control (insects, rodents)  
   - Garden, lawn maintenance
   - General tidiness, organization
   - Dustbins, trash bins

6. **Administration** - Handles:
   - Security issues, access control
   - Policy matters
   - Administrative requests
   - Unclear or multi-department issues

🎯 ANALYSIS PRIORITY:
1. **PRIMARY**: Focus on the PRIMARY complaint description first
2. **SECONDARY**: Use ADDITIONAL CONTEXT only if:
   - PRIMARY is unclear or vague
   - You need more details to classify correctly
   - Confidence would be low based on PRIMARY alone

🎯 INSTRUCTIONS:
1. Read the PRIMARY complaint carefully
2. If PRIMARY is clear → classify based on it (ignore SECONDARY)
3. If PRIMARY is unclear → use ADDITIONAL CONTEXT to help
4. Identify the core issue
5. Match it to ONE department
6. Provide confidence score (0-100)
7. Explain your reasoning briefly

⚠️ IMPORTANT DISTINCTIONS:
- "Light not working" → Check if it's the BULB (Civil) or WIRING (Electrical)
- "Washroom issue" → CLEANING (Housekeeping) or PLUMBING (Mechanical)?
- "Computer screen broken" → PHYSICAL damage (Civil) or SOFTWARE (IT)?
- "AC not cooling" → Mechanical (HVAC system)
- "Fan not spinning" → Electrical (motor/wiring)
- "Security issue" → Usually Administration (access, policies) or Housekeeping (patrol, surveillance)
- "Fire safety" → EQUIPMENT damage (Civil) or ALARM malfunction (Electrical)?
- "Smoke detector" → Electrical (detection system)
- "Fire extinguisher missing" → Civil (mounting, installation)

📊 RESPONSE FORMAT (JSON ONLY):
{
  "department": "Civil|Electrical|Mechanical|IT|Housekeeping|Administration",
  "confidence": 85,
  "reasoning": "Brief explanation of why this department"
}

Return ONLY valid JSON, no markdown, no extra text.`;
}

/**
 * Analyze text-only complaint using Gemini SDK
 */
async function analyzeTextOnly(apiKey: string, prompt: string): Promise<string> {
    // Use official Google SDK - handles all endpoint/version routing automatically
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite", // Stable version, better availability
        generationConfig: {
            temperature: 0.2, // Low temperature for consistent classification
            topK: 1,
            topP: 1,
            maxOutputTokens: 500,
        }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
}

/**
 * Parse AI response and extract department + confidence
 */
function parseAIResponse(response: string): AIRoutingResult {
    try {
        // Remove markdown code blocks if present
        let cleanResponse = response.trim();
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        // Parse JSON
        const parsed = JSON.parse(cleanResponse);
        
        // Validate department
        const validDepartments: Department[] = [
            'Civil', 'Electrical', 'Mechanical', 'IT', 'Housekeeping', 'Administration'
        ];
        
        const department = validDepartments.includes(parsed.department) 
            ? parsed.department 
            : 'Administration';
        
        const confidence = Math.min(100, Math.max(0, parseInt(parsed.confidence) || 0));
        
        return {
            department,
            confidence,
            reasoning: parsed.reasoning || 'No reasoning provided'
        };

    } catch (error) {
        console.error('❌ Failed to parse AI response:', response);
        return {
            department: 'Administration',
            confidence: 0,
            reasoning: 'Failed to parse AI response'
        };
    }
}

/**
 * Check if AI routing should be used for this complaint type
 */
export function shouldUseAIRouting(complaintType: string): boolean {
    const aiEnabled = process.env.ENABLE_AI_ROUTING !== 'false';
    
    // ONLY use AI for "General Other" (value: 'other')
    // NOT for department-specific "Other" types:
    //   - civil-other, electrical-other, mechanical-other, etc. (already know department)
    //   - security, fire (have fixed department assignments)
    const needsAI = complaintType === 'other';
    
    return aiEnabled && needsAI && !!process.env.GOOGLE_GEMINI_API_KEY;
}

/**
 * Get confidence threshold for AI routing
 */
export function getConfidenceThreshold(): number {
    return parseInt(process.env.AI_CONFIDENCE_THRESHOLD || '70');
}
