// components/ManualDateInput.tsx
import { useState, useRef } from "react";
import {
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { format, parse } from "date-fns";

interface ManualDateInputProps {
  value?: string;
  onChange: (formatted: string) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export const ManualDateInput = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
}: ManualDateInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-format date input to dd-MM-yyyy
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // remove non-digits
    if (val.length > 8) val = val.slice(0, 8);

    let formatted = val;
    if (val.length > 4) formatted = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4)}`;
    else if (val.length > 2) formatted = `${val.slice(0, 2)}-${val.slice(2)}`;

    onChange(formatted);

    // Auto-parse and send valid formatted date as ISO (yyyy-MM-dd)
    const parsed = parse(formatted, "dd-MM-yyyy", new Date());
    if (!isNaN(parsed.getTime()) && formatted.length === 10) {
      onChange(format(parsed, "yyyy-MM-dd"));
    }
  };

  const selectedDate =
    value && !isNaN(new Date(value).getTime()) ? new Date(value) : undefined;

  return (
    <InputGroup>
      <Input
        ref={inputRef}
        value={
          value && !isNaN(new Date(value).getTime())
            ? format(new Date(value), "dd-MM-yyyy")
            : value || ""
        }
        onChange={handleInputChange}
        placeholder="dd-mm-yyyy"
        disabled={disabled}
      />
      <InputRightElement width="3rem">
        <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} placement="bottom-end">
          <PopoverTrigger>
            <IconButton
              aria-label="Open calendar"
              icon={<CalendarIcon />}
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
            />
          </PopoverTrigger>
          <PopoverContent width="auto">
            <SingleDatepicker
              name="manual-date"
              date={selectedDate}
              onDateChange={(date) => {
                if (!date) return;
                const formatted = format(date, "yyyy-MM-dd");
                onChange(formatted);
                setIsOpen(false);
              }}
              minDate={minDate}
              maxDate={maxDate}
              configs={{ dateFormat: "dd-MM-yyyy" }}
            />
          </PopoverContent>
        </Popover>
      </InputRightElement>
    </InputGroup>
  );
};
