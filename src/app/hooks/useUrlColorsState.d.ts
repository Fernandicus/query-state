export declare function useUrlColorState(): {
    colorsState: {
        value: import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk"> | import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">[];
        is(v: import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">): boolean;
        has(v: import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">): boolean;
        has(v: import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">): boolean;
        isArray(v: import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk"> | import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">[]): v is import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">[];
        firstElement(): import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">;
    };
    setColorsState: (v: import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk"> | import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">[]) => void;
    colors: readonly ["orange", "lime", "teal", "cornflowerblue", "cornsilk", "#143140"];
    defaultColor: string;
    clean: (v: "all" | import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk"> | import('../../lib').StateValue<"#143140" | "orange" | "lime" | "teal" | "cornflowerblue" | "cornsilk">[]) => void;
};
