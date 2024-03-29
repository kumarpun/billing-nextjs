export default function Stauslayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <h2>Status Product</h2>
    </div>
  );
}
