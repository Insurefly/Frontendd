import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
  children?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseStyles = "relative w-full rounded-lg border p-4";
    const variantStyles = {
      default: "bg-white text-gray-900 border-gray-200",
      destructive: "border-red-600/50 text-red-600 dark:border-red-500 bg-red-50"
    };

    const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;

    return (
      <div
        ref={ref}
        role="alert"
        className={styles}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }