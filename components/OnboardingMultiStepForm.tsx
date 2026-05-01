"use client";

import {
  ChangeEvent,
  FormEvent,
  InvalidEvent,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
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
import { toCityPath } from "@/lib/locations";

type Step = 1 | 2 | 3;

type FormField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type FormData = {
  ownerName: string;
  businessName: string;
  ownerWhatsapp: string;
  password: string;
  about: string;
  zipcode: string;
  neighborhood: string;
  street: string;
  category: ProfileCategory | "";
  segment: string;
  logoFile: File | null;
  instagram: string;
  businessWhatsapp: string;
  email: string;
  selectedPlan: "free" | "premium";
  userType: "" | "ADMIN" | "MANAGER" | "EMPLOYER";
  city: string;
  state: string;
};

type CepLookupResponse = {
  zipcode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export enum ProfileCategory {
  GASTRONOMIA = "gastronomia",
  SERVICOS_AUTOMOTIVOS = "servicos_automotivos",
  AGRO_COLONIAIS = "agro_coloniais",
  SAUDE_BELEZA = "saude_beleza",
  COMERCIO_VAREJO = "comercio_varejo",
  SERVICOS_PROFISSIONAIS = "servicos_profissionais",
  TURISMO_LAZER = "turismo_lazer",
  IMOBILIARIA_LAR = "imobiliaria_lar",
  CASA_CONSTRUCAO = "casa_construcao",
}

export const CategorySegments: Record<ProfileCategory, string[]> = {
  [ProfileCategory.GASTRONOMIA]: [
    "Doces e Salgados",
    "Bar e Choperia",
    "Restaurante",
    "Lanchonete",
    "Sorveteria",
    "Cafeteria",
    "Pizzaria",
    "Padaria",
  ],
  [ProfileCategory.SERVICOS_AUTOMOTIVOS]: [
    "Oficina Mecanica",
    "Autoeletrica",
    "Lava-jato",
    "Borracharia",
    "Pecas",
  ],
  [ProfileCategory.CASA_CONSTRUCAO]: [
    "Material de Construcao",
    "Marcenaria",
    "Mao de Obra (Pedreiro)",
    "Eletrica e Hidraulica",
    "Pintura",
    "Arquitetura e Projetos",
  ],
  [ProfileCategory.AGRO_COLONIAIS]: [
    "Produtos Coloniais",
    "Agropecuaria",
    "Veterinaria",
    "Hortifruti",
  ],
  [ProfileCategory.SAUDE_BELEZA]: [
    "Farmacia",
    "Salao de Beleza",
    "Academia",
    "Dentista",
    "Estetica",
  ],
  [ProfileCategory.COMERCIO_VAREJO]: [
    "Moda",
    "Calcados",
    "Supermercado",
    "Papelaria",
    "Eletronicos",
  ],
  [ProfileCategory.SERVICOS_PROFISSIONAIS]: [
    // Profissionais Liberais
    "Contabilidade",
    "Advocacia",
    "Consultoria e Assessoria",
    "Fotografia e Filmagens",

    // Cuidados e Bem-estar (Autónomos)
    "Cuidador de Idosos",
    "Babás / Dog Walker",
    "Personal Trainer",

    // Manutenção e Serviços Gerais (A força da cidade)
    "Marido de Aluguer (Reparos)",
    "Montador de Móveis",
    "Limpeza Residencial / Diarista",
    "Piscineiro",
    "Jardinagem",
    "Fretes e Mudanças",

    // Tecnologia e Eventos
    "Informática e Suporte",
    "Organização de Eventos / Buffet",
    "Design e Marketing",

    // Outros
    "Costura e Reformas",
    "Aulas Particulares / Reforço",
  ],
  [ProfileCategory.TURISMO_LAZER]: [
    "Pousada",
    "Hotel",
    "Parque Termal",
    "Eventos",
  ],
  [ProfileCategory.IMOBILIARIA_LAR]: [
    "Corretor de Imoveis",
    "Imobiliaria",
    "Aluguel de Temporada",
    "Jardinagem e Paisagismo",
    "Limpeza e Conservacao",
    "Seguranca Residencial",
  ],
};

const profileCategoryLabels: Record<ProfileCategory, string> = {
  [ProfileCategory.GASTRONOMIA]: "Gastronomia",
  [ProfileCategory.SERVICOS_AUTOMOTIVOS]: "Servicos Automotivos",
  [ProfileCategory.AGRO_COLONIAIS]: "Agro e Coloniais",
  [ProfileCategory.SAUDE_BELEZA]: "Saude e Beleza",
  [ProfileCategory.COMERCIO_VAREJO]: "Comercio e Varejo",
  [ProfileCategory.SERVICOS_PROFISSIONAIS]: "Servicos Profissionais",
  [ProfileCategory.TURISMO_LAZER]: "Turismo e Lazer",
  [ProfileCategory.IMOBILIARIA_LAR]: "Imobiliaria e Lar",
  [ProfileCategory.CASA_CONSTRUCAO]: "Casa e Construcao",
};

const TOTAL_STEPS = 3;

const ONBOARDING_STORAGE_KEY = "onboarding_form_draft";

type StoredFormData = Omit<FormData, "logoFile" | "password">;

function loadFormDraft(): Partial<StoredFormData> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<StoredFormData>) : {};
  } catch {
    return {};
  }
}

const allowedImageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function getImageMimeTypeFromName(fileName: string): string | null {
  const normalized = fileName.toLowerCase();

  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (normalized.endsWith(".png")) {
    return "image/png";
  }

  if (normalized.endsWith(".webp")) {
    return "image/webp";
  }

  return null;
}

function normalizeImageFile(file: File): File | null {
  const browserMimeType = file.type?.toLowerCase().trim();
  const mimeTypeFromName = getImageMimeTypeFromName(file.name);

  const detectedType =
    browserMimeType && allowedImageMimeTypes.includes(browserMimeType)
      ? browserMimeType
      : mimeTypeFromName;

  if (!detectedType || !allowedImageMimeTypes.includes(detectedType)) {
    return null;
  }

  if (browserMimeType === detectedType) {
    return file;
  }

  return new File([file], file.name, {
    type: detectedType,
    lastModified: file.lastModified,
  });
}

function formatWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidBrazilMobilePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^[1-9]{2}9\d{8}$/.test(digits);
}

function formatZipcode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) return digits;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isSequentialNumericPassword(value: string): boolean {
  if (!/^\d+$/.test(value) || value.length < 2) return false;

  let ascending = true;
  let descending = true;

  for (let index = 1; index < value.length; index += 1) {
    const previous = Number(value[index - 1]);
    const current = Number(value[index]);

    if (current - previous !== 1) ascending = false;
    if (previous - current !== 1) descending = false;
  }

  return ascending || descending;
}

function validatePasswordField(field: HTMLInputElement): void {
  if (field.validity.valueMissing) {
    field.setCustomValidity("Crie uma senha para acessar sua conta.");
    return;
  }

  if (field.validity.tooShort) {
    field.setCustomValidity("A senha precisa ter no minimo 8 caracteres.");
    return;
  }

  if (isSequentialNumericPassword(field.value)) {
    field.setCustomValidity("A senha nao pode ser uma sequencia numerica.");
    return;
  }

  field.setCustomValidity("");
}

function validateWhatsappField(field: HTMLInputElement): void {
  const digits = field.value.replace(/\D/g, "");

  if (field.required && digits.length === 0) {
    field.setCustomValidity(
      field.dataset.requiredMessage ||
        "Adicione um WhatsApp para receber contatos dos clientes.",
    );
    return;
  }

  if (digits.length > 0 && !isValidBrazilMobilePhone(digits)) {
    field.setCustomValidity(
      "Informe um numero de celular valido no formato (DDD) 9XXXX-XXXX.",
    );
    return;
  }

  field.setCustomValidity("");
}

