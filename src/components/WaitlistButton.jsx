import './WaitlistButton.css'

/**
 * The amber gradient pill button ("Daftar Waiting List") used in the
 * navbar and the CTA form.
 *
 * @param {object} props
 * @param {boolean} [props.fullWidth] - stretch to the full container width
 * @param {string}  [props.type] - native button type (defaults to "button")
 * @param {React.ReactNode} [props.children]
 */
export default function WaitlistButton({
  fullWidth = false,
  type = 'button',
  children = 'Daftar Waiting List',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`waitlist-btn${fullWidth ? ' waitlist-btn--full' : ''}`}
      {...rest}
    >
      <span>{children}</span>
    </button>
  )
}
