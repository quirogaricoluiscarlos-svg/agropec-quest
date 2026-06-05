const KEY = 'agropec_save';
const EPISODE_ORDER = ['ep0','ep1','ep2','ep3','ep4','ep5','ep6','ep7','ep_final'];

function initialState() {
  const episodios = {};
  EPISODE_ORDER.forEach((id, i) => { episodios[id] = i === 0 ? 'disponible' : 'bloqueado'; });
  return { personaje: null, episodios, misiones: {}, timestamp: Date.now() };
}

export const SaveManager = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : initialState();
    } catch { return initialState(); }
  },
  save(state) {
    state.timestamp = Date.now();
    localStorage.setItem(KEY, JSON.stringify(state));
  },
  reset() { localStorage.removeItem(KEY); },
  completeMission(episodeId, missionId) {
    const state = this.load();
    if (!state.misiones[episodeId]) state.misiones[episodeId] = [];
    if (!state.misiones[episodeId].includes(missionId)) state.misiones[episodeId].push(missionId);
    this.save(state);
  },
  completeEpisode(episodeId, totalMissions) {
    const state = this.load();
    const done = (state.misiones[episodeId] ?? []).length;
    if (done >= totalMissions) {
      state.episodios[episodeId] = 'completado';
      const idx = EPISODE_ORDER.indexOf(episodeId);
      if (idx >= 0 && idx + 1 < EPISODE_ORDER.length) {
        const next = EPISODE_ORDER[idx + 1];
        if (state.episodios[next] === 'bloqueado') state.episodios[next] = 'disponible';
      }
      this.save(state);
      return true;
    }
    return false;
  },
  hasSave() { return localStorage.getItem(KEY) !== null; }
};