export default function OnboardingMultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const formRef = useRef<HTMLFormElement>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepFeedback, setCepFeedback] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedListingPath, setPublishedListingPath] = useState("");
  const [samePhone, setSamePhone] = useState(false);
  const [lastZipLookup, setLastZipLookup] = useState("");
  const [formData, setFormData] = useState<FormData>({
    ownerName: "",
    businessName: "",
    ownerWhatsapp: "",
    password: "",
    about: "",
    zipcode: "",
    neighborhood: "",
    street: "",
    category: "",
    segment: "",
    logoFile: null,
    instagram: "",
    businessWhatsapp: "",
    email: "",
    selectedPlan: "free",
    userType: "",
    state: "SC",
    city: "Águas Mornas",
  });

  useEffect(() => {
    const draft = loadFormDraft();
    if (Object.keys(draft).length === 0) return;
    startTransition(() => {
      setFormData((prev) => ({
        ...prev,
        ownerName: draft.ownerName ?? prev.ownerName,
        businessName: draft.businessName ?? prev.businessName,
        ownerWhatsapp: draft.ownerWhatsapp ?? prev.ownerWhatsapp,
        about: draft.about ?? prev.about,
        zipcode: draft.zipcode ?? prev.zipcode,
        neighborhood: draft.neighborhood ?? prev.neighborhood,
        street: draft.street ?? prev.street,
        category: draft.category ?? prev.category,
        segment: draft.segment ?? prev.segment,
        instagram: draft.instagram ?? prev.instagram,
        businessWhatsapp: draft.businessWhatsapp ?? prev.businessWhatsapp,
        email: draft.email ?? prev.email,
        selectedPlan: draft.selectedPlan ?? prev.selectedPlan,
        userType: draft.userType ?? prev.userType,
        state: draft.state ?? prev.state,
        city: draft.city ?? prev.city,
      }));
      if (draft.zipcode && draft.street) {
        setLastZipLookup(draft.zipcode.replace(/\D/g, ""));
      }
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { logoFile, password, ...dataToStore } = formData;
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(dataToStore));
  }, [formData]);

  const progress = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);
  const availableSegments = useMemo(
    () =>
      formData.category
        ? CategorySegments[formData.category as ProfileCategory]
        : [],
    [formData.category],
  );

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function onWhatsappChange(
    key: "ownerWhatsapp" | "businessWhatsapp",
    value: string,
  ) {
    updateField(key, formatWhatsapp(value));
  }

  function onLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    updateField("logoFile", file);
  }

  async function lookupAddressByZipcode(rawZipcode: string) {
    const digits = rawZipcode.replace(/\D/g, "");

    if (digits.length !== 8) return;

    setCepLoading(true);
    setCepFeedback("");

    try {
      const response = await fetch(`/api/location/cep/${digits}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setCepFeedback("Nao foi possivel encontrar o endereco pelo CEP.");
        updateField("street", "");
        updateField("neighborhood", "");
        updateField("city", "");
        updateField("state", "");
        return;
      }

      const data = (await response.json()) as CepLookupResponse;

      updateField("street", data.street || "");
      updateField("neighborhood", data.neighborhood || "");
      updateField("city", data.city || "");
      updateField("state", data.state || "");
      setCepFeedback("");
      setLastZipLookup(digits);
    } catch {
      setCepFeedback("Erro ao consultar CEP. Tente novamente.");
    } finally {
      setCepLoading(false);
    }
  }

  function onFieldInvalid(event: InvalidEvent<FormField>) {
    const field = event.currentTarget;

    if (
      field instanceof HTMLInputElement &&
      (field.name === "ownerWhatsapp" || field.name === "businessWhatsapp")
    ) {
      validateWhatsappField(field);
      return;
    }

    if (field.validity.valueMissing) {
      field.setCustomValidity(
        field.dataset.requiredMessage ||
          "Este campo precisa ser preenchido para continuar.",
      );
      return;
    }

    if (field instanceof HTMLInputElement && field.name === "password") {
      validatePasswordField(field);
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

    for (const field of fields) {
      if (field instanceof HTMLInputElement && field.name === "password") {
        validatePasswordField(field);
      }

      if (
        field instanceof HTMLInputElement &&
        (field.name === "ownerWhatsapp" || field.name === "businessWhatsapp")
      ) {
        validateWhatsappField(field);
      }
    }

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    for (const stepToValidate of [1, 2] as const) {
      if (reportFirstInvalidField(stepToValidate)) continue;

      setStep(stepToValidate);
      requestAnimationFrame(() => {
        reportFirstInvalidField(stepToValidate);
      });
      return;
    }

    const cleanZipcode = formData.zipcode.replace(/\D/g, "");
    const cleanOwnerWhatsapp = formData.ownerWhatsapp.replace(/\D/g, "");
    const cleanBusinessWhatsapp = formData.businessWhatsapp.replace(/\D/g, "");

    if (!isValidBrazilMobilePhone(cleanOwnerWhatsapp)) {
      setStep(1);
      const ownerWhatsappField =
        formRef.current?.querySelector<HTMLInputElement>(
          'input[name="ownerWhatsapp"]',
        );

      if (ownerWhatsappField) {
        ownerWhatsappField.setCustomValidity(
          "Informe um numero de celular valido no formato (DDD) 9XXXX-XXXX.",
        );
        ownerWhatsappField.reportValidity();
        ownerWhatsappField.focus();
      }

      return;
    }

    if (
      cleanBusinessWhatsapp &&
      !isValidBrazilMobilePhone(cleanBusinessWhatsapp)
    ) {
      setStep(2);
      const businessWhatsappField =
        formRef.current?.querySelector<HTMLInputElement>(
          'input[name="businessWhatsapp"]',
        );

      if (businessWhatsappField) {
        businessWhatsappField.setCustomValidity(
          "Informe um numero de celular valido no formato (DDD) 9XXXX-XXXX.",
        );
        businessWhatsappField.reportValidity();
        businessWhatsappField.focus();
      }

      return;
    }

    const hasValidZipcodeLookup =
      cleanZipcode.length === 8 &&
      cleanZipcode === lastZipLookup &&
      Boolean(formData.street.trim());

    if (!hasValidZipcodeLookup) {
      setStep(2);
      setCepFeedback(
        "Informe um CEP valido para preencher a rua antes de continuar.",
      );
      return;
    }

    const payload = new window.FormData();
    payload.append("ownerName", formData.ownerName);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("ownerWhatsapp", cleanOwnerWhatsapp);
    payload.append("businessName", formData.businessName);
    payload.append("about", formData.about);
    payload.append("zipcode", cleanZipcode);
    payload.append("street", formData.street.trim());
    payload.append("neighborhood", formData.neighborhood);
    payload.append("city", formData.city);
    payload.append("state", formData.state);
    payload.append("category", formData.category);
    payload.append("segment", formData.segment);

    const socialLinks = {
      instagram: formData.instagram.trim() || undefined,
    };

    if (socialLinks.instagram) {
      payload.append("socialLinks", JSON.stringify(socialLinks));
    }

    payload.append("businessWhatsapp", cleanBusinessWhatsapp);
    payload.append("selectedPlan", formData.selectedPlan);
    payload.append("userType", formData.userType);
    if (formData.logoFile) {
      const normalizedFile = normalizeImageFile(formData.logoFile);

      if (!normalizedFile) {
        console.log("Arquivo de imagem invalido. Use JPG, PNG ou WEBP.");
        return;
      }

      payload.append("avatar", normalizedFile);
    }

    const response = await fetch("/api/profile/create", {
      method: "POST",
      body: payload,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.log("Erro ao criar perfil:", error);
      // TODO: exibir feedback de erro ao usuário
      return;
    }

    const stateCode = formData.state.trim().toLowerCase();
    const citySlug = toSlug(formData.city);
    const listingPath = toCityPath(
      stateCode || "sc",
      citySlug || "aguas-mornas",
    );

    setPublishedListingPath(listingPath);
    setShowSuccessModal(true);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
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
                  Seu email
                  <input
                    value={formData.email}
                    onChange={(event) => {
                      updateField("email", event.target.value);
                      clearFieldError(event.currentTarget);
                    }}
                    onInvalid={onFieldInvalid}
                    data-required-message="Informe o seu email para contato."
                    placeholder="Ex: ana@example.com"
                    required
                    className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                  />
                </label>

                <label className="grid gap-1.5 text-sm text-stone-700">
                  WhatsApp
                  <input
                    name="ownerWhatsapp"
                    value={formData.ownerWhatsapp}
                    onChange={(event) => {
                      onWhatsappChange("ownerWhatsapp", event.target.value);
                      clearFieldError(event.currentTarget);
                    }}
                    onInvalid={onFieldInvalid}
                    data-required-message="Adicione um WhatsApp para receber contatos dos clientes."
                    placeholder="(48) 99999-9999"
                    inputMode="numeric"
                    type="tel"
                    required
                    className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                  />
                </label>

                <label className="grid gap-1.5 text-sm text-stone-700">
                  Senha
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={(event) => {
                      updateField("password", event.target.value);
                      validatePasswordField(event.currentTarget);
                    }}
                    onInvalid={onFieldInvalid}
                    data-required-message="Crie uma senha para acessar sua conta."
                    placeholder="Minimo de 8 caracteres"
                    minLength={8}
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
                  Sobre
                  <textarea
                    value={formData.about}
                    onChange={(event) => {
                      updateField("about", event.target.value);
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
                  <div className="grid gap-1.5">
                    <label className="grid gap-1.5 text-sm text-stone-700">
                      CEP
                      <input
                        value={formData.zipcode}
                        onChange={(event) => {
                          const formattedZipcode = formatZipcode(
                            event.target.value,
                          );
                          const cleanZipcode = formattedZipcode.replace(
                            /\D/g,
                            "",
                          );

                          updateField("zipcode", formattedZipcode);

                          if (cleanZipcode.length < 8) {
                            updateField("street", "");
                            updateField("neighborhood", "");
                            updateField("city", "");
                            updateField("state", "");
                            setCepFeedback("");
                            setLastZipLookup("");
                          }

                          if (
                            cleanZipcode.length === 8 &&
                            cleanZipcode !== lastZipLookup
                          ) {
                            void lookupAddressByZipcode(cleanZipcode);
                          }

                          clearFieldError(event.currentTarget);
                        }}
                        onInvalid={onFieldInvalid}
                        data-required-message="Informe o CEP para buscar o endereco automaticamente."
                        placeholder="00000-000"
                        inputMode="numeric"
                        required
                        className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                      />
                    </label>

                    {cepLoading ? (
                      <p className="text-xs text-stone-600">
                        Buscando endereco pelo CEP...
                      </p>
                    ) : null}

                    {formData.street &&
                    formData.neighborhood &&
                    formData.city &&
                    formData.state ? (
                      <p className="rounded-xl border border-[#d6e9d5] bg-[#f3faf2] px-3.5 py-2.5 text-sm text-[#2f622c]">
                        {`${formData.street}, ${formData.neighborhood} - ${formData.city} - ${formData.state}`}
                      </p>
                    ) : null}

                    {cepFeedback ? (
                      <p className="text-xs text-red-500">{cepFeedback}</p>
                    ) : null}
                  </div>

                  <label className="grid gap-1.5 text-sm text-stone-700">
                    Categoria
                    <select
                      value={formData.category}
                      onChange={(event) => {
                        updateField(
                          "category",
                          event.target.value as ProfileCategory | "",
                        );
                        updateField("segment", "");
                        clearFieldError(event.currentTarget);
                      }}
                      onInvalid={onFieldInvalid}
                      data-required-message="Escolha uma categoria para seu comercio aparecer nas buscas certas."
                      required
                      className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30"
                    >
                      <option value="">Selecione</option>
                      {(
                        Object.values(ProfileCategory) as ProfileCategory[]
                      ).map((item) => (
                        <option key={item} value={item}>
                          {profileCategoryLabels[item]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-1.5 text-sm text-stone-700">
                  Segmento
                  <select
                    value={formData.segment}
                    onChange={(event) => {
                      updateField("segment", event.target.value);
                      clearFieldError(event.currentTarget);
                    }}
                    onInvalid={onFieldInvalid}
                    data-required-message="Selecione um segmento para refinar a categoria do seu comercio."
                    required
                    disabled={!formData.category}
                    className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 outline-none transition focus:border-[#5f9f5a] focus:ring-4 focus:ring-[#9dcb9a]/30 disabled:cursor-not-allowed disabled:bg-stone-100"
                  >
                    <option value="">
                      {formData.category
                        ? "Selecione um segmento"
                        : "Selecione uma categoria primeiro"}
                    </option>
                    {availableSegments.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

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

                <div className="grid gap-2 rounded-xl border border-[#cde4cc] bg-[#f4faf4] px-3.5 py-3">
                  <p className="text-sm font-semibold text-[#2f622c]">
                    Você é proprietário?
                  </p>

                  <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input
                      type="radio"
                      name="userType"
                      value="ADMIN"
                      checked={formData.userType === "ADMIN"}
                      onChange={(event) => {
                        updateField(
                          "userType",
                          event.target.value as FormData["userType"],
                        );
                        clearFieldError(event.currentTarget);
                      }}
                      onInvalid={onFieldInvalid}
                      data-required-message="Selecione qual e a sua funcao no comercio."
                      required
                      className="h-4 w-4 border-2 border-[#9dcb9a] accent-[#2f622c]"
                    />
                    Proprietário
                  </label>

                  <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input
                      type="radio"
                      name="userType"
                      value="MANAGER"
                      checked={formData.userType === "MANAGER"}
                      onChange={(event) => {
                        updateField(
                          "userType",
                          event.target.value as FormData["userType"],
                        );
                        clearFieldError(event.currentTarget);
                      }}
                      onInvalid={onFieldInvalid}
                      data-required-message="Selecione qual e a sua funcao no comercio."
                      required
                      className="h-4 w-4 border-2 border-[#9dcb9a] accent-[#2f622c]"
                    />
                    Gerente
                  </label>

                  <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input
                      type="radio"
                      name="userType"
                      value="EMPLOYER"
                      checked={formData.userType === "EMPLOYER"}
                      onChange={(event) => {
                        updateField(
                          "userType",
                          event.target.value as FormData["userType"],
                        );
                        clearFieldError(event.currentTarget);
                      }}
                      onInvalid={onFieldInvalid}
                      data-required-message="Selecione qual e a sua funcao no comercio."
                      required
                      className="h-4 w-4 border-2 border-[#9dcb9a] accent-[#2f622c]"
                    />
                    Funcionário
                  </label>
                </div>

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

                  <div className="grid gap-1.5">
                    <span className="text-sm text-stone-700">
                      WhatsApp de Atendimento
                    </span>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
                      <input
                        type="checkbox"
                        checked={samePhone}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setSamePhone(checked);
                          if (checked) {
                            updateField(
                              "businessWhatsapp",
                              formData.ownerWhatsapp,
                            );
                          } else {
                            updateField("businessWhatsapp", "");
                          }
                        }}
                        className="h-4 w-4 accent-[#3D7A3A]"
                      />
                      Usar mesmo telefone
                    </label>
                    {!samePhone && (
                      <div className="flex items-center rounded-xl border border-stone-200 bg-white px-3">
                        <MessageCircle className="h-4 w-4 text-stone-500" />
                        <input
                          name="businessWhatsapp"
                          value={formData.businessWhatsapp}
                          onChange={(event) => {
                            onWhatsappChange(
                              "businessWhatsapp",
                              event.target.value,
                            );
                            clearFieldError(event.currentTarget);
                          }}
                          onInvalid={onFieldInvalid}
                          placeholder="(48) 99999-9999"
                          type="tel"
                          inputMode="numeric"
                          className="w-full bg-transparent px-2 py-2.5 outline-none"
                        />
                      </div>
                    )}
                  </div>
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

      {showSuccessModal ? (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-[#0f1f0e]/55 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#cde4cc] bg-white p-6 shadow-[0_24px_80px_rgba(20,45,18,0.35)]">
            <h3 className="text-xl font-semibold text-[#1f3d1d]">
              Comércio publicado com sucesso
            </h3>
            <p className="mt-2 text-sm text-stone-600">
              Seu perfil já está disponível. Escolha para onde deseja ir agora.
            </p>

            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={() => router.push(publishedListingPath)}
                className="w-full rounded-xl bg-[#3D7A3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f622c]"
              >
                Ver lista de comércios
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Ir para o painel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
