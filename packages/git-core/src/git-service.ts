import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface GitCredentials {
  username: string;
  password: string;
}

export interface GitAuthor {
  name: string;
  email: string;
}

export interface PullResult {
  success: boolean;
  conflicts: string[];
  message?: string;
}

export interface GitStatus {
  staged: string[];
  unstaged: string[];
  untracked: string[];
  conflicted: string[];
}

export interface CommitInfo {
  oid: string;
  message: string;
  author: {
    name: string;
    email: string;
    timestamp: number;
  };
  committer: {
    name: string;
    email: string;
    timestamp: number;
  };
}

export class GitService {
  /**
   * Clone a repository
   */
  async clone(
    repoUrl: string,
    localPath: string,
    credentials?: GitCredentials
  ): Promise<void> {
    await fs.ensureDir(localPath);
    
    const options: any = {
      fs,
      http,
      dir: localPath,
      url: repoUrl,
      singleBranch: false,
      depth: 1,
    };

    if (credentials) {
      options.onAuth = () => ({
        username: credentials.username,
        password: credentials.password,
      });
    }

    await git.clone(options);
  }

  /**
   * Initialize a new repository
   */
  async init(localPath: string): Promise<void> {
    await fs.ensureDir(localPath);
    await git.init({ fs, dir: localPath, defaultBranch: 'main' });
  }

  /**
   * Add a file to staging
   */
  async add(localPath: string, filepath: string): Promise<void> {
    await git.add({ fs, dir: localPath, filepath });
  }

  /**
   * Add all files to staging
   */
  async addAll(localPath: string): Promise<void> {
    const status = await git.statusMatrix({ fs, dir: localPath });
    
    for (const [filepath, headStatus, workdirStatus, stageStatus] of status) {
      // If file is modified or untracked, add it
      if (workdirStatus !== 1 || stageStatus !== 1) {
        await git.add({ fs, dir: localPath, filepath });
      }
    }
  }

  /**
   * Commit changes
   */
  async commit(
    localPath: string,
    message: string,
    author: GitAuthor
  ): Promise<string> {
    const oid = await git.commit({
      fs,
      dir: localPath,
      message,
      author: {
        name: author.name,
        email: author.email,
      },
    });
    return oid;
  }

  /**
   * Push to remote
   */
  async push(
    localPath: string,
    remote: string,
    branch: string,
    credentials?: GitCredentials
  ): Promise<void> {
    const options: any = {
      fs,
      http,
      dir: localPath,
      remote,
      ref: branch,
    };

    if (credentials) {
      options.onAuth = () => ({
        username: credentials.username,
        password: credentials.password,
      });
    }

    await git.push(options);
  }

  /**
   * Pull from remote
   */
  async pull(
    localPath: string,
    remote: string,
    branch: string,
    credentials?: GitCredentials
  ): Promise<PullResult> {
    try {
      const options: any = {
        fs,
        http,
        dir: localPath,
        remote,
        ref: branch,
        fastForwardOnly: false,
      };

      if (credentials) {
        options.onAuth = () => ({
          username: credentials.username,
          password: credentials.password,
        });
      }

      await git.pull(options);

      // Check for conflicts after pull
      const conflicts = await this.getConflicts(localPath);

      return {
        success: true,
        conflicts,
      };
    } catch (error: any) {
      // Check if it's a merge conflict error
      if (error.message && error.message.includes('merge')) {
        const conflicts = await this.getConflicts(localPath);
        return {
          success: false,
          conflicts,
          message: error.message,
        };
      }
      throw error;
    }
  }

  /**
   * Get list of branches
   */
  async getBranches(localPath: string): Promise<string[]> {
    const branches = await git.listBranches({ fs, dir: localPath });
    return branches;
  }

  /**
   * Create a new branch
   */
  async createBranch(localPath: string, branchName: string): Promise<void> {
    await git.branch({ fs, dir: localPath, ref: branchName, checkout: false });
  }

  /**
   * Checkout a branch or commit
   */
  async checkout(localPath: string, ref: string): Promise<void> {
    await git.checkout({ fs, dir: localPath, ref });
  }

  /**
   * Get repository status
   */
  async getStatus(localPath: string): Promise<GitStatus> {
    const status = await git.statusMatrix({ fs, dir: localPath });
    
    const result: GitStatus = {
      staged: [],
      unstaged: [],
      untracked: [],
      conflicted: [],
    };

    for (const [filepath, headStatus, workdirStatus, stageStatus] of status) {
      // headStatus: 0=absent, 1=unchanged, 2=modified, 3=deleted
      // workdirStatus: 0=absent, 1=unchanged, 2=modified, 3=deleted
      // stageStatus: 0=absent, 1=unchanged, 2=modified, 3=deleted

      // Conflict detection: workdir and stage both modified differently
      if (workdirStatus === 2 && stageStatus === 2) {
        result.conflicted.push(filepath);
      } else if (stageStatus !== 1) {
        // Staged changes
        result.staged.push(filepath);
      } else if (workdirStatus === 2) {
        // Modified but not staged
        result.unstaged.push(filepath);
      } else if (headStatus === 0 && workdirStatus !== 0) {
        // Untracked file
        result.untracked.push(filepath);
      }
    }

    return result;
  }

  /**
   * Get conflicted files
   */
  async getConflicts(localPath: string): Promise<string[]> {
    const status = await git.statusMatrix({ fs, dir: localPath });
    const conflicts: string[] = [];

    for (const [filepath, headStatus, workdirStatus, stageStatus] of status) {
      // Conflict: both workdir and stage have modifications
      if (workdirStatus === 2 && stageStatus === 2) {
        conflicts.push(filepath);
      }
    }

    return conflicts;
  }

  /**
   * Get commit history
   */
  async getCommitHistory(
    localPath: string,
    ref: string = 'HEAD',
    depth: number = 10
  ): Promise<CommitInfo[]> {
    const commits = await git.log({
      fs,
      dir: localPath,
      ref,
      depth,
    });

    return commits.map((commit: any) => ({
      oid: commit.oid,
      message: commit.commit.message,
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        timestamp: commit.commit.author.timestamp,
      },
      committer: {
        name: commit.commit.committer.name,
        email: commit.commit.committer.email,
        timestamp: commit.commit.committer.timestamp,
      },
    }));
  }

  /**
   * Check if a directory is a git repository
   */
  async isRepo(localPath: string): Promise<boolean> {
    try {
      await git.findRoot({ fs, filepath: localPath });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(localPath: string): Promise<string> {
    const branch = await git.currentBranch({ fs, dir: localPath, fullname: false });
    return branch || 'HEAD';
  }
}
