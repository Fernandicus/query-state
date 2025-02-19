import { default as React } from 'react';
type Shape = "box" | "rounded";
type FormState = {
    title: string;
    shape: Shape;
    setTitle(title: string): void;
    setShape(shape: Shape): void;
    clean(shape: "title" | "shape"): void;
    validate(): string;
    shapes: Shape[];
};
export declare const formContext: () => FormState;
export declare function FormStateProvider({ children }: {
    children: JSX.Element;
}): React.JSX.Element;
export {};
