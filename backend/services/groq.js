export const generateChatCompletion = async (
  messages,
  { temperature = 0.4, model = "llama-3.1-8b-instant" } = {},
) => {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq request failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();

  return data?.choices?.[0]?.message?.content || "No response";
};