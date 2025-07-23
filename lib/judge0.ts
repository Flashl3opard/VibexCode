// lib/judge0.ts
const JUDGE0_URL =
  "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

export const runJudge0Advanced = async (code: string, languageId: number) => {
  try {
    // Submit code
    const submitRes = await fetch("/api/judge0/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
      }),
    });

    if (!submitRes.ok) {
      throw new Error(`Submit failed: ${submitRes.status}`);
    }

    const { token } = await submitRes.json();

    // Poll for result
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const resultRes = await fetch(`/api/judge0/result/${token}`);

      if (!resultRes.ok) {
        throw new Error(`Result fetch failed: ${resultRes.status}`);
      }

      const result = await resultRes.json();

      // Check if execution is complete
      if (result.status.id > 2) {
        // Status > 2 means completed
        return result;
      }

      attempts++;
    }

    return { stderr: "❌ Execution timeout" };
  } catch (err) {
    console.error("Error calling Judge0 API:", err);
    return { stderr: "❌ Failed to execute code. Please try again." };
  }
};
