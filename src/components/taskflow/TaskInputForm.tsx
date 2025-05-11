"use client";

import type React from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Task } from '@/types/taskflow';
import { PlusCircle } from 'lucide-react';

const taskSchema = z.object({
  name: z.string().min(1, "Le nom de la tâche est requis"),
  duration: z.coerce.number().min(0.1, "La durée doit être positive"),
  dependencies: z.array(z.string()),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskInputFormProps {
  onAddTask: (taskData: Omit<Task, 'id'>) => void;
  existingTasks: Task[];
  editingTask?: Task | null; // For editing functionality (optional extension)
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({ onAddTask, existingTasks }) => {
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
 defaultValues: {
      name: '',
      duration: 1,
      dependencies: [],
    },
  });

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    onAddTask(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
      <h3 className="text-lg font-semibold text-card-foreground">Ajouter une nouvelle tâche</h3>
      <div>
        <Label htmlFor="name">Nom de la tâche</Label>
        <Input id="name" {...register('name')} aria-invalid={errors.name ? "true" : "false"} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="duration">Durée (jours par exemple)</Label>
        <Input id="duration" type="number" step="0.1" {...register('duration')} aria-invalid={errors.duration ? "true" : "false"} />
        {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
      </div>
 
      <div>
        <Label>Dependencies</Label>
        <Controller
          name="dependencies"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal">
                  {field.value && field.value.length > 0
                    ? `${field.value.length} sélectionnée(s)`
                    : "Sélectionner les dépendances"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <ScrollArea className="h-48"> 
                  {existingTasks.length === 0 ? (
                     <p className="p-4 text-sm text-muted-foreground">No tasks available to select.</p>
                  ) : (
                    existingTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-2 p-2">
                        <Checkbox
                          id={`dep-${task.id}`}
                          checked={field.value?.includes(task.id)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value || []), task.id]
                              : (field.value || []).filter((id) => id !== task.id);
                            field.onChange(newValue);
                          }}
                        />
                        <Label htmlFor={`dep-${task.id}`} className="font-normal">
                          {task.name}
                        </Label>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.dependencies && <p className="text-sm text-destructive">{errors.dependencies.message}</p>}
      </div>

      <Button type="submit" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Ajouter la tâche
      </Button>
    </form>
  );
};

export default TaskInputForm;
