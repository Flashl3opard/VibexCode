// lib/judge0.ts
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

export const runJudge0 = async (code: string, languageId: number) => {
  try {
    const res = await fetch(JUDGE0_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: "", // You can customize input here
      }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error calling Judge0 API:", err);
    return { stderr: "❌ Failed to execute code" };
  }
};
