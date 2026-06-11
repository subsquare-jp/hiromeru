# AGENTS.md

## Project purpose

Hiromeru is a creator-focused advertising posting and discovery service for ad.subsquare.jp.
The product should stay small, durable, and easy for one operator to run.

## Tech stack

- Next.js
- TypeScript
- TailwindCSS
- Firebase
- Firestore
- Firebase Storage
- Firebase Authentication

## MVP scope

Implement only the MVP flows needed for creator ads:

- Ad posting
- Ad list display
- Tag search
- Ad detail modal
- External link navigation

Prefer small task decomposition and Ask Mode before broad changes.

## Do not implement

Do not add these features unless explicitly re-scoped:

- Comments
- Direct messages
- Follow relationships
- Likes
- Rankings
- Recommendations
- New paid billing flows
- High-frequency moderation workflows
- Large UI redesigns

## Firebase rules

- Keep Firebase as the primary backend.
- Prefer Firestore flexibility over premature rigid schema design.
- Do not change Firestore document structure unless the task explicitly requires it.
- Do not change Firebase project configuration unless the task explicitly requires it.
- Do not weaken Firestore or Storage security rules.
- Do not require frequent manual moderation as an operating assumption.
- Use `npx -y firebase-tools@latest` for Firebase CLI commands when Firebase CLI work is required.

## Testing commands

Use the commands that exist in `package.json`:

```bash
npm test
npm run build
```

There is no `lint` script currently. Do not add a new lint or test framework only for a small MVP change unless requested.

## Review checklist

- Confirm the change stays inside MVP scope.
- Confirm no DB schema, Firebase config, or posting data structure changed unintentionally.
- Confirm external links open in a new tab only after any required confirmation UI.
- Confirm every `target="_blank"` link includes `rel="noopener noreferrer"`.
- Confirm click logging happens at the intended user action point.
- Confirm the UI remains close to the existing visual style.
- Confirm `npm test` and `npm run build` pass, or document why they could not run.
