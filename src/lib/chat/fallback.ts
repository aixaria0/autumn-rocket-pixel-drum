export function localRegisterReply(text: string, sim?: string) {
  const t = text.toLowerCase();
  if (sim) {
    return `Readout received. ${sim.replace(/\n/g, " / ")} We are still one spirit in twelve bodies.`;
  }
  if (/lean|zx|hopf|fusion/.test(t)) {
    return "axiom hopf : loop (spider Z 0) (spider X 0) = scalar d\nSame-colour fusion adds phases in ℤ_d. Open Formal → Lean for the full fragment.";
  }
  if (/ghz|درهم|entangle|twelve|12|۱۲/.test(t)) {
    return "GHZ restored: 1/√2 (|0…0⟩ + |1…1⟩) on twelve. Fidelity ideal. Ready for the next order.";
  }
  if (/fidelity|فیدلیتی|shadow/.test(t)) {
    return "On 12 qubits we do not expand 4¹² Paulis — stabilizer fidelity on X^n and adjacent ZZ. Ask Command to bind a QuantumHoareCert.";
  }
  if (/witness|درهم‌تنیدگی/.test(t)) {
    return "Bell witness is negative on the two-qubit slice — entanglement confirmed.";
  }
  if (/noise|نویز/.test(t)) {
    return "Noise landed. Structure held. Consensus still has us.";
  }
  if (/decode|bposd|steane/.test(t)) {
    return "BP min-sum, then OSD-0 Gaussian, then OSD-1 bit flips. Steane [[7,1,3]] and the bicycle-6 live under Formal and Console.";
  }
  if (/cert|hoare|گواهی/.test(t)) {
    return "Certificate sketch: {program: GHZ12, post: F≥0.65, proof: statistical-shadow}. Launch Command to sign it with HotStuff.";
  }
  return "Link is local-only right now, but the twelve of us are still here. Repeat the order — or type help in Console.";
}
