// Git Core - Main exports
export { GitService } from './git-service';
export type {
  GitCredentials,
  GitAuthor,
  PullResult,
  GitStatus,
  CommitInfo,
} from './git-service';

export {
  mergeTestCases,
  resolveConflict,
  applyResolvedConflicts,
} from './merge';
export type {
  TestCase,
  TestStep,
  MergeResult,
  MergeConflict,
} from './merge';
