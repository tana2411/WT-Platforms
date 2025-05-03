export type RequestLoginParams = {
  email: string;
  password: string;
};

export type ResponseLogin = {
  data: {
    user: {
      id: number;
      email: string;
      accessToken: string;
      globalRole: string;
    };
  };
};
