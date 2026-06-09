// Funkcija za čuvanje podataka
export const saveItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Funkcija za čitanje podataka
export const readItem = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  
  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error("Greška pri čitanju iz LocalStorage-a:", error);
    return null;
  }
};

// Funkcija za brisanje podataka
export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};