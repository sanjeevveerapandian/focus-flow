
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart3, TrendingUp, Calendar, Target, Award } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

interface AnalyticsData {
  daily: number;
  weekly: number;
  monthly: number;
  totalTasks: number;
  completedTasks: number;
  streak: number;
}

const StatusPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    totalTasks: 0,
    completedTasks: 0,
    streak: 0
  });
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    const today = new Date();
    let totalTasks = 0;
    let completedTasks = 0;
    let dailyTasks = 0;
    let dailyCompleted = 0;
    let weeklyTasks = 0;
    let weeklyCompleted = 0;
    let monthlyTasks = 0;
    let monthlyCompleted = 0;
    let streak = 0;
    let currentStreak = 0;

    // Calculate for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const savedTasks = localStorage.getItem(`tasks-${dateString}`);
      if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks);
        const dayCompleted = tasks.filter(task => task.completed).length;
        
        totalTasks += tasks.length;
        completedTasks += dayCompleted;
        
        // Daily (today only)
        if (i === 0) {
          dailyTasks = tasks.length;
          dailyCompleted = dayCompleted;
        }
        
        // Weekly (last 7 days)
        if (i < 7) {
          weeklyTasks += tasks.length;
          weeklyCompleted += dayCompleted;
        }
        
        // Monthly (all 30 days)
        monthlyTasks += tasks.length;
        monthlyCompleted += dayCompleted;
        
        // Streak calculation (consecutive days with 100% completion)
        if (tasks.length > 0 && dayCompleted === tasks.length) {
          currentStreak++;
        } else if (currentStreak > 0) {
          if (streak === 0) streak = currentStreak;
          currentStreak = 0;
        }
      } else if (currentStreak > 0) {
        if (streak === 0) streak = currentStreak;
        currentStreak = 0;
      }
    }
    
    if (currentStreak > streak) streak = currentStreak;

    setAnalytics({
      daily: dailyTasks > 0 ? (dailyCompleted / dailyTasks) * 100 : 0,
      weekly: weeklyTasks > 0 ? (weeklyCompleted / weeklyTasks) * 100 : 0,
      monthly: monthlyTasks > 0 ? (monthlyCompleted / monthlyTasks) * 100 : 0,
      totalTasks,
      completedTasks,
      streak
    });
  };

  const getMotivationalMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! You're crushing it! 🔥";
    if (percentage >= 80) return "Excellent work! Keep it up! 💪";
    if (percentage >= 70) return "Great job! You're doing well! 🌟";
    if (percentage >= 60) return "Good progress! Stay consistent! 📈";
    if (percentage >= 50) return "You're on track! Keep pushing! 🚀";
    return "Every step counts! You've got this! 💪";
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Elite", color: "bg-purple-500", icon: "🏆" };
    if (percentage >= 80) return { level: "Excellent", color: "bg-green-500", icon: "⭐" };
    if (percentage >= 70) return { level: "Good", color: "bg-blue-500", icon: "👍" };
    if (percentage >= 60) return { level: "Fair", color: "bg-yellow-500", icon: "📊" };
    return { level: "Developing", color: "bg-orange-500", icon: "🌱" };
  };

  const currentPercentage = analytics[activeTab];
  const performance = getPerformanceLevel(currentPercentage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Progress Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your consistency and improvement
        </p>
      </div>

      {/* Time Period Selector */}
      <Card className="glass-morphism border-0">
        <CardContent className="pt-6">
          <div className="flex justify-center space-x-2">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <Button
                key={period}
                variant={activeTab === period ? "default" : "outline"}
                onClick={() => setActiveTab(period)}
                className="capitalize hover:scale-105 transition-transform"
              >
                {period} Status
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Card */}
      <Card className="glass-morphism border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span className="capitalize">{activeTab} Performance</span>
            </span>
            <Badge className={`${performance.color} text-white`}>
              {performance.icon} {performance.level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Percentage Display */}
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round(currentPercentage)}%
              </div>
              <Progress value={currentPercentage} className="h-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {getMotivationalMessage(currentPercentage)}
              </p>
            </div>

            {/* Period-specific Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">{Math.round(analytics.daily)}%</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">{Math.round(analytics.weekly)}%</p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">{Math.round(analytics.monthly)}%</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-morphism border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>Overall Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Tasks Created</span>
              <span className="font-bold text-xl">{analytics.totalTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tasks Completed</span>
              <span className="font-bold text-xl text-green-600">{analytics.completedTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Overall Completion Rate</span>
              <span className="font-bold text-xl">
                {analytics.totalTasks > 0 ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl">🔥</div>
              <div className="text-2xl font-bold">{analytics.streak}</div>
              <div className="text-sm text-muted-foreground">
                Day{analytics.streak !== 1 ? 's' : ''} Perfect Streak
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {analytics.streak > 0 
                ? "Amazing consistency! Keep it up!"
                : "Start your streak by completing all tasks today!"
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusPage;
