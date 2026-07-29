"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, PencilSimple, Warning } from "@phosphor-icons/react";
import { OryxMark } from "@/components/brand/OryxMark";
import { Action } from "@/components/ui/Action";
import { JOURNEYS, type Service, type Step } from "@/lib/content";
import { useExperience, type Details } from "@/lib/store";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One question per screen, shaped to the service.
 *
 * The journey sits on the dark stage with no picture behind it. The
 * only thing that responds to progress is a low accent wash rising from
 * the foot of the screen, so the surface warms as the brief becomes
 * complete without ever competing with the question.
 *
 * Composition: the question holds a column of its own at display scale,
 * with the step numeral set in the display face beside it, and the
 * options answer it from the wider column. Position is carried by a
 * segmented rail across the top edge, one segment per question, so the
 * visitor can see where they are and how much is left without reading
 * a number.
 *
 * Colour note. Every value below resolves from the palette variables.
 * The accent carries rules, numerals, edges and fills, never a word,
 * because none of the three accents clears 4.5:1 as text on its base.
 */
export function Journey({ service }: { service: Service }) {
  const steps = JOURNEYS[service.id];
  const reduce = useReducedMotion();

  const step = useExperience((s) => s.step);
  const setStep = useExperience((s) => s.setStep);
  const reviewing = useExperience((s) => s.reviewing);
  const setReviewing = useExperience((s) => s.setReviewing);
  const answers = useExperience((s) => s.answers);
  const setAnswer = useExperience((s) => s.setAnswer);
  const toggleAnswer = useExperience((s) => s.toggleAnswer);
  const details = useExperience((s) => s.details);
  const setDetails = useExperience((s) => s.setDetails);
  const backToGateway = useExperience((s) => s.backToGateway);
  const status = useExperience((s) => s.status);
  const setStatus = useExperience((s) => s.setStatus);
  const errorMessage = useExperience((s) => s.errorMessage);
  const closeContact = useExperience((s) => s.closeContact);
  const resetRequest = useExperience((s) => s.resetRequest);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState("");

  const index = Math.min(step, steps.length - 1);
  const current = steps[index];
  const progress = reviewing ? 1 : (index + 1) / (steps.length + 1);

  const validateDetails = () => {
    const next: Record<string, string> = {};
    if (!details.name.trim()) next.name = "We need a name to reply to.";
    if (!details.company.trim())
      next.company = "Tell us which company this is for.";
    if (details.contactPreference === "phone") {
      if (!details.phone.trim()) next.phone = "Add a number we can call.";
    } else if (!EMAIL.test(details.email)) {
      next.email = "That email address does not look complete.";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const advance = () => {
    if (current.kind === "details") {
      if (!validateDetails()) return;
      setReviewing(true);
      return;
    }
    setStep(index + 1);
  };

  const back = () => {
    if (reviewing) {
      setReviewing(false);
      return;
    }
    if (index === 0) {
      backToGateway();
      return;
    }
    setStep(index - 1);
  };

  const submit = async () => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: service.id, answers, details }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        reference?: string;
        error?: string;
        errors?: Record<string, string>;
      };
      if (!res.ok || !data.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
          setReviewing(false);
          setStep(steps.length - 1);
        }
        setStatus("error", data.error ?? "Some details still need attention.");
        return;
      }
      setReference(data.reference ?? "");
      setStatus("success");
    } catch {
      setStatus(
        "error",
        "We could not send that just now. Your answers are safe. Try again.",
      );
    }
  };

  const canContinue = useMemo(() => {
    if (current.kind === "single") return Boolean(answers[current.id]);
    return true;
  }, [current, answers]);

  if (status === "success") {
    return (
      <Success
        reference={reference}
        onClose={() => {
          closeContact();
          resetRequest();
        }}
      />
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* The environment responds to how complete the brief is. One
          wash, rising from the foot of the screen, built from the
          palette accent so it is correct in every palette. */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 68% at 50% 118%, rgba(var(--accent-rgb), 0.5), transparent 70%)",
          }}
          initial={false}
          animate={{ opacity: 0.06 + progress * 0.16 }}
          transition={{ duration: reduce ? 0.2 : 1.1, ease: EASE }}
        />
      </div>

      {/* Position and remainder, read as a shape before it is read as a
          number. One segment per question, filled to where you stand. */}
      <div className="relative z-10 shrink-0">
        <div className="flex gap-px" aria-hidden="true">
          {steps.map((s, i) => {
            const done = reviewing || i <= index;
            return (
              <span
                key={s.id}
                className="block h-[2px] flex-1 bg-[color:var(--line)]"
              >
                <motion.span
                  className="block h-full w-full origin-left bg-[color:var(--accent)]"
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.55, ease: EASE }}
                />
              </span>
            );
          })}
        </div>

        <div className="border-b border-[color:var(--line-soft)] px-6 sm:px-10 lg:px-14">
          <div className="mx-auto flex w-full max-w-[104rem] items-center justify-between gap-6 py-4">
            <p className="t-label truncate">{service.name}</p>
            <p className="t-index shrink-0 text-[0.6875rem] text-[color:var(--ink-muted)]">
              {reviewing
                ? "SUMMARY"
                : `${pad(index + 1)} / ${pad(steps.length)}`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
        <div className="mx-auto w-full max-w-[104rem]">
          <AnimatePresence mode="wait">
            {reviewing ? (
              <motion.div
                key="summary"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18 }}
                transition={{ duration: reduce ? 0.25 : 0.6, ease: EASE }}
              >
                <Summary
                  service={service}
                  steps={steps}
                  onEdit={(i) => {
                    setReviewing(false);
                    setStep(i);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key={current.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 34 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -34 }}
                transition={{ duration: reduce ? 0.25 : 0.55, ease: EASE }}
                className="grid gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <div className="lg:col-span-5">
                  <div className="flex items-start gap-5">
                    {/* The step numeral in the display face. A numeral
                        is one of the few things the accent is allowed to
                        carry, and it repeats the counter in the rail, so
                        nothing depends on reading it. */}
                    <span
                      className="t-display-xs shrink-0 pt-1 text-[clamp(1.5rem,2.2vw,2.1rem)] leading-none text-[color:var(--accent)]"
                      aria-hidden="true"
                    >
                      {pad(index + 1)}
                    </span>
                    <div className="min-w-0">
                      <h2 className="t-display-sm max-w-[18ch] text-[clamp(1.9rem,4vw,3.4rem)]">
                        {current.prompt}
                      </h2>

                      {current.help ? (
                        <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-[color:var(--ink-muted)]">
                          {current.help}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  {current.kind === "single" ? (
                    <SelectorGrid
                      step={current}
                      selected={answers[current.id] as string | undefined}
                      onSelect={(v) => {
                        setAnswer(current.id, v);
                        window.setTimeout(() => setStep(index + 1), 180);
                      }}
                    />
                  ) : null}

                  {current.kind === "multi" ? (
                    <SelectorGrid
                      step={current}
                      multi
                      selectedMany={(answers[current.id] as string[]) ?? []}
                      onSelect={(v) => toggleAnswer(current.id, v)}
                    />
                  ) : null}

                  {current.kind === "details" ? (
                    <DetailsForm
                      details={details}
                      errors={fieldErrors}
                      onChange={(patch) => {
                        setDetails(patch);
                        setFieldErrors({});
                      }}
                    />
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 shrink-0 border-t border-[color:var(--line-soft)] bg-[color:color-mix(in_oklab,var(--base)_88%,transparent)] px-6 py-5 backdrop-blur-sm sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[104rem]">
          {status === "error" ? <Alert>{errorMessage}</Alert> : null}

          <div className="flex items-center justify-between gap-4">
            <Action variant="quiet" arrow="left" onClick={back}>
              {reviewing ? "Back" : index === 0 ? "All services" : "Back"}
            </Action>

            {reviewing ? (
              <Action
                onClick={submit}
                disabled={status === "submitting"}
                style={{ color: "var(--accent-ink)" }}
              >
                {status === "submitting" ? "Sending" : "Send request"}
              </Action>
            ) : current.kind === "single" ? (
              <p className="text-xs text-[color:var(--ink-muted)]">
                Choose one to continue
              </p>
            ) : (
              <Action
                onClick={advance}
                disabled={!canContinue}
                style={{ color: "var(--accent-ink)" }}
              >
                {current.kind === "details" ? "Review request" : "Continue"}
              </Action>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The error voice.
 *
 * There is no red in this system, and inventing one would break the
 * two palettes it was not picked against. So the accent carries the
 * signal through the icon and the edge rule, and the words themselves
 * stay in --ink at roughly 17:1. Accent text would sit near 3.6:1 in
 * the steel palette and fail outright. role="alert" and the icon mean
 * the state never depends on colour at all.
 */
function Alert({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="mb-4 flex items-start gap-2.5 border-l-2 border-[color:var(--accent)] py-0.5 pl-3.5 text-sm leading-relaxed text-[color:var(--ink)]"
    >
      <Warning
        size={16}
        weight="fill"
        className="mt-0.5 shrink-0 text-[color:var(--accent)]"
      />
      {children}
    </p>
  );
}

/**
 * The selector.
 *
 * Each option is a sharp panel with an index gutter, which is what
 * makes it read as an operational choice rather than a default form
 * control. Selection is carried three ways at once: the edge bar, the
 * border colour and the marker fill, so it never depends on colour
 * alone. Borders are --ink-faint rather than --line, because a form
 * control needs a 3:1 boundary against the surface and a 14% hairline
 * does not reach it.
 */
function SelectorGrid({
  step,
  selected,
  selectedMany = [],
  multi = false,
  onSelect,
}: {
  step: Step;
  selected?: string;
  selectedMany?: string[];
  multi?: boolean;
  onSelect: (value: string) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-label={step.prompt}
      className="grid gap-2.5 sm:grid-cols-2"
    >
      {(step.options ?? []).map((o, i) => {
        const on = multi ? selectedMany.includes(o.value) : selected === o.value;
        return (
          <motion.button
            key={o.value}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => onSelect(o.value)}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0.25 : 0.5,
              delay: reduce ? 0 : i * 0.045,
              ease: EASE,
            }}
            whileTap={reduce ? undefined : { scale: 0.99 }}
            className="group relative flex min-h-[4.5rem] items-stretch overflow-hidden border text-left transition-colors duration-300"
            style={{
              borderColor: on ? "var(--accent)" : "var(--ink-faint)",
              background: on
                ? "color-mix(in oklab, var(--accent) 12%, var(--raised))"
                : "var(--raised)",
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 bg-[color:color-mix(in_oklab,var(--accent)_7%,transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden="true"
            />

            {/* Index gutter. Precision, and a place for the eye to land. */}
            <span
              className="relative z-10 flex w-10 shrink-0 items-center justify-center border-r text-[0.625rem] transition-colors duration-300"
              style={{
                borderColor: on
                  ? "color-mix(in oklab, var(--accent) 45%, transparent)"
                  : "var(--line)",
                color: on ? "var(--ink)" : "var(--ink-muted)",
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.04em",
              }}
              aria-hidden="true"
            >
              {pad(i + 1)}
            </span>

            <span className="relative z-10 flex flex-1 items-center justify-between gap-3 px-4 py-4">
              <span className="block">
                <span className="block text-[0.9375rem] leading-snug tracking-tight text-[color:var(--ink)] sm:text-base">
                  {o.label}
                </span>
                {o.hint ? (
                  <span className="mt-1.5 block text-xs leading-relaxed text-[color:var(--ink-muted)]">
                    {o.hint}
                  </span>
                ) : null}
              </span>

              {/* Marker. Filled it becomes an accent chip, and the tick
                  inside it is --accent-ink through currentColor, which
                  is the one pairing guaranteed to read on the fill. */}
              <span
                className="flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center border transition-colors duration-300"
                style={{
                  borderColor: on ? "var(--accent)" : "var(--ink-faint)",
                  background: on ? "var(--accent)" : "transparent",
                  color: "var(--accent-ink)",
                  borderRadius: multi ? 2 : 999,
                }}
                aria-hidden="true"
              >
                {on ? <Check size={11} weight="bold" /> : null}
              </span>
            </span>

            <span
              className="absolute inset-y-0 left-0 z-10 block w-[2px] origin-top bg-[color:var(--accent)] transition-transform duration-300"
              style={{ transform: `scaleY(${on ? 1 : 0})` }}
              aria-hidden="true"
            />
          </motion.button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="t-label">{label}</span>
      {children}
      {hint && !error ? (
        <span className="text-xs text-[color:var(--ink-muted)]">{hint}</span>
      ) : null}
      {error ? (
        <span
          role="alert"
          className="flex items-start gap-1.5 text-xs leading-relaxed text-[color:var(--ink)]"
        >
          <Warning
            size={13}
            weight="fill"
            className="mt-[0.15rem] shrink-0 text-[color:var(--accent)]"
          />
          {error}
        </span>
      ) : null}
    </label>
  );
}

/* Field borders use --ink-faint rather than --line: a 14% hairline is
   below the 3:1 a form control needs against the raised surface. The
   placeholder is --ink-muted for the same reason, --ink-faint is for
   rules and disabled states and never for text that has to be read. */
const inputClass =
  "w-full border border-[color:var(--ink-faint)] bg-[color:var(--raised)] px-4 py-3.5 text-base text-[color:var(--ink)] placeholder:text-[color:var(--ink-muted)] transition-colors focus:border-[color:var(--accent)] focus:outline-none";

function DetailsForm({
  details,
  errors,
  onChange,
}: {
  details: Details;
  errors: Record<string, string>;
  onChange: (patch: Partial<Details>) => void;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Company" error={errors.company}>
        <input
          className={inputClass}
          value={details.company}
          onChange={(e) => onChange({ company: e.target.value })}
          autoComplete="organization"
          placeholder="Company name"
        />
      </Field>

      <Field label="Your name" error={errors.name}>
        <input
          className={inputClass}
          value={details.name}
          onChange={(e) => onChange({ name: e.target.value })}
          autoComplete="name"
          placeholder="Full name"
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          className={inputClass}
          type="email"
          inputMode="email"
          value={details.email}
          onChange={(e) => onChange({ email: e.target.value })}
          autoComplete="email"
          placeholder="name@company.nl"
        />
      </Field>

      <Field
        label="Phone"
        error={errors.phone}
        hint="Optional unless you prefer a call."
      >
        <input
          className={inputClass}
          type="tel"
          inputMode="tel"
          value={details.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          autoComplete="tel"
          placeholder="+31"
        />
      </Field>

      <div className="sm:col-span-2">
        <p className="t-label mb-2.5">How should we reach you?</p>
        <div className="inline-flex border border-[color:var(--ink-faint)] p-1">
          {(["email", "phone"] as const).map((k) => {
            const on = details.contactPreference === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => onChange({ contactPreference: k })}
                aria-pressed={on}
                className="px-6 py-2.5 text-sm capitalize transition-colors duration-300"
                style={{
                  // Selected is an accent tint under --ink type, not a
                  // solid accent fill. A fill would force --accent-ink
                  // at 14px, which is legible but reads as a second
                  // primary button next to the real one.
                  background: on
                    ? "color-mix(in oklab, var(--accent) 16%, transparent)"
                    : "transparent",
                  color: on ? "var(--ink)" : "var(--ink-muted)",
                  boxShadow: on ? "inset 0 0 0 1px var(--accent)" : "none",
                }}
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sm:col-span-2">
        <Field label="Anything else we should know?" hint="Optional.">
          <textarea
            className={`${inputClass} min-h-[7.5rem] resize-y`}
            value={details.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Access, timing, anything specific to your site."
          />
        </Field>
      </div>

      <p className="border-t border-[color:var(--line-soft)] pt-5 text-xs leading-relaxed text-[color:var(--ink-muted)] sm:col-span-2">
        We use these details only to answer this request. They are not sold and
        not used for unrelated marketing.
      </p>
    </div>
  );
}

/**
 * The brief.
 *
 * Not a definition list with buttons on it, and no longer a boxed card
 * either. A document set straight on the stage: numbered lines in the
 * order they were asked, separated by hairlines, with the contact block
 * set apart at the foot the way an operational sheet carries its
 * sender.
 */
function Summary({
  service,
  steps,
  onEdit,
}: {
  service: Service;
  steps: Step[];
  onEdit: (index: number) => void;
}) {
  const answers = useExperience((s) => s.answers);
  const details = useExperience((s) => s.details);

  const questions = steps.filter((s) => s.kind !== "details");

  const valuesFor = (step: Step): string[] => {
    const value = answers[step.id];
    if (step.kind === "multi") {
      const list = (value as string[]) ?? [];
      if (list.length === 0) return ["None specified"];
      return list.map(
        (v) => step.options?.find((o) => o.value === v)?.label ?? v,
      );
    }
    if (!value) return ["Not answered"];
    return [step.options?.find((o) => o.value === value)?.label ?? String(value)];
  };

  const answered = questions.filter((s) => {
    const v = answers[s.id];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-4">
        <h2 className="t-display-sm max-w-[14ch] text-[clamp(1.9rem,4vw,3.4rem)]">
          Your operational brief.
        </h2>
        <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-[color:var(--ink-muted)]">
          Check anything you want to change before this reaches the team.
        </p>

        <div
          className="mt-8 h-px w-16 bg-[color:var(--accent)]"
          aria-hidden="true"
        />

        <dl className="mt-8 space-y-3.5">
          <div className="flex items-baseline justify-between gap-6 border-b border-[color:var(--line-soft)] pb-3.5">
            <dt className="t-label">Service</dt>
            <dd className="text-right text-sm text-[color:var(--ink)]">
              {service.name}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6 border-b border-[color:var(--line-soft)] pb-3.5">
            <dt className="t-label">Answered</dt>
            <dd className="t-index text-right text-sm text-[color:var(--ink)]">
              {pad(answered)} / {pad(questions.length)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-6">
            <dt className="t-label">Reply by</dt>
            <dd className="text-right text-sm capitalize text-[color:var(--ink)]">
              {details.contactPreference}
            </dd>
          </div>
        </dl>
      </div>

      <div className="lg:col-span-8">
        <div className="border-t border-[color:var(--line)]">
          <dl>
            {questions.map((s, i) => (
              <div
                key={s.id}
                className="border-b border-[color:var(--line-soft)] py-5"
              >
                <dt className="t-label flex items-baseline gap-4">
                  <span className="t-index w-6 shrink-0" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <span className="min-w-0">{s.prompt}</span>
                </dt>
                <dd className="mt-2.5 flex items-start justify-between gap-5 sm:pl-10">
                  {s.kind === "multi" ? (
                    <span className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
                      {valuesFor(s).map((v) => (
                        <span
                          key={v}
                          className="flex items-center gap-2 text-[0.9375rem] leading-snug text-[color:var(--ink)]"
                        >
                          <span
                            className="block h-px w-3 shrink-0 bg-[color:var(--accent)]"
                            aria-hidden="true"
                          />
                          {v}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="min-w-0 text-base leading-snug text-[color:var(--ink)] sm:text-[1.0625rem]">
                      {valuesFor(s)[0]}
                    </span>
                  )}

                  <EditButton
                    onClick={() => onEdit(steps.indexOf(s))}
                    label={`Edit: ${s.prompt}`}
                  />
                </dd>
              </div>
            ))}

            <div className="border-b border-[color:var(--line)] py-5">
              <dt className="t-label flex items-baseline gap-4">
                <span className="t-index w-6 shrink-0" aria-hidden="true">
                  {pad(questions.length + 1)}
                </span>
                <span className="min-w-0">Who should we speak with?</span>
              </dt>
              <dd className="mt-2.5 flex items-start justify-between gap-5 sm:pl-10">
                <span className="min-w-0">
                  <span className="block text-base leading-snug text-[color:var(--ink)] sm:text-[1.0625rem]">
                    {details.name}, {details.company}
                  </span>
                  <span className="mt-1.5 block text-sm text-[color:var(--ink-muted)]">
                    {details.contactPreference === "phone"
                      ? details.phone
                      : details.email}
                  </span>
                  {details.notes ? (
                    <span className="mt-4 block max-w-[52ch] border-l-2 border-[color:var(--accent)] pl-4 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                      {details.notes}
                    </span>
                  ) : null}
                </span>

                <EditButton
                  onClick={() => onEdit(steps.length - 1)}
                  label="Edit contact details"
                />
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-6 max-w-[62ch] text-xs leading-relaxed text-[color:var(--ink-muted)]">
          Sending this shares your answers and contact details with the ORYX
          {" "}
          {service.name.toLowerCase()} team, for the purpose of answering this
          request only.
        </p>
      </div>
    </div>
  );
}

function EditButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="control inline-flex shrink-0 items-center gap-1.5 border border-[color:var(--ink-faint)] px-3.5 py-1.5 text-xs text-[color:var(--ink-muted)] transition-colors hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
    >
      <PencilSimple size={12} />
      Edit
    </button>
  );
}

/**
 * The close.
 *
 * The line is the whole moment, so it is set at the scale the rest of
 * the experience gives a closing statement, and everything else
 * arrives after it in sequence. Nothing is drawn behind it: an empty
 * dark stage is the calmest way to end a form.
 */
function Success({
  reference,
  onClose,
}: {
  reference: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.35 : 0.9,
      delay: reduce ? 0 : delay,
      ease: EASE,
    },
  });

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden px-6 py-12 sm:px-10">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 108%, rgba(var(--accent-rgb), 0.5), transparent 68%)",
          opacity: 0.16,
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 flex max-w-[52ch] flex-col items-center text-center"
        role="status"
      >
        <motion.span
          className="text-[color:var(--accent)]"
          {...rise(0)}
          aria-hidden="true"
        >
          <OryxMark size={44} strokeWidth={2} draw={!reduce} duration={1.2} />
        </motion.span>

        <motion.span
          className="mt-9 block h-px w-14 bg-[color:var(--accent)]"
          {...rise(0.12)}
          aria-hidden="true"
        />

        <motion.h2
          className="t-display-sm mt-9 text-[clamp(2.1rem,4.6vw,4rem)]"
          {...rise(0.2)}
        >
          Your request is in motion.
        </motion.h2>

        <motion.p
          className="mt-7 max-w-[42ch] text-base leading-relaxed text-[color:var(--ink-muted)]"
          {...rise(0.32)}
        >
          The ORYX team will review the operational details and contact you
          through your selected method.
        </motion.p>

        {reference ? (
          <motion.p
            className="mt-10 inline-flex items-center gap-3 border border-[color:var(--line)] bg-[color:var(--raised)] px-5 py-3"
            {...rise(0.42)}
          >
            <span className="t-label">Reference</span>
            <span className="t-index text-sm text-[color:var(--ink)]">
              {reference}
            </span>
          </motion.p>
        ) : null}

        <motion.div className="mt-11" {...rise(0.52)}>
          <Action variant="ghost" arrow="none" onClick={onClose}>
            Back to ORYX
          </Action>
        </motion.div>
      </div>
    </div>
  );
}
