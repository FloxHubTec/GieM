
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function extractReceiptData(base64Image: string, mimeType: string): Promise<ExtractionResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: "Extract data from this delivery receipt or invoice. Focus on the NF-e number (Nota Fiscal), the name of the person who received it, and a summary of the products. Return in JSON format."
        }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nf_number: { type: Type.STRING, description: "The invoice number (Nota Fiscal)" },
          receiver_name: { type: Type.STRING, description: "Name of the receiver" },
          product_description: { type: Type.STRING, description: "Description or list of products" },
          delivery_date: { type: Type.STRING, description: "Date of delivery if visible (ISO format)" }
        },
        required: ["nf_number", "receiver_name", "product_description"],
      },
    },
  });

  const text = response.text || "{}";
  return JSON.parse(text) as ExtractionResult;
}
