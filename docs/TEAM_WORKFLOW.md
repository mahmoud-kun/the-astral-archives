# CASE:404 — Team and Chat Workflow

Last updated: 2026-10-29

## Team ownership

- **Technical Owner (Mahmoud):** architecture, implementation, integration, correctness, QA.
- **Designer:** visuals, UX direction, assets, animations, audio handoffs.
- **Data Analyst / Content Owner:** NASA primary-source research, mission content, evidence, narrative, scientific accuracy and source traceability.

This corrects the owner labels inside the unmodified original designer handoff. No extra team positions are assumed.

## One repo, two chat responsibilities

- **Main Chat:** resolves OPEN decisions, manages scope, approves architecture/story changes and accepts Technical handoffs.
- **Technical Chat:** reads the repo, scopes a single batch, implements approved change, tests relevant behavior, produces a concise report, and stops without merging by default.
- No complicated ERP-style issue bureaucracy, extra agents, micro-approvals, or unrelated workstreams. GitHub issues/PRs only if they provide useful review/history.

## Parallel handoff model

- Content owns mission IDs and structured content conforming to `docs/CONTENT_CONTRACT.md`; changes needing engine semantics are proposed, not silently introduced.
- Designer owns assets conforming to `docs/ASSET_CONTRACT.md`; missing final media has explicit placeholders with the same asset IDs.
- Engineer builds scene and simulation interfaces against approved sample fixtures. Asset replacement and case addition must not trigger changes to unrelated engine modules.
- All changes to contracts are recorded in docs, announced to both owners, and schema/version changes must have a migration or a small coordinated change.

## Batch handoff template

```
Goal:
Approved scope and decision IDs:
Files changed:
Tests actually run, results and environment:
Unverified items or risks:
Expected integration inputs:
Decision needed from Main (if any):
```

## Source safety

- No secret keys, credentials, confidential content, third-party unlicensed graphics/audio or false NASA endorsements in commits.
- NASA historical data and fictional reconstructed content must be distinguishable.
- Never merge/delete other team members' work unilaterally; review content or visual ownership changes with that owner.
