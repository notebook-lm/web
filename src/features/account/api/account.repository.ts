import { toUser } from "@/features/authentication/model";
import { accountApi } from "./account.api";
import type {
  ChangeEmailRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  UpdateProfileRequest,
} from "./account.dto";

export const accountRepository = {
  getCurrentUser: async () => {
    const response = await accountApi.getCurrentUser();
    return toUser(response);
  },
  updateProfile: async (payload: UpdateProfileRequest) => {
    const response = await accountApi.updateProfile(payload);
    return toUser(response);
  },
  changeEmail: async (payload: ChangeEmailRequest) => {
    const response = await accountApi.changeEmail(payload);
    return toUser(response);
  },
  changePassword: async (payload: ChangePasswordRequest) => {
    await accountApi.changePassword(payload);
  },
  deleteAccount: async (payload: DeleteAccountRequest) => {
    await accountApi.deleteAccount(payload);
  },
};
