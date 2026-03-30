const KEY = "admission_crm";

export const loadData = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

export const saveData = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};