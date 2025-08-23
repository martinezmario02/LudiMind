import { cva } from "class-variance-authority";

const inputVariants = cva(
    "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
);

const Input = ({ className, ...props }) => {
    return <input className={inputVariants({ className })} {...props} />;
}

export default Input;