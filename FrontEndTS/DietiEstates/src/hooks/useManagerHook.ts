import { useCallback } from "react"
import { ManagerService } from "@/src/services/ManagerService"

export const useManagerHook = (managerService : ManagerService) => {

    const handleCreateAgent = useCallback(async (data: any, setError: (error: string) => void) => {
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const response = await managerService.createAgent(data);
            return response;
        } catch (error) {
            console.error("Error creating agent:", error);
            throw error;
        }
    }, [managerService]);

    return {
        handleCreateAgent,
    };
}