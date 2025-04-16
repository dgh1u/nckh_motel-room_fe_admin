import vietinbankLogo from "@/assets/bankLogo/Vietinbank.svg";
import techcombankLogo from "@/assets/bankLogo/Techcombank.svg";
import mbLogo from "@/assets/bankLogo/Mbbank.svg";
import zalopayLogo from "@/assets/bankLogo/ZaloPay.svg";

export const bankMapping = {
  "01201001": {
    name: "Vietinbank",
    logo: vietinbankLogo,
  },
  970407: {
    name: "Techcombank",
    logo: techcombankLogo,
  },
  970422: {
    name: "ZaloPay",
    logo: zalopayLogo,
  },
  "": {
    name: "MB Bank",
    logo: mbLogo,
  },
  // Thêm các ngân hàng khác nếu cần...
};

export function getBankData(bankId) {
  return bankMapping[bankId] || { name: bankId, logo: null };
}
