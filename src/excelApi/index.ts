import express from "express";
import { z } from "zod";
import { readWorkbookFromRepo, writeWorkbookToRepo } from "./excelService.js";

const app = express();
app.use(express.json());

const payloadSchema = z.object({
  sheetName: z.string().optional(),
  row: z.number().int().min(1),
  values: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
});

app.post("/api/update-row", async (req, res) => {
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

  const { sheetName, row, values } = parsed.data;

  try {
    const { workbook, sha } = await readWorkbookFromRepo();

    const ws = sheetName ? workbook.getWorksheet(sheetName) ?? workbook.addWorksheet(sheetName) : (workbook.worksheets[0] ?? workbook.addWorksheet("Sheet1"));
    const targetRow = ws.getRow(row);

    for (const [col, val] of Object.entries(values)) {
      targetRow.getCell(col).value = val as any;
    }
    targetRow.commit();

    const commit = await writeWorkbookToRepo(workbook, sha, `Update row ${row} via API`);
    return res.json({ ok: true, commit });
  } catch (err: any) {
    if (err.message === "SHA_MISMATCH") {
      return res.status(409).json({ error: "File changed upstream. Please retry." });
    }
    console.error(err);
    return res.status(500).json({ error: "internal_error", detail: err.message });
  }
});

const port = Number(process.env.APP_PORT || 3000);
app.listen(port, () => console.log(`Excel API listening on ${port}`));
