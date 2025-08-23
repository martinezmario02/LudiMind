const Card = ({ className, children, ...props }) => (
  <div className={`bg-card rounded-lg shadow p-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ className, children, ...props }) => (
  <div className={`mb-2 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ className, children, ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
)

const CardContent = ({ className, children, ...props }) => (
  <div className={`mt-2 ${className}`} {...props}>
    {children}
  </div>
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent }