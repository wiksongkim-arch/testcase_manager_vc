/**
 * Three-way merge logic for test case files
 * Supports cell-level conflict detection
 */

export interface TestCase {
  id: string;
  name: string;
  description?: string;
  steps: TestStep[];
  expectedResult?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'draft' | 'active' | 'deprecated';
  [key: string]: any;
}

export interface TestStep {
  id: string;
  order: number;
  description: string;
  expectedResult?: string;
  [key: string]: any;
}

export interface MergeResult {
  success: boolean;
  merged: TestCase[];
  conflicts: MergeConflict[];
}

export interface MergeConflict {
  testCaseId: string;
  field: string;
  baseValue: any;
  localValue: any;
  remoteValue: any;
  resolved?: boolean;
  resolvedValue?: any;
}

/**
 * Three-way merge for test case arrays
 * @param base - Common ancestor version
 * @param local - Local changes
 * @param remote - Remote changes
 * @returns Merge result with conflicts
 */
export function mergeTestCases(
  base: TestCase[],
  local: TestCase[],
  remote: TestCase[]
): MergeResult {
  const merged: TestCase[] = [];
  const conflicts: MergeConflict[] = [];

  // Create maps for quick lookup
  const baseMap = new Map(base.map(tc => [tc.id, tc]));
  const localMap = new Map(local.map(tc => [tc.id, tc]));
  const remoteMap = new Map(remote.map(tc => [tc.id, tc]));

  // Get all unique test case IDs
  const allIds = new Set([...baseMap.keys(), ...localMap.keys(), ...remoteMap.keys()]);

  for (const id of allIds) {
    const baseTc = baseMap.get(id);
    const localTc = localMap.get(id);
    const remoteTc = remoteMap.get(id);

    // Case 1: Deleted in both - skip
    if (!localTc && !remoteTc) {
      continue;
    }

    // Case 2: Deleted in local, modified in remote - conflict
    if (!localTc && remoteTc && baseTc) {
      const remoteChanged = !isEqual(baseTc, remoteTc);
      if (remoteChanged) {
        conflicts.push({
          testCaseId: id,
          field: 'DELETED_LOCALLY_MODIFIED_REMOTELY',
          baseValue: baseTc,
          localValue: null,
          remoteValue: remoteTc,
        });
        // Keep remote version for now
        merged.push(remoteTc);
      }
      continue;
    }

    // Case 3: Deleted in remote, modified in local - conflict
    if (localTc && !remoteTc && baseTc) {
      const localChanged = !isEqual(baseTc, localTc);
      if (localChanged) {
        conflicts.push({
          testCaseId: id,
          field: 'DELETED_REMOTELY_MODIFIED_LOCALLY',
          baseValue: baseTc,
          localValue: localTc,
          remoteValue: null,
        });
        // Keep local version for now
        merged.push(localTc);
      }
      continue;
    }

    // Case 4: Added in local only
    if (localTc && !remoteTc && !baseTc) {
      merged.push(localTc);
      continue;
    }

    // Case 5: Added in remote only
    if (remoteTc && !localTc && !baseTc) {
      merged.push(remoteTc);
      continue;
    }

    // Case 6: Added in both with same ID - merge fields
    if (localTc && remoteTc && !baseTc) {
      const { merged: mergedTc, conflicts: tcConflicts } = mergeTestCaseFields(
        null,
        localTc,
        remoteTc
      );
      merged.push(mergedTc);
      conflicts.push(...tcConflicts);
      continue;
    }

    // Case 7: Modified in both - three-way merge
    if (localTc && remoteTc && baseTc) {
      const { merged: mergedTc, conflicts: tcConflicts } = mergeTestCaseFields(
        baseTc,
        localTc,
        remoteTc
      );
      merged.push(mergedTc);
      conflicts.push(...tcConflicts);
    }
  }

  return {
    success: conflicts.length === 0,
    merged,
    conflicts,
  };
}

/**
 * Merge fields of a single test case
 */
function mergeTestCaseFields(
  base: TestCase | null,
  local: TestCase,
  remote: TestCase
): { merged: TestCase; conflicts: MergeConflict[] } {
  const merged: TestCase = { ...local };
  const conflicts: MergeConflict[] = [];

  // Get all field keys
  const allKeys = new Set([
    ...Object.keys(local),
    ...Object.keys(remote),
    ...(base ? Object.keys(base) : []),
  ]);

  for (const key of allKeys) {
    // Skip internal fields
    if (key.startsWith('_')) continue;

    const baseVal = base ? base[key] : undefined;
    const localVal = local[key];
    const remoteVal = remote[key];

    // If local and remote are the same, no conflict
    if (isEqual(localVal, remoteVal)) {
      merged[key] = localVal;
      continue;
    }

    // If only local changed from base
    if (base && isEqual(remoteVal, baseVal)) {
      merged[key] = localVal;
      continue;
    }

    // If only remote changed from base
    if (base && isEqual(localVal, baseVal)) {
      merged[key] = remoteVal;
      continue;
    }

    // Both changed differently - conflict!
    // Special handling for arrays (like steps, tags)
    if (Array.isArray(localVal) && Array.isArray(remoteVal)) {
      if (key === 'steps') {
        const { merged: mergedSteps, conflicts: stepConflicts } = mergeSteps(
          base?.steps || [],
          localVal,
          remoteVal
        );
        merged[key] = mergedSteps;
        conflicts.push(...stepConflicts.map(c => ({ ...c, testCaseId: local.id })));
      } else if (key === 'tags') {
        // Merge tags (union of both)
        merged[key] = [...new Set([...localVal, ...remoteVal])];
      } else {
        // Generic array conflict
        conflicts.push({
          testCaseId: local.id,
          field: key,
          baseValue: baseVal,
          localValue: localVal,
          remoteValue: remoteVal,
        });
        // Use local as default
        merged[key] = localVal;
      }
    } else {
      // Simple field conflict
      conflicts.push({
        testCaseId: local.id,
        field: key,
        baseValue: baseVal,
        localValue: localVal,
        remoteValue: remoteVal,
      });
      // Use local as default
      merged[key] = localVal;
    }
  }

  return { merged, conflicts };
}

