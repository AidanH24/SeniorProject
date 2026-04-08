import ExcelJS from "exceljs";
import { getFileContent, updateFileContent } from "./githubClient.js";

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH!;
const PATH = process.env.EXCEL_PATH!;

export async function readWorkbookFromRepo() {
  const { buffer, sha } = await getFileContent(OWNER, REPO, PATH, BRANCH);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  return { workbook, sha };
}

export async function writeWorkbookToRepo(workbook: ExcelJS.Workbook, previousSha: string, commitMessage = "Update workbook") {
  const outBuf = await workbook.xlsx.writeBuffer();
  try {
    const res = await updateFileContent(OWNER, REPO, PATH, Buffer.from(outBuf), commitMessage, previousSha, BRANCH);
    return res;
  } catch (err: any) {
    if (err.status === 409 || (err.message && err.message.includes("sha"))) {
      const e = new Error("SHA_MISMATCH");
      // @ts-ignore
      e.cause = err;
      throw e;
    }
    throw err;
  }
}
