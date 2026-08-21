import { LegalSection, LegalShell } from "@/components/legal/LegalShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Taskly",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="August 21, 2026"
      intro="This policy explains what information Taskly handles and how it is used. We aim to collect as little as possible."
    >
      <LegalSection heading="1. Information we handle">
        <p>
          When you use Taskly as a guest, we create a minimal profile (a display name and demo
          email) so the workspace renders correctly. We do not ask for a password. The tasks,
          projects, and comments you create are stored to power the app.
        </p>
      </LegalSection>

      <LegalSection heading="2. How we use it">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>to operate the app and show your workspace back to you;</li>
          <li>to remember your preferences (theme, view options);</li>
          <li>to keep you signed in across page refreshes.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Where data is stored">
        <p>
          Preferences and your session are stored in your browser’s <code>localStorage</code>.
          Task and project data is stored by the application’s backend API. No analytics or
          advertising trackers are used.
        </p>
      </LegalSection>

      <LegalSection heading="4. Cookies & local storage">
        <p>
          Taskly uses local storage (not tracking cookies) to persist your theme, view settings,
          and session token on your device. Clearing your browser storage removes them.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data retention">
        <p>
          Guest/demo workspaces are ephemeral and may be reset or re-seeded periodically. You can
          remove your local data at any time by logging out and clearing your browser storage.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your choices">
        <p>
          You can log out at any time from the workspace menu, edit your profile details, and
          leave the workspace from the Profile page. Because guest data is minimal and local, you
          remain in control of it.
        </p>
      </LegalSection>

      <LegalSection heading="7. Changes to this policy">
        <p>
          We may update this policy as the product evolves. Material changes will be reflected by
          updating the “Last updated” date above.
        </p>
      </LegalSection>

      <LegalSection heading="8. Contact">
        <p>
          Questions about your privacy? Contact us at{" "}
          <a
            href="mailto:privacy@taskly.app"
            className="text-accent underline underline-offset-2"
          >
            privacy@taskly.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
