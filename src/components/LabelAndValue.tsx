export const LabelAndValue = ({
  label,
  value,
}: {
  label?: string;
  value?: string;
}) => {
  return (
    <p>
      {label}: {value}
    </p>
  );
};
