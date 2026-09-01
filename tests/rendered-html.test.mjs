import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports a complete static homepage", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /Андрей Варнавский/);
  assert.match(html, /Эфирная графика/);
  assert.match(html, /Дипломный проект/);
  assert.doesNotMatch(html, /codex-preview/);
});
