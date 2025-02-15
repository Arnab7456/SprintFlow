'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { DayPicker, DateRange as DayPickerDateRange } from "react-day-picker";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { SprintSchema } from "@/lib/form/validator";
import useFetch from "@/hooks/use-fetch";
import createSprint from "@/actions/Sprint";

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
  sprintKey 
}: CreateSprintProps) {
  const [showForm, setShowForm] = useState(false);
  const initialDateRange: DayPickerDateRange = {
    from: new Date(),
    to: addDays(new Date(), 14),
  };
  const [dateRange, setDateRange] = useState<DayPickerDateRange | undefined>(initialDateRange);
  const router = useRouter();

  const { loading: createSprintLoading, fn: createSprintFn } = useFetch(createSprint);

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
      projectId: projectId
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!dateRange?.from || !dateRange?.to) return;
    
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
        console.log(error);
      toast.error("Failed to create sprint. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  className="bg-slate-950"
                  placeholder="Enter sprint name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name?.message?.toString()}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal bg-slate-950 ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from && dateRange?.to ? (
                            format(dateRange.from, "LLL dd, y") +
                            " - " +
                            format(dateRange.to, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-slate-900"
                        align="start"
                      >
                        <DayPicker
                          classNames={{
                            chevron: "fill-blue-500",
                            range_start: "bg-blue-700",
                            range_end: "bg-blue-700",
                            range_middle: "bg-blue-400",
                            day_button: "border-none",
                            today: "border-2 border-blue-700",
                          }}
                          mode="range"
                          disabled={[{ before: new Date() }]}
                          selected={dateRange}
                          onSelect={(newRange: DayPickerDateRange | undefined) => {
                            setDateRange(newRange);
                            if (newRange?.from) {
                              setValue('startDate', newRange.from);
                            }
                            if (newRange?.to) {
                              setValue('endDate', newRange.to);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}