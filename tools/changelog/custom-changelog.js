const { DefaultChangelogNotes } = require('release-please/build/src/changelog-notes/default');

class CustomChangelog extends DefaultChangelogNotes {
  _groupCommits(conventionalCommits) {
    const groups = {
      fix: { title: 'Bug Fixes', commits: [] },
      feat: { title: 'Features', commits: [] },
      breaking: { title: 'Breaking Changes (via `breaking:`)', commits: [] },
      deprecate: { title: 'Deprecations', commits: [] },
      others: { title: 'Other Changes', commits: [] },
    };

    for (const commit of conventionalCommits) {
      switch (commit.type) {
        case 'fix':
          groups.fix.commits.push(commit);
          break;
        case 'feat':
          groups.feat.commits.push(commit);
          break;
        case 'breaking':
          groups.breaking.commits.push(commit);
          break;
        case 'deprecate':
          groups.deprecate.commits.push(commit);
          break;
        default:
          groups.others.commits.push(commit);
      }
    }

    const orderedGroups = [];
    if (groups.fix.commits.length) orderedGroups.push(groups.fix);
    if (groups.feat.commits.length) orderedGroups.push(groups.feat);
    if (groups.breaking.commits.length) orderedGroups.push(groups.breaking);
    if (groups.deprecate.commits.length) orderedGroups.push(groups.deprecate);
    if (groups.others.commits.length) orderedGroups.push(groups.others);
    return orderedGroups;
  }
}

module.exports = { CustomChangelog };
