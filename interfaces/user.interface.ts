export interface ISession {
  sub?: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  state?: string;
  city?: string;
  account?: string;
  plan?: string;
  category?: string;
  hasProfile?: string | boolean;
  slug?: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  userType: string;
}

export interface ILogin {
  email: string;
  password: string;
  loginType?: string;
}
