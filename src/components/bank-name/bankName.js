import vietinbankLogo from "@/assets/bankLogo/Vietinbank.svg";
import techcombankLogo from "@/assets/bankLogo/Techcombank.svg";
import mbLogo from "@/assets/bankLogo/Mbbank.svg";
import zalopayLogo from "@/assets/bankLogo/ZaloPay.svg";
import msbLogo from "@/assets/bankLogo/MSBbank.svg";
import tpbankLogo from "@/assets/bankLogo/TPbank.svg";
import vpbankLogo from "@/assets/bankLogo/VPBank.svg";

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

  970426: {
    name: "Ngân hàng Hàng Hải",
    logo: msbLogo,
  },
  970423: {
    name: "TPBank",
    logo: tpbankLogo,
  },
  970432: {
    name: "VPBank",
    logo: vpbankLogo,
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
