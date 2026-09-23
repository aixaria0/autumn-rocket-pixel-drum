export type Phase = "prepare" | "precommit" | "commit" | "decide" | "view-change";

export type NodeState = {
  id: number;
  honest: boolean;
  vote: boolean;
  locked: boolean;
};

export type Packet = {
  from: number;
  to: number;
  phase: Phase;
  view: number;
};

export type HotStuffRound = {
  n: number;
  f: number;
  quorum: number;
  view: number;
  leader: number;
  byzantine: number;
  nodes: NodeState[];
  packets: Packet[];
  decided: boolean;
  value: string;
  phases: { name: Phase; votes: number; ok: boolean }[];
};

export function runHotStuff(opts: {
  n?: number;
  byzantine?: number;
  accept: boolean;
  value: string;
  view?: number;
}): HotStuffRound {
  const n = opts.n ?? 7;
  const f = Math.floor((n - 1) / 3);
  const quorum = 2 * f + 1;
  const byz = Math.min(opts.byzantine ?? 1, f);
  const view = opts.view ?? 0;
  const leader = view % n;
  const nodes: NodeState[] = Array.from({ length: n }, (_, id) => ({
    id,
    honest: id !== byz,
    vote: false,
    locked: false,
  }));

  const packets: Packet[] = [];
  const phases: HotStuffRound["phases"] = [];

  const honestIds = nodes.filter((nd) => nd.honest).map((nd) => nd.id);

  function broadcast(from: number, phase: Phase) {
    for (let to = 0; to < n; to++) {
      if (to === from) continue;
      packets.push({ from, to, phase, view });
    }
  }

  broadcast(leader, "prepare");
  let votes = 0;
  for (const id of honestIds) {
    if (opts.accept || id === leader) {
      nodes[id].vote = true;
      votes++;
      broadcast(id, "prepare");
    }
  }
  phases.push({ name: "prepare", votes, ok: votes >= quorum });

  votes = 0;
  if (phases[0].ok) {
    broadcast(leader, "precommit");
    for (const id of honestIds) {
      if (nodes[id].vote) {
        nodes[id].locked = true;
        votes++;
        broadcast(id, "precommit");
      }
    }
  }
  phases.push({ name: "precommit", votes, ok: votes >= quorum });

  votes = 0;
  if (phases[1].ok) {
    broadcast(leader, "commit");
    for (const id of honestIds) {
      if (nodes[id].locked) {
        votes++;
        broadcast(id, "commit");
      }
    }
  }
  phases.push({ name: "commit", votes, ok: votes >= quorum });

  const decided = phases[2].ok;
  if (decided) {
    broadcast(leader, "decide");
    phases.push({ name: "decide", votes, ok: true });
  } else {
    phases.push({ name: "view-change", votes: honestIds.length, ok: true });
  }

  return {
    n,
    f,
    quorum,
    view: decided ? view : view + 1,
    leader,
    byzantine: byz,
    nodes,
    packets,
    decided,
    value: opts.value,
    phases,
  };
}
