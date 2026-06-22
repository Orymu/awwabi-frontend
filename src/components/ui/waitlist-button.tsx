import { cn } from '@/lib/utils'

interface WaitlistButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
}

/**
 * The amber gradient pill button ("Daftar Waiting List") used in the
 * navbar and the CTA form.
 */
export function WaitlistButton({
  fullWidth = false,
  type = 'button',
  className,
  children = 'Daftar Waiting List',
  ...props
}: WaitlistButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[1234px] px-4 py-2.5 min-h-[44px]',
        'font-ui text-sm font-semibold leading-5 text-white whitespace-nowrap',
        'shadow-[0_2px_8px_rgba(180,83,9,0.25)]',
        'transition-[transform,box-shadow,filter] duration-150 ease-out',
        'hover:-translate-y-px hover:brightness-[1.03] hover:shadow-[0_6px_16px_rgba(180,83,9,0.35)]',
        'active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-800',
        'max-md:px-3 max-md:py-2 max-md:text-xs max-md:min-h-[40px]',
        fullWidth && 'w-full',
        className
      )}
      style={{ backgroundImage: 'var(--gradient-amber)' }}
      {...props}
    >
      <span>{children}</span>
    </button>
  )
}
