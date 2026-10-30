export default function Button({ variant = "primary", children, className = "", ...rest }) {
  const classes = ["btn", `btn-${variant}`, className].filter(Boolean).join(" ");

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
