export const convertToUTC = (localDateTime) => {
    const date = new Date(localDateTime);
    return date.toISOString(); // 👈 automatically UTC ma convert kare
  };