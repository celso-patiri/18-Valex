export const formatCardholderName = (fullName: string) => {
  const names = fullName.split(" ");
  let formattedName = names[0];

  for (let i = 1; i < names.length - 1; i++) {
    formattedName = formattedName.concat(" " + names[i].charAt(0));
  }

  formattedName = formattedName.concat(" " + names[names.length - 1]);
  return formattedName.toUpperCase();
};

export const getCurrentYearAndMonth = () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const yearMonthDay = date.split("-");

  const year = +yearMonthDay[0].slice(2);
  const month = yearMonthDay[1];
  return { month, year };
};

export const getExpirationDate = () => {
  const { month, year } = getCurrentYearAndMonth();
  return `${month}/${year + 5}`;
};

interface ICreditEntry {
  amount: number;
}

const calculateTotal = <T extends ICreditEntry>(entryList: T[]) => {
  return entryList.map((entry) => entry.amount).reduce((sum, amount) => sum + amount, 0);
};

export const calculateBalance = <T1 extends ICreditEntry, T2 extends T1>(
  recharges: T1[],
  transactions: T2[],
) => {
  const totalIncome = calculateTotal(recharges);
  const totalExpense = calculateTotal(transactions);

  return totalIncome - totalExpense;
};
