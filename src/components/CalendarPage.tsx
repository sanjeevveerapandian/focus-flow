
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar as CalendarIcon, CheckCircle, Clock, Target } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

interface DayData {
  date: string;
  tasks: Task[];
  completionRate: number;
}

const CalendarPage: React.FC = () => {
  const [calendarData, setCalendarData] = useState<DayData[]>([]);

  useEffect(() => {
    // Load historical data from localStorage
    const data: DayData[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const savedTasks = localStorage.getItem(`tasks-${dateString}`);
      if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks);
        const completedTasks = tasks.filter(task => task.completed).length;
        const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
        
        data.push({
          date: dateString,
          tasks,
          completionRate
        });
      }
    }
    
    setCalendarData(data.reverse());
  }, []);

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-yellow-500';
    if (rate >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCompletionText = (rate: number) => {
    if (rate >= 80) return 'Excellent';
    if (rate >= 60) return 'Good';
    if (rate >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Calendar
        </h1>
        <p className="text-muted-foreground">
          Track your progress over time
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-morphism border-0">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{calendarData.length}</p>
                <p className="text-sm text-muted-foreground">Active Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-0">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {calendarData.reduce((sum, day) => sum + day.tasks.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-0">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(calendarData.reduce((sum, day) => sum + day.completionRate, 0) / calendarData.length || 0)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg. Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar History */}
      <Card className="glass-morphism border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calendarData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No historical data available yet.</p>
                <p className="text-sm">Start adding tasks to see your progress!</p>
              </div>
            ) : (
              calendarData.map((day, index) => (
                <div 
                  key={day.date}
                  className="p-4 border rounded-xl hover:shadow-md transition-all duration-200 animate-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {day.tasks.length} task{day.tasks.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${getCompletionColor(day.completionRate)} text-white`}
                    >
                      {getCompletionText(day.completionRate)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {day.tasks.filter(t => t.completed).length} of {day.tasks.length} completed
                      </span>
                      <span className="font-semibold">{Math.round(day.completionRate)}%</span>
                    </div>
                    <Progress value={day.completionRate} className="h-2" />
                  </div>
                  
                  {day.tasks.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {day.tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="flex items-center space-x-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                      {day.tasks.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-4">
                          +{day.tasks.length - 3} more task{day.tasks.length - 3 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