/**
 * Merge test steps with cell-level conflict detection
 */
function mergeSteps(
  base: TestStep[],
  local: TestStep[],
  remote: TestStep[]
): { merged: TestStep[]; conflicts: MergeConflict[] } {
  const merged: TestStep[] = [];
  const conflicts: MergeConflict[] = [];

  // Create maps by step ID
  const baseMap = new Map(base.map(s => [s.id, s]));
  const localMap = new Map(local.map(s => [s.id, s]));
  const remoteMap = new Map(remote.map(s => [s.id, s]));

  const allIds = new Set([...baseMap.keys(), ...localMap.keys(), ...remoteMap.keys()]);

  for (const id of allIds) {
    const baseStep = baseMap.get(id);
    const localStep = localMap.get(id);
    const remoteStep = remoteMap.get(id);

    // Both deleted
    if (!localStep && !remoteStep) continue;

    // Deleted in local
    if (!localStep && remoteStep) {
      if (baseStep && !isEqual(baseStep, remoteStep)) {
        conflicts.push({
          testCaseId: '', // Will be filled by caller
          field: `step:${id}:DELETED_LOCALLY`,
          baseValue: baseStep,
          localValue: null,
          remoteValue: remoteStep,
        });
      }
      merged.push(remoteStep);
      continue;
    }

    // Deleted in remote
    if (localStep && !remoteStep) {
      if (baseStep && !isEqual(baseStep, localStep)) {
        conflicts.push({
          testCaseId: '',
          field: `step:${id}:DELETED_REMOTELY`,
          baseValue: baseStep,
          localValue: localStep,
          remoteValue: null,
        });
      }
      merged.push(localStep);
      continue;
    }

    // Both exist - merge fields
    if (!localStep || !remoteStep) continue;
    
    const mergedStep: TestStep = { ...localStep };
    const stepKeys: (keyof TestStep)[] = ['description', 'expectedResult', 'order'];

    for (const key of stepKeys) {
      const baseVal = baseStep?.[key];
      const localVal = localStep[key];
      const remoteVal = remoteStep[key];

      if (isEqual(localVal, remoteVal)) {
        mergedStep[key] = localVal;
      } else if (baseStep && isEqual(remoteVal, baseVal)) {
        mergedStep[key] = localVal;
      } else if (baseStep && isEqual(localVal, baseVal)) {
        mergedStep[key] = remoteVal;
      } else {
        // Conflict at cell level
        conflicts.push({
          testCaseId: '',
          field: `step:${id}:${key}`,
          baseValue: baseVal,
          localValue: localVal,
          remoteValue: remoteVal,
        });
        mergedStep[key] = localVal; // Default to local
      }
    }

    merged.push(mergedStep);
  }

  // Sort by order
  merged.sort((a, b) => a.order - b.order);

  return { merged, conflicts };
}

/**
 * Deep equality check
 */
function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!isEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

/**
 * Resolve a conflict by choosing a value
 */
export function resolveConflict(
  conflict: MergeConflict,
  choice: 'local' | 'remote' | 'custom',
  customValue?: any
): MergeConflict {
  return {
    ...conflict,
    resolved: true,
    resolvedValue: choice === 'custom' ? customValue : 
                   choice === 'local' ? conflict.localValue : 
                   conflict.remoteValue,
  };
}

/**
 * Apply resolved conflicts to merged test cases
 */
export function applyResolvedConflicts(
  merged: TestCase[],
  conflicts: MergeConflict[]
): TestCase[] {
  const result = [...merged];

  for (const conflict of conflicts) {
    if (!conflict.resolved || conflict.resolvedValue === undefined) continue;

    const tcIndex = result.findIndex(tc => tc.id === conflict.testCaseId);
    if (tcIndex === -1) continue;

    const tc = result[tcIndex];

    // Handle step-level conflicts
    if (conflict.field.startsWith('step:')) {
      const parts = conflict.field.split(':');
      if (parts.length >= 3) {
        const stepId = parts[1];
        const stepField = parts[2];
        
        if (stepField === 'DELETED_LOCALLY' || stepField === 'DELETED_REMOTELY') {
          // Handle deletion conflicts
          continue;
        }

        const stepIndex = tc.steps.findIndex(s => s.id === stepId);
        if (stepIndex !== -1) {
          (tc.steps[stepIndex] as any)[stepField] = conflict.resolvedValue;
        }
      }
    } else {
      // Handle field-level conflicts
      (tc as any)[conflict.field] = conflict.resolvedValue;
    }
  }

  return result;
}
