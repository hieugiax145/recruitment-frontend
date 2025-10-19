import api from "../../../config/axios"

export const departServices={
    getDepartments: async ()=>{
        return api.get("/api/v1/departments");
    }
}