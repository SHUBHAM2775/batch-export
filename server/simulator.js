const FAIL_RATE = 0.2;
const TICK_MS = 500;
const ERROR_MESSAGES = [
  "Renderer timed out",
  "Unsupported image data",
  "Export worker crashed",
];

const randomBetween = (min, max) => min + Math.random() * (max - min);

function buildOutputUrl(row) {
  const [width, height] = row.size.split("x");
  return `https://picsum.photos/seed/${row.id}/${width}/${height}`;
}

export function runRow(row, startDelayMs, processingMs) {
  row.status = "queued";
  row.progress = 0;
  row.outputUrl = null;
  row.error = null;

  setTimeout(() => {
    row.status = "processing";
    const startedAt = Date.now();

    const ticker = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      row.progress = Math.min(95, Math.round((elapsed / processingMs) * 100));
    }, TICK_MS);

    setTimeout(() => {
      clearInterval(ticker);

      if (Math.random() < FAIL_RATE) {
        row.status = "failed";
        row.error =
          ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
      } else {
        row.status = "done";
        row.progress = 100;
        row.outputUrl = buildOutputUrl(row);
      }
    }, processingMs);
  }, startDelayMs);
}

export function startBatch(batch) {
  const batchMs = randomBetween(25000, 35000);
  const slowestIndex = Math.floor(Math.random() * batch.rows.length);

  batch.rows.forEach((row, index) => {
    const finishMs =
      index === slowestIndex ? batchMs : randomBetween(0.35, 1) * batchMs;
    const startDelayMs = randomBetween(0.05, 0.3) * finishMs;

    runRow(row, startDelayMs, finishMs - startDelayMs);
  });
}