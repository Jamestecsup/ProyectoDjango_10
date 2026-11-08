// A reusable button: it receives its content by `children` and its look by `variant`.
// `{...rest}` goes AFTER type="button" on purpose: that way a caller can still ask for
// type="submit" (or any other native prop) and it overrides the default.
export default function Button({ variant = "primary", children, ...rest }) {
  return (
    <button type="button" className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
}
