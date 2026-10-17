# Saving milestones to GitHub

The local project directory is the working copy. Git records meaningful checkpoints as commits, and pushing sends those commits to the GitHub repository. Saving a file alone does not upload it.

## Milestone workflow

1. Finish a coherent change, such as adding a complete topic or fixing mobile navigation.
2. Review `git status` and `git diff`. Check new files too. Keep credentials, `.env` files, local browser data, `node_modules`, and `.next` out of Git.
3. Run appropriate checks. For application changes:

   ```sh
   pnpm typecheck
   pnpm build
   pnpm start --port 3100
   ```

   Leave the verification server running while you run the existing smoke suite in another terminal. In PowerShell:

   ```powershell
   $env:BASE_URL = 'http://127.0.0.1:3100'
   pnpm test
   ```

   Stop that verification server with Ctrl+C when finished. Keep your normal preview server running. Development output uses `.next-preview` and production output uses `.next`, so a production validation build can run while the development preview stays available.

4. Stage only the files belonging to the milestone, review the staged diff, and commit:

   ```sh
   git add <files-for-this-milestone>
   git diff --cached
   git commit -m "feat: describe the completed milestone"
   git push
   ```

5. Verify the commit appears on GitHub. Use messages such as `feat: add a second Chemistry lesson`, `fix: preserve notes while changing topics`, or `docs: explain the study workflow`.

You can ask Codex to **“Save this milestone to GitHub.”** The repository's `AGENTS.md` also records your preference to commit and push completed milestones during future work. This is an instruction for active work on this project, not a background synchronization service.

## Authentication

Use the official GitHub CLI and its browser sign-in flow:

```sh
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
gh auth status
```

Complete sign-in in the browser yourself. Do not put a password or access token in source files, Git remote URLs, or chat. Use the operating system credential store. See [GitHub's authentication documentation](https://cli.github.com/manual/gh_auth_login).

The GitHub integration in Codex is optional and separate from the local Git CLI's authentication. Connecting the integration alone does not configure this working copy's remote or upload local files.

## Public repository reminder

The requested repository is public: anything committed and pushed can be read by anyone. Personal notes currently stay in browser storage and are not part of the project source. GitHub hosts the code; starting the website locally still requires the local server unless a later milestone adds deployment.
