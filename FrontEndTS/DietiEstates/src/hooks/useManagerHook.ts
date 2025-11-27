import { useCallback } from "react"
import { ManagerService } from "@/src/services/ManagerService"
import { CreateUserRequest } from "../dto/request/CreateUserRequest.dto";
import { ChangePasswordDTOWithConfirm } from "../dto/request/ChangePasswordWithConfirm.dto";

export const useManagerHook = (managerService : ManagerService) => {

    const handleCreateAgent = useCallback(async (data: CreateUserRequest, setError: (error: string) => void) => {
        if (data.name.trim() === "" || data.surname.trim() === "" || data.username.trim() === "" || data.email.trim() === "") {
            setError("All fields are required");
            return;
        }
        if (!data.licenseNumber || !data.phone || data.licenseNumber.trim() === "" || data.phone.trim() === "") {
            setError("Phone number and license number are required");
            return;
        }
        try {
            const response = await managerService.createAgent(data);
            if (response.success !== true) {
                setError(response.message || "Failed to create agent");
                return;
            }
            return response;
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred.");
            throw error;
        }
    }, [managerService]);

    const handleCreateAdmin = useCallback(async (data: CreateUserRequest, setError: (error: string) => void) => {
        if (data.name.trim() === "" || data.surname.trim() === "" || data.username.trim() === "" || data.email.trim() === "") {
            setError("All fields are required");
            return;
        }
        try {
            const response = await managerService.createManager(data);
            if (response.success !== true) {
                setError(response.message || "Failed to create admin");
                return;
            }
            return response;
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred.");
            throw error;
        }
    }, [managerService]);

    const handleChangePassword = useCallback(async (data: ChangePasswordDTOWithConfirm, setError: (error: string) => void) => {
        try {
            const response = await managerService.changePassword(data);
            if (response.success !== true) {
                setError(response.message || "Failed to change password");
                return;
            }
            return response;
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred.");
            throw error;
        }
    }, [managerService]);

    return {
        handleCreateAgent,
        handleCreateAdmin,
        handleChangePassword,
    };
}