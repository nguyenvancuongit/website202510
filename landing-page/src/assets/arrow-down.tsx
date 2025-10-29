import { SVGProps } from "react";

const ArrowDown = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 8.00223C4.60646 8.13595 5.60222 8.78257 6 10.5022C6.32785 8.76401 7.34302 8.16737 9 8.00223"
        stroke="#1D2129"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 1.5L6 9.5" stroke="#1D2129" strokeLinecap="round" />
    </svg>
  );
};

export default ArrowDown;
