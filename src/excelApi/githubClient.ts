import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

export async function getFileContent(owner: string, repo: string, path: string, ref?: string) {
  const res = await octokit.repos.getContent({ owner, repo, path, ref });
  // @ts-ignore
  const file = Array.isArray(res.data) ? res.data[0] : res.data;
  if (!("content" in file)) throw new Error("Unexpected content response");
  const buffer = Buffer.from(file.content, "base64");
  return { buffer, sha: file.sha, encoding: file.encoding };
}

export async function updateFileContent(
  owner: string,
  repo: string,
  path: string,
  contentBuffer: Buffer,
  message: string,
  sha: string,
  branch?: string
) {
  const content = contentBuffer.toString("base64");
  const params: any = { owner, repo, path, message, content, sha };
  if (branch) params.branch = branch;
  const res = await octokit.repos.createOrUpdateFileContents(params);
  return res.data;
}
