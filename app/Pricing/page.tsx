'use client'
import { Github, Star, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import FAQPage from "@/components/Faq";

// Define props for the OpenSourcePricing component

const features = [
  "Unlimited public repositories",
  "Community support",
  "Full source code access",
  "No usage limits",
  "Commercial use allowed",
  "MIT License",
];


export default function OpenSourcePricing() {
  // Card container animation
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };

  // Features list animation
  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <div className="dark:bg-black/[0.96] mt-1 p-12 md:p-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-400 dark:from-neutral-50 dark:to-neutral-200 bg-opacity-80 dark:bg-opacity-50 mb-4"
      >
        Pricing
      </motion.h1>

      <div className="flex justify-center items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card
            className={cn("w-[380px] relative overflow-hidden")}
          >
            <motion.div 
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 45, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.3,
                type: "spring" 
              }}
              className="absolute top-5 -right-12 bg-green-500 text-white px-12 py-1 rotate-45 transform"
            >
              Free Forever
            </motion.div>

            <CardHeader>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Github className="h-6 w-6" />
                <CardTitle>Open Source</CardTitle>
              </motion.div>
              <CardDescription>
                Perfect for developers and open source projects
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center space-x-4 rounded-md border p-4 bg-secondary/50"
              >
                <Star className="text-yellow-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">$0 / month</p>
                  <p className="text-sm text-muted-foreground">
                    No credit card required
                  </p>
                </div>
              </motion.div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={featureVariants}
                    className="grid grid-cols-[25px_1fr] items-start"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    <div className="space-y-1">
                      <p className="text-sm">{feature}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link
                    href="https://github.com/Arnab7456/SprintFlow"
                    target="_blank"
                    className="flex items-center justify-center"
                  >
                    <Github className="mr-2 h-4 w-4" /> Star on GitHub
                  </Link>
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      <FAQPage />
    </div>
  );
}
