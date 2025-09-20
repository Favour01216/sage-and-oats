import { SafeImage } from "@/src/components/SafeImage";

export default function ImageTestPage() {
  const testImageUrl =
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=60";
  const awsImageUrl =
    "https://edamam-product-images.s3.amazonaws.com/web-img/0a1/0a1836bfac70a083726be56d98af4b83.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGwaCXVzLWVhc3QtMSJHMEUCIFo%2Bnyy9tZAC2z68SudsVrscOcp9GMDzyyE2JE9ketxqAiEAzyjd9TnLm0q4PJQ8gIFUPaXylCJXF4mXslaWiDqxloEqwgUI5P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDL4V%2FhlMY2TLCLQ%2BLyqWBe8UFPKZ7FqJ63aEohYCBqg4SLTHoDi%2Fem0aWTEVLVnHvKRRBABqRqaLO5gBaesZ3vqibXSwPFFcPtttZL9yLxh77R6XLBjFWc%2B64cKAd0%2BclfNZuaDIyLEcNma7oTbszGcYXWuX3rTPRxAw3E5vOUR0rL6b8E7keX1dM0plQeuJBQ8TkBpqIrWzTcV%2F07OyK4LEAmgMAeWlDwvKu85usOIh4Z1HYkAoik9WnoC%2FJMytPdLZH8dR7cCvw3de46xXaulhyorg0aaF0gb75GgCjL9sWkqaMgBj%2FUEOKkK%2FxDinyxVGm3KJ2xD3nWnJlWL5nTWqchfZeQdrnxpWPdI9VzbKxQEYAGVOu9HkMSoMpVPuIhlc%2BWEQXxjawdw8JAGvY3mKVMM%2BPOIXa3reUQNbtCn75wSatVuAIxrj6vEX%2BAI0EobgOZedNEXaR6cA5TLcRcHlgl17xHlDqycIGAGwYXXULD%2FEZAqp0naNedvlEMf1Udz%2FlIlGD%2F8ppxecZiJhY2EUEsU9zY7C1%2B4OdrmifOaFTF0o7Z7PVKU5SOMBVT9Tca68pgPJ6h796nNUajpcr5R0ekxUMa%2BtPd6tcOcPUnNzixVbDa%2FLNTSkK%2B0sDORrilz%2BKOUBM7pQ0%2F0PnMSI1K8tVpp7A2%2BEURi8rvS6BhvJxnrXsMBOr0J%2BIti%2FqELRoR7qWWNtGxEuJB85Qb5U%2Fw5RVZsLAvPUSIWAx%2FYgxpsFdbf1xwG6uRCtTwPkiPlfthc0RGvCRsBtg1Fl7Jn0N51lNjibaJiiiwiU5a7zTMWNNQ4YGinVNjQFQXRP%2B5KEmPbQaYbGls2DLvO6hD7nwf3nWPwnoIPCT0J%2FKPaePVMCbBVSX8nqgUfUM9cRWCo87XR6FfdKMN64uMYGOrEBsbuCXzY%2F%2FgtPynh7nF4B7Vf7kwQNj0g7sD%2BGrwDKrS%2FGILFfRwCcwoIUEoWfYOlv9IghyPm6oek0HHUJeRHmtAwL3UAb9H7e1BIPbwVwa60sQWs91qVp2%2BBXgrl9%2F4Vut8FJeIuaYGivh5Ymywu4OZ%2BfJNOppfn5VyUXwJmxKzLn3eRAJNwOyDTRHtTLZl1HZM7FwDMCPFZhXy36pyCua90rQypWaIQ8EDYyO%2BO01ORm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250920T043413Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=ASIASXCYXIIFE4A3ILCO%2F20250920%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5c826f59a7644d368abe4c8b4b162302df9805e3e724613b672a86523a1ab5ec";

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Image Test</h1>

      <div className="grid gap-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">SafeImage with Unsplash (should work)</h2>
          <div className="relative h-48 w-64 border">
            <SafeImage
              src={testImageUrl}
              alt="Test image"
              fill
              unoptimized={true}
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">SafeImage with AWS (might fail)</h2>
          <div className="relative h-48 w-64 border">
            <SafeImage
              src={awsImageUrl}
              alt="AWS test image"
              fill
              unoptimized={true}
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Native IMG with Unsplash</h2>
          <img src={testImageUrl} alt="Test image" className="h-48 w-64 border object-cover" />
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Native IMG with AWS</h2>
          <img src={awsImageUrl} alt="AWS test image" className="h-48 w-64 border object-cover" />
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Fallback Image</h2>
          <img
            src="/placeholder-recipe.svg"
            alt="Placeholder"
            className="h-48 w-64 border object-cover"
          />
        </div>
      </div>
    </div>
  );
}
