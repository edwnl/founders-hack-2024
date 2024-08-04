"use server";
import OpenAI from "openai";

/**
 * By utilising AI, we can give out reasons why we might think 2 profiles are matched. Therefore, users can utilise
 * them to start a conversation
 * @param id
 * @param id2
 * @param data
 * @returns {Promise<any>}
 */
export async function findMatches(id, id2, data) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              `from this dataset of fellow users who will be attending the same event, please tell me why the user ${id} matches with the ${id2}. Please format your response to JSON format and only output similarity score (in field 'sim-score') in percentage, and the reasons why they might be similar (in field 'reasons')` +
              `The data is formatted in JSON:${data}`,
          },
        ],
      },
    ],
    model: "gpt-4o-mini",
  });
  const response = completion.choices[0].message.content.slice(7, -3);

  return JSON.parse(response);
}
