import { expect } from 'vitest';
import { SaveManager } from '../systems/SaveManager.js';

describe('SaveManager', () => {
  it('load devuelve estado inicial si no hay guardado', () => {
    localStorage.clear();
    const state = SaveManager.load();
    expect(state.personaje).toBeNull();
    expect(state.episodios.ep0).toBe('disponible');
    expect(state.episodios.ep1).toBe('bloqueado');
  });

  it('save y load persisten correctamente', () => {
    localStorage.clear();
    const state = SaveManager.load();
    state.personaje = 'aprendiz_m';
    state.episodios.ep0 = 'completado';
    state.episodios.ep1 = 'disponible';
    SaveManager.save(state);
    const loaded = SaveManager.load();
    expect(loaded.personaje).toBe('aprendiz_m');
    expect(loaded.episodios.ep0).toBe('completado');
  });

  it('reset elimina el guardado', () => {
    localStorage.clear();
    const state = SaveManager.load();
    state.personaje = 'aprendiz_f';
    SaveManager.save(state);
    SaveManager.reset();
    expect(SaveManager.load().personaje).toBeNull();
  });

  it('completeMission marca mision', () => {
    localStorage.clear();
    const state = SaveManager.load();
    state.personaje = 'aprendiz_m';
    SaveManager.save(state);
    SaveManager.completeMission('ep0', 'mision_entrada');
    const s2 = SaveManager.load();
    expect(s2.misiones.ep0).toContain('mision_entrada');
  });
});
