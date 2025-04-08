export async function getPosition(page) {
  const canvasExists = await page.evaluate(() => {
    const canvas =
      document.querySelector("#GameCanvas") ||
      document.querySelector("#GameCanvas.GameCanvas");
    return canvas !== null;
  });
  console.log("Canvas exists:", canvasExists);
  await page.evaluate(() => {
    const canvas = document.querySelector("#GameCanvas");
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(`Tọa độ: x=${x}, y=${y}`);
    });
  });
}
