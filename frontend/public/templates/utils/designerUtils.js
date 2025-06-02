import allowed from '../designerConfig.json';

export function filterAllowedActivities(data) {
  const allowedList = allowed.allowedActivities;

  if (Array.isArray(data.activities)) {
    data.original = {
      ...data.original,
      activities: data.activities.filter(act => allowedList.includes(act.Type))
    };
  }

  return data;
}
