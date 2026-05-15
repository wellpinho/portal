import { ILogin, IRegister } from "@/interfaces/user.interface";
import { tryCatch } from "@/utils/index.utils";

export const getToken = async ({ email, password, loginType }: ILogin) => {
  const endpoint =
    loginType === "client" || !loginType
      ? "/auth/login"
      : "/auth/customer/login";

  const baseUrl = process.env.NEXT_PUBLIC_AUTH || "";
  const url = `${baseUrl}${endpoint}`;

  const [error, response] = await tryCatch(
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'x-csrf-token': csrfToken, // Descomentado se necessário
      },
      // credentials: 'include', // Equivalente ao withCredentials
      body: JSON.stringify({
        email,
        password,
      }),
    }),
  );

  if (error) {
    return error;
  }

  if (!response || !response.ok) {
    return new Error("User not found!");
  }

  const data = await response.json();
  return data;
};

// export const getCsrfToken = async () => {
//     const [error, response] = await tryCatch(
//         api.get("/csrf-token", { withCredentials: true })
//     );

//     if (error) {
//         return error;
//     }

//     if (!response) {
//         return new Error("Session not found!");
//     }

//     console.error("CSRF Token:", response.data.csrfToken);

//     return response.data.csrfToken;
// };

export const createUser = async (...data: IRegister[]) => {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH || "";
  const url = `${baseUrl}/user/register`;

  const [error, response] = await tryCatch(
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data[0]),
    }),
  );

  if (error) {
    console.error("Error:", error.message);
    return Promise.reject(error);
  }

  if (!response || !response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Error:", errorData);
    return Promise.reject(new Error("Failed to create user"));
  }

  const responseData = await response.json();
  return responseData;
};

export const listUsers = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH || "";
  const url = `${baseUrl}/users`;

  const [error, response] = await tryCatch(
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );

  if (error) {
    return Promise.reject(error);
  }

  if (!response || !response.ok) {
    return Promise.reject(new Error("Failed to fetch users"));
  }

  const users = await response.json();
  return users;
};

export const createUserV2 = async (userData: IRegister) => {
  const [error, response] = await tryCatch(
    urlRequest("/user/create", userData),
  );

  if (error) {
    return Promise.reject(error);
  }

  return response.data;
};

const urlRequest = async (url: string, userData: IRegister) => {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH || "";
  const fullUrl = `${baseUrl}${url}`;

  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return { data };
};
