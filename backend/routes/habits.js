import express from "express";
import { getHabits, createHabit, updateHabit, deleteHabit, archiveHabit, reorderHabits } from "../controllers/habitController.js";
import {protect} from "../middleware/auth.js"