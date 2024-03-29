export default function Authlayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
        {children}
        <h2>Inner layout</h2>
      </div>
    );
  }
  