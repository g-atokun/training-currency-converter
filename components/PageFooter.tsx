interface PageFooterProps {
  lastUpdated?: number;
}

export default function PageFooter({ lastUpdated }: PageFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="text-center mt-8 text-gray-600 text-sm">
      <p>Exchange rates are updated hourly</p>
      {lastUpdated && (
        <p className="mt-1">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}
      <p className="mt-1">
        &copy; {currentYear} Example Technologies. All rights reserved.
      </p>
    </div>
  );
}
