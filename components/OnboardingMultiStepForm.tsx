"use client";

import {
  ChangeEvent,
  FormEvent,
  InvalidEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCheck,
  Crown,
  ImagePlus,
  MapPin,
  MessageCircle,
  Store,
  UserRound,
} from "lucide-react";
import { SiInstagram } from "react-icons/si";

type Step = 1 | 2 | 3;

type FormField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type FormData = {
  ownerName: string;
  businessName: string;
  ownerWhatsapp: string;
  description: string;
  neighborhood: string;
  category: string;
  logoFile: File | null;
  instagram: string;
  supportWhatsapp: string;
  selectedPlan: "free" | "premium";
};

const TOTAL_STEPS = 3;

const neighborhoods = [
  "Águas Mornas - Centro",
  "Santa Isabel",
  "Rio do Cedro",
  "Vargem Grande",
  "Rancho Queimado (limítrofe)",
];

const categories = [
  "Restaurante e Lanchonete",
  "Mercado e Mercearia",
  "Beleza e Estética",
  "Saúde e Bem-estar",
  "Serviços Gerais",
  "Moda e Acessórios",
  "Artesanato e Produtos Coloniais",
];

function formatWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function OnboardingMultiStepForm() {
  const [step, setStep] = useState<Step>(1);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    businessName: "",
    ownerWhatsapp: "",
    description: "",
    neighborhood: "",
    category: "",
    logoFile: null,
    instagram: "",
    supportWhatsapp: "",
    selectedPlan: "free",
  });

  const progress = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function onWhatsappChange(
    key: "ownerWhatsapp" | "supportWhatsapp",
    value: string,
  ) {
    updateField(key, formatWhatsapp(value));
  }

  function onLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    updateField("logoFile", file);
  }

  function onFieldInvalid(event: InvalidEvent<FormField>) {
    const field = event.currentTarget;

    if (field.validity.valueMissing) {
      field.setCustomValidity(
        field.dataset.requiredMessage ||
          "Este campo precisa ser preenchido para continuar.",
      );
      return;
    }

    field.setCustomValidity("");
  }

  function clearFieldError(field: FormField) {
    field.setCustomValidity("");
  }

  function getStepFields(stepToValidate: Step) {
    const container = formRef.current?.querySelector<HTMLElement>(
      `[data-step="${stepToValidate}"]`,
    );

    if (!container) return [];

    return Array.from(
      container.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("input, textarea, select"),
    );
  }

  function reportFirstInvalidField(stepToValidate: Step): boolean {
    const fields = getStepFields(stepToValidate);
    const invalidField = fields.find((field) => !field.checkValidity());

    if (!invalidField) return true;

    invalidField.reportValidity();
    invalidField.focus();
    return false;
  }

  function nextStep() {
    if (!reportFirstInvalidField(step)) return;
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS) as Step);
  }

  function previousStep() {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    for (const stepToValidate of [1, 2] as const) {
      if (reportFirstInvalidField(stepToValidate)) continue;

      setStep(stepToValidate);
      requestAnimationFrame(() => {
        reportFirstInvalidField(stepToValidate);
      });
      return;
    }

    // Placeholder de submit: integrar com API quando o endpoint estiver pronto.
    console.log("Onboarding payload", formData);
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#e7f4e6_0%,#f6faf6_42%,#f8faf7_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[#d6e9d5] bg-white/90 p-5 shadow-[0_12px_48px_rgba(26,64,24,0.12)] backdrop-blur sm:p-7">
        <header className="mb-6 space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#edf6ed] px-3 py-1 text-xs font-semibold text-[#2f622c]">
            <Store className="h-3.5 w-3.5" />
            Portal de Comércios Locais
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1f3d1d] sm:text-3xl">
            Publique seu comércio em poucos passos
          </h1>
          <p className="text-sm text-stone-600 sm:text-base">
            Crie sua conta, complete o perfil do seu negócio e publique seu
            comércio grátis agora mesmo.
          </p>
        </header>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#3D7A3A] sm:text-sm">
            <span>Etapa {step} de 3</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e4efe4]">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#3D7A3A] to-[#57a251] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] sm:text-xs">
            <div
              className={`rounded-xl border px-2 py-2 text-center transition ${
                step >= 1
                  ? "border-[#7db679] bg-[#edf7ed] text-[#2f622c]"
                  : "border-stone-200 bg-stone-50 text-stone-500"
              }`}
            >
              <UserRound className="mx-auto mb-1 h-4 w-4" />
              Cadastro
            </div>
            <div
              className={`rounded-xl border px-2 py-2 text-center transition ${
                step >= 2
                  ? "border-[#7db679] bg-[#edf7ed] text-[#2f622c]"
                  : "border-stone-200 bg-stone-50 text-stone-500"
              }`}
            >
              <MapPin className="mx-auto mb-1 h-4 w-4" />
              Perfil
            </div>
            <div
              className={`rounded-xl border px-2 py-2 text-center transition ${
                step >= 3
                  ? "border-[#7db679] bg-[#edf7ed] text-[#2f622c]"
                  : "border-stone-200 bg-stone-50 text-stone-500"
              }`}
            >
              <Crown className="mx-auto mb-1 h-4 w-4" />
              Publicar
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
          <div className="relative overflow-hidden sm:min-h-105">
            <div
              data-step="1"
              className={`w-full transition-all duration-300 ${
                step === 1
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none absolute inset-0 -translate-x-6 opacity-0"
              }`}
              aria-hidden={step !== 1}
            >
              <h2 className="mb-4 text-lg font-semibold text-[#224420]">
                Cadastro Simples
              </h2>
              <div className="grid gap-4">
                <label className="grid gap-1.5 text-sm text-stone-700">
                  Nome do Responsável
                  <input
                    value={formData.ownerName}
                    onChange={(event) => {
                      updateField("ownerName", event.target.value);
                      clearFieldError(event.currentTarget);
                    }}
                    onInvalid={onFieldInvalid}
                    data-required-message="Como devemos te chamar? Preencha o nome do responsável."
                    placeholder="Ex: Ana Carolina"
                    required
                    className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                  />
                </label>

                <label className="grid gap-1.5 text-sm text-stone-700">
                  Nome do Comércio
                  <input
                    value={formData.businessName}
                    onChange={(event) => {
                      updateField("businessName", event.target.value);
                      clearFieldError(event.currentTarget);
                    }}
                    onInvalid={onFieldInvalid}
                    data-required-message="Informe o nome do seu comércio para publicar o perfil."
                    placeholder="Ex: Empório da Serra"
                    required
                    className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                  />
                </label>

                <label className="grid gap-1.5 text-sm text-stone-700">
                  WhatsApp
                  <input
                    value={formData.ownerWhatsapp}
                    onChange={(event) => {
                      onWhatsappChange("ownerWhatsapp", event.target.value);
                      clearFieldError(event.currentTarget);
                    }}
                    onInvalid={onFieldInvalid}
                    data-required-message="Adicione um WhatsApp para receber contatos dos clientes."
                    placeholder="(48) 99999-9999"
                    inputMode="numeric"
                    required
                    className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                  />
                </label>
              </div>
            </div>

            <div
              data-step="2"
              className={`w-full transition-all duration-300 ${
                step === 2
                  ? "translate-x-0 opacity-100"
                  : step < 2
                    ? "pointer-events-none absolute inset-0 translate-x-6 opacity-0"
                    : "pointer-events-none absolute inset-0 -translate-x-6 opacity-0"
              }`}
              aria-hidden={step !== 2}
            >
              <h2 className="mb-4 text-lg font-semibold text-[#224420]">
                Perfil do Comércio
              </h2>

              <div className="grid gap-4">
                <label className="grid gap-1.5 text-sm text-stone-700">
                  Descrição
                  <textarea
                    value={formData.description}
                    onChange={(event) => {
                      updateField("description", event.target.value);
                      clearFieldError(event.currentTarget);
                    }}
                    onInvalid={onFieldInvalid}
                    data-required-message="Conte em poucas linhas o que seu comércio oferece."
                    placeholder="Conte o que seu comércio oferece e os diferenciais."
                    rows={4}
                    required
                    className="resize-none rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm text-stone-700">
                    Bairro
                    <select
                      value={formData.neighborhood}
                      onChange={(event) => {
                        updateField("neighborhood", event.target.value);
                        clearFieldError(event.currentTarget);
                      }}
                      onInvalid={onFieldInvalid}
                      data-required-message="Selecione o bairro para melhorar a visibilidade local."
                      required
                      className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                    >
                      <option value="">Selecione</option>
                      {neighborhoods.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5 text-sm text-stone-700">
                    Categoria
                    <select
                      value={formData.category}
                      onChange={(event) => {
                        updateField("category", event.target.value);
                        clearFieldError(event.currentTarget);
                      }}
                      onInvalid={onFieldInvalid}
                      data-required-message="Escolha uma categoria para seu comércio aparecer nas buscas certas."
                      required
                      className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                    >
                      <option value="">Selecione</option>
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-1.5 text-sm text-stone-700">
                  Logo do Comércio
                  <div className="rounded-xl border border-dashed border-[#8dbf8a] bg-[#f4faf4] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#2f622c]">
                      <ImagePlus className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Envie uma imagem de logo
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onLogoChange}
                      className="block w-full text-xs text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#3D7A3A] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#2f622c]"
                    />
                    {formData.logoFile ? (
                      <p className="mt-2 text-xs text-stone-600">
                        Arquivo selecionado: {formData.logoFile.name}
                      </p>
                    ) : null}
                  </div>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm text-stone-700">
                    Instagram
                    <div className="flex items-center rounded-xl border border-stone-200 bg-white px-3">
                      <SiInstagram className="h-4 w-4 text-stone-500" />
                      <input
                        value={formData.instagram}
                        onChange={(event) =>
                          updateField("instagram", event.target.value)
                        }
                        placeholder="@seucomercio"
                        className="w-full bg-transparent px-2 py-2.5 outline-none"
                      />
                    </div>
                  </label>

                  <label className="grid gap-1.5 text-sm text-stone-700">
                    WhatsApp de Atendimento
                    <div className="flex items-center rounded-xl border border-stone-200 bg-white px-3">
                      <MessageCircle className="h-4 w-4 text-stone-500" />
                      <input
                        value={formData.supportWhatsapp}
                        onChange={(event) =>
                          onWhatsappChange(
                            "supportWhatsapp",
                            event.target.value,
                          )
                        }
                        placeholder="(48) 99999-9999"
                        inputMode="numeric"
                        className="w-full bg-transparent px-2 py-2.5 outline-none"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div
              data-step="3"
              className={`w-full transition-all duration-300 ${
                step === 3
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none absolute inset-0 translate-x-6 opacity-0"
              }`}
              aria-hidden={step !== 3}
            >
              {/* <h2 className="mb-4 text-lg font-semibold text-[#224420]">
                Escolha seu Plano
              </h2> */}

              <div className="grid gap-4 md:grid-cols-1">
                {/* <button
                  type="button"
                  onClick={() => updateField("selectedPlan", "free")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    formData.selectedPlan === "free"
                      ? "border-[#6aa366] bg-[#eff8ef] shadow-md"
                      : "border-stone-200 bg-white hover:border-[#9fcb9d]"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                    Plano Grátis
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#2f622c]">R$ 0</p>
                  <ul className="mt-4 space-y-2 text-sm text-stone-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#3D7A3A]" />
                      Listagem padrão
                    </li>
                    <li className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-[#3D7A3A]" />1 foto
                    </li>
                  </ul>
                </button> */}

                <button
                  type="button"
                  onClick={() => updateField("selectedPlan", "free")}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                    formData.selectedPlan === "free"
                      ? "border-[#3D7A3A] bg-linear-to-br from-[#f1fbf1] to-[#e5f5e4] shadow-[0_0_0_2px_rgba(61,122,58,0.12),0_14px_32px_rgba(61,122,58,0.28)]"
                      : "border-[#87ba84] bg-white hover:shadow-[0_10px_24px_rgba(61,122,58,0.18)]"
                  }`}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#67b262]/25 blur-2xl" />
                  <div className="relative">
                    <p className="inline-flex items-center gap-1 rounded-full bg-[#3D7A3A] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      <Crown className="h-3.5 w-3.5" />
                      Grátis
                    </p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#2f622c]">
                      Plano Gratuito
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#1f3d1d]">
                      R$ 0/mês
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-stone-700">
                      <li className="flex items-center gap-2">
                        <CheckCheck className="h-4 w-4 text-[#3D7A3A]" />
                        Aparece na lista do bairro e categoria escolhidos
                      </li>
                      {/* <li className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-[#3D7A3A]" />
                        Selo de verificado
                      </li> */}
                      <li className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-[#3D7A3A]" />
                        Contatos ilimitados pelo WhatsApp
                      </li>
                      <li className="flex items-center gap-2">
                        <ImagePlus className="h-4 w-4 text-[#3D7A3A]" />
                        Foto do comércio no perfil
                      </li>
                    </ul>
                  </div>
                </button>
              </div>

              {/* <div className="mt-4 rounded-xl border border-[#cde4cc] bg-[#f3faf2] p-3 text-sm text-[#2f622c]">
                Plano selecionado:{" "}
                <strong>
                  {formData.selectedPlan === "premium" ? "Premium" : "Grátis"}
                </strong>
              </div> */}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 1}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Voltar
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-xl bg-[#3D7A3A] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#3D7A3A]/30 transition hover:bg-[#2f622c]"
              >
                Continuar
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-xl bg-linear-to-r cursor-pointer from-[#3D7A3A] to-[#57a251] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(61,122,58,0.35)] transition hover:brightness-110"
              >
                Publicar Comércio
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
