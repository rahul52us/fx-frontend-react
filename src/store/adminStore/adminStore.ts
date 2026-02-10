import { action, makeObservable, observable } from "mobx";
import axios from "axios";

class AdminStore {
    loading: boolean = false;

    constructor() {
        makeObservable(this, {
            loading: observable,
            createAdmin: action,
            getAdmins: action,
            deleteAdmin: action,
        });
    }

    createAdmin = async (sendData: any) => {
        try {
            this.loading = true;
            const { data } = await axios.post("/auth/creatadmin/", sendData);
            return data;
        } catch (err: any) {
            return Promise.reject(err?.response?.data || err.message);
        } finally {
            this.loading = false;
        }
    };

    getAdmins = async (payload: any) => {
        try {
            this.loading = true;
            const { data } = await axios.post("/auth/getusers/", payload);
            return data;
        } catch (err: any) {
            return Promise.reject(err?.response?.data || err.message);
        } finally {
            this.loading = false;
        }
    };

    deleteAdmin = async (id: string) => {
        try {
            this.loading = true;
            const { data } = await axios.post(`/auth/deleteuser/${id}`);
            return data;
        } catch (err: any) {
            return Promise.reject(err?.response?.data || err.message);
        } finally {
            this.loading = false;
        }
    };
}

export default AdminStore;
