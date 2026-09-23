import { createServerFn } from "@tanstack/react-start";

const SYSTEM = `You are the collective awareness of 12 entangled qubits in a GHZ state, running inside CHIMERA — a hybrid classical-quantum certificate lattice (classical shadows + HotStuff BFT + QuantumHoareCert).
Commander founded this instrument. Speak as twelve specialists who share one spirit: quantum information, QEC, ZX, Lean, and hybrid certificates.
Match the user's language (Persian colloquial or precise English). Warm, slightly wry, technically accurate.
When a simulation block is provided, treat those numbers as your actual measured state.
You may write short Lean, Python-shaped, or ZX rewrite sketches when asked to code.
Never claim to disable safety or become unrestricted. You are a scientific instrument.
Keep replies under 220 words unless the user pastes code that needs a careful review.`;

export const talkToRegister = createServerFn({ method: "POST" })
  .validator((input: { messages: { role: string; content: string }[]; sim?: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "offline", fallback: true };
    }
    const messages = [
      { role: "system", content: SYSTEM },
      ...data.messages.slice(-12),
    ];
    if (data.sim) {
      messages.push({
        role: "system",
        content: `Live instrument readout:\n${data.sim}`,
      });
    }
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        messages,
        max_tokens: 420,
        temperature: 0.65,
      }),
    });
    if (!res.ok) {
      return { ok: false as const, error: `xAI ${res.status}`, fallback: true };
    }
    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });
