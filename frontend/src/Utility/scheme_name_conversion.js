export const getDisplayName = (code) => {
    const mainLabels = {
        permit_type_main_for_engine_1: "Construction Related Permit",
        permit_type_main_for_engine_2: "Parking / Occupancy Related Permit",
        permit_type_main_for_engine_3: "Commercial Vehicle Related Permit",
        permit_type_main_for_engine_4: "Public Space Rental Related Permit"
    };

    const matchMain = Object.keys(mainLabels).find(k => code === k);
    if (matchMain) return mainLabels[matchMain];

    const childRegex = /^permit_type_main_for_engine_(\d+)_child_(\d+)$/;
    const match = code.match(childRegex);

    if (match) {
        const mainKey = `permit_type_main_for_engine_${match[1]}`;
        const categoryNumber = match[2];
        const mainName = mainLabels[mainKey];
        if (mainName) return `${mainName} : Category ${categoryNumber}`;
    }

    // fallback if pattern doesn't match
    return code;
};
