export default function generateTreeTrenchPlanterSVG(color: string) {
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
        d="M18 14.2361L18.8451 16.8369L19.0696 17.5279H19.7961H22.5308L20.3184 19.1353L19.7306 19.5623L19.9551 20.2533L20.8002 22.8541L18.5878 21.2467L18 20.8197L17.4122 21.2467L15.1998 22.8541L16.0449 20.2533L16.2694 19.5623L15.6816 19.1353L13.4692 17.5279H16.2039H16.9304L17.1549 16.8369Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}