import type { User } from "./user.model";

export interface UserResponse {
  id: string;
  email: string;
  displayName: string;
}

export function toUser(response: UserResponse): User {
  return {
    id: response.id,
    email: response.email,
    displayName: response.displayName,
  };
}
