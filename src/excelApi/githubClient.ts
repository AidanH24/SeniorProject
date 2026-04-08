import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

export async function getFileContent(owner: string, repo: string, path: string, ref?: string) {
  const res = await octokit.repos.getContent({ owner, repo, path, ref });
  // res.data can be an array for directories; expect a file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const file: any = Array.isArray(res.data) ? res.data[0] : res.data;

  if (!file || typeof file.content !== "string") {
    throw new Error(`File content not found for ${owner}/${repo}/${path} (ref=${ref})`);
  }

  // Explicitly treat content as string so Buffer.from's overloads match
  const contentBase64 = file.content as string;
  const buffer = Buffer.from(contentBase64, "base64");
  return { buffer, sha: file.sha as string };
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
