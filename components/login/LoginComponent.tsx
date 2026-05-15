"use client";

import { useLogin } from "@/hooks/useLogin";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { Eye, EyeOff, Lock, User, CheckCircle, XCircle } from "lucide-react";

const validateEmailFn = (email: string) => {
  if (!email.trim()) {
    return { isValid: false, message: "Email é obrigatório" };
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Email deve ter um formato válido",
    };
  }

  return { isValid: true, message: "" };
};

const INITIAL_FORM_DATA = { email: "", password: "" };
const INITIAL_REMEMBER_ME = false;
const INITIAL_VALIDATION = {
  email: { isValid: false, message: "" },
  password: { isValid: false, message: "" },
};
const INITIAL_TOUCHED = { email: false, password: false };

export const LoginComponent = () => {
  const { getLogin, state, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(INITIAL_REMEMBER_ME);
  const [localValidation, setLocalValidation] = useState(INITIAL_VALIDATION);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    const savedEmail = savedRememberMe
      ? localStorage.getItem("savedEmail") || ""
      : "";

    if (savedEmail) {
      setFormData({ email: savedEmail, password: "" });
      setRememberMe(savedRememberMe);
      setLocalValidation({
        email: validateEmailFn(savedEmail),
        password: { isValid: false, message: "" },
      });
      setTouched({ email: true, password: false });
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const validateEmail = useCallback((email: string) => {
    if (!email.trim()) {
      return { isValid: false, message: "Email é obrigatório" };
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: "Email deve ter um formato válido",
      };
    }

    return { isValid: true, message: "" };
  }, []);

  const validatePassword = useCallback((password: string) => {
    if (!password.trim()) {
      return { isValid: false, message: "Senha é obrigatória" };
    }

    if (password.length < 6) {
      return {
        isValid: false,
        message: "Senha deve ter pelo menos 6 caracteres",
      };
    }

    return { isValid: true, message: "" };
  }, []);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;
      const validation = validateEmail(email);
      setLocalValidation((prev) => ({
        ...prev,
        email: validation,
      }));
      setFormData((prev) => ({
        ...prev,
        email: email,
      }));
    },
    [validateEmail],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const password = e.target.value;
      const validation = validatePassword(password);
      setLocalValidation((prev) => ({
        ...prev,
        password: validation,
      }));
      setFormData((prev) => ({
        ...prev,
        password: password,
      }));
    },
    [validatePassword],
  );

  const handleFieldBlur = useCallback((field: "email" | "password") => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#589442]/5 via-gray-50 to-[#FCB53B]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="hidden md:block text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Comércios Locais
            </h1>
          </div>
          <p className="text-gray-600">
            Conectando você aos melhores profissionais da sua região
          </p>
        </div>

        <div
          className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${
            localValidation.email.isValid && localValidation.password.isValid
              ? "ring-2 ring-[#589442]/20"
              : ""
          }`}
        >
          <div className="bg-linear-to-r from-[#589442] to-[#589442]/90 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Bem-vindo de volta!
            </h2>
            <p className="text-[#FCB53B]/90 text-center text-sm mt-1">
              Faça login para continuar
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLoading) return;

              const loginData = {
                email: formData.email,
                password: formData.password,
              };
              getLogin(loginData);
            }}
            className="p-8 space-y-6"
            noValidate
            aria-label="Formulário de login"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  disabled={isLoading}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#589442] focus:border-transparent transition-all duration-200 ${
                    state?.errors?.email ||
                    (touched.email && !localValidation.email.isValid)
                      ? "border-red-500 bg-red-50"
                      : touched.email && localValidation.email.isValid
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  type="email"
                  value={formData.email}
                  autoComplete="email"
                  onChange={handleEmailChange}
                  onBlur={() => handleFieldBlur("email")}
                  aria-describedby="email-error"
                  aria-invalid={
                    !!state?.errors?.email ||
                    (touched.email && !localValidation.email.isValid)
                  }
                />
                {touched.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {localValidation.email.isValid ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {state?.errors?.email ? (
                <p
                  id="email-error"
                  className="text-sm text-red-600 flex items-center gap-1 animate-fade-in"
                >
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {state.errors.email}
                </p>
              ) : touched.email && !localValidation.email.isValid ? (
                <p
                  id="email-error"
                  className="text-sm text-red-600 flex items-center gap-1 animate-fade-in"
                >
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {localValidation.email.message}
                </p>
              ) : touched.email && localValidation.email.isValid ? (
                <p className="text-sm text-green-600 flex items-center gap-1 animate-fade-in">
                  <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                  Email válido
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  disabled={isLoading}
                  className={`w-full pl-10 pr-20 py-3 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#589442] focus:border-transparent transition-all duration-200 ${
                    state?.errors?.password ||
                    (touched.password && !localValidation.password.isValid)
                      ? "border-red-500 bg-red-50"
                      : touched.password && localValidation.password.isValid
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  onChange={handlePasswordChange}
                  onBlur={() => handleFieldBlur("password")}
                  aria-describedby="password-error"
                  aria-invalid={
                    !!state?.errors?.password ||
                    (touched.password && !localValidation.password.isValid)
                  }
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {touched.password && (
                    <div className="pr-1">
                      {localValidation.password.isValid ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <XCircle size={18} className="text-red-500" />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {state?.errors?.password ? (
                <p
                  id="password-error"
                  className="text-sm text-red-600 flex items-center gap-1 animate-fade-in"
                >
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {state.errors.password}
                </p>
              ) : touched.password && !localValidation.password.isValid ? (
                <p
                  id="password-error"
                  className="text-sm text-red-600 flex items-center gap-1 animate-fade-in"
                >
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {localValidation.password.message}
                </p>
              ) : touched.password && localValidation.password.isValid ? (
                <p className="text-sm text-green-600 flex items-center gap-1 animate-fade-in">
                  <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                  Senha válida
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRememberMe(checked);
                    localStorage.setItem("rememberMe", checked.toString());
                    if (checked && formData.email) {
                      localStorage.setItem("savedEmail", formData.email);
                    } else if (!checked) {
                      localStorage.removeItem("savedEmail");
                    }
                  }}
                  className="h-4 w-4 text-[#589442] focus:ring-[#589442] border-gray-300 rounded transition-colors"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer select-none"
                >
                  Lembrar meu email
                </label>
              </div>
            </div>

            {state?.message && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <XCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">
                      Erro no login
                    </h4>
                    <p className="text-sm text-red-700 mt-1">{state.message}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              disabled={
                isLoading ||
                !localValidation.email.isValid ||
                !localValidation.password.isValid
              }
              aria-disabled={
                isLoading ||
                !localValidation.email.isValid ||
                !localValidation.password.isValid
              }
              type="submit"
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#589442] focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transform ${
                localValidation.email.isValid &&
                localValidation.password.isValid &&
                !isLoading
                  ? "bg-linear-to-r from-[#589442] to-[#589442]/90 hover:from-[#589442]/90 hover:to-[#589442] text-white hover:shadow-xl hover:-translate-y-0.5"
                  : "bg-gray-300 text-gray-500 opacity-75"
              }`}
              title={
                !localValidation.email.isValid ||
                !localValidation.password.isValid
                  ? "Preencha todos os campos corretamente para continuar"
                  : undefined
              }
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                <>Entrar na conta</>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-700">
                Ainda não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="font-bold underline block text-[#589442] hover:text-[#589442]/80 transition-colors"
                >
                  Crie uma conta gratuita
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Ao fazer login, você concorda com nossos{" "}
            <Link
              href="/terms"
              className="text-[#589442] hover:underline focus:outline-none focus:ring-2 focus:ring-[#589442] focus:ring-offset-2 rounded"
            >
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link
              href="/privacy"
              className="text-[#589442] hover:underline focus:outline-none focus:ring-2 focus:ring-[#589442] focus:ring-offset-2 rounded"
            >
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
