import { Button } from "shared/src/Components/Button";
import { Header } from "./Header";
import { Text } from "./Text";

export function SectionKitHeader() {
  return (
    <div className="mt-section text-center">
      <div className="inline-block bg-gradient-to-r from-[#d556e3] to-[#3c59fd] text-white text-sm font-bold py-2 px-4 rounded-full">
        Coming Soon
      </div>
      <Header
        size="h1"
        className="md:!text-h1 !font-bold !leading-tight max-w-4xl text-center mx-auto !mt-4"
      >
        Legend Kit: Hyper optimized components and helpers
      </Header>
      <Text>
        Tons of tools to accelerate your development, reduce your code, and
        speed up your apps.
      </Text>
      <div className="!mt-8 text-center flex flex-col justify-center items-center">
        <div className="t-border border p-6 rounded-lg t-bg">
          <Text className="text-white/60 text-sm pb-2">One time purchase</Text>
          <Button color="bg-gradient-to-br from-[#d556e3] to-[#3c59fd] text-white/90 font-semibold mx-auto">
            Preorder for $199
          </Button>
          <Text className="text-white/60 !mt-0 text-sm pt-2">
            Lifetime access
          </Text>
        </div>
      </div>
    </div>
  );
}

/*
      <Header size="h1" className="!text-[8rem] !leading-tight">
        🧺
      </Header>
      */
