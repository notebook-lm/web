import { Check } from "lucide-react";
import { authenticationBenefits } from "./authentication-copy";

export function AuthenticationBenefits() {
  return (
    <ul className="mt-8 hidden list-none p-0 md:block">
      {authenticationBenefits.map((benefit) => (
        <li
          key={benefit}
          className="my-3 flex items-center gap-2.5 text-sm text-[#4d5e59]"
        >
          <Check size={17} className="text-violet" />
          {benefit}
        </li>
      ))}
    </ul>
  );
}
