import { login } from "@/context/actions";
import { useState } from "react";

export const useLogin = () => {
  const [state, setState] = useState({
    password: "",
    email: "",
    message: "",
    errors: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const getLogin = async (formData: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const formDataObj = new FormData();

      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);

      const result = await login(formDataObj);

      // Se result for undefined (login bem-sucedido e redirecionamento)
      if (!result) {
        setState({
          email: "",
          password: "",
          message: "",
          errors: { email: "", password: "" },
        });
        return;
      }

      // Tratar erros de validação de campos
      if (result.errors) {
        setState({
          email: formData.email,
          password: formData.password,
          message: "",
          errors: {
            email: result.errors.email?.[0] || "",
            password: result.errors.password?.[0] || "",
          },
        });
        return result;
      }

      // Tratar mensagem de erro geral (credenciais inválidas, erro interno, etc.)
      if (result.message) {
        setState({
          email: formData.email,
          password: formData.password,
          message: result.message,
          errors: { email: "", password: "" },
        });
        return result;
      }

      // Fallback para casos inesperados
      setState({
        email: "",
        password: "",
        message: "Erro inesperado. Tente novamente.",
        errors: { email: "", password: "" },
      });

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getLogin,
    state,
    isLoading,
  };
};
