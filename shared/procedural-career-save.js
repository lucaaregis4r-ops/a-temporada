(function () {
  const STORAGE_KEY = "temporada_procedural_careers_v1";
  const SPORT_STORAGE_KEYS = {
    basquete: `${STORAGE_KEY}_basquete`,
    futsal: `${STORAGE_KEY}_futsal`,
    volei: `${STORAGE_KEY}_volei`,
    "volei-feminino": `${STORAGE_KEY}_volei_feminino`
  };
  const FOLDER_DB_NAME = "temporada_procedural_save_folder";
  const FOLDER_STORE_NAME = "handles";
  const FOLDER_HANDLE_ID = "save-folder";
  const SCHEMA_VERSION = 1;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function createId() {
    return `career-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }

  function getVariantFolderName(variant = "") {
    const names = {
      basquete: "basquete",
      futsal: "futsal",
      volei: "volei-masculino",
      "volei-feminino": "volei-feminino"
    };
    return names[variant] || names.basquete;
  }

  function slugifyFilePart(value = "") {
    return String(value || "carreira")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 54)
      .toLowerCase() || "carreira";
  }

  function getSaveFileName(record = {}) {
    const id = slugifyFilePart(record.id || createId());
    const name = slugifyFilePart(record.name || record.clubName || "carreira");
    return `${id}__${name}.json`;
  }

  function getSaveVariant(payload = {}) {
    if (payload.sportVariant) return payload.sportVariant;
    if (payload.sportId === "volei" && payload.division === "feminino") return "volei-feminino";
    if (payload.sportId === "volei") return "volei";
    return payload.sportId || "basquete";
  }

  function getStorageKey(sportId = "", sportVariant = "") {
    return SPORT_STORAGE_KEYS[sportVariant] || SPORT_STORAGE_KEYS[sportId] || STORAGE_KEY;
  }

  function readStore(storageKey = STORAGE_KEY) {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (error) {
      console.warn("[procedural-save] Nao foi possivel ler saves procedurais.", error);
      return {};
    }
  }

  function writeStore(store, storageKey = STORAGE_KEY) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(store));
      return { ok: true };
    } catch (error) {
      console.warn("[procedural-save] Nao foi possivel gravar saves procedurais.", error);
      const quota = error?.name === "QuotaExceededError" || error?.code === 22;
      return { ok: false, errors: [quota ? "local_storage_cheio" : "falha_ao_gravar_save"] };
    }
  }

  function compactPlayerForSave(player = {}) {
    const compact = { ...player };
    [
      "debug",
      "diagnostics",
      "scoutNotes",
      "scoutingReport",
      "report",
      "generatedFrom",
      "generationTrace",
      "fitExplanation"
    ].forEach((key) => delete compact[key]);
    return compact;
  }

  function compactRosterForSave(roster = {}, options = {}) {
    const compact = { ...roster };
    if (Array.isArray(compact.players)) {
      compact.players = options.omitPlayers
        ? undefined
        : compact.players.map(compactPlayerForSave);
      if (!compact.players) delete compact.players;
    }
    return compact;
  }

  function compactTeamForSave(team = {}, userTeamId = "") {
    const compact = { ...team };
    [
      "debug",
      "diagnostics",
      "calibration",
      "warnings",
      "scoutNotes",
      "narrativeDebug",
      "generationTrace",
      "marketFit",
      "generatedAt"
    ].forEach((key) => delete compact[key]);
    if (compact.roster) {
      compact.roster = compactRosterForSave(compact.roster, { omitPlayers: compact.id === userTeamId });
    }
    return compact;
  }

  function compactPayloadForSave(payload) {
    const compact = clone(payload);
    [
      "saveMessage",
      "careerJsonDraft",
      "pendingDeleteCareerId",
      "marketSelectionId",
      "marketReleaseSelections",
      "liveMatch"
    ].forEach((key) => delete compact[key]);

    if (Array.isArray(compact.roster)) {
      compact.roster = compact.roster.map(compactPlayerForSave);
    }
    if (compact.userTeam) {
      compact.userTeam = compactTeamForSave(compact.userTeam, compact.userTeam.id);
      if (compact.userTeam.roster) {
        compact.userTeam.roster = compactRosterForSave(compact.userTeam.roster, { omitPlayers: true });
      }
    }
    if (compact.league) {
      compact.league = { ...compact.league };
      delete compact.league.standingsPreview;
      delete compact.league.debug;
      delete compact.league.diagnostics;
      if (Array.isArray(compact.league.teams)) {
        compact.league.teams = compact.league.teams.map((team) => compactTeamForSave(team, compact.userTeam?.id));
      }
    }
    if (Array.isArray(compact.calendar?.events)) {
      compact.calendar = {
        ...compact.calendar,
        events: compact.calendar.events.map((event) => {
          const next = { ...event };
          delete next.debug;
          delete next.diagnostics;
          return next;
        })
      };
    }
    if (Array.isArray(compact.log)) compact.log = compact.log.slice(0, 50);
    compact.saveCompactedAt = new Date().toISOString();
    return compact;
  }

  function compactSaveRecord(save) {
    const normalized = normalizeStoredSave(save);
    if (!normalized?.payload) return save;
    const payload = compactPayloadForSave(normalized.payload);
    const userStanding = (payload.standings || []).find((row) => row.teamId === payload.userTeam?.id) || null;
    return {
      ...normalized,
      clubName: payload.userTeam?.name || normalized.clubName || "",
      currentDay: payload.currentDay || normalized.currentDay || 1,
      currentWeek: payload.currentWeek || normalized.currentWeek || 1,
      record: userStanding ? `${userStanding.wins || 0}-${userStanding.losses || 0}` : normalized.record || "0-0",
      pointDiff: userStanding?.pointDiff || normalized.pointDiff || 0,
      payload
    };
  }

  function compactStore(store = {}) {
    const entries = Array.isArray(store)
      ? store.map((save, index) => [save?.id || `legacy-${index}`, save])
      : Object.entries(store || {});
    return entries.reduce((nextStore, [id, save]) => {
      const compacted = compactSaveRecord(save);
      if (compacted) nextStore[compacted.id || id] = compacted;
      return nextStore;
    }, {});
  }

  function getStoreSize(store = {}) {
    try {
      return JSON.stringify(store).length;
    } catch (error) {
      return 0;
    }
  }

  function reclaimStorageSpace() {
    const sportKeys = [SPORT_STORAGE_KEYS.basquete, SPORT_STORAGE_KEYS.futsal, SPORT_STORAGE_KEYS.volei, SPORT_STORAGE_KEYS["volei-feminino"]];
    const sportIds = new Set();
    sportKeys.forEach((key) => {
      const store = readStore(key);
      Object.keys(store || {}).forEach((id) => sportIds.add(id));
      const compacted = compactStore(store);
      if (getStoreSize(compacted) <= getStoreSize(store)) writeStore(compacted, key);
    });

    const legacyStore = readStore(STORAGE_KEY);
    let legacyChanged = false;
    Object.keys(legacyStore || {}).forEach((id) => {
      if (sportIds.has(id)) {
        delete legacyStore[id];
        legacyChanged = true;
      }
    });
    const compactedLegacy = compactStore(legacyStore);
    if (legacyChanged || getStoreSize(compactedLegacy) <= getStoreSize(legacyStore)) {
      writeStore(compactedLegacy, STORAGE_KEY);
    }
  }

  function writeStoreWithRecovery(store, storageKey = STORAGE_KEY, preferredId = "") {
    const firstTry = writeStore(store, storageKey);
    if (firstTry.ok || !firstTry.errors?.includes("local_storage_cheio")) return firstTry;
    reclaimStorageSpace();
    const compacted = compactStore(store);
    const secondTry = writeStore(compacted, storageKey);
    if (secondTry.ok) return secondTry;
    if (preferredId && compacted[preferredId]) {
      const preferredTry = writeStore({ [preferredId]: compacted[preferredId] }, storageKey);
      if (preferredTry.ok) return preferredTry;
    }
    const entries = Object.entries(compacted)
      .sort((a, b) => getSaveTimestamp(b[1]) - getSaveTimestamp(a[1]));
    const currentId = entries[0]?.[0] || "";
    const slimStore = currentId ? { [currentId]: entries[0][1] } : compacted;
    return writeStore(slimStore, storageKey);
  }

  function normalizeStoredSave(save, fallbackId = "") {
    if (save?.payload) {
      return {
        ...save,
        id: save.id || save.payload?.careerMeta?.id || fallbackId || createId()
      };
    }
    if (isObject(save) && String(save.mode || "").includes("procedural")) {
      return {
        id: save.careerMeta?.id || fallbackId || createId(),
        name: save.careerMeta?.name || save.userTeam?.name || save.seed || "Carreira procedural",
        savedAt: save.careerMeta?.savedAt || save.savedAt || "",
        schemaVersion: save.careerMeta?.schemaVersion || SCHEMA_VERSION,
        clubName: save.userTeam?.name || "",
        currentDay: save.currentDay || 1,
        currentWeek: save.currentWeek || 1,
        payload: save
      };
    }
    return null;
  }

  function getStoredSaves(options = {}) {
    const sportId = options.sportId || "";
    const sportVariant = options.sportVariant || "";
    const stores = sportId
      ? [readStore(getStorageKey(sportId, sportVariant)), readStore(STORAGE_KEY)]
      : [readStore(STORAGE_KEY), readStore(SPORT_STORAGE_KEYS.basquete), readStore(SPORT_STORAGE_KEYS.futsal), readStore(SPORT_STORAGE_KEYS.volei), readStore(SPORT_STORAGE_KEYS["volei-feminino"])];
    const merged = {};
    stores.forEach((store) => {
      const entries = Array.isArray(store)
        ? store.map((save, index) => [save?.id || `legacy-${index}`, save])
        : Object.entries(store || {});
      entries.forEach(([id, save]) => {
        if (!merged[id]) merged[id] = save;
      });
    });
    const store = merged;
    const entries = Array.isArray(store)
      ? store.map((save, index) => [save?.id || `legacy-${index}`, save])
      : Object.entries(store || {});
    return entries
      .map(([id, save]) => normalizeStoredSave(save, id))
      .filter((save) => {
        if (!save) return false;
        const payload = save.payload || {};
        const payloadSportId = payload.sportId || "basquete";
        if (sportId && payloadSportId !== sportId) return false;
        if (sportVariant) return getSaveVariant(payload) === sportVariant;
        if (sportId === "volei") return getSaveVariant(payload) === "volei";
        return true;
      });
  }

  function getValidationErrors(payload) {
    const errors = [];
    if (!isObject(payload)) errors.push("payload_not_object");
    if (!payload?.mode || !String(payload.mode).includes("procedural")) errors.push("invalid_mode");
    if (!payload?.seed) errors.push("missing_seed");
    if (!Number(payload?.currentDay)) errors.push("missing_current_day");
    if (!Number(payload?.currentWeek)) errors.push("missing_current_week");
    if (!isObject(payload?.league) || !Array.isArray(payload?.league?.teams)) errors.push("missing_league");
    if (!payload?.userTeam?.id) errors.push("missing_user_team");
    if (!Array.isArray(payload?.roster)) errors.push("missing_roster");
    if (!Array.isArray(payload?.standings)) errors.push("missing_standings");
    if (!Array.isArray(payload?.calendar?.events)) errors.push("missing_calendar");
    if (!isObject(payload?.teamState)) errors.push("missing_team_state");
    if (payload?.teamState && !Number.isFinite(Number(payload.teamState.budget))) errors.push("missing_budget");
    if (payload?.teamState && !Number.isFinite(Number(payload.teamState.morale))) errors.push("missing_morale");
    if (payload?.teamState && !Number.isFinite(Number(payload.teamState.chemistry))) errors.push("missing_chemistry");
    if (payload?.teamState && !Number.isFinite(Number(payload.teamState.fatigue))) errors.push("missing_fatigue");
    if (!isObject(payload?.summary)) errors.push("missing_summary");
    if (!Array.isArray(payload?.log)) errors.push("missing_log");
    if (!Array.isArray(payload?.processedEventIds)) errors.push("missing_processed_events");
    if (!Array.isArray(payload?.usedDecisionIds)) errors.push("missing_used_decisions");
    if (!Array.isArray(payload?.decisionMemory)) errors.push("missing_decision_memory");
    return errors;
  }

  function normalizeLoadedPayload(payload, save = {}) {
    const migrated = clone(payload);
    const version = Number(migrated.careerMeta?.schemaVersion || save.schemaVersion || 0);

    if (version < 1) {
      migrated.careerMeta = {
        ...(migrated.careerMeta || {}),
        id: save.id || migrated.careerMeta?.id || createId(),
        name: save.name || migrated.careerMeta?.name || migrated.userTeam?.name || "Carreira procedural",
        savedAt: save.savedAt || migrated.careerMeta?.savedAt || new Date().toISOString(),
        schemaVersion: SCHEMA_VERSION
      };
    }

    migrated.careerMeta = {
      ...(migrated.careerMeta || {}),
      id: migrated.careerMeta?.id || save.id || createId(),
      name: migrated.careerMeta?.name || save.name || migrated.userTeam?.name || "Carreira procedural",
      savedAt: migrated.careerMeta?.savedAt || save.savedAt || new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION
    };
    migrated.teamState = {
      ...(migrated.teamState || {}),
      weeklyFocus: migrated.teamState?.weeklyFocus || "balanced"
    };
    migrated.decisionDeckSeed = migrated.decisionDeckSeed
      || `deck-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    migrated.decisionDeckCursor = Number.isFinite(Number(migrated.decisionDeckCursor))
      ? Number(migrated.decisionDeckCursor)
      : 0;
    migrated.rosterView = {
      position: migrated.rosterView?.position || "all",
      sort: migrated.rosterView?.sort || "overall"
    };
    if (migrated.userTeam?.roster && !Array.isArray(migrated.userTeam.roster.players)) {
      migrated.userTeam.roster.players = Array.isArray(migrated.roster) ? migrated.roster : [];
    }
    if (Array.isArray(migrated.league?.teams) && migrated.userTeam?.id) {
      migrated.league.teams = migrated.league.teams.map((team) => {
        if (team.id !== migrated.userTeam.id || Array.isArray(team.roster?.players)) return team;
        return {
          ...team,
          roster: {
            ...(team.roster || {}),
            players: Array.isArray(migrated.roster) ? migrated.roster : []
          }
        };
      });
    }
    migrated.processedEventIds = Array.isArray(migrated.processedEventIds) ? migrated.processedEventIds : [];
    migrated.usedDecisionIds = Array.isArray(migrated.usedDecisionIds) ? migrated.usedDecisionIds : [];
    migrated.decisionMemory = Array.isArray(migrated.decisionMemory) ? migrated.decisionMemory : [];
    if (migrated.sportId === "volei" && Array.isArray(migrated.roster)) {
      const emptyVolleyStats = {
        games: 0,
        setsPlayed: 0,
        points: 0,
        aces: 0,
        attacks: 0,
        attackPoints: 0,
        attackErrors: 0,
        blocks: 0,
        receptions: 0,
        positiveReceptions: 0,
        receptionErrors: 0,
        digs: 0,
        setAssists: 0,
        errors: 0,
        efficiency: 0
      };
      migrated.roster = migrated.roster.map((player) => ({
        ...player,
        sportId: player.sportId || "volei",
        seasonStats: {
          ...emptyVolleyStats,
          ...(player.seasonStats || {})
        }
      }));
    }
    migrated.log = Array.isArray(migrated.log) ? migrated.log : [];
    migrated.status = migrated.status || "playing";
    migrated.activeTab = migrated.activeTab || "calendar";
    return migrated;
  }

  function createSaveRecord(payload, name, options = {}) {
    const id = options.forceNew ? createId() : payload.careerMeta?.id || createId();
    const savedAt = new Date().toISOString();
    const saveName = String(name || payload.careerMeta?.name || payload.userTeam?.name || payload.seed || "Carreira procedural").trim();
    const userStanding = (payload.standings || []).find((row) => row.teamId === payload.userTeam?.id) || null;
    const normalized = compactPayloadForSave({
      ...payload,
      saveMessage: null,
      careerJsonDraft: "",
      careerMeta: {
        ...(payload.careerMeta || {}),
        id,
        name: saveName,
        savedAt,
        schemaVersion: SCHEMA_VERSION
      }
    });
    return {
      id,
      name: saveName,
      savedAt,
      schemaVersion: SCHEMA_VERSION,
      clubName: normalized.userTeam?.name || "",
      currentDay: normalized.currentDay || 1,
      currentWeek: normalized.currentWeek || 1,
      record: userStanding ? `${userStanding.wins || 0}-${userStanding.losses || 0}` : "0-0",
      pointDiff: userStanding?.pointDiff || 0,
      payload: normalized
    };
  }

  function getSaveTimestamp(save = {}) {
    const candidates = [
      save.savedAt,
      save.payload?.careerMeta?.savedAt,
      save.payload?.savedAt,
      String(save.id || "").match(/^career-(\d+)/)?.[1]
    ];
    for (const candidate of candidates) {
      if (!candidate) continue;
      const numeric = Number(candidate);
      if (Number.isFinite(numeric) && numeric > 100000000000) return numeric;
      const parsed = Date.parse(candidate);
      if (Number.isFinite(parsed)) return parsed;
    }
    return 0;
  }

  function normalizeSaveRecordForList(save) {
    const payload = save?.payload || {};
    const userStanding = (payload.standings || []).find((row) => row.teamId === payload.userTeam?.id) || null;
    return {
      id: save.id || payload.careerMeta?.id || createId(),
      name: save.name || payload.careerMeta?.name || payload.userTeam?.name || payload.seed || "Carreira procedural",
      savedAt: save.savedAt || payload.careerMeta?.savedAt || "",
      clubName: save.clubName || payload.userTeam?.name || "",
      currentDay: save.currentDay || payload.currentDay || 1,
      currentWeek: save.currentWeek || payload.currentWeek || 1,
      record: save.record || (userStanding ? `${userStanding.wins || 0}-${userStanding.losses || 0}` : "0-0"),
      pointDiff: save.pointDiff || userStanding?.pointDiff || 0,
      schemaVersion: save.schemaVersion || payload.careerMeta?.schemaVersion || SCHEMA_VERSION,
      warnings: getValidationErrors(payload),
      __timestamp: getSaveTimestamp(save)
    };
  }

  function listCareers(options = {}) {
    return getStoredSaves(options)
      .filter((save) => save?.id && save?.payload)
      .map(normalizeSaveRecordForList)
      .sort((a, b) => b.__timestamp - a.__timestamp || String(b.id).localeCompare(String(a.id)))
      .map(({ __timestamp, ...save }) => save);
  }

  function saveCareer(state, name, options = {}) {
    if (!state) return null;
    const sportId = state.sportId || "basquete";
    const storageKey = getStorageKey(sportId, getSaveVariant(state));
    const store = readStore(storageKey);
    const errors = getValidationErrors(state);
    if (errors.length) {
      return { ok: false, errors };
    }
    const record = createSaveRecord(state, name, options);
    store[record.id] = record;
    const written = writeStoreWithRecovery(store, storageKey, record.id);
    if (!written.ok) return written;
    return { ok: true, save: record };
  }

  function saveCareerAsNew(state, name) {
    return saveCareer(state, name, { forceNew: true });
  }

  function loadCareer(id) {
    const save = normalizeStoredSave(readStore(SPORT_STORAGE_KEYS.basquete)[id], id)
      || normalizeStoredSave(readStore(SPORT_STORAGE_KEYS.futsal)[id], id)
      || normalizeStoredSave(readStore(SPORT_STORAGE_KEYS.volei)[id], id)
      || normalizeStoredSave(readStore(SPORT_STORAGE_KEYS["volei-feminino"])[id], id)
      || normalizeStoredSave(readStore(STORAGE_KEY)[id], id)
      || getStoredSaves().find((item) => item.id === id);
    if (!save?.payload) return { ok: false, errors: ["save_not_found"] };
    const errors = getValidationErrors(save.payload);
    if (errors.length) return { ok: false, errors };
    return { ok: true, payload: normalizeLoadedPayload(save.payload, save) };
  }

  function deleteCareer(id) {
    let deleted = false;
    [SPORT_STORAGE_KEYS.basquete, SPORT_STORAGE_KEYS.futsal, SPORT_STORAGE_KEYS.volei, SPORT_STORAGE_KEYS["volei-feminino"], STORAGE_KEY].forEach((storageKey) => {
      const store = readStore(storageKey);
      if (!store[id]) return;
      delete store[id];
      writeStore(store, storageKey);
      deleted = true;
    });
    return deleted;
  }

  function exportCareer(id) {
    const save = normalizeStoredSave(readStore(SPORT_STORAGE_KEYS.basquete)[id], id)
      || normalizeStoredSave(readStore(SPORT_STORAGE_KEYS.futsal)[id], id)
      || normalizeStoredSave(readStore(SPORT_STORAGE_KEYS.volei)[id], id)
      || normalizeStoredSave(readStore(SPORT_STORAGE_KEYS["volei-feminino"])[id], id)
      || normalizeStoredSave(readStore(STORAGE_KEY)[id], id);
    if (!save?.payload) return { ok: false, errors: ["save_not_found"] };
    const errors = getValidationErrors(save.payload);
    if (errors.length) return { ok: false, errors };
    return {
      ok: true,
      json: JSON.stringify({
        exportedAt: new Date().toISOString(),
        source: "A Temporada - Carreira Procedural",
        schemaVersion: SCHEMA_VERSION,
        save
      }, null, 2)
    };
  }

  function importCareer(jsonText) {
    let parsed;
    try {
      parsed = JSON.parse(String(jsonText || ""));
    } catch (error) {
      return { ok: false, errors: ["invalid_json"] };
    }
    const importedSave = parsed.save || parsed;
    const payload = importedSave.payload || importedSave;
    const errors = getValidationErrors(payload);
    if (errors.length) return { ok: false, errors };
    const normalizedPayload = normalizeLoadedPayload(payload, importedSave);
    normalizedPayload.careerMeta = {
      ...(normalizedPayload.careerMeta || {}),
      id: createId(),
      name: `${normalizedPayload.careerMeta?.name || normalizedPayload.userTeam?.name || "Carreira procedural"} (importada)`,
      savedAt: new Date().toISOString(),
      schemaVersion: SCHEMA_VERSION
    };
    const record = createSaveRecord(normalizedPayload, normalizedPayload.careerMeta.name);
    const importStorageKey = getStorageKey(normalizedPayload.sportId || "basquete", getSaveVariant(normalizedPayload));
    const store = readStore(importStorageKey);
    store[record.id] = record;
    const written = writeStoreWithRecovery(store, importStorageKey, record.id);
    if (!written.ok) return written;
    return { ok: true, save: record };
  }

  function isFolderSaveSupported() {
    return Boolean(window.showDirectoryPicker && window.indexedDB);
  }

  function openFolderDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(FOLDER_DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(FOLDER_STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function setStoredFolderHandle(handle) {
    const db = await openFolderDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FOLDER_STORE_NAME, "readwrite");
      tx.objectStore(FOLDER_STORE_NAME).put(handle, FOLDER_HANDLE_ID);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getStoredFolderHandle() {
    if (!isFolderSaveSupported()) return null;
    const db = await openFolderDb();
    return new Promise((resolve) => {
      const tx = db.transaction(FOLDER_STORE_NAME, "readonly");
      const request = tx.objectStore(FOLDER_STORE_NAME).get(FOLDER_HANDLE_ID);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async function verifyFolderPermission(handle, mode = "readwrite") {
    if (!handle?.queryPermission || !handle?.requestPermission) return false;
    const options = { mode };
    if ((await handle.queryPermission(options)) === "granted") return true;
    return (await handle.requestPermission(options)) === "granted";
  }

  async function connectSaveFolder() {
    if (!isFolderSaveSupported()) {
      return { ok: false, errors: ["folder_save_unsupported"] };
    }
    try {
      const handle = await window.showDirectoryPicker({
        id: "temporada-procedural-saves",
        mode: "readwrite",
        startIn: "documents"
      });
      const allowed = await verifyFolderPermission(handle, "readwrite");
      if (!allowed) return { ok: false, errors: ["folder_permission_denied"] };
      await setStoredFolderHandle(handle);
      return { ok: true, handle };
    } catch (error) {
      if (error?.name === "AbortError") return { ok: false, errors: ["folder_selection_cancelled"] };
      console.warn("[procedural-save] Nao foi possivel selecionar pasta de saves.", error);
      return { ok: false, errors: ["folder_save_failed"] };
    }
  }

  async function getActiveFolderHandle() {
    const handle = await getStoredFolderHandle();
    if (!handle) return null;
    const allowed = await verifyFolderPermission(handle, "readwrite");
    return allowed ? handle : null;
  }

  async function getVariantDirectory(handle, sportId = "basquete", sportVariant = "") {
    const variant = getSaveVariant({ sportId, sportVariant });
    const root = await handle.getDirectoryHandle("temporada-total-saves", { create: true });
    return root.getDirectoryHandle(getVariantFolderName(variant), { create: true });
  }

  async function readJsonFile(fileHandle) {
    const file = await fileHandle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  }

  async function writeJsonFile(directoryHandle, fileName, data) {
    const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
  }

  async function saveCareerToFolder(state, name, options = {}) {
    const handle = options.handle || await getActiveFolderHandle();
    if (!handle) return { ok: false, errors: ["folder_not_selected"] };
    const errors = getValidationErrors(state);
    if (errors.length) return { ok: false, errors };
    try {
      const record = createSaveRecord(state, name, options);
      const directory = await getVariantDirectory(handle, record.payload?.sportId || state.sportId || "basquete", getSaveVariant(record.payload || state));
      await writeJsonFile(directory, getSaveFileName(record), {
        exportedAt: new Date().toISOString(),
        source: "A Temporada - Pasta de Saves",
        schemaVersion: SCHEMA_VERSION,
        save: record
      });
      return { ok: true, save: record };
    } catch (error) {
      console.warn("[procedural-save] Nao foi possivel salvar na pasta.", error);
      return { ok: false, errors: ["folder_write_failed"] };
    }
  }

  async function listFolderCareers(options = {}) {
    const handle = await getActiveFolderHandle();
    if (!handle) return { ok: false, errors: ["folder_not_selected"], saves: [] };
    try {
      const directory = await getVariantDirectory(handle, options.sportId || "basquete", options.sportVariant || "");
      const saves = [];
      for await (const [fileName, entry] of directory.entries()) {
        if (entry.kind !== "file" || !fileName.toLowerCase().endsWith(".json")) continue;
        try {
          const parsed = await readJsonFile(entry);
          const save = normalizeStoredSave(parsed.save || parsed, fileName.replace(/\.json$/i, ""));
          if (!save?.payload) continue;
          const payloadSportId = save.payload.sportId || "basquete";
          if (options.sportId && payloadSportId !== options.sportId) continue;
          if (options.sportVariant && getSaveVariant(save.payload) !== options.sportVariant) continue;
          if (options.sportId === "volei" && !options.sportVariant && getSaveVariant(save.payload) !== "volei") continue;
          saves.push({
            ...normalizeSaveRecordForList(save),
            source: "folder",
            fileName
          });
        } catch (error) {
          console.warn("[procedural-save] Save de pasta ignorado.", fileName, error);
        }
      }
      return {
        ok: true,
        saves: saves
          .sort((a, b) => b.__timestamp - a.__timestamp || String(b.id).localeCompare(String(a.id)))
          .map(({ __timestamp, ...save }) => save)
      };
    } catch (error) {
      console.warn("[procedural-save] Nao foi possivel listar saves da pasta.", error);
      return { ok: false, errors: ["folder_read_failed"], saves: [] };
    }
  }

  async function loadFolderCareer(id, options = {}) {
    const handle = await getActiveFolderHandle();
    if (!handle) return { ok: false, errors: ["folder_not_selected"] };
    try {
      const directory = await getVariantDirectory(handle, options.sportId || "basquete", options.sportVariant || "");
      for await (const [fileName, entry] of directory.entries()) {
        if (entry.kind !== "file" || !fileName.toLowerCase().endsWith(".json")) continue;
        const parsed = await readJsonFile(entry);
        const save = normalizeStoredSave(parsed.save || parsed, fileName.replace(/\.json$/i, ""));
        if (save?.id !== id) continue;
        const errors = getValidationErrors(save.payload);
        if (errors.length) return { ok: false, errors };
        return { ok: true, payload: normalizeLoadedPayload(save.payload, save) };
      }
      return { ok: false, errors: ["save_not_found"] };
    } catch (error) {
      console.warn("[procedural-save] Nao foi possivel carregar save da pasta.", error);
      return { ok: false, errors: ["folder_read_failed"] };
    }
  }

  async function deleteFolderCareer(id, options = {}) {
    const handle = await getActiveFolderHandle();
    if (!handle) return { ok: false, errors: ["folder_not_selected"] };
    try {
      const directory = await getVariantDirectory(handle, options.sportId || "basquete", options.sportVariant || "");
      for await (const [fileName, entry] of directory.entries()) {
        if (entry.kind !== "file" || !fileName.toLowerCase().endsWith(".json")) continue;
        const parsed = await readJsonFile(entry);
        const save = normalizeStoredSave(parsed.save || parsed, fileName.replace(/\.json$/i, ""));
        if (save?.id !== id) continue;
        await directory.removeEntry(fileName);
        return { ok: true };
      }
      return { ok: false, errors: ["save_not_found"] };
    } catch (error) {
      console.warn("[procedural-save] Nao foi possivel excluir save da pasta.", error);
      return { ok: false, errors: ["folder_write_failed"] };
    }
  }

  window.TemporadaTotal = {
    ...(window.TemporadaTotal || {}),
    ProceduralCareerSave: {
      STORAGE_KEY,
      SPORT_STORAGE_KEYS,
      SCHEMA_VERSION,
      listCareers,
      saveCareer,
      saveCareerAsNew,
      loadCareer,
      deleteCareer,
      exportCareer,
      importCareer,
      isFolderSaveSupported,
      connectSaveFolder,
      listFolderCareers,
      saveCareerToFolder,
      loadFolderCareer,
      deleteFolderCareer,
      getValidationErrors
    }
  };
})();
