import assert from "node:assert/strict";
import type { Page } from "playwright";

const assertPreviewEdges = async (
  page: Page,
  twoColumn: boolean,
  scoreId: string,
  measurePrefix: string,
) => {
  // 代表施策から両方の中間目的へ接続し、異なる内容には個別に接続する。
  const connections = twoColumn
    ? [
        ["original", "purpose-a"],
        ["unset-progress", "purpose-a"],
        ["empty-a", "purpose-a"],
        ["different-color", "purpose-b"],
        ["different-comment", "purpose-b"],
        ["original", "purpose-b"],
        ["zero-progress", "purpose-b"],
        ["empty-b", "purpose-b"],
      ]
    : [
        ["original", "purpose-a"],
        ["individual", "purpose-a"],
        ["unset-progress", "purpose-a"],
        ["empty-a", "purpose-a"],
        ["different-feedback", "purpose-b"],
        ["different-color", "purpose-b"],
        ["different-progress", "purpose-b"],
        ["different-comment", "purpose-b"],
        ["different-comment-color", "purpose-b"],
        ["original", "purpose-b"],
        ["zero-progress", "purpose-b"],
        ["empty-b", "purpose-b"],
      ];

  await page.waitForFunction(
    ({ connections, scoreId, measurePrefix }) => {
      const score = document.getElementById(scoreId)!;
      const base = score.getBoundingClientRect();
      const lines = [...score.querySelectorAll('line[visibility="visible"]')];
      return (
        lines.length === connections.length + 2 &&
        connections.every(([measure, purpose]) => {
          const from = document
            .getElementById(measurePrefix + measure)!
            .getBoundingClientRect();
          const to = document
            .getElementById(
              measurePrefix.replace(/-measure-$/, "-purpose-") + purpose,
            )!
            .getBoundingClientRect();
          return lines.some((line) => {
            const expected = {
              x1: from.right - base.left,
              y1: from.top + from.height / 2 - base.top - 2,
              x2: to.left - base.left + 1,
              y2: to.top + to.height / 2 - base.top,
            };
            return Object.entries(expected).every(
              ([attr, value]) =>
                Math.abs(Number(line.getAttribute(attr)) - value) < 0.1,
            );
          });
        })
      );
    },
    { connections, scoreId, measurePrefix },
    { timeout: 5000 },
  );
};

// textareaを避けてカードの枠からドラッグし、実際のSortable動作を確認する。
const dragMeasure = async (page: Page, measurePrefix: string) => {
  const from = page.locator(`[id="${measurePrefix}original"]`);
  const to = page.locator(`[id="${measurePrefix}individual"]`);
  await from.scrollIntoViewIfNeeded();
  const start = (await from.boundingBox())!;
  const end = (await to.boundingBox())!;
  await page.mouse.move(start.x + 2, start.y + 2);
  await page.mouse.down();
  await page.waitForTimeout(30);
  await page.mouse.move(start.x + 2, start.y + 12, { steps: 3 });
  await page.mouse.move(end.x + 2, end.y + end.height - 2, { steps: 20 });
  await page.waitForTimeout(200);
  await page.mouse.up();
};

export const previewBrowserTest = async (
  page: Page,
  mobile: boolean,
  twoColumn: boolean,
) => {
  const score = page.locator('[role="score"][aria-label="box"]');
  const scoreId = (await score.getAttribute("id"))!;
  const measurePrefix = `${scoreId.slice("score-".length)}-measure-`;
  const cards = score.locator('[role="measure"][aria-label="box"]');
  const order = () =>
    cards.evaluateAll((elements) => elements.map((element) => element.id));
  const toggle = page.getByRole("button", { name: "プレビュー切り替え" });

  if (!mobile)
    await assertPreviewEdges(page, twoColumn, scoreId, measurePrefix);
  const previewOrder = await order();
  await dragMeasure(page, measurePrefix);
  assert.deepEqual(
    await order(),
    previewOrder,
    "プレビュー中は枠からドラッグしても順序を変更しない",
  );

  await toggle.click();
  assert.equal(await cards.count(), 13);
  if (!mobile) {
    await score
      .locator('line[stroke-dasharray="2"][visibility="visible"]')
      .first()
      .waitFor({ state: "attached" });
  }
  const editOrder = await order();
  await toggle.click();
  if (!mobile)
    await assertPreviewEdges(page, twoColumn, scoreId, measurePrefix);

  // 編集モードに戻すと入力・追加・並べ替えが可能。
  await toggle.click();
  assert.equal(await cards.count(), 13);
  assert.deepEqual(await order(), editOrder);
  await dragMeasure(page, measurePrefix);
  assert.notDeepEqual(
    await order(),
    editOrder,
    "編集モードではドラッグで並べ替えできる",
  );
  const textbox = score.locator(`[id="${measurePrefix}individual"] textarea`);
  await textbox.fill("編集できる施策");
  assert.equal(await textbox.inputValue(), "編集できる施策");
  const count = await cards.count();
  await score
    .locator('[role="measure"][aria-label="add-icon"]')
    .first()
    .click();
  assert.equal(await cards.count(), count + 1);
};
