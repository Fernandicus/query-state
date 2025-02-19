export declare function useUrlSizeState(): {
    sizeState: import('../../lib').StateValue<"xs" | "sm" | "md" | "lg" | "xl">;
    setSizeState: (v: import('../../lib').StateValue<"xs" | "sm" | "md" | "lg" | "xl"> | import('../../lib').StateValue<"xs" | "sm" | "md" | "lg" | "xl">[]) => void;
    sizes: readonly ["xs", "sm", "md", "lg", "xl"];
    clean: (v: "all" | import('../../lib').StateValue<"xs" | "sm" | "md" | "lg" | "xl"> | import('../../lib').StateValue<"xs" | "sm" | "md" | "lg" | "xl">[]) => void;
};
