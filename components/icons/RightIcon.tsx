const GreenCheckIcon = ({ size = 64, color = "#16A34A" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32zm0 416c-105.9 0-192-86.1-192-192S150.1 64 256 64s192 86.1 192 192-86.1 192-192 192z"
      fill={color}
    />
    <path
      d="M378.8 169.4c-12.5-12.5-32.8-12.5-45.3 0L224 278.8l-45.5-45.5c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l68.2 68.2c12.5 12.5 32.8 12.5 45.3 0l146-146c12.5-12.5 12.5-32.8.1-45.4z"
      fill={color}
    />
  </svg>
);

export default GreenCheckIcon;
