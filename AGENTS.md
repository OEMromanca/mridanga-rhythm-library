<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Account state lives in one root AccountProvider, with a single auth subscription and server-validated user checks, so all public pages reflect the same session.
- Account forms share auth UI and account helpers; Cloud Auth owns identities, keeping profile-free accounts separate from the browser-only mantra prototype.
- Keep the library public and account pages at top-level routes; no private data access has been introduced by adding sign-in.
