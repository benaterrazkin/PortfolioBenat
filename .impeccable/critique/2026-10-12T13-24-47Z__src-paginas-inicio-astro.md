---
target: la web (portada, estante y cuadernos)
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\BEÑAT\\Desktop\\portfolio\\GitHub\\PortfolioBenat\\src\\paginas\\Inicio.astro"
target_fingerprint: "sha256:4dd2ca8067030423105e2e48f66586ad6dba16f5ec5877030fced7b463743124"
target_path: "C:\\Users\\BEÑAT\\Desktop\\portfolio\\GitHub\\PortfolioBenat\\src\\paginas\\Inicio.astro"
timestamp: 2026-10-12T13-24-47Z
slug: src-paginas-inicio-astro
---
Method: dual-agent (A: design review · B: detector)

## Design Health Score: 25/40 (Acceptable, high)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | No visible page counter in the notebook; nav marked Proyectos while on the hero |
| 2 | Match system / real world | 3 | Shelf + notebook fit; half-empty table beside the cover reads as broken |
| 3 | User control and freedom | 3 | Esc, Back, close, prev/next, deep links |
| 4 | Consistency and standards | 3 | Project title twice in dialog; English course names in Spanish UI |
| 5 | Error prevention | 3 | Form validation fine |
| 6 | Recognition rather than recall | 2 | Prev/next without destination; subtitulo never shown |
| 7 | Flexibility and efficiency | 3 | Keyboard, deep links, PDFs in 4 languages |
| 8 | Aesthetic and minimalist design | 2 | Hero fills first screen; empty half of notebook dialog; provisional diagram twice |
| 9 | Error recovery | 3 | Form error offers email fallback |
| 10 | Help and documentation | 1 | Page-turn hint exists in i18n but never rendered |

## Design specificity
Wrapper (shelf, notebook, drawing-office lettering) is authored; the work itself is hidden: renders only on hover, never on mobile; five near-identical provisional diagrams. Detector: 1 advisory (em-dash-overuse in Cara.astro), false positive (counts CSS `--` vars and BEM modifiers).

## Priority issues
1. [P1] Work not visible first: covers show provisional diagrams, renders hidden on touch, no subtitulo. Fix: render strip always visible, subtitulo. (layout, bolder)
2. [P1] First screen has no work: hero fills 900px viewport. Fix: compact hero, positioning line. (layout, distill)
3. [P1] Notebook has no affordance/status: opens on cover, no counter, no hint, invisible tap zones. Fix: open on ficha+text, counter, chevrons, hint, named prev/next. (onboard, clarify)
4. [P2] Copy vs honesty: "académicos y profesionales", English course names, "Arquitecto" title while master in progress. (clarify)
5. [P2] 9px low-contrast text on cardboard cover; red on corcho below AA; muddy taupe table. (typeset, quieter)

## Persona red flags
- Jordan: hidden hover reveal and page-turn; half-empty dialog.
- Casey: no render on mobile shelf; invisible tap strips.
- Sam: render alt dropped on shelf; dialog labelled generically; 9px low-contrast text.
- Studio partner: 2 minutes yield name, photo, software list, six similar diagrams; likely jumps to PDF.

## Questions
- Should the web resemble the PDF spreads?
- Model photos above the fold for "del dibujo a la maqueta"?
- Is the notebook metaphor for the visitor or the author?
