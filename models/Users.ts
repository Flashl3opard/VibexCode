import mongoose from "mongoose";

// Schema for tracking solved questions with timestamps
const SolvedQuestionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  solvedAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: store the submitted answer/solution
  submittedAnswer: {
    type: String,
    default: "",
  },
  // Optional: programming language used
  language: {
    type: String,
    enum: ["Javascript", "Python", "Java", "C++"],
    default: "Javascript",
  },
  // Optional: execution time and memory usage
  executionStats: {
    time: { type: Number }, // in milliseconds
    memory: { type: Number }, // in KB
  },
});

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: "" },

    // Status & activity
    status: {
      type: String,
      enum: ["Online", "Idle", "Busy", "Offline"],
      default: "Offline",
    },
    activity: { type: String, default: "" },

    // ✅ Required for Appwrite authentication
    appwriteId: { type: String, required: true, unique: true },

    // ✅ Improved tracking of solved questions with timestamps
    solvedQuestions: [SolvedQuestionSchema],

    // ✅ Keep legacy array for backward compatibility (can be removed later)
    solvedQuestionIds: { type: [String], default: [] },

    // ✅ User statistics
    stats: {
      totalSolved: { type: Number, default: 0 },
      easyCount: { type: Number, default: 0 },
      mediumCount: { type: Number, default: 0 },
      hardCount: { type: Number, default: 0 },
      favoriteLanguage: { type: String, default: "Javascript" },
      longestStreak: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: Date.now },
    },

    // ✅ User preferences
    preferences: {
      defaultLanguage: {
        type: String,
        enum: ["Javascript", "Python", "Java", "C++"],
        default: "Javascript",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "auto",
      },
      soundEnabled: { type: Boolean, default: true },
      showDifficulty: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ======= INDEXES =======
// Removed duplicate index on appwriteId because `unique: true` creates an index implicitly
// UserSchema.index({ appwriteId: 1 }); <-- removed this line

UserSchema.index({ "solvedQuestions.solvedAt": -1 });
UserSchema.index({ "stats.totalSolved": -1 });

// Method to add a solved question
UserSchema.methods.addSolvedQuestion = function (
  questionId: string,
  submittedAnswer?: string,
  language?: string,
  executionStats?: { time?: number; memory?: number }
) {
  // Check if already solved (avoid duplicates)
  const alreadySolved = this.solvedQuestions.some(
    (sq: any) => sq.questionId.toString() === questionId
  );

  if (!alreadySolved) {
    this.solvedQuestions.push({
      questionId,
      solvedAt: new Date(),
      submittedAnswer: submittedAnswer || "",
      language: language || "Javascript",
      executionStats: executionStats || {},
    });

    // Update legacy array for backward compatibility
    if (!this.solvedQuestionIds.includes(questionId)) {
      this.solvedQuestionIds.push(questionId);
    }

    // Update statistics
    this.stats.totalSolved = this.solvedQuestions.length;
    this.stats.lastActiveDate = new Date();

    // Update streak (simplified logic - you can make this more sophisticated)
    const today = new Date();
    const lastActive = new Date(this.stats.lastActiveDate);
    const daysDiff = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 1) {
      this.stats.currentStreak = (this.stats.currentStreak || 0) + 1;
      this.stats.longestStreak = Math.max(
        this.stats.longestStreak || 0,
        this.stats.currentStreak
      );
    } else {
      this.stats.currentStreak = 1;
    }

    return true; // Question was added
  }

  return false; // Question was already solved
};

// Method to get solved questions with populated data
UserSchema.methods.getSolvedQuestionsWithDetails = function () {
  return this.populate({
    path: "solvedQuestions.questionId",
    select: "title difficulty description",
    model: "Question",
  });
};

// Static method to get user leaderboard
UserSchema.statics.getLeaderboard = function (limit = 10) {
  return this.find({})
    .select("username name stats.totalSolved stats.currentStreak")
    .sort({ "stats.totalSolved": -1, "stats.currentStreak": -1 })
    .limit(limit);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
