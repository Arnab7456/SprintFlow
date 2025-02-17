"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker, DateRange as DayPickerDateRange } from "react-day-picker";
import { toast } from "sonner";
import {
  CalendarIcon,
  Timer,
  ArrowRightCircle,
  RefreshCw,
  Target,
  Plus,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SprintSchema } from "@/lib/form/validator";
import useFetch from "@/hooks/use-fetch";
import createSprint from "@/actions/Sprint";
import { motion } from "framer-motion";

interface CreateSprintProps {
  projectTitle: string;
  projectKey: string;
  projectId: string;
  sprintKey: number;
}

interface FormValues {
  name: string;
  startDate: Date;
  endDate: Date;
  projectId: string;
}

export default function CreateSprintPage({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}: CreateSprintProps) {
  const [showForm, setShowForm] = useState(false);
  const initialDateRange: DayPickerDateRange = {
    from: new Date(),
    to: addDays(new Date(), 14),
  };
  const [dateRange, setDateRange] =
    useState<DayPickerDateRange>(initialDateRange);
  const router = useRouter();
  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(SprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: initialDateRange.from,
      endDate: initialDateRange.to,
      projectId: projectId,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select a date range");
      return;
    }

    try {
      await createSprintFn(projectId, {
        ...data,
        startDate: dateRange.from,
        endDate: dateRange.to,
      });
      toast.success("Sprint created successfully!");
      setShowForm(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create sprint. Please try again.");
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Select date";
    return format(date, "LLL dd, y");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Initial state (hidden and slightly below)
      animate={{ opacity: 1, y: 0 }} // Animate to visible and in place
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Target className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                {projectTitle}
              </h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={() => setShowForm(!showForm)}
                variant={!showForm ? "default" : "destructive"}
                className="group transition-all duration-300 ease-in-out hover:scale-105 bg-gradient-to-r hover:bg-gradient-to-l"
              >
                {!showForm ? (
                  <>
                    <Plus className="mr-2 h-4 w-4 transition-all duration-300 ease-in-out" />{" "}
                    Create Sprint
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4 transition-all duration-300 ease-in-out" />{" "}
                    Cancel
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {showForm && (
            <Card className="border border-slate-700 shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-blue-500" />
                  New Sprint Configuration
                </CardTitle>
                <CardDescription>
                  Configure your sprint details and duration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium ">Sprint Name</label>
                    <div className="relative">
                      <Input
                        {...register("name")}
                        className="pl-10 dark:bg-slate-800 border-slate-700"
                        placeholder="Enter sprint name"
                      />
                      <Target className="absolute left-3 top-2.5 h-5 w-5 " />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.name.message?.toString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium ">
                      Sprint Duration
                    </label>
                    <Controller
                      control={control}
                      name="startDate"
                      render={() => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal dark:bg-slate-800 border-slate-700 hover:bg-slate-700"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                              <span className="flex items-center gap-2">
                                {formatDate(dateRange?.from)}
                                <ArrowRightCircle className="h-4 w-4 " />
                                {formatDate(dateRange?.to)}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                            <DayPicker
                              mode="range"
                              selected={dateRange}
                              onSelect={(
                                range: DayPickerDateRange | undefined
                              ) => {
                                if (range) {
                                  setDateRange(range);
                                  if (range.from)
                                    setValue("startDate", range.from);
                                  if (range.to) setValue("endDate", range.to);
                                }
                              }}
                              className="border-slate-700"
                              classNames={{
                                months: "space-y-4",
                                month: "space-y-4",
                                caption:
                                  "flex justify-center pt-1 relative items-center",
                                caption_label: "text-sm font-medium",
                                nav: "space-x-1 flex items-center",
                                nav_button:
                                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell:
                                  "text-slate-400 rounded-md w-8 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                                day_selected:
                                  "bg-blue-600 text-slate-50 hover:bg-blue-600 hover:text-slate-50 focus:bg-blue-600 focus:text-slate-50",
                                day_today: "bg-slate-700 text-slate-50",
                                day_outside: "text-slate-500 opacity-50",
                                day_disabled: "text-slate-500 opacity-50",
                                day_range_middle:
                                  "aria-selected:bg-slate-700 aria-selected:text-slate-50",
                                day_hidden: "invisible",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full md:w-auto transition-all duration-300 hover:scale-105"
                    disabled={createSprintLoading}
                  >
                    {createSprintLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Create Sprint
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
