import { ChangePasswordDTO } from "./ChangePassword.dto";

export interface ChangePasswordDTOWithConfirm extends ChangePasswordDTO {
    confirmNewPassword: string;
}