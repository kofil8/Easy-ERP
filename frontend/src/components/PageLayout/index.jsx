export default function PageLayout({
  children,
  variant = 'boxed',
  maxWidth = '100%',
  minHeight,
  style = {},
}) {
  const isBoxed = variant === 'boxed';

  return (
    <div
      className={isBoxed ? 'whiteBox shadow layoutPadding' : undefined}
      style={{
        margin: isBoxed ? '30px auto' : '0 auto',
        width: '100%',
        maxWidth,
        minHeight,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
