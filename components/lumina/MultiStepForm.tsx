import { useState } from 'react';
import { AGENCY_MODELS } from '../../data/agencyModels';
import { useLang } from '../../contexts/LanguageContext';
import { useForBrandsLocale } from '../../i18n/forBrandsLocale';

interface FormState {
  goal?: string;
  budget?: string;
  selectedModels: string[];
  noPreference: boolean;
  name: string;
  company: string;
  email: string;
  phone: string;
  startDate: string;
  launchDate: string;
  notes: string;
}

const MAX_SELECTED_MODELS = 5;

/**
 * Build the payload for FormSubmit.co (or similar form-to-email services).
 * FormSubmit.co emails the JSON body to the address in the URL path.
 * First submission triggers a one-time confirmation email to activate.
 */
function buildInquiryPayload(s: FormState) {
  const preferredModels = s.noPreference
    ? 'Recommend'
    : s.selectedModels.length
    ? s.selectedModels
        .map((id) => AGENCY_MODELS.find((m) => m.id === id)?.name ?? id)
        .join(', ')
    : '(none)';
  return {
    _subject: `[LUMINA] New inquiry — ${s.company || s.name}`,
    _template: 'table',
    _captcha: 'false',
    'お名前': s.name,
    '会社 / ブランド': s.company,
    'メール': s.email,
    '電話': s.phone || '—',
    '目的 (Goal)': s.goal ?? '—',
    '予算 (Budget)': s.budget ?? '—',
    '指名モデル': preferredModels,
    '開始希望日': s.startDate,
    'ローンチ日': s.launchDate || '—',
    '備考': s.notes || '—',
  };
}

export default function MultiStepForm({ formId }: { formId?: string }) {
  const { lang } = useLang();
  const t = useForBrandsLocale(lang);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState<FormState>({
    selectedModels: [],
    noPreference: false,
    name: '',
    company: '',
    email: '',
    phone: '',
    startDate: '',
    launchDate: '',
    notes: '',
  });

  function canAdvance(): boolean {
    if (step === 1) return Boolean(state.goal);
    if (step === 2) return Boolean(state.budget);
    if (step === 3) return true;
    return true;
  }

  function validateStep4(): string {
    if (!state.name.trim()) return t.form.errRequiredName;
    if (!state.company.trim()) return t.form.errRequiredCompany;
    if (!state.email.trim()) return t.form.errRequiredEmail;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email))
      return t.form.errInvalidEmail;
    if (!state.startDate.trim()) return t.form.errRequiredStartDate;
    return '';
  }

  function next() {
    if (!canAdvance()) return;
    setError('');
    setStep((s) => Math.min(4, s + 1));
  }

  function back() {
    setError('');
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    const err = validateStep4();
    if (err) {
      setError(err);
      return;
    }

    const inquiryEmail = import.meta.env.VITE_LUMINA_INQUIRY_EMAIL as string | undefined;
    if (inquiryEmail) {
      try {
        // FormSubmit.co ajax endpoint — emails the JSON body to the target address.
        // No backend / API key required. Free tier sufficient for early launch.
        await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inquiryEmail)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(buildInquiryPayload(state)),
        });
      } catch (e) {
        // Non-blocking: still show thank-you + Meet link so user can book
        // eslint-disable-next-line no-console
        console.warn('[LUMINA] Inquiry email send failed', e);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('[LUMINA inquiry]', state);
    }
    setSubmitted(true);
  }

  function toggleModel(id: string) {
    setState((prev) => {
      if (prev.selectedModels.includes(id)) {
        return {
          ...prev,
          selectedModels: prev.selectedModels.filter((x) => x !== id),
        };
      }
      if (prev.selectedModels.length >= MAX_SELECTED_MODELS) return prev;
      return {
        ...prev,
        selectedModels: [...prev.selectedModels, id],
        noPreference: false,
      };
    });
  }

  if (submitted) {
    const meetUrl = (import.meta.env.VITE_LUMINA_GMEET_URL as string | undefined) || '';
    return (
      <section
        id={formId}
        className="bg-[#050508] text-[#FAFAFA] py-24 md:py-32 border-t border-[#1A1A2E]"
      >
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#00D4FF] mb-6">
            {t.form.thanksEyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight">
            {t.form.thanksHeading}
          </h2>
          <p className="text-[#9CA3AF] leading-relaxed mb-8 whitespace-pre-line">
            {t.form.thanksBody}
          </p>

          {meetUrl ? (
            <a
              href={meetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-[0.16em] font-medium bg-[#FAFAFA] text-[#050508] hover:bg-[#00D4FF] transition-colors"
            >
              {t.form.thanksMeetCta} <span aria-hidden>→</span>
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-[0.16em] font-medium bg-[#1A1A2E] text-[#6B7280]">
              {t.form.thanksMeetCta}
            </div>
          )}

          <p className="mt-6 text-xs text-[#6B7280]">{t.form.thanksMeetFootnote}</p>

          <div className="mt-10">
            <a
              href="/"
              className="text-sm uppercase tracking-[0.16em] text-[#FAFAFA]/70 hover:text-[#00D4FF] transition-colors"
            >
              {t.form.thanksCta}
            </a>
          </div>
        </div>
      </section>
    );
  }

  const progress = (step / 4) * 100;

  return (
    <section
      id={formId}
      className="bg-[#050508] text-[#FAFAFA] py-24 md:py-32 border-t border-[#1A1A2E]"
    >
      <div className="max-w-xl mx-auto px-6">
        <div className="mb-10 md:mb-14 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#6B7280] mb-4">
            {t.form.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight mb-4">
            {t.form.heading}
          </h2>
          <p className="text-sm text-[#9CA3AF]">{t.form.sub}</p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
              {t.form.stepOf(step)}
            </span>
            <span className="text-[10px] text-[#6B7280]">{Math.round(progress)}%</span>
          </div>
          <div className="h-px bg-[#1A1A2E] overflow-hidden">
            <div
              className="h-px bg-[#00D4FF] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div>
            <h3 className="text-lg font-medium mb-6">{t.form.step1Heading}</h3>
            <div className="space-y-2">
              {t.form.goals.map((o) => (
                <OptionRow
                  key={o.value}
                  selected={state.goal === o.value}
                  label={o.label}
                  onClick={() => setState({ ...state, goal: o.value })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-medium mb-6">{t.form.step2Heading}</h3>
            <div className="space-y-2">
              {t.form.budgets.map((o) => (
                <OptionRow
                  key={o.value}
                  selected={state.budget === o.value}
                  label={o.label}
                  onClick={() => setState({ ...state, budget: o.value })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Model selection */}
        {step === 3 && (
          <div>
            <h3 className="text-lg font-medium mb-2">{t.form.step3Heading}</h3>
            <p className="text-xs text-[#6B7280] mb-6">{t.form.step3Sub}</p>

            <OptionRow
              selected={state.noPreference}
              label={t.form.step3NoPreference}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  noPreference: !prev.noPreference,
                  selectedModels: prev.noPreference ? prev.selectedModels : [],
                }))
              }
            />

            <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {AGENCY_MODELS.filter((m) => m.images.beauty).map((m) => {
                const selected = state.selectedModels.includes(m.id);
                const disabled =
                  !selected && state.selectedModels.length >= MAX_SELECTED_MODELS;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleModel(m.id)}
                    disabled={disabled}
                    className={[
                      'relative aspect-[3/4] overflow-hidden border transition-all duration-200',
                      selected
                        ? 'border-[#00D4FF] scale-[1.02]'
                        : 'border-[#1A1A2E] hover:border-[#FAFAFA]/30',
                      disabled ? 'opacity-30 cursor-not-allowed' : '',
                    ].join(' ')}
                  >
                    <img
                      src={m.images.beauty}
                      alt={m.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050508] to-transparent px-2 py-1.5">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#FAFAFA]">
                        {m.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {state.selectedModels.length > 0 && (
              <p className="mt-4 text-[11px] text-[#9CA3AF]">
                {t.form.step3Selected(state.selectedModels.length, MAX_SELECTED_MODELS)}
              </p>
            )}
          </div>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <div>
            <h3 className="text-lg font-medium mb-6">{t.form.step4Heading}</h3>
            <div className="grid grid-cols-1 gap-4">
              <Field
                label={t.form.fieldName}
                required
                value={state.name}
                onChange={(v) => setState({ ...state, name: v })}
              />
              <Field
                label={t.form.fieldCompany}
                required
                value={state.company}
                onChange={(v) => setState({ ...state, company: v })}
              />
              <Field
                label={t.form.fieldEmail}
                type="email"
                required
                value={state.email}
                onChange={(v) => setState({ ...state, email: v })}
              />
              <Field
                label={t.form.fieldPhone}
                type="tel"
                value={state.phone}
                onChange={(v) => setState({ ...state, phone: v })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label={t.form.fieldStartDate}
                  type="date"
                  required
                  value={state.startDate}
                  onChange={(v) => setState({ ...state, startDate: v })}
                />
                <Field
                  label={t.form.fieldLaunchDate}
                  type="date"
                  value={state.launchDate}
                  onChange={(v) => setState({ ...state, launchDate: v })}
                />
              </div>
              <TextArea
                label={t.form.fieldNotes}
                value={state.notes}
                onChange={(v) => setState({ ...state, notes: v })}
                maxLength={500}
              />
            </div>

            {error && (
              <p className="mt-4 text-xs text-[#FF3366]">{error}</p>
            )}

            <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-[#6B7280]">
              {t.form.trustLine}
            </p>
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF] hover:text-[#FAFAFA] transition-colors"
            >
              {t.form.back}
            </button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance()}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAFAFA] hover:text-[#00D4FF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t.form.next} <span aria-hidden>→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs uppercase tracking-[0.16em] font-medium bg-[#FAFAFA] text-[#050508] hover:bg-[#00D4FF] transition-colors"
            >
              {t.form.submit} <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function OptionRow({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex items-center gap-4 p-4 border text-left text-sm transition-colors',
        selected
          ? 'border-[#00D4FF] bg-[#00D4FF]/[0.04] text-[#FAFAFA]'
          : 'border-[#1A1A2E] text-[#9CA3AF] hover:border-[#FAFAFA]/40 hover:text-[#FAFAFA]',
      ].join(' ')}
    >
      <span
        className={[
          'w-4 h-4 rounded-full border flex items-center justify-center shrink-0',
          selected ? 'border-[#00D4FF]' : 'border-[#9CA3AF]',
        ].join(' ')}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />}
      </span>
      <span>{label}</span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF]">
        {label} {required && <span className="text-[#FF3366]">*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-b border-[#1A1A2E] focus:border-[#00D4FF] outline-none py-2 text-[#FAFAFA] placeholder-[#374151] transition-colors"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF]">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border border-[#1A1A2E] focus:border-[#00D4FF] outline-none p-3 text-[#FAFAFA] placeholder-[#374151] transition-colors resize-none"
      />
      {maxLength && (
        <span className="text-[10px] text-[#6B7280]">
          {value.length} / {maxLength}
        </span>
      )}
    </label>
  );
}
