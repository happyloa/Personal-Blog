import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

test("光暈穩定後停止排程，離開會淡出，換頁會清理資源", () => {
  /** @type {Map<number, FrameRequestCallback>} */
  const frames = new Map();
  /** @type {Map<string, Function>} */
  const listeners = new Map();
  let nextId = 0;
  let clock = 100;
  let draws = 0;
  const canvas = {
    width: 0,
    height: 0,
    style: {},
    getContext: () => ({
      clearRect() {},
      setTransform() {},
      fillRect() {
        draws++;
      },
      strokeRect() {},
    }),
  };
  const context = vm.createContext({
    window: {
      innerWidth: 1200,
      innerHeight: 800,
      devicePixelRatio: 1,
      scrollX: 0,
      scrollY: 0,
      matchMedia: (/** @type {string} */ query) => ({
        matches: !query.includes("reduced-motion"),
      }),
      addEventListener: (
        /** @type {string} */ name,
        /** @type {Function} */ callback,
      ) => listeners.set(name, callback),
      removeEventListener: (/** @type {string} */ name) =>
        listeners.delete(name),
    },
    document: { querySelector: () => canvas },
    requestAnimationFrame: (/** @type {FrameRequestCallback} */ callback) => {
      frames.set(++nextId, callback);
      return nextId;
    },
    cancelAnimationFrame: (/** @type {number} */ id) => frames.delete(id),
  });
  const source = readFileSync(
    new URL("../src/scripts/grid-glow.js", import.meta.url),
    "utf8",
  );
  vm.runInContext(source.replaceAll("export function", "function"), context);
  const flush = () => {
    let count = 0;
    while (frames.size && count++ < 120) {
      const callbacks = [...frames.values()];
      frames.clear();
      clock += 16;
      callbacks.forEach((callback) => callback(clock));
    }
    assert.equal(frames.size, 0, "透明度穩定後不應繼續排程");
  };
  vm.runInContext("initGridGlow()", context);
  listeners.get("pointermove")?.({
    pointerType: "mouse",
    clientX: 100,
    clientY: 100,
  });
  flush();
  assert(draws > 0);
  const stableDraws = draws;
  listeners.get("pointermove")?.({
    pointerType: "mouse",
    clientX: 101,
    clientY: 101,
  });
  assert.equal(frames.size, 0, "同一格內移動不需重繪");
  assert.equal(draws, stableDraws);
  listeners.get("scroll")?.();
  flush();
  assert(draws > stableDraws, "捲動後須更新方格位置");
  listeners.get("pointerleave")?.();
  assert.equal(frames.size, 1, "停止後離開必須重新啟動淡出");
  flush();
  const fadedDraws = draws;
  listeners.get("scroll")?.();
  assert.equal(frames.size, 0, "完全淡出後捲動不應啟動動畫");
  assert.equal(draws, fadedDraws);
  listeners.get("pointermove")?.({
    pointerType: "mouse",
    clientX: 200,
    clientY: 200,
  });
  vm.runInContext("cleanupGridGlow()", context);
  assert.equal(frames.size, 0);
  assert.equal(listeners.size, 0);
});
