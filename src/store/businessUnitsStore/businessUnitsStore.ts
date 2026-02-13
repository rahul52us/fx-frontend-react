import { action, makeObservable, observable } from "mobx";

interface Bank {
    bankName: string;
    currency: string;
    margin: string;
    location: string;
}

interface BusinessUnit {
    unitCode: string;
    banks: Bank[];
}

class BusinessUnitsStore {
    businessUnits: BusinessUnit[] = [];
    loading: boolean = false;

    constructor() {
        makeObservable(this, {
            businessUnits: observable,
            loading: observable,
            getBusinessUnits: action,
            getUnitCodes: action,
            getBanksByUnit: action,
            getCurrencyByBank: action,
        });

        // Initialize with static data
        this.initializeStaticData();
    }

    // Initialize with static data (will be replaced with API call later)
    initializeStaticData = () => {
        this.businessUnits = [
            {
                unitCode: "unit bank 1",
                banks: [
                    {
                        bankName: "bank 1",
                        currency: "GAME",
                        margin: "20",
                        location: "india",
                    },
                    {
                        bankName: "bank 2",
                        currency: "SECOND",
                        margin: "50",
                        location: "agra",
                    },
                ],
            },
            {
                unitCode: "NOS",
                banks: [
                    {
                        bankName: "second bank 1",
                        currency: "GAME",
                        margin: "50",
                        location: "location",
                    },
                ],
            },
        ];
    };

    // Function to get business units (placeholder for future API call)
    getBusinessUnits = async () => {
        this.loading = true;
        try {
            return this.businessUnits;
        } catch (error) {
            console.error("Error fetching business units:", error);
            return [];
        } finally {
            this.loading = false;
        }
    };

    // Get all unit codes as options for dropdown
    getUnitCodes = () => {
        return this.businessUnits.map((unit) => ({
            label: unit.unitCode,
            value: unit.unitCode,
        }));
    };

    // Get banks for a specific unit code
    getBanksByUnit = (unitCode: string) => {
        const unit = this.businessUnits.find((u) => u.unitCode === unitCode);
        if (!unit) return [];

        return unit.banks.map((bank) => ({
            label: bank.bankName,
            value: bank.bankName,
            currency: bank.currency,
            margin: bank.margin,
            location: bank.location,
        }));
    };

    // Get currency for a specific bank in a unit
    getCurrencyByBank = (unitCode: string, bankName: string) => {
        const unit = this.businessUnits.find((u) => u.unitCode === unitCode);
        if (!unit) return null;

        const bank = unit.banks.find((b) => b.bankName === bankName);
        return bank || null;
    };

    // Get all data for a specific unit
    getUnitData = (unitCode: string) => {
        return this.businessUnits.find((u) => u.unitCode === unitCode) || null;
    };
}

export default BusinessUnitsStore;
