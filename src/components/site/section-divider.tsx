import Image from 'next/image'

/**
 * Decorative divider: two thin lines with a four-dot ornament in the center.
 */
export function SectionDivider() {
  return (
    <Image
      src="/assets/divider.svg"
      alt=""
      aria-hidden="true"
      width={516}
      height={42}
      className="h-auto w-[516px] max-w-full"
    />
  )
}
