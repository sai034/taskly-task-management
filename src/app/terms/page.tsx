import { LegalSection, LegalShell } from "@/components/legal/LegalShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Taskly",
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      updated="August 21, 2026"
      intro="Welcome to Taskly. By accessing or using the app you agree to these terms. Please read them carefully."
    >
      <LegalSection heading="1. Acceptance of terms">
        <p>
          By clicking “Continue as Guest”, signing in, or otherwise using Taskly, you agree to be
          bound by these Terms of Service. If you do not agree, please do not use the app.
        </p>
      </LegalSection>

      <LegalSection heading="2. Using the service">
        <p>
          Taskly lets you organise tasks and projects across board and list views. You may use it
          as a guest, in which case a lightweight session is created so your workspace loads
          correctly. You are responsible for the activity that occurs under your session.
        </p>
      </LegalSection>

      <LegalSection heading="3. Guest accounts">
        <p>
          Guest access is provided for convenience and evaluation. Guest sessions may be reset,
          and data associated with a demo workspace may be periodically re-seeded. Do not store
          information you cannot afford to lose in a guest workspace.
        </p>
      </LegalSection>

      <LegalSection heading="4. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>use the service for any unlawful purpose or in violation of any regulation;</li>
          <li>attempt to disrupt, overload, or gain unauthorised access to the service;</li>
          <li>upload content that infringes the rights of others.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Your content">
        <p>
          You retain ownership of the tasks, projects, and comments you create. You grant Taskly
          the permissions necessary to store and display that content back to you as part of
          operating the service.
        </p>
      </LegalSection>

      <LegalSection heading="6. Disclaimer & limitation of liability">
        <p>
          The service is provided “as is” without warranties of any kind. To the maximum extent
          permitted by law, Taskly is not liable for any indirect or consequential damages arising
          from your use of the app.
        </p>
      </LegalSection>

      <LegalSection heading="7. Changes to these terms">
        <p>
          We may update these terms from time to time. Continued use of the service after changes
          take effect constitutes acceptance of the revised terms.
        </p>
      </LegalSection>

      <LegalSection heading="8. Contact">
        <p>
          Questions about these terms? Reach out at{" "}
          <a
            href="mailto:hello@taskly.app"
            className="text-accent underline underline-offset-2"
          >
            hello@taskly.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
