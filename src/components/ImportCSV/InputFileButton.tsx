import { Input, Button, ButtonProps } from "@chakra-ui/react";
import { FC, useRef } from "react";
import { toast } from "react-toastify";
import { isCSV } from "../../utils/csv";

interface Props extends ButtonProps {
  onFileChange: (file: File) => void;
}

export const InputFileButton: FC<Props> = ({ onFileChange, ...props }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (!isCSV(file)) return toast.error("Please select a CSV file");
    onFileChange(file);
  };

  return (
    <>
      <Input
        ref={fileInputRef}
        type="file"
        display="none"
        accept=".csv"
        multiple={false}
        onChange={handleChange}
      />

      <Button
        rounded="full"
        colorScheme="primary"
        variant="outline"
        onClick={() => {
          fileInputRef.current?.click();
        }}
        {...props}
      >
        Browse files
      </Button>
    </>
  );
};
