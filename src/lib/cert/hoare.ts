export type QuantumHoareCert = {
  version: number;
  programHash: string;
  precondition: string;
  postcondition: string;
  proofType: "statistical" | "interactive" | "machine-checkable";
  fidelity: number;
  fidelityError: number;
  witness: number | null;
  shots: number;
  noise: number;
  bft: {
    decided: boolean;
    view: number;
    quorum: number;
    leader: number;
  };
  accepted: boolean;
  timestamp: number;
  qubits: number;
  binding: string;
};

async function shaHex(text: string) {
  const data = new TextEncoder().encode(text);
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = (h ^ text.charCodeAt(i)) * 16777619;
  return (h >>> 0).toString(16).padStart(8, "0");
}

export async function makeCert(input: {
  program: string;
  fidelity: number;
  fidelityError: number;
  witness: number | null;
  shots: number;
  noise: number;
  qubits: number;
  decided: boolean;
  view: number;
  quorum: number;
  leader: number;
}): Promise<QuantumHoareCert> {
  const programHash = (await shaHex(input.program)).slice(0, 16);
  const accepted =
    input.decided &&
    input.fidelity >= 0.65 &&
    (input.witness === null || input.witness < 0);
  const binding = (
    await shaHex(
      `${programHash}|${input.fidelity.toFixed(4)}|${input.decided}|${input.view}`,
    )
  ).slice(0, 24);
  return {
    version: 1,
    programHash,
    precondition: "ρ₀ = |0⟩⟨0|⊗n",
    postcondition:
      input.witness === null
        ? `F(ρ, GHZ) ≥ 0.65  (est ${input.fidelity.toFixed(3)})`
        : `F ≥ 0.65 ∧ Tr(Wρ) < 0`,
    proofType: "statistical",
    fidelity: input.fidelity,
    fidelityError: input.fidelityError,
    witness: input.witness,
    shots: input.shots,
    noise: input.noise,
    bft: {
      decided: input.decided,
      view: input.view,
      quorum: input.quorum,
      leader: input.leader,
    },
    accepted,
    timestamp: Date.now(),
    qubits: input.qubits,
    binding,
  };
}

export const BFT_THRESHOLD = 0.65;
