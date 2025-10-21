export type UserType = {
  _id: number;
  email: string;
  fullName: string;
  profilePic: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type SignUpRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type Contact = {
  __id: number;
  fullName: string;
  email: string;
};

export type Chat = {
  __id: number;
};

export type Message = {
  __id: number;
};
