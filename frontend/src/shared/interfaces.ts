export interface UserAfterLogin {
  id: string;
  username: string;
  token: string;
  expiresIn: string;
}

export interface User {
  entityId: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface Room {
  entityId: string;
  name: string;
  creatorId: string;
  memberIds: string[];
  is1on1: boolean;
  lastMessage: Message;
}

export interface Message {
  entityId: string;
  senderUserId: string;
  message: string;
  roomId: string;
  timestamp: string;
  senderUsername?: string;
  sentByMe?: boolean;
}

export type MyForm = {
  [key: string]: FormElement;
};

export interface FormElement {
  value: any;
  valid: boolean;
  touched: boolean;
  minLength?: number;
  maxLength?: number;
  regexCheck?: RegExp;
  shouldValidate?: boolean;
  [key: string]: any;
}
