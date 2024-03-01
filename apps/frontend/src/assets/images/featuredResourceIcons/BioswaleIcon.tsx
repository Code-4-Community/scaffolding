export default function generateBioswaleIcon(color: string) {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 38 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M37 19.5C37 29.7419 28.9168 38 19 38C9.0832 38 1 29.7419 1 19.5C1 9.25809 9.0832 1 19 1C28.9168 1 37 9.25809 37 19.5Z"
        stroke={color}
        stroke-width="2"
      />
      <path
        d="M11.809 25.5L18 13.118L24.191 25.5H11.809Z"
        fill={color}
        stroke="black"
      />
    </svg>
  );
}
