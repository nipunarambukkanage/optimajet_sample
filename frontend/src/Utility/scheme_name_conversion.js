export const getDisplayName = (code) => {
    const mainLabels = {
        main_approval_1: "Construction Related Permit",
        main_approval_2: "Electricity Related Permit",
        main_approval_3: "Water Consumption Related Permit",
        main_approval_4: "Infrastructure Related Permit"
    };

    const matchMain = Object.keys(mainLabels).find(k => code === k);
    if (matchMain) return mainLabels[matchMain];

    const childRegex = /^main_approval_(\d+)_child_(\d+)$/;
    const match = code.match(childRegex);

    if (match) {
        const mainKey = `main_approval_${match[1]}`;
        const categoryNumber = match[2];
        const mainName = mainLabels[mainKey];
        if (mainName) return `${mainName} : Category ${categoryNumber}`;
    }

    // fallback if pattern doesn't match
    return code;
};
