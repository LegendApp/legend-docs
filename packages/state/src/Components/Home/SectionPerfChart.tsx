import { SectionTitle } from "./Components";

export const SectionRPerfChart = () => {
  return (
    <div className="!mt-20 max-w-4xl mx-auto">
      <SectionTitle
        text="🚀 The fastest React state library"
        description="Legend-State is so fast that it outperforms even vanilla JS in some benchmarks. Extremely optimized at just 4kb and encouraging fine-grained reactivity, it reduces code and file size while maximizing performance."
      />
      <div>Chart goes here</div>
    </div>
  );
};
