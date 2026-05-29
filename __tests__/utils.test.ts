import { cn } from "../lib/utils";

describe("cn class merger utility", () => {
  it("should merge class names", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    expect(cn("class1", true && "class2", false && "class3")).toBe("class1 class2");
  });

  it("should merge Tailwind classes overrides correctly", () => {
    expect(cn("px-2 py-1 bg-red-500", "p-4")).toBe("bg-red-500 p-4");
  });
});
