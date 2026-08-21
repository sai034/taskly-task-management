# Part 2 — Product Understanding: AbleSpace "Take Data" (Caseload)

> Scope note: this write-up is based on the **Caseload** screen provided in the assessment
> (the list of students with the highlighted **Take Data** entry point) plus reasonable
> product reasoning about AbleSpace as a special-education / therapy (SLP, OT) tool where
> practitioners manage a caseload of students and record progress against **IEP goals**.
> Where I infer a step I couldn't directly click through, I say so.

---

## 1. What this screen is

The **Caseload** tab (under **CAPTURE** in the left rail) is the practitioner's home base. It
lists every student they serve in a table with the columns:

`Full Name · Last Name · IEP Due · Eval Due · Collaborators · Service Time · School · Actions`

Above the table are three scopes — **Students (15)**, **Groups (12)**, **Unassigned (39)** — a
**Search students** box, and **Add Student**. Each row ends with a primary **Take Data** button
and an overflow (`⋮`) menu.

The screen answers the two questions a therapist has at the start of a session: *who am I seeing*
and *what's due* (IEP/Eval dates), and then gives a one-click path into the actual work:
**Take Data**.

## 2. The "Take Data" workflow (in my own words)

1. **Find the student.** From the Caseload list the practitioner locates the student (scroll,
   search, or the Students/Groups tabs). The at-a-glance columns — IEP Due, Eval Due, Service
   Time, Collaborators — help them prioritise who needs attention.
2. **Enter data-collection mode.** Clicking **Take Data** on that row opens the student's
   data-taking session. This is the core capture surface: it lists that student's **IEP goals /
   objectives**, each with a way to record a trial result.
3. **Record trials during the session.** For each goal the practitioner logs performance —
   typically tallies of correct / incorrect / prompted responses, percentages, or rating scales,
   often across multiple trials, while the session is happening.
4. **Add context.** Session notes, the prompt level used, accommodations applied, and which
   goals were targeted are captured alongside the numbers.
5. **Save the session.** The data is written to the student's record so it rolls up into
   **Data**, **Report**, and progress-monitoring views, and feeds **Billing / Service Time**.

So the mental model is: **Caseload = the roster and the launcher; Take Data = the per-student
capture form used live during therapy.** The Caseload screen's job is to get the practitioner
into the right student's Take Data session as fast as possible.

## 3. What works well

- **The primary action is obvious.** "Take Data" is a filled button repeated on every row — the
  main job-to-be-done is always one click away, and it's consistent.
- **Deadline-first columns.** Leading with IEP Due and Eval Due surfaces the most
  time-sensitive information for compliance-driven work.
- **Scannable roster.** Collaborators as avatars and a compact table keep a large caseload
  legible; Students/Groups/Unassigned scopes match how caseloads are really organised.
- **Clear IA.** Grouping the rail into CAPTURE / TRACK / MISC maps to the workflow (record →
  review → admin).

## 4. UX / UI improvements I'd suggest

1. **Make deadlines pop with urgency.** IEP/Eval dates are plain text. Color-code by proximity
   (e.g. red < 7 days, amber < 30, muted otherwise) and add a relative hint ("in 4 days"). This
   turns the most important columns into a glanceable triage signal.
2. **Bulk actions on selected students.** There's a leading checkbox column but no visible bulk
   bar. Selecting several students should reveal actions like *assign collaborator*, *set service
   time*, or *export* — common for managing 15+ students.
3. **Group / session Take Data.** Many therapists see students in **groups**. A "Take Data for
   group" flow (record for several students in one session) would remove a lot of repetition and
   matches the Groups tab that already exists.
4. **Sticky header + column controls.** With a long caseload, freeze the header row and the
   Actions column while scrolling, and let users sort (by IEP Due especially) and show/hide
   columns.
5. **Row density + quick preview.** Offer a comfortable/compact density toggle, and let clicking
   a name open a lightweight student peek (goals, last session, next due) without leaving the list.
6. **Empty / loading / overdue states.** Explicit states — an onboarding empty state for a new
   caseload, skeleton rows while loading, and an "overdue" badge — reduce ambiguity.
7. **Accessibility polish.** Ensure the avatar collaborator stacks have accessible names, the
   table has proper header semantics and keyboard navigation, and the "Take Data" buttons have
   distinct accessible labels (e.g. "Take data for Max Planck") since the visible text repeats.
8. **Search that matches the mental model.** Allow searching by more than name — school, goal
   keyword, or "due this week" — and keep the query in the URL so a filtered caseload is shareable/bookmarkable.

## 5. Functionality improvements I'd suggest

1. **"Due this week" / smart views.** A saved filter or dashboard card that pulls students with
   imminent IEP/Eval dates or missing recent data — proactive rather than manual scanning.
2. **Resume last session.** If a Take Data session was interrupted, offer "Resume" on the row so
   no trials are lost.
3. **Offline-first capture.** Therapy rooms have poor connectivity; Take Data should buffer
   locally and sync later so data is never lost mid-session.
4. **Quick-add trial from the list.** A tiny inline "+1 correct / +1 incorrect" affordance for a
   student's *primary* goal, for fast tallying without opening the full session.
5. **Progress signal in the row.** A small sparkline or on-track/at-risk indicator per student
   would let practitioners triage by *progress*, not just by *due date*.
6. **Templates & reuse.** Let practitioners reuse goal/data-collection templates across similar
   students to cut setup time.
7. **Reminders & nudges.** Notify when an IEP/Eval is approaching or when a student hasn't had
   data recorded in N sessions.

## 6. Summary

The Caseload screen is a well-structured launcher whose strongest quality is that the core
action — **Take Data** — is unmistakable and always one click away. The biggest opportunities are
(a) turning the compliance-critical **due dates** into an active triage signal, (b) supporting the
**group / bulk** realities of a real caseload, and (c) making capture **resilient** (offline,
resumable) and **proactive** (smart "due/at-risk" views) so practitioners spend less time
navigating and more time with students.
