import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { Input } from "@shared/components/ui/Input/Input";

interface MyInputProperties extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  className?: string;
}

const MyInput = forwardRef<HTMLInputElement, MyInputProperties>((properties, reference) => {
  const { label, className, ...rest } = properties;
  return (
    <div className="flex w-full flex-col">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 opacity-50">
          {label}
        </div>

        <Input
          ref={reference}
          className={`${className} ${label ? "px-4 ps-10" : ""} focus:ring-button-primary block w-full rounded border-none py-2 text-sm text-black ring-1 ring-gray-300 transition-shadow duration-300 outline-none focus:ring-2`}
          {...rest}
        />
      </div>
    </div>
  );
});

MyInput.displayName = "MyInput";

export { MyInput };
