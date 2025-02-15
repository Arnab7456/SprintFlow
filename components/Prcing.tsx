import { Github, Star, Check } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  "Unlimited public repositories",
  "Community support",
  "Full source code access",
  "No usage limits",
  "Commercial use allowed",
  "MIT License",
];

type CardProps = React.ComponentProps<typeof Card>;

export default function OpenSourcePricing({ className, ...props }: CardProps) {
  return (
    <div className=" dark:bg-black/[0.96] mt-1 p-12 md:p-4  ">
      <h1 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-400 dark:from-neutral-50 dark:to-neutral-200 bg-opacity-80 dark:bg-opacity-50 mb-4">
        Pricing
      </h1>

      <div className="flex justify-center items-center ">
        <Card
          className={cn("w-[380px] relative overflow-hidden", className)}
          {...props}
        >
          <div className="absolute top-5 -right-12 bg-green-500 text-white px-12 py-1 rotate-45 transform ">
            Free Forever
          </div>

          <CardHeader>
            <div className="flex items-center space-x-2 ">
              <Github className="h-6 w-6" />
              <CardTitle>Open Source</CardTitle>
            </div>
            <CardDescription>
              Perfect for developers and open source projects
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-4 rounded-md border p-4 bg-secondary/50">
              <Star className="text-yellow-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">$0 / month</p>
                <p className="text-sm text-muted-foreground">
                  No credit card required
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[25px_1fr] items-start"
                >
                  <Check className="h-4 w-4 text-green-500" />
                  <div className="space-y-1">
                    <p className="text-sm">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link
                href="https://github.com/arnab7456"
                target="_blank"
                className="flex items-center justify-center"
              >
                <Github className=" mr-2 h-4 w-4" /> Star on GitHub
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
