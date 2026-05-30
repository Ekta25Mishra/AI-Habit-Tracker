import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import AIInsight from "../models/AIInsight.js";
import { chatCompletion, SYSTEM_PROMPTS } from "../utils/aiServise.js";
import {lastNdays, calcStreak, todayKey} from "../utils/dateHelpers.js"

const buildWeeklyContext = async (userId) =>{
  const habits = await Habit.find({ userId, isArchived:false});
  const days = lastNdays(7);
  const logs = await HabitLog.find({
    userId,
    completedDate:{
      $gte: days[0],
      $lte: days[days.length - 1]
    },
  });
  const perHabit = habits.map((h) =>{
    const completed = logs.filter(
      (l) => String(l.habitId) === String(h._id)
    ).length;
    return {
      name:h.name,
      category: h.category,
      frequency: h.frequency,
      completedDays: completed,
      targetDays : h.targetDays,
    };
  });
  return { days, perHabit};
};

export const weeklyReport = async (req, res)=>{
  
}
