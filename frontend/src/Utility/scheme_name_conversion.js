export const getDisplayName = (code) => {
    const mainLabels = {
        commercial_vehicle_1: "Construction Related Permit",
    };

    const matchMain = Object.keys(mainLabels).find(k => code === k);
    if (matchMain) return mainLabels[matchMain];

    const childRegex = /^commercial_vehicle_(\d+)_child_(\d+)$/;
    const match = code.match(childRegex);

    if (match) {
        const mainKey = `commercial_vehicle_${match[1]}`;
        const categoryNumber = match[2];
        const mainName = mainLabels[mainKey];
        if (mainName) return `${mainName} : Category ${categoryNumber}`;
    }

    // fallback if pattern doesn't match
    return code;
};
