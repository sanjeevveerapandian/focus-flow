
import React from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Trash2 } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div 
      className={`task-item p-4 bg-card rounded-xl border shadow-sm hover:shadow-md ${
        task.completed ? 'task-completed' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="h-5 w-5"
        />
        <span 
          className={`flex-1 text-sm font-medium transition-all duration-200 ${
            task.completed 
              ? 'line-through text-muted-foreground' 
              : 'text-foreground'
          }`}
        >
          {task.text}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="p-1 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
