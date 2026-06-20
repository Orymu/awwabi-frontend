import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** path to the leading icon (served from /public) */
  icon?: string
}

/**
 * Labeled text input matching the Figma text-field component.
 */
export function TextInput({
  label,
  icon,
  name,
  placeholder = 'Input',
  type = 'text',
  className,
  ...props
}: TextInputProps) {
  const id = `field-${name ?? label.toLowerCase()}`

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="font-field text-xs font-bold leading-4 text-[var(--color-field-label)]"
      >
        {label}
      </label>
      <div
        className={cn(
          'flex min-h-12 items-center gap-2 rounded-lg border border-[var(--color-border-field)] bg-white px-4',
          'transition-[border-color,box-shadow] duration-150 ease-out',
          'focus-within:border-yellow-800 focus-within:shadow-[0_0_0_3px_rgba(180,83,9,0.12)]',
          className
        )}
      >
        {icon && (
          <Image
            src={icon}
            alt=""
            aria-hidden="true"
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-none bg-transparent font-field text-base leading-6 text-[var(--color-ink)] outline-none placeholder:text-zinc-400"
          {...props}
        />
      </div>
    </div>
  )
}
