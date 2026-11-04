import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = ts.transpileModule(
  await readFile("src/lib/carousel.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { carouselStops, adjacentStop, carouselState, connectCarousel } =
  await import(
    `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
  );

for (const width of [375, 768, 1024, 1440]) {
  for (const count of [1, 2, 3, 7]) {
    test(`${width}px / ${count} cards: one measured stop per click, complete last card and reverse`, () => {
      const container = Math.min(width - 40, 1160);
      const card =
        width <= 650
          ? container * 0.88
          : width <= 1100
            ? (container - 24) / 2
            : (container - 48) / 3;
      const offsets = Array.from({ length: count }, (_, i) => i * (card + 24));
      const maximum = Math.max(0, offsets.at(-1) + card - container);
      const stops = carouselStops(offsets, maximum);
      let position = 0;
      for (let i = 1; i < stops.length; i++) {
        position = adjacentStop(stops, position, 1);
        assert.equal(position, stops[i]);
        assert.ok(position - stops[i - 1] <= card + 24 + 1);
      }
      assert.ok(offsets.at(-1) + card <= position + container + 1);
      assert.equal(carouselState(position, maximum).end, true);
      assert.equal(carouselState(position, maximum).progress, 1);
      for (let i = stops.length - 2; i >= 0; i--) {
        position = adjacentStop(stops, position, -1);
        assert.equal(position, stops[i]);
      }
      assert.equal(carouselState(position, maximum).start, true);
      assert.equal(adjacentStop(stops, position, -1), 0);
    });
  }
}

test("fractional/unequal card positions include gaps without accumulating offsets", () => {
  const stops = carouselStops([0, 245.375, 563.8125, 851.25], 712.5);
  assert.deepEqual(stops, [0, 245.375, 563.8125, 712.5]);
  assert.equal(adjacentStop(stops, 310, 1), 563.8125);
  assert.equal(adjacentStop(stops, 310, -1), 245.375);
  assert.equal(adjacentStop(stops, 245.375 + 0.25, 1), 563.8125);
  assert.equal(carouselState(711.8, 712.5).end, true);
  assert.equal(carouselState(-3, 712.5).start, true);
  assert.equal(carouselState(356.25, 712.5).progress, 0.5);
});

test("native controller handles queued clicks, manual scroll, resize, reduced motion and cleanup", () => {
  const saved = Object.fromEntries(
    [
      "window",
      "ResizeObserver",
      "requestAnimationFrame",
      "cancelAnimationFrame",
    ].map((key) => [key, globalThis[key]]),
  );
  let resize;
  let reduced = false;
  let disconnected = false;
  const frames = [];
  globalThis.window = Object.assign(new EventTarget(), {
    matchMedia: () => ({ matches: reduced }),
  });
  globalThis.ResizeObserver = class {
    constructor(callback) {
      resize = callback;
    }
    observe() {}
    disconnect() {
      disconnected = true;
    }
  };
  globalThis.requestAnimationFrame = (callback) => (
    frames.push(callback),
    frames.length
  );
  globalThis.cancelAnimationFrame = () => {};
  const track = Object.assign(new EventTarget(), {
    scrollLeft: 0,
    clientLeft: 0,
    clientWidth: 900,
    scrollWidth: 2244,
    getBoundingClientRect: () => ({ left: 100 }),
  });
  let stride = 324;
  track.children = Array.from({ length: 7 }, (_, index) => ({
    getBoundingClientRect: () => ({
      left: 100 + index * stride - track.scrollLeft,
    }),
  }));
  const commands = [];
  track.scrollTo = (command) => {
    commands.push(command);
    if (command.behavior === "instant") track.scrollLeft = command.left;
  };
  let state;
  const scroll = (position) => {
    track.scrollLeft = position;
    track.dispatchEvent(new Event("scroll"));
    while (frames.length) frames.shift()();
  };
  try {
    const controller = connectCarousel(track, (next) => {
      state = next;
    });
    assert.equal(state.start, true);
    controller.move(1);
    controller.move(1);
    assert.deepEqual(
      commands.map((c) => c.left),
      [324, 648],
    );
    assert.equal(commands[0].behavior, "smooth");
    scroll(648);
    assert.equal(state.progress, 648 / 1344);
    track.dispatchEvent(new Event("wheel"));
    scroll(810);
    controller.move(-1);
    assert.equal(commands.at(-1).left, 648);
    scroll(972);
    track.dispatchEvent(new Event("scrollend"));
    stride = 248;
    track.clientWidth = 500;
    track.scrollWidth = 1712;
    resize();
    assert.equal(commands.at(-1).left, 744);
    assert.equal(commands.at(-1).behavior, "instant");
    reduced = true;
    controller.move(1);
    assert.equal(commands.at(-1).left, 992);
    assert.equal(commands.at(-1).behavior, "instant");
    scroll(1212);
    assert.equal(state.end, true);
    assert.equal(state.progress, 1);
    controller.dispose();
    assert.equal(disconnected, true);
    scroll(0);
    assert.equal(state.end, true);
  } finally {
    for (const [key, value] of Object.entries(saved))
      value === undefined ? delete globalThis[key] : (globalThis[key] = value);
  }
});
