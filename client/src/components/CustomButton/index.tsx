type IProps = {
  className?: string;
  onClick?: () => void;
  name?: string;
  type?: "button" | "submit" | "reset";
};

export const Button = ({ onClick, name, className, type }: IProps) => {
  return (
    <button type={type} onClick={onClick} className={className}>
      {name}
    </button>
  );
};
