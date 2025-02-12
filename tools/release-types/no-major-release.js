// tools/release-types/no-major-release.js

const { Node } = require('release-please/build/src/releasers/node');
const { parseConventionalCommits } = require('release-please/build/src/commit-message/parse');
const { maxBumpType, BumpType } = require('release-please/build/src/util/versioning');

class NoMajorNode extends Node {
  /**
   * Override how we determine the bump from commits.
   *
   * Instead of the standard "BREAKING CHANGE => major," we do "BREAKING => minor."
   * Also, we ensure `chore`, `fix` => patch, and `feat`, `breaking`, `deprecate` => minor.
   */
  async _detectSemanticCommits(commits) {
    // parseConventionalCommits is the built-in parser that returns an array of conventional commit info
    const cc = parseConventionalCommits(commits);

    // Start from no bump (patch is the smallest, but let's store as 'undefined' for clarity)
    let bump = BumpType.PATCH; // or BumpType.PATCH by default

    for (const commit of cc) {
      const type = commit.type;
      // By default, release-please uses fix => patch, feat => minor, "BREAKING" => major
      // We'll override that logic.

      if (type === 'feat' || type === 'breaking' || type === 'deprecate') {
        // We interpret these as "minor"
        bump = maxBumpType(bump, BumpType.MINOR);
      } else if (type === 'chore' || type === 'fix') {
        // patch is the default, so just ensure we never go bigger than minor from these
        bump = maxBumpType(bump, BumpType.PATCH);
      }

      // If the commit has BREAKING CHANGE notes, normally we do major
      // but we want to ignore that => treat as minor at most.
      // So we do NOT do the normal "commit.breaking = major" logic
    }

    return bump;
  }
}

module.exports = { NoMajorNode };
