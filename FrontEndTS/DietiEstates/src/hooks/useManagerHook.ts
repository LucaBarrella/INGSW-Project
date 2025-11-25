import { useCallback } from "react"
import { ManagerService } from "@/src/services/ManagerService"
import { SignupRequestAgent } from "../dto/request/SignupRequestAgent.dto";

export const useManagerHook = (managerService : ManagerService) => {

    const handleCreateAgent = useCallback(async (data: SignupRequestAgent, setError: (error: string) => void) => {
        if (data.name.trim() === "" || data.surname.trim() === "" || data.username.trim() === "" || data.email.trim() === "") {
            setError("All fields are required");
            return;
        }
        if (!data.licenseNumber || !data.phone || data.licenseNumber.trim() === "" || data.phone.trim() === "") {
            setError("Phone number and license number are required");
            return;
        }
        if (data.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
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

    return {
        handleCreateAgent,
    };
}